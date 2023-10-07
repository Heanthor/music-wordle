import React, { useState } from "react";
import Select from "react-select";
import worksByComposer from "../assets/parsed_composers.json";
import { ComposerWork, getComposerWorkByID } from "./../composerWork";
import { currentPuzzle } from "./../dailyPuzzle";

type Props = {
    onSubmit: (guess: ComposerWork) => void;
};

function GuessInput({ onSubmit }: Props) {
    const allComposerOptions = worksByComposer.map((composer) => {
        return {
            value: composer.id,
            label: composer.fullname,
        };
    });
    const composerMap: { [key: string]: { value: number; label: string }[] } = {};

    for (const entry of worksByComposer) {
        composerMap[entry.id] = entry.works.map((work) => {
            const opusString = `(${work.opus} ${work.opus_number >= 0 ? `#${work.opus_number}` : ""
                })`;
            const workValue = `${opusString} ${work.work_title}`;

            return {
                value: work.id,
                label: workValue,
            };
        });
    }

    const [currentOptions, setCurrentOptions] = useState(allComposerOptions);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const resetToInitial = () => {
        setCurrentOptions(allComposerOptions);
        setSelectedOptions([]);
    }

    const isComposerCorrect = (composer: string): boolean => composer === currentPuzzle.puzzleAnswer.composer;

    const onSelectChange = (option) => {
        if (option.length === 0) {
            resetToInitial();
            return;
        }

        console.log(option);
        const composer = option[0].value;
        const workOptions = composerMap[composer];
        setCurrentOptions(workOptions);
        setSelectedOptions(option);
    };

    return (
        <form
            className="mb-4 mt-2 md:mb-2 md:mt-0 flex justify-center"
            onSubmit={(e) => {
                if (e) {
                    e.preventDefault();
                }

                const composerID = selectedOptions[0].value;
                const workID = selectedOptions[1].value;
                const guess = getComposerWorkByID(composerID, workID);
                onSubmit(guess);
                if (isComposerCorrect(guess.composer)) {
                    // set options back to works, and preserve the selected composer
                    setSelectedOptions(selectedOptions[0]);

                    const workOptions = composerMap[composerID];
                    setCurrentOptions(workOptions);
                } else {
                    resetToInitial();
                }
            }}
        >
            <Select
                options={currentOptions}
                onChange={onSelectChange}
                isMulti
                placeholder="Enter composer..."
                className="w-3/4 md:w-2/3 mr-2"
                value={selectedOptions}
            />

            <button
                className="px-2 py-1 font-semibold text-sm bg-cyan-500 text-neutral-50 rounded-lg md:rounded-full shadow-sm"
                type="submit"
            >
                Guess!
            </button>
        </form>
    );
}

export default GuessInput;
