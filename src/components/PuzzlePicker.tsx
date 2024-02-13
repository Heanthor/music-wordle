import { useNavigate } from "react-router-dom";


function PuzzlePicker() {
    return (
        <div className="text-neutral-50">
            <div className="inline border-2 bg-blue-700 p-2 rounded-md shadow-md my-4 text-left border-blue-500">&lt;</div>
            <span className="mx-2 border-2 bg-indigo-500 p-2 rounded-md shadow-md my-4 text-left border-indigo-400">Puzzle 1</span>
            <div className="inline border-2 bg-blue-700 p-2 rounded-md shadow-md my-4 text-left border-blue-500">&gt;</div>
        </div>
    );
}

export default PuzzlePicker;
