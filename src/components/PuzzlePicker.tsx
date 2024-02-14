import { useNavigate, useLoaderData } from "react-router-dom";
import { CategoryPuzzleIDLoaderData } from "../loaders";
import { DailyPuzzle } from "../dailyPuzzle";

type Props = {
    currentPuzzle: DailyPuzzle | undefined;
};

function PuzzlePicker({ currentPuzzle }: Props) {
    const routeData = useLoaderData() as CategoryPuzzleIDLoaderData;
    const navigate = useNavigate();

    const category = routeData.puzzleCategory;

    const backDisabled = currentPuzzle?.puzzleNumber === 1;
    const forwardDisabled = currentPuzzle?.isLatestPuzzle;
    const currentPuzzleNumber = currentPuzzle?.puzzleNumber;

    const disabledStyles = "bg-gray-500 text-gray-300 cursor-not-allowed";
    return (
        <div className="text-neutral-50 my-2">
            <button className={`inline border-2 bg-blue-700 p-2 rounded-md shadow-mdtext-left border-blue-500 ${backDisabled ? disabledStyles : ""}}`}
                onClick={() => {
                    if (!currentPuzzleNumber) return;
                    navigate(`/${category.toLowerCase()}/${currentPuzzleNumber - 1}`);
                }}
                disabled={backDisabled}
            >
                &lt;
            </button>
            <span className="mx-2 border-2 bg-indigo-500 p-2 rounded-md shadow-md text-left border-indigo-400">
                {currentPuzzle ? `Puzzle ${currentPuzzle.getPuzzleShortTitle()}` : `Loading...`}
            </span>
            <button className={`inline border-2 bg-blue-700 p-2 rounded-md shadow-md text-left border-blue-500 ${forwardDisabled ? disabledStyles : ""}}`}
                onClick={() => {
                    if (!currentPuzzleNumber) return;
                    navigate(`/${category.toLowerCase()}/${currentPuzzleNumber + 1}`);
                }}
                disabled={forwardDisabled}
            >
                &gt;
            </button>
        </div>
    );
}

export default PuzzlePicker;
