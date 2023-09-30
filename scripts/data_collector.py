from __future__ import annotations

import json
from dataclasses import dataclass

import requests
from bs4 import BeautifulSoup

COMPOSERS_FILE = "composers.json"


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

    return opus, num


config_by_composer = {
    "Ludwig van Beethoven": {"opus_func": beethoven_opus},
    "Wolfgang Amadeus Mozart": {"opus_func": mozart_opus},
}


@dataclass
class ScrapedWork:
    composer_firstname: str
    composer_lastname: str
    composer_fullname: str
    work_title: str
    composition_year: int
    opus: str
    opus_number: int


def scrape_imslp_page(composer: str, page_text: str) -> list[ScrapedWork]:
    soup = BeautifulSoup(page_text, "html.parser")

    works_table = soup.find("table", {"class": "wikitable sortable"})
    # loop over the tr elements inside the tbody
    first = True
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
            first = False
            continue

        tds = row.find_all("td")
        # delete display: none span from opus number
        opus_number_td = tds[0]
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
        work_title = tds[name_col].text.strip()
        if opus_number_str == "—":
            # skip no opus number
            print(f"Skipping no opus number: {work_title}")
            continue

        if "(" in work_title:
            # start grouping of works like Piano Trio (3)
            continue

        try:
            # use custom function to parse opus number
            opus_func = config_by_composer[composer]["opus_func"]
            opus, num = opus_func(opus_number_str)
            opus = int(opus)
            num = int(num)
        except KeyError:
            # fallback basic opus number handling
            if "/" in opus_number_str:
                # opus is the first part, number is the second
                opus, num = opus_number_str.split("/")
                try:
                    int(opus)
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

        date_str = tds[date_col].text.strip()
        if date_str == "" or date_str == "—":
            print(f"Skipping no year: {work_title}")
            continue
        elif "," in date_str:
            date = date_str.split(",")[0]
        else:
            date = date_str

        if "\u2013" in date:
            # take the "start" year of composition rather than the full range
            date = date_str.split("\u2013")[0]
        if "-" in date:
            # some pages use the ascii character rather than unicode
            date = date_str.split("-")[0]

        date = (
            date.replace("?", "")
            .replace("c.", "")
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


def parse_composer_imslp(composer: str):
    url = f"https://imslp.org/wiki/List_of_works_by_{composer.replace(' ', '_')}"
    try_imslp = requests.get(url)

    status = try_imslp.status_code
    if status == 404:
        print(f"Composer not found: {composer}")
        return

    if status != 200:
        raise Exception(f"Status ({status}) loading page: {url}")

    print(f"Scraping IMSLP: {url}")
    scrape_imslp_page(composer, try_imslp.text)


def parse_composer(composer: str):
    parse_composer_imslp(composer)


with open(COMPOSERS_FILE, "r") as f:
    composer_list = json.loads(f.read())

    for composer in composer_list:
        parse_composer(composer)
