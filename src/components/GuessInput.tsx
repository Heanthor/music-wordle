import { useState } from "react";
import Select, { ActionMeta, OnChangeValue, StylesConfig, createFilter } from "react-select";
import worksByComposer from "../assets/parsed_composers.json";
import { ComposerWork, getComposerWorkByID } from "./../composerWork";
import { currentPuzzle } from "./../dailyPuzzle";
import catalogPrefixes from "../assets/catalog_prefixes.json";

type Props = {
    onSubmit: (guess: ComposerWork) => void;
};

type ChoiceOption = {
    value: number;
    label: string;
    isFixed: boolean;
};

function hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj;
}

function GuessInput({ onSubmit }: Props) {
    const renderWorkChoiceLine = (work: ComposerWork, composerID: number): string => {
        let prefix = "Op. ";
        if (hasKey(catalogPrefixes, composerID)) {
            prefix = catalogPrefixes[composerID];
        }

        const opusString = `(${prefix}${work.opus}${work.opusNumber && work.opusNumber >= 0 ? ` #${work.opusNumber}` : ""})`;
        const workValue = `${opusString} ${work.work}`;

        return workValue;
    };

    const allComposerOptions = worksByComposer.map((composer) => {
        return {
            value: composer.id,
            label: composer.fullname,
            isFixed: false,
        };
    });
    const composerMap: { [key: string]: ChoiceOption[] } = {};

    for (const entry of worksByComposer) {
        composerMap[entry.id] = entry.works.map((work) => {
            const cw = getComposerWorkByID(entry.id, work.id);

            return {
                value: work.id,
                label: renderWorkChoiceLine(cw, entry.id),
                isFixed: false,
            };
        });
    }

    const [currentOptions, setCurrentOptions] = useState<readonly ChoiceOption[]>(allComposerOptions);
    const [selectedOptions, setSelectedOptions] = useState<readonly ChoiceOption[]>([]);
    const [placeholderText, setPlaceholderText] = useState("Enter composer...");

    const resetToInitial = () => {
        setCurrentOptions(allComposerOptions);
        setSelectedOptions([]);
    }

    const orderOptions = (values: readonly ChoiceOption[]) => {
        return values
            .filter((v) => v.isFixed)
            .concat(values.filter((v) => !v.isFixed));
    };

    const isComposerCorrect = (composer: string): boolean => composer === currentPuzzle.puzzleAnswer.composer;

    const onSelectChange = (option: OnChangeValue<ChoiceOption, true>, actionMeta: ActionMeta<ChoiceOption>) => {
        if (option.length === 0) {
            resetToInitial();
            return;
        }

        const newOption = [...option];
        if (option.length === 3) {
            // if we've selected more than two values, replace the old work with the current
            newOption[1] = option[2];
            newOption.pop();
        }

        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                if (actionMeta.removedValue.isFixed) {
                    return;
                }
                break;
        }

        const composer = newOption[0].value;
        const workOptions = composerMap[composer];
        setCurrentOptions(workOptions);
        setSelectedOptions(orderOptions(newOption));
    };

    const styles: StylesConfig<ChoiceOption, true> = {
        multiValue: (base, state) => {
            return state.data.isFixed ? { ...base, backgroundColor: '#06b6d4', borderRadius: "4px" } : base;
        },
        multiValueLabel: (base, state) => {
            return state.data.isFixed
                ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
                : base;
        },
        multiValueRemove: (base, state) => {
            return state.data.isFixed ? { ...base, display: 'none' } : base;
        },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customStringify = (option: any) => `${option.label}`;

    return (
        <form
            className="md:mt-0 flex justify-center flex-col md:flex-row items-center"
            onSubmit={(e) => {
                if (e) {
                    e.preventDefault();
                }

                if (selectedOptions.length !== 2) {
                    return;
                }
                const composerID = selectedOptions[0].value;
                const workID = selectedOptions[1].value;
                const guess = getComposerWorkByID(composerID, workID);
                onSubmit(guess);
                if (guess.equals(currentPuzzle.puzzleAnswer)) {
                    // game is over, clear out the box
                    resetToInitial();
                    setPlaceholderText("");
                } else if (isComposerCorrect(guess.composer)) {
                    // set options back to works, and preserve the selected composer
                    const fixedComposer = selectedOptions[0];
                    fixedComposer.isFixed = true;
                    setSelectedOptions([fixedComposer]);

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
                placeholder={placeholderText}
                className="w-full md:max-w-[38rem] mr-0 md:mr-2 mb-2 md:mb-0 rounded-lg border-solid border-2 border-sky-700"
                value={selectedOptions}
                isClearable={false}
                styles={styles}
                filterOption={createFilter({ stringify: customStringify })}
            />
            <button
                className="px-2 py-1 font-semibold text-sm bg-cyan-500 border-solid border-2 border-sky-700 text-neutral-50 rounded-lg md:rounded-lg shadow-sm w-full md:w-auto md:py-2 hover:bg-sky-600"
                type="submit"
            >
                Guess!
            </button>
        </form>
    );
}

export default GuessInput;
