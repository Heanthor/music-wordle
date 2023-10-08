function GuessNumberPill(props: { rowNumber: number }) {
    const { rowNumber } = props;
    return (
        <div className="bg-yellow-400 rounded-lg py-1 px-2 mr-2 text-blue-800 font-semibold flex flex-col justify-center content-center">
            <span>{rowNumber}</span>
        </div>
    );
}

export default GuessNumberPill;