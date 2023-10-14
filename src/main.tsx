import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { PuzzleCategory, puzzleCategories } from './dailyPuzzle.ts';

const router = createBrowserRouter([
  {
    path: "/music-wordle/",
    element: <App />,
  },
  {
    path: "/music-wordle/:puzzleCategory",
    element: <App />,
    loader: ({ params }) => {
      const { puzzleCategory } = params;
      const match = puzzleCategories.find((category: PuzzleCategory) => category.toLowerCase() === puzzleCategory?.toLowerCase());

      if (!match) {
        // default category
        return puzzleCategories[0];
      }

      return match;
    },
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
