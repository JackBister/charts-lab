import ReactApexChart from "react-apexcharts";
import { MergedDataPoint } from "../utils";
import * as transactions from "../assets/transactions.json";

export const SimpleChart = ({ data }: { data: MergedDataPoint[] }) => {
  return (
    <ReactApexChart
      width={"100%"}
      height={400}
      type="area"
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
        fill: {
          gradient: {
            colorStops: [
              [
                {
                  offset: 5,
                  color: "#82ca9d",
                  opacity: 0.8,
                },
                {
                  offset: 95,
                  color: "#82ca9d",
                  opacity: 0,
                },
              ],
              [
                {
                  offset: 0,
                  color: "#FFD624",
                  opacity: 1,
                },
              ],
              [
                {
                  offset: 0,
                  color: "#000",
                  opacity: 0,
                },
              ],
            ],
          },
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
          },
          labels: {
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
          type: "area",
          name: "AZA",
          data: data.map((p) => ({
            x: p.timestamp,
            y: p.close,
          })),
        },
        {
          type: "line",
          name: "OMXS30GI",
          data: data.map((p) => ({
            x: p.timestamp,
            y: p.comparison,
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
  );
};
