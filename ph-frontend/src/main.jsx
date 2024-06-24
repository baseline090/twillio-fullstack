import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { AppContextProvider } from "./AppContext.jsx";
const router = createBrowserRouter([{ path: "*", Component: App }]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppContextProvider>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </AppContextProvider>
);
