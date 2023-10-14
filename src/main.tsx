import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { categoryLoader } from "./loaders";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/music-wordle/",
    element: <App />,
    loader: categoryLoader
  },
  {
    path: "/music-wordle/:puzzleCategory",
    element: <App />,
    loader: categoryLoader
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
