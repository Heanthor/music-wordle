from __future__ import annotations

from scripts.data_collector import BaseScraper, ScrapedWork
from bs4 import BeautifulSoup


class ScrapeBeethoven(BaseScraper):
    def __init__(self) -> None:
        super().__init__()
        self.base_url = (
            "https://en.wikipedia.org/wiki/List_of_compositions_by_Ludwig_van_Beethoven"
        )

    def get_all_works(self) -> list[ScrapedWork]:
        soup = self.load_page(self.base_url)

        works = []
        opus_list = soup.find(
            "span", id="Works_with_opus_number"
        ).parent.find_next_sibling("ul")

        print(opus_list)
