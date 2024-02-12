import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { categoryLoader } from "./loaders";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css'

const queryClient = new QueryClient();

const rootApp = <QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;

const router = createBrowserRouter([
  {
    path: "/",
    element: rootApp,
    loader: categoryLoader
  },
  {
    path: "/:puzzleCategory",
    element: rootApp,
    loader: categoryLoader
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
