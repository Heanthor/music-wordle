import Footer from "./components/Footer";
import GameInstance from "./components/GameInstance";
import Header from "./components/Header";
import { CategoryPuzzleIDLoaderData } from "./loaders";

import { useLoaderData } from "react-router-dom";

import { v4 as uuidv4 } from 'uuid';
import { UuidContext } from "./contexts";
import NewsPopup from "./components/NewsPopup";

function AppInner() {
  const routeData = useLoaderData() as CategoryPuzzleIDLoaderData;
  const puzzleCategory = routeData.puzzleCategory;
  const puzzleID = routeData.puzzleID

  return (
    <div className="min-h-screen bg-blue-900 font-sans relative">
      <Header puzzleCategory={puzzleCategory} />
      <NewsPopup />
      <GameInstance puzzleCategory={puzzleCategory} key={`${puzzleCategory}${puzzleID}`} />

      {/* Spacer for footer */}
      <div className="h-16"></div>
      <Footer />
    </div>
  )
}

function App() {
  // provide unique id on initial render/pageload
  const uuid = uuidv4();

  return (
    <UuidContext.Provider value={uuid}>
      <AppInner />
    </UuidContext.Provider>
  )
}

export default App;