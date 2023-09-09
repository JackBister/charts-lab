import { Link } from "react-router-dom";
import { CandlestickChart } from "./CandlestickChart";
import { SimpleChart } from "./SimpleChart";
import { generateNextPoint, getMergedData } from "../utils";
import { useEffect, useState } from "react";

const initialData = getMergedData();

export const RechartsPage = () => {
  const [data, setData] = useState(initialData);
  useEffect(() => {
    const interval = setInterval(() => {
      const nextPoint = generateNextPoint([data[data.length - 2], data[data.length - 1]]);
      return setData([...data, nextPoint]);
    }, 5000);
    return () => clearInterval(interval);
  });
  return (
    <div style={{ padding: "0 6px" }}>
      <Link to="/">Tillbaka</Link>
      <h1>Enkel graf</h1>
      <SimpleChart data={data} />
      <h1>Candlestick-graf</h1>
      <CandlestickChart data={data} />
    </div>
  );
};
