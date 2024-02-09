/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from "react";
import Select, {
    ActionMeta,
    OnChangeValue,
    StylesConfig,
    createFilter,
    components,
    ValueContainerProps,
} from "react-select";
// import worksByComposer from "../assets/parsed_composers.json";
import { ComposerWork } from "./../composerWork";
import { PuzzleCategory } from "./../dailyPuzzle";
import catalogPrefixes from "../assets/catalog_prefixes.json";

import { useLoaderData } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import {
    getComposers,
    getWorksByComposerId,
    ComposerResponse,
    WorkResponse
} from "../fetchers";

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

// persist Placeholder text in input box
// this is very hacky and ignores type errors, but it seems to work?
const ValueContainer = ({
    children,
    ...props
}: ValueContainerProps<ChoiceOption>) => (
    <components.ValueContainer {...props}>
        {/* @ts-ignore */}
        {React.Children.map(children, child => child && child.type !== components.Placeholder ? child : null)}
        {/* @ts-ignore */}
        <components.Placeholder {...props} isFocused={props.isFocused}>
            {props.selectProps.placeholder}
        </components.Placeholder>
    </components.ValueContainer>
);

function GuessInput({ onSubmit }: Props) {
    const renderWorkChoiceLine = (
        work: WorkResponse,
        composerID: number
    ): string => {
        let prefix = "Op. ";
        if (hasKey(catalogPrefixes, composerID)) {
            prefix = catalogPrefixes[composerID];
        }

        const opusString = `(${prefix}${work.opus}${work.opusNumber && work.opusNumber >= 0 ? ` #${work.opusNumber}` : ""
            })`;
        const workValue = `${opusString} ${work.workTitle}`;

        return workValue;
    };

    const composerOptions = useQuery({
        queryKey: ["composers"],
        queryFn: getComposers,
        select: React.useCallback(
            (data: ComposerResponse[]) =>
                data
                    .map((composer) => {
                        return {
                            value: composer.id,
                            label: composer.fullName,
                            isFixed: false,
                        };
                    })
                    .sort((a, b) => a.label.localeCompare(b.label)),
            []
        ),
    });

    // const composerMap: { [key: string]: ChoiceOption[] } = {};

    // for (const entry of worksByComposer) {
    //     composerMap[entry.id] = entry.works.map((work) => {
    //         const cw = getComposerWorkByID(entry.id, work.id);

    //         return {
    //             value: work.id,
    //             label: renderWorkChoiceLine(cw, entry.id),
    //             isFixed: false,
    //         };
    //     });
    // }

    const defaultPlaceholderText = "Enter composer...";

    const puzzleCategory = useLoaderData() as PuzzleCategory;

    const [currentOptions, setCurrentOptions] = useState<readonly ChoiceOption[]>(
        []
    );
    useEffect(() => {
        if (
            currentOptions.length === 0 &&
            !composerOptions.isPending &&
            !composerOptions.isError
        ) {
            setCurrentOptions(composerOptions.data);
        }
    }, [currentOptions, composerOptions]);

    const [selectedOptions, setSelectedOptions] = useState<
        readonly ChoiceOption[]
    >([]);

    const [selectedComposerId, setSelectedComposerId] = useState<number | null>();

    const worksByComposerId = useQuery({
        queryKey: ["works", selectedComposerId],
        queryFn: () => getWorksByComposerId(selectedComposerId || 0),
        enabled: selectedComposerId !== null,
    });

    useEffect(() => {
        if (!worksByComposerId.isError && !worksByComposerId.isPending) {
            const transformed = worksByComposerId.data
                .map((work) => {
                    return {
                        value: work.id,
                        label: renderWorkChoiceLine(work, selectedComposerId || 0),
                        isFixed: false,
                    };
                })
            setCurrentOptions(transformed);
        }
    }, [selectedComposerId, worksByComposerId]);

    const [placeholderText, setPlaceholderText] = useState(
        defaultPlaceholderText
    );

    const resetToInitial = () => {
        if (
            currentOptions.length === 0 &&
            !composerOptions.isPending &&
            !composerOptions.isError
        ) {
            setCurrentOptions(composerOptions.data);
        } else {
            console.log("Could not set currentOptions to initial");
            setCurrentOptions([]);
        }

        setSelectedOptions([]);
        setPlaceholderText(defaultPlaceholderText);
    };

    const orderOptions = (values: readonly ChoiceOption[]) => {
        return values
            .filter((v) => v.isFixed)
            .concat(values.filter((v) => !v.isFixed));
    };

    const isComposerCorrect = (composer: string): boolean =>
        composer === currentPuzzle(puzzleCategory).puzzleAnswer.composer;

    const onSelectChange = (
        option: OnChangeValue<ChoiceOption, true>,
        actionMeta: ActionMeta<ChoiceOption>
    ) => {
        switch (actionMeta.action) {
            case "remove-value":
            case "pop-value":
                if (actionMeta.removedValue.isFixed) {
                    return;
                }
                break;
        }

        if (option.length === 0) {
            resetToInitial();
            return;
        }

        const newOption = [...option];
        if (newOption.length === 3) {
            // if we've selected more than two values, replace the old work with the current
            newOption[1] = option[2];
            newOption.pop();
        }

        if (newOption.length === 1) {
            // only a composer is selected
            setPlaceholderText("Select a work...");
        } else if (newOption.length === 2) {
            setPlaceholderText("");
        }

        const composer = newOption[0].value;
        const workOptions = composerMap[composer];
        setCurrentOptions(workOptions);
        setSelectedOptions(orderOptions(newOption));
    };

    const styles: StylesConfig<ChoiceOption, true> = {
        multiValue: (base, state) => {
            return state.data.isFixed
                ? { ...base, backgroundColor: "#06b6d4", borderRadius: "4px" }
                : base;
        },
        multiValueLabel: (base, state) => {
            return state.data.isFixed
                ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
                : base;
        },
        multiValueRemove: (base, state) => {
            return state.data.isFixed ? { ...base, display: "none" } : base;
        },
        input: (base) => {
            return { ...base, flexGrow: 0 };
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
                setSelectedComposerId(composerID);
                // const guess = getComposerWorkByID(composerID, workID);
                const guess = worksByComposerId.data?.find((work) => work.id === workID);
                onSubmit(guess);
                if (guess.equals(currentPuzzle(puzzleCategory).puzzleAnswer)) {
                    // game is over, clear out the box
                    resetToInitial();
                    setPlaceholderText("");
                } else if (isComposerCorrect(guess.composer)) {
                    // set options back to works, and preserve the selected composer
                    const fixedComposer = selectedOptions[0];
                    fixedComposer.isFixed = true;
                    setSelectedOptions([fixedComposer]);

                    // TODO if composerID is stored as state, the dependent query will refresh when it changes
                    // but, how can that set currentOptions?
                    setSelectedComposerId(composerID);
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
                components={{ ValueContainer }}
            />
            <button
                className="px-2 py-1 font-semibold text-sm bg-cyan-500 border-solid border-2 border-sky-700 text-neutral-50 rounded-lg md:rounded-lg shadow-sm w-full md:w-auto md:py-2 hover:bg-sky-600 align-middle"
                type="submit"
            >
                <span>Guess!</span>
            </button>
        </form>
    );
}

export default GuessInput;
