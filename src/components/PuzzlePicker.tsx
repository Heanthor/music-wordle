import { useLoaderData } from "react-router-dom";
import { PuzzleCategory } from "../dailyPuzzle";

interface PuzzlePickerProps {
    // Define props here
}

function PuzzlePicker(props) {
    // Implement component logic here
    const puzzleCategory = useLoaderData() as PuzzleCategory;

    return (
        <div>
            Puzzle 1
        </div>
    );
}

export default PuzzlePicker;
