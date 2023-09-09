import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { RechartsPage } from "./recharts/RechartsPage.tsx";
import App from "./App.tsx";
import { ApexChartsPage } from "./apexcharts/ApexChartsPage.tsx";
import { HighchartsPage } from "./highcharts/HighchartsPage.tsx";
import { TradingViewPage } from "./tradingview/TradingViewPage.tsx";
import { CanvasJSPage } from "./canvasjs/CanvasJSPage.tsx";
import { AmchartsPage } from "./amcharts/AmchartsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/recharts",
    element: <RechartsPage />,
  },
  {
    path: "/apexcharts",
    element: <ApexChartsPage />,
  },
  {
    path: "/highcharts",
    element: <HighchartsPage />,
  },
  {
    path: "/tradingview",
    element: <TradingViewPage />,
  },
  {
    path: "/canvasjs",
    element: <CanvasJSPage />,
  },
  {
    path: "/amcharts",
    element: <AmchartsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
