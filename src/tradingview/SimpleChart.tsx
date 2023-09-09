import { createChart, ColorType, UTCTimestamp } from "lightweight-charts";
import { useRef, useEffect } from "react";
import { MergedDataPoint } from "../utils";

export const SimpleChart = ({ data }: { data: MergedDataPoint[] }) => {
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
      /*
      layout: {
        background: {
          type: ColorType.VerticalGradient,
          topColor: "rgba(130, 202, 157, 0.8)",
          bottomColor: "rgba(130, 202, 157, 0)",
        },
      },
      */
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor: "rgba(130, 202, 157, 1.0)",
      topColor: "rgba(130, 202, 157, 0.8)",
      bottomColor: "rgba(130, 202, 157, 0)",
    });
    newSeries.setData(
      data.map((p) => ({
        time: (p.timestamp / 1000) as UTCTimestamp,
        value: p.close,
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

  return <div style={{ width: "800px" }} ref={chartContainerRef} />;
};
