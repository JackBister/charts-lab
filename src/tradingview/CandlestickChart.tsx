import { createChart, UTCTimestamp } from "lightweight-charts";
import { useRef, useEffect } from "react";
import { MergedDataPoint } from "../utils";

export const CandlestickChart = ({ data }: { data: MergedDataPoint[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }
    const handleResize = () => {
      if (!chartContainerRef.current) {
        return;
      }
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({});
    newSeries.setData(
      data.map((p) => ({
        time: (p.timestamp / 1000) as UTCTimestamp,
        open: p.open,
        high: p.high,
        low: p.low,
        close: p.close,
      }))
    );

    const compareSeries = chart.addLineSeries({
      color: "#FFD624",
    });
    compareSeries.setData(
      data.map((p) => ({
        time: (p.timestamp / 1000) as UTCTimestamp,
        value: p.comparison,
      }))
    );

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data]);

  return <div style={{ width: "100%" }} ref={chartContainerRef} />;
};
