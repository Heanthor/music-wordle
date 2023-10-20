import { useState } from "react";
import { PuzzleCategory, puzzleCategories } from "../dailyPuzzle";
import eighthNote from "../assets/8thNote.svg";
import { useNavigate } from "react-router-dom";

type Props = {
    puzzleCategory: PuzzleCategory,
};

function Header(props: Props) {
    const { puzzleCategory } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const renderDropdownOptions = () => {
        return puzzleCategories.map((category, i) => {
            const backgroundClass = puzzleCategory.toLowerCase() === category.toLowerCase() ? "bg-neutral-500" : "bg-transparent";

            return (<li key={i}>
                <button
                    className={`block w-full text-left whitespace-nowrap ${backgroundClass} px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600 cursor-pointer`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                        setDropdownOpen(false);
                        navigate(`/music-wordle/${category.toLowerCase()}`);
                    }}
                >{category}</button>
            </li>
            );
        });
    }

    const renderDropdown = () => {
        const displayClass = dropdownOpen ? "block" : "hidden";
        return (
            <div className="relative ml-2 mr-0 md:mr-4">
                <button
                    className="flex items-center px-6 pb-2 pt-2.5 text-neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400 cursor-pointer"
                    id="dropdownMenuButton2"
                    aria-expanded="false"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setDropdownOpen(false)}
                >
                    {puzzleCategory}
                    <span className="ml-2 w-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5">
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd" />
                        </svg>
                    </span>
                </button>
                <ul
                    className={`${displayClass} absolute z-[1000] m-0 min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block`}
                    aria-labelledby="dropdownMenuButton2"
                >
                    {renderDropdownOptions()}
                </ul>
            </div>
        )
    };

    return (
        <nav
            className="relative flex w-full flex-wrap items-center justify-between bg-[#FBFBFB] py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600"
            data-te-navbar-ref>
            <div className="flex w-full flex-wrap items-center justify-between px-3">
                <div className="ml-2">
                    <a className="text-xl text-neutral-800 dark:text-neutral-200" href="#"
                    >
                        <span>Sheet Musicdle</span>
                        <img src={eighthNote} className="inline h-6 pb-[3px] w-6" />
                    </a>
                </div>
                {renderDropdown()}
            </div>
        </nav>
    );
}

export default Header;