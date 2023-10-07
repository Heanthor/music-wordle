import React, { useState } from "react";
import Select from "react-select";
import worksByComposer from "../assets/parsed_composers.json";
import { ComposerWork, getComposerWorkByID } from "./../composerWork";

function GuessInput({ onSubmit }: { onSubmit: (guess: ComposerWork) => void }) {
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

    const onSelectChange = (option) => {
        if (option.length === 0) {
            resetToInitial();
            return;
        }

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
                onSubmit(getComposerWorkByID(composerID, workID));
                resetToInitial();
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
            {/* <input
                className="mr-2 pl-1 shrink w-2/3 md:w-1/4"
                type="text"
                id="guess-box"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
            /> */}
            <button
                className="px-2 py-1 font-semibold text-sm bg-cyan-500 text-neutral-50 rounded-full shadow-sm"
                type="submit"
            >
                Guess!
            </button>
        </form>
    );
}

export default GuessInput;
