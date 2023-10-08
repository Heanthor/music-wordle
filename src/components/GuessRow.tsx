
import GuessRowContainer from "./GuessRowContainer";
import GuessRowCard from "./GuessRowCard";
import { ComposerWork } from "../composerWork";
import WorkCard from "./WorkCard";

function GuessRow({ rowNumber, guess }: { rowNumber: number, guess: ComposerWork }) {
    return (
        <GuessRowContainer rowNumber={rowNumber}>
            <div className="flex flex-col md:flex-row md:justify-center flex-grow">
                <div className="mb-2 md:mb-0">
                    <GuessRowCard
                        guess={guess}
                    />
                </div>
                <WorkCard guess={guess} />
            </div>
        </GuessRowContainer>
    );
}

export default GuessRow;