import GameInstance from "./components/GameInstance";
import Header from "./components/Header";
import { PuzzleCategory } from "./dailyPuzzle";

import { useLoaderData } from "react-router-dom";

function App() {
  const puzzleCategory = useLoaderData() as PuzzleCategory;

  return (
    <div className="min-h-screen bg-blue-900">
      <Header puzzleCategory={puzzleCategory} />
      <div className="container mx-auto text-center w-3/4">
        <div className="bg-blue-700 p-2 rounded-md shadow-md my-4 text-left border-blue-500 border-solid border-2">
          <div className="bg-blue-500 rounded-sm p-1 pl-2 flex justify-between">
            <span className=" text-neutral-50 text-sm font-bold">News</span>
            <span className=" text-neutral-300 text-sm pr-2 font-bold">Oct 21, 2023</span>
          </div>
          <p className="text-neutral-50 text-sm pl-2 pt-1">
            I am adding more composers...
          </p>
        </div>
      </div>
      <GameInstance puzzleCategory={puzzleCategory} key={puzzleCategory} />
    </div>
  )
}

export default App;