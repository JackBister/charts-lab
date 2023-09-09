import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <ul>
        <li>
          <Link to="/recharts">Recharts</Link>
        </li>
        <li>
          <Link to="/apexcharts">ApexCharts</Link>
        </li>
        <li>
          <Link to="/highcharts">HighCharts</Link>
        </li>
        <li>
          <Link to="/tradingview">TradingView lightweight</Link>
        </li>
        <li>
          <Link to="/canvasjs">CanvasJS</Link>
        </li>
        <li>
          <Link to="/amcharts">amCharts</Link>
        </li>
      </ul>
    </>
  );
}

export default App;
