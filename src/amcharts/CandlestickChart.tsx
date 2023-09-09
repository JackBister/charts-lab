import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5stock from "@amcharts/amcharts5/stock";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { MergedDataPoint, Transaction } from "../utils";
import * as transactions from "../assets/transactions.json";
import { useEffect, useRef, useState } from "react";

export const CandlestickChart = ({ data }: { data: MergedDataPoint[] }) => {
  const transactionsByTimestamp = transactions.sell.reduce((p, c) => {
    p[c.timestamp.toString()] = c;
    return p;
  }, {} as Record<string, Transaction>);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const toolbarContainerRef = useRef<HTMLDivElement>(null);

  const [mainSeries, setMainSeries] = useState<am5xy.CandlestickSeries | null>(null);
  const [volumeSeries, setVolumeSeries] = useState<am5xy.ColumnSeries | null>(null);
  const [comparisonSeries, setComparisonSeries] = useState<am5xy.LineSeries | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !toolbarContainerRef.current) {
      return;
    }
    const root = am5.Root.new(chartContainerRef.current);

    root.setThemes([am5themes_Animated.new(root)]);
    root.numberFormatter.setAll({
      numberFormat: "#,###.00",
    });

    let chart = root.container.children.push(am5stock.StockChart.new(root, {}));

    const mainPanel = chart.panels.push(
      am5stock.StockPanel.new(root, {
        wheelY: "zoomX",
        panX: true,
        panY: true,
      })
    );

    const tooltip = mainPanel.set("tooltip", am5.Tooltip.new(root, {}));
    // For some reason open/close does not work here but high/low does...
    tooltip.label.setAll({
      text: "AZA: {close} SEK\nOMXS30GI: {comparison}",
    });

    // Create Y-axis
    let yAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create X-Axis
    let xAxis = mainPanel.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );
    xAxis.data.setAll(data);

    // Create series
    const mainSeries = mainPanel.series.push(
      am5xy.CandlestickSeries.new(root, {
        name: "AZA",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "timestamp",
        openValueYField: "open",
        highValueYField: "high",
        lowValueYField: "low",
        valueYField: "close",
        stroke: am5.color("#82ca9d"),
        tooltip,
      })
    );
    setMainSeries(mainSeries);
    mainSeries.bullets.push((r, _series, dataItem) => {
      if (!(dataItem.dataContext as any)?.timestamp) {
        return undefined;
      }
      const tr = transactionsByTimestamp[(dataItem.dataContext as any).timestamp.toString()];
      if (tr) {
        return am5.Bullet.new(r, {
          sprite: am5.Circle.new(r, {
            radius: 5,
            fill: am5.color("#f00"),
          }),
        });
      }
      return undefined;
    });
    mainSeries.data.setAll(data);

    const comparisonSeries = mainPanel.series.push(
      am5xy.LineSeries.new(root, {
        name: "OMXS30GI",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "timestamp",
        valueYField: "comparison",
        stroke: am5.color("#FFD624"),
        tooltip,
      })
    );
    setComparisonSeries(comparisonSeries);
    comparisonSeries.data.setAll(data);

    // https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series
    const volumeValueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        forceHidden: true,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    volumeValueAxis.get("renderer").grid.template.set("forceHidden", true);
    volumeValueAxis.get("renderer").labels.template.set("forceHidden", true);

    const volumeSeries = mainPanel.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "AZA",
        xAxis: xAxis,
        yAxis: volumeValueAxis,
        forceHidden: true,
      })
    );
    setVolumeSeries(volumeSeries);
    volumeSeries.data.setAll(data);

    chart.set("stockSeries", mainSeries);
    chart.set("volumeSeries", volumeSeries);

    const valueLegend = mainPanel.plotContainer.children.push(
      am5stock.StockLegend.new(root, {
        stockChart: chart,
      })
    );
    valueLegend.data.setAll([mainSeries, comparisonSeries]);

    // Add cursor
    mainPanel.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        xAxis,
        yAxis,
        snapToSeries: [mainSeries],
        snapToSeriesBy: "y!",
      })
    );

    am5stock.StockToolbar.new(root, {
      container: toolbarContainerRef.current,
      stockChart: chart,
      controls: [
        am5stock.IndicatorControl.new(root, {
          stockChart: chart,
        }),
      ],
    });

    return () => {
      root.dispose();
    };
  }, []);

  useEffect(() => {
    if (!mainSeries || !comparisonSeries || !volumeSeries) {
      return;
    }
    mainSeries.data.setAll(data);
    comparisonSeries.data.setAll(data);
    volumeSeries.data.setAll(data);
  }, [data]);
  return (
    <div style={{ backgroundColor: "white" }}>
      <div ref={toolbarContainerRef}></div>
      <div style={{ width: "800px", height: "400px" }} ref={chartContainerRef}></div>
    </div>
  );
};
