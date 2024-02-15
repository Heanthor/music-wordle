import GuessRowContainer from "./GuessRowContainer";

function PlaceholderRow({ rowNumber }: { rowNumber: number }) {
    return (
        <GuessRowContainer rowNumber={rowNumber}>
            <div className="block rounded-lg text-left flex-grow"></div>
        </GuessRowContainer>
    )
}

export default PlaceholderRow;