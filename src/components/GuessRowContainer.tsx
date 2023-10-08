import React from "react";
import GuessNumberPill from "./GuessNumberPill";

function GuessRowContainer(props: { children: React.ReactNode, rowNumber: number }) {
    const { children, rowNumber } = props;

    return (
        <div key={rowNumber} className="flex justify-center mb-2">
            <div className="flex justify-between flex-grow max-w-[34rem] bg-gray-400 rounded-lg p-1">
                <GuessNumberPill
                    rowNumber={rowNumber}
                />
                {children}
            </div>

        </div>
    );
}

export default GuessRowContainer;