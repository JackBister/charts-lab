import * as Highcharts from "highcharts/highstock";
import * as HighchartsReact from "highcharts-react-official";
import Annotations from "highcharts/modules/annotations";
Annotations(Highcharts);

import { MergedDataPoint } from "../utils";
import * as transactions from "../assets/transactions.json";

export const SimpleChart = ({ data }: { data: MergedDataPoint[] }) => {
  const options: Highcharts.Options = {
    chart: {
      height: 400,
    },
    credits: {
      enabled: false,
    },
    navigator: {
      series: [
        {
          type: "bar",
          animation: {
            defer: 0,
            duration: 0,
          },
          data: data.map((p) => ({
            x: p.timestamp,
            y: p.totalVolumeTraded,
          })),
        },
      ],
    },
    tooltip: {
      shared: true,
      split: false,
      valueDecimals: 2,
      positioner() {
        return {
          x: 0,
          y: 0,
        };
      },
    },
    colors: ["#82ca9d", "#FFD624", "rgba(0,0,0,0)"],
    series: [
      {
        type: "area",
        name: "AZA",
        data: data.map((p) => ({
          id: p.timestamp.toString(),
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
        data: transactions.sell.map((p) => ({
          x: p.timestamp,
          y: p.averagePrice,
        })),
      },
    ],
    annotations: [
      {
        animation: {
          defer: 0,
        },
        draggable: "",
        shapes: transactions.sell.map((t) => ({
          point: {
            x: t.timestamp,
            y: t.averagePrice,
            xAxis: 0,
            yAxis: 0,
          },
          type: "circle",
          r: 5,
          fill: "red",
          stroke: "pink",
        })),
      },
    ],
  };
  return <HighchartsReact.default highcharts={Highcharts} constructorType="stockChart" options={options} />;
};
