import { useNavigate, useLoaderData } from "react-router-dom";
import { CategoryPuzzleIDLoaderData } from "../loaders";
import { getCategoryAbbreviation } from "../dailyPuzzle";

type Props = {
    currentPuzzleNumber: number | undefined;
    isLatest: boolean;
};

function PuzzlePicker({ currentPuzzleNumber, isLatest }: Props) {
    const routeData = useLoaderData() as CategoryPuzzleIDLoaderData;
    const navigate = useNavigate();

    const category = routeData.puzzleCategory;

    const backDisabled = currentPuzzleNumber === 1;
    const forwardDisabled = isLatest;

    const disabledStyles = "bg-gray-500 text-gray-300 cursor-not-allowed";
    return (
        <div className="text-neutral-50">
            <button className={`inline border-2 bg-blue-700 p-2 rounded-md shadow-md my-4 text-left border-blue-500 ${backDisabled ? disabledStyles : ""}}`}
                onClick={() => {
                    if (!currentPuzzleNumber) return;
                    navigate(`/${category.toLowerCase()}/${currentPuzzleNumber - 1}`);
                }}
                disabled={backDisabled}
            >
                &lt;
            </button>
            <span className="mx-2 border-2 bg-indigo-500 p-2 rounded-md shadow-md my-4 text-left border-indigo-400">
                {currentPuzzleNumber ? `Puzzle ${getCategoryAbbreviation(category) + currentPuzzleNumber}` : `Loading...`}
            </span>
            <button className={`inline border-2 bg-blue-700 p-2 rounded-md shadow-md my-4 text-left border-blue-500 ${forwardDisabled ? disabledStyles : ""}}`}
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
