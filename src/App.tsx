import Footer from "./components/Footer";
import GameInstance from "./components/GameInstance";
import Header from "./components/Header";
import { CategoryPuzzleIDLoaderData } from "./loaders";

import { useLoaderData } from "react-router-dom";

function App() {
  const routeData = useLoaderData() as CategoryPuzzleIDLoaderData;
  const puzzleCategory = routeData.puzzleCategory;

  return (
    <div className="min-h-screen bg-blue-900 font-sans">
      <Header puzzleCategory={puzzleCategory} />
      <div className="container mx-auto text-center w-3/4">
        <div className="bg-blue-700 p-2 rounded-md shadow-md my-4 text-left border-blue-500 border-solid border-2">
          <div className="bg-blue-500 rounded-sm p-1 pl-2 flex justify-between">
            <span className=" text-neutral-50 text-sm font-bold">News</span>
            <span className=" text-neutral-300 text-sm pr-2 font-bold">Feb 13, 2024</span>
          </div>
          <p className="text-neutral-50 text-sm pl-2 pt-1">
            You can switch between puzzles, play them all!
          </p>
        </div>
      </div>
      <GameInstance puzzleCategory={puzzleCategory} key={puzzleCategory} />
      <Footer />
    </div>
  )
}

export default App;