import { useLoaderData } from "react-router-dom";
import { CategoryPuzzleIDLoaderData } from "../loaders";
import { PuzzleCategory } from "../dailyPuzzle";

function InstructionsCard() {
    const routeData = useLoaderData() as CategoryPuzzleIDLoaderData;
    const puzzleCategory = routeData.puzzleCategory;

    const hints: { [category in PuzzleCategory]: string[] } = {
        Violin: [
            "Solo violin",
            "Solo violin and piano or orchestra (sonatas, concertos, etc.)",
            "Chamber music featuring violin (all violin parts, but the part will be prominent and recognizable)",
        ],
        Piano: [
            "Solo piano",
            "Piano and orchestra (concertos)",
            "Chamber music featuring piano",
        ],
        Cello: [
            "Solo cello",
            "Solo cello and piano or orchestra (sonatas, concertos, etc.)",
            "Chamber music featuring cello (all cello parts, but the part will be prominent and recognizable)",
            "Orchestral principal solos",
        ],
        Orchestral: [
            "The full score is not always included.",
            "When shown a subset of a larger score, instrumentation might not always be obvious.",
        ],
    };

    const renderHints = () =>
        hints[puzzleCategory].map((hint, index) => {
            return <li key={index}>{hint}</li>;
        });

    return (
        <div>
            <h2 className="text-l md:text-xl">Work Selection Rules</h2>
            <div className="text-left px-2 md:px-5 pb-1 md:pb-2">
                {puzzleCategory !== 'Orchestral' && (<span className="font-bold">
                    The correct work can be found in the following repertoire:
                </span>)}
                <ul className="list-disc pl-2 md:pl-5">{renderHints()}</ul>
            </div>
        </div>
    );
}

export default InstructionsCard;
