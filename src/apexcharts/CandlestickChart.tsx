import ReactApexChart from "react-apexcharts";
import { MergedDataPoint } from "../utils";
import * as transactions from "../assets/transactions.json";

export const CandlestickChart = ({ data }: { data: MergedDataPoint[] }) => {
  return (
    <div style={{ marginLeft: "-40px", marginRight: "-6px" }}>
      <ReactApexChart
        width={"100%"}
        height={400}
        type="candlestick"
        options={{
          annotations: {
            points: transactions.sell.map((t) => ({
              id: t.timestamp + "_" + t.totalAmount,
              x: t.timestamp,
              y: t.averagePrice,
              marker: {
                fillColor: "red",
                strokeColor: "pink",
                radius: 5,
              },
            })),
          },
          chart: {
            animations: {
              enabled: false,
            },
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          grid: {
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          legend: {
            show: false,
          },
          stroke: {
            width: 1.5,
            colors: ["#82ca9d", "#FFD624", "rgba(0, 0, 0, 0)"],
          },
          tooltip: {
            shared: true,
            fixed: {
              enabled: true,
              position: "topLeft",
              offsetX: 60,
              offsetY: 8,
            },
            cssClass: "apexcharts-tooltip",
          },
          xaxis: {
            type: "datetime",
            labels: {
              style: {
                colors: "rgba(255, 255, 255, 0.6)",
              },
            },
            tooltip: {
              enabled: false,
            },
          },
          yaxis: {
            axisBorder: {
              show: true,
              offsetX: -35,
            },
            labels: {
              offsetX: 35,
              align: "left",
              style: {
                colors: "rgba(255, 255, 255, 0.6)",
              },
              formatter(v) {
                return v.toFixed(0);
              },
            },
          },
        }}
        series={[
          {
            name: "AZA",
            type: "candlestick",
            data: data.map((p) => ({
              x: p.timestamp,
              y: [p.open, p.high, p.low, p.close],
            })),
          },
          {
            type: "line",
            name: "OMXS30GI",
            data: data.map((p) => ({
              x: p.timestamp,
              y: p.comparison?.toFixed(0),
            })),
          },
          {
            type: "line",
            name: "Sälj",
            // This part breaks the "shared" part of the tooltip.
            // https://github.com/apexcharts/apexcharts.js/issues/420
            data: transactions.sell.map((t) => ({
              x: t.timestamp,
              y: t.averagePrice,
            })),
          },
        ]}
      />
    </div>
  );
};
