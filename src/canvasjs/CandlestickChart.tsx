import CanvasJS from "@canvasjs/charts";
import { MergedDataPoint, Transaction } from "../utils";
import * as transactions from "../assets/transactions.json";
import { useEffect, useRef, useState } from "react";

const transactionsByTimestamp = transactions.sell.reduce((p, c) => {
  p[c.timestamp.toString()] = c;
  return p;
}, {} as Record<string, Transaction>);

const convertData = (data: MergedDataPoint[]) => {
  return [
    {
      type: "candlestick",
      name: "AZA",
      yValueFormatString: "#.00 SEK",
      dataPoints: data.map((p) => ({
        x: new Date(p.timestamp),
        y: [p.open, p.high, p.low, p.close],
        color: p.close < p.open ? "red" : "green",
        markerType: transactionsByTimestamp[p.timestamp.toString()] ? "circle" : undefined,
        markerColor: transactionsByTimestamp[p.timestamp.toString()] ? "#FF0000" : undefined,
        markerSize: transactionsByTimestamp[p.timestamp.toString()] ? 12 : undefined,
      })),
    },
    {
      type: "line",
      name: "OMXS30GI",
      lineColor: "#FFD624",
      yValueFormatString: "#.00",
      dataPoints: data.map((p) => ({
        x: new Date(p.timestamp),
        y: p.comparison,
      })),
    },
    {
      type: "line",
      name: "Sälj",
      lineColor: "rgba(0, 0, 0, 0)",
      markerSize: 0,
      dataPoints: transactions.sell.map((t) => ({
        x: new Date(t.timestamp),
        y: t.averagePrice,
        toolTipContent: "Sälj: " + t.totalAmount,
      })),
    },
  ];
};

export const CandlestickChart = ({ data }: { data: MergedDataPoint[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current || chartContainerRef.current.children.length > 0) {
      return;
    }
    const options = {
      toolTip: {
        shared: true,
      },
      data: convertData(data),
    };

    const chart = new CanvasJS.Chart(chartContainerRef.current, options);
    chart.render();
  }, []);

  useEffect(() => {
    if (!chart) {
      return;
    }
    chart.set("data", convertData(data));
  }, [data]);

  return (
    <div>
      <div style={{ width: "800px", height: "400px" }} ref={chartContainerRef} />
    </div>
  );
};
