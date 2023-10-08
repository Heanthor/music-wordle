import GuessRowContainer from "./GuessRowContainer";

function PlaceholderRow({ rowNumber }: { rowNumber: number }) {
    return (
        <GuessRowContainer rowNumber={rowNumber}>
            <div className="block max-w-[30rem] rounded-lg text-left  flex-grow"></div>
        </GuessRowContainer>
    )
}

export default PlaceholderRow;