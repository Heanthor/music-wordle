from __future__ import annotations

import json
from dataclasses import dataclass
import re

import requests
from bs4 import BeautifulSoup

COMPOSERS_FILE = "composers.json"


class InvalidWork(Exception):
    pass


class BaseScraper:
    def load_page(self, url) -> BeautifulSoup:
        page = requests.get(self.base_url)
        return BeautifulSoup(page.text, "html.parser")


@dataclass
class ScrapedWork:
    composer_firstname: str
    composer_lastname: str
    composer_fullname: str
    work_title: str
    composition_year: int
    opus: str
    opus_number: int


def beethoven_opus(opus_number_str: str):
    if "/" in opus_number_str:
        # opus is the first part, number is the second
        opus, num = opus_number_str.split("/")
    else:
        opus = opus_number_str
        num = -1

    return opus.strip(), num


def mozart_opus(opus_number_str: str):
    num = -1
    if "/" in opus_number_str:
        # throw out alternative K numbers
        opus = opus_number_str.split("/")[0].strip()
    else:
        opus = opus_number_str
        num = -1

    return opus.strip(), num


def brahms_opus(opus_number_str: str):
    opus_number_str = opus_number_str.replace("Op.", "")
    if "/" in opus_number_str:
        opus, num = opus_number_str.split("/")
    else:
        opus = opus_number_str
        num = -1

    return opus.strip(), num


def chopin_override(work_title: str) -> ScrapedWork | None:
    if work_title == "E♭ major" or work_title == "G major":
        # rowspan breaks the table for andante spinato
        raise InvalidWork()
    if work_title == "Andante spianato et Grande polonaise brillante":
        return ScrapedWork(
            composer_firstname="Frédéric",
            composer_lastname="Chopin",
            composer_fullname="Frédéric Chopin",
            work_title="Andante spianato et Grande polonaise brillante",
            composition_year=1834,
            opus="22",
            opus_number=-1,
        )

    return None


def tchaikovsky_opus(opus_number_str: str):
    opus_number_str = opus_number_str.replace("//", "/")
    if "/" in opus_number_str:
        opus, num = opus_number_str.split("/")
        int(num)
    else:
        opus = opus_number_str
        num = -1

    return opus.strip(), num


config_by_composer = {
    "Ludwig van Beethoven": {"opus_func": beethoven_opus},
    "Wolfgang Amadeus Mozart": {"opus_func": mozart_opus},
    "Frédéric Chopin": {"work_override": chopin_override},
    "Johannes Brahms": {"opus_func": brahms_opus},
    "Pyotr Tchaikovsky": {"opus_func": tchaikovsky_opus},
}


def scrape_imslp_page(composer: str, page_text: str) -> list[ScrapedWork]:
    soup = BeautifulSoup(page_text, "html.parser")

    works_table = soup.find("table", {"class": "wikitable sortable"})
    # loop over the tr elements inside the tbody
    first = True
    opus_col = 0
    name_col = -1
    date_col = -1
    all_works = []
    for row in works_table.find_all("tr"):
        if first:
            headers = row.find_all("th")
            # first row is header
            # find the index of the header with "Title" as the text
            for i, header in enumerate(headers):
                if header.text.strip() == "Title":
                    name_col = i
                elif header.text.strip() == "Date":
                    date_col = i
                elif header.text.strip() == "Opus":
                    opus_col = i
            first = False
            continue

        tds = row.find_all("td")
        # delete display: none span from opus number
        opus_number_td = tds[opus_col]
        if opus_number_td.span:
            opus_number_td.span.decompose()

        opus_number_str = opus_number_td.text.strip()
        if opus_number_str == "":
            # skip empty opus number
            print(f"Skipping empty opus number")
            continue
        if len(tds) < name_col:
            print(f"Skipping empty row")
            continue

        if opus_number_str == "—":
            # skip no opus number
            print(f"Skipping no opus number")
            continue

        work_title = tds[name_col].text.strip()
        # process override if there are any
        try:
            work_override = config_by_composer[composer]["work_override"]
            try:
                work_override_result = work_override(work_title)
                if work_override_result is not None:
                    # replace whatever is in the table with handwritten result, then skip it
                    all_works.append(work_override_result)
                    continue
            except InvalidWork:
                # skip row entirely
                continue
        except KeyError:
            pass

        if work_title == "":
            print(f"Skipping empty work title")
            continue
        if "(" in work_title:
            # grouping of works like Piano Trio (3), which will be scraped in upcoming rows
            if re.search("\(\d+\)", work_title):
                continue

        try:
            # use custom function to parse opus number
            opus_func = config_by_composer[composer]["opus_func"]
            opus, num = opus_func(opus_number_str)
            num = int(num)
        except KeyError:
            # fallback basic opus number handling
            if "/" in opus_number_str:
                # opus is the first part, number is the second
                opus, num = opus_number_str.split("/")
                try:
                    int(num)
                except ValueError:
                    print(
                        f"Skipping invalid opus number: {work_title} ({opus_number_str})"
                    )
                    continue
            else:
                opus = opus_number_str
                num = -1
        except ValueError:
            print(f"Skipping invalid opus number: {work_title} ({opus_number_str})")
            continue

        # clean up date
        date_str = tds[date_col].text.strip()
        if date_str == "" or date_str == "—":
            print(f"Skipping no year: {work_title}")
            continue
        elif "," in date_str:
            date = date_str.split(",")[0]
        elif "/" in date_str:
            date = date_str.split("/")[0]
        else:
            date = date_str

        if "\u2013" in date:
            # take the "start" year of composition rather than the full range
            date = date_str.split("\u2013")[0]
        if "-" in date:
            # some pages use the ascii character rather than unicode
            date = date_str.split("-")[0]

        if "before" in date:
            # same deal
            date = date_str.split("before")[0]
        elif "or" in date:
            # take the first date
            date = date_str.split("or")[0]

        date = (
            date.replace("?", "")
            .replace("c.", "")
            .replace("ca.", "")
            .replace("after", "")
            .replace("before", "")
            .strip()
        )

        if date == "":
            print(f"Skipping no year: {work_title}")
            continue

        # naive first/last split
        firstname = composer.split(" ")[0]
        lastname = composer.split(" ")[-1]
        all_works.append(
            ScrapedWork(
                composer_firstname=firstname,
                composer_lastname=lastname,
                composer_fullname=composer,
                work_title=work_title,
                composition_year=int(date),
                opus=opus,
                opus_number=int(num),
            )
        )
    return all_works


def parse_composer_imslp(composer: str) -> list[ScrapedWork]:
    url = f"https://imslp.org/wiki/List_of_works_by_{composer.replace(' ', '_')}"
    print("Requesting IMSLP...")
    try_imslp = requests.get(url)
    print("Got response.")
    status = try_imslp.status_code
    if status == 404:
        print(f"Composer not found: {composer}")
        return

    if status != 200:
        raise Exception(f"Status ({status}) loading page: {url}")

    print(f"Scraping IMSLP: {url}")
    return scrape_imslp_page(composer, try_imslp.text)


def parse_composer(composer: str) -> list[ScrapedWork] | None:
    return parse_composer_imslp(composer)


with open(COMPOSERS_FILE, "r") as f:
    composer_list = json.loads(f.read())

    j = 0
    all_works = []
    for composer in composer_list:
        works = parse_composer(composer)
        if works is None:
            continue

        output = {
            "id": j,
            "firstname": works[0].composer_firstname,
            "lastname": works[0].composer_lastname,
            "fullname": works[0].composer_fullname,
            "works": [
                {
                    "id": i,
                    "work_title": w.work_title,
                    "composition_year": w.composition_year,
                    "opus": w.opus,
                    "opus_number": w.opus_number,
                }
                for i, w in enumerate(works)
            ],
        }

        all_works.append(output)
        j += 1

        composer_filename = (
            composer.lower().replace(" ", "_").replace(".", "").replace(",", "")
        )
        filename = f"../src/assets/composer_data/{composer_filename}.json"
        with open(filename, "w") as f:
            f.write(json.dumps(output, indent=2))

    # write version consumed by app, all composers in one file
    with open("../src/assets/parsed_composers.json", "w") as f:
        f.write(json.dumps(all_works, indent=2))
    print("Wrote output")
