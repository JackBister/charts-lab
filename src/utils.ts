import * as comparisonChartData from "./assets/compare.json";
import * as priceChartData from "./assets/price-chart.json";
import * as transactions from "./assets/transactions.json";

export const shortDateFormatter = new Intl.DateTimeFormat("sv-SE", {
  dateStyle: "short",
});
export const longDateFormatter = new Intl.DateTimeFormat("sv-SE", {
  dateStyle: "long",
});

export type Transaction = (typeof transactions.sell)[0];

export interface MergedDataPoint {
  timestamp: number;
  open: number;
  close: number;
  high: number;
  low: number;
  openClose: [number, number];
  totalVolumeTraded: number;
  comparison?: number;
  transactions?: Transaction[];
}

export const getMergedData = () => {
  const mergedData: MergedDataPoint[] = [];

  for (let i = 0; i < priceChartData.ohlc.length; i++) {
    const originalPoint = priceChartData.ohlc[i];
    const p: MergedDataPoint = {
      ...originalPoint,
      openClose: [originalPoint.open, originalPoint.close],
      comparison: comparisonChartData.ohlc[i].close,
    };
    if (comparisonChartData.ohlc[i].timestamp !== priceChartData.ohlc[i].timestamp) {
      console.log(
        "timestamp mismatch at index",
        i,
        priceChartData.ohlc[i].timestamp,
        comparisonChartData.ohlc[i].timestamp
      );
    }
    let tr = [
      ...transactions.buy.map((t: any) => ({ ...t, side: "BUY" })),
      ...transactions.sell.map((t) => ({ ...t, side: "SELL" })),
    ].filter((t) => t.timestamp === p.timestamp);
    p.transactions = tr;
    mergedData.push(p);
  }
  return mergedData;
};

export const calculateAxisParameters = (data: MergedDataPoint[]) => {
  let minClose = data[0].close;
  let maxClose = data[0].close;
  for (const p of data) {
    if (p.close < minClose) {
      minClose = p.close;
    }
    if (p.close > maxClose) {
      maxClose = p.close;
    }
  }
  minClose *= 0.8;
  maxClose *= 1.2;
  const yMin = Math.floor(minClose / 5) * 5;
  const yMax = Math.floor(maxClose / 5) * 5;
  let ticks = [];
  for (let i = yMin; i <= yMax; i += 40) {
    ticks.push(i);
  }
  const xMin = data[0].timestamp;
  const xMax = data[data.length - 1].timestamp;

  return { xMin, xMax, yMin, yMax, ticks };
};

const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const generateNextPoint: (lastPoints: [MergedDataPoint, MergedDataPoint]) => MergedDataPoint = (lastPoints) => {
  const highFactor = getRandomNumber(0.98, 1.03);
  const lowFactor = getRandomNumber(0.98, 1.03);
  const high = highFactor * lastPoints[1].close;
  const low = Math.min(high * 0.99, lowFactor * lastPoints[1].close);
  const openFactor = getRandomNumber(0.98, 1.03);
  const closeFactor = getRandomNumber(0.98, 1.03);
  const open = Math.min(high, Math.max(low, openFactor * lastPoints[1].open));
  const close = Math.min(high, Math.max(low, closeFactor * lastPoints[1].close));
  const volumeFactor = getRandomNumber(0.9, 1.1);
  const comparisonFactor = getRandomNumber(0.98, 1.02);
  return {
    timestamp: lastPoints[1].timestamp + lastPoints[1].timestamp - lastPoints[0].timestamp,
    open,
    high,
    low,
    close,
    openClose: [open, close],
    totalVolumeTraded: volumeFactor * lastPoints[1].totalVolumeTraded,
    comparison: lastPoints[1].comparison && comparisonFactor * lastPoints[1].comparison,
  };
};
