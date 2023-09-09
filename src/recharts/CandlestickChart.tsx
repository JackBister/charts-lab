import { TooltipProps, ComposedChart, XAxis, YAxis, Tooltip, Bar, Cell, Area, ReferenceDot } from "recharts";
import { MergedDataPoint, Transaction, longDateFormatter, calculateAxisParameters, shortDateFormatter } from "../utils";
import { TransactionReferenceDot } from "./shared";
import * as transactions from "../assets/transactions.json";

const OHLCTooltip = ({ payload, label }: TooltipProps<any, any>) => {
  let value: MergedDataPoint | null = null;
  let comparisonValue: number | null = null;
  let tr: Transaction[] = [];
  if (payload && payload[0]) {
    value = payload[0].payload;
    if (payload[0].payload.transactions && payload[0].payload.transactions.length > 0) {
      tr = payload[0].payload.transactions;
    }
  }
  if (payload && payload[1]) {
    comparisonValue = payload[1].value;
  }
  return (
    <div
      style={{
        backgroundColor: "white",
        color: "black",
        fontSize: "9pt",
        borderRadius: "8px",
        padding: "1px 12px 12px",
      }}
    >
      <p>{longDateFormatter.format(label)}</p>
      <div>
        {value && (
          <div>
            <div className="flex-between row">
              <strong>O</strong>
              <span>{value.open.toFixed(2)}</span>
            </div>
            <div className="flex-between row">
              <strong>H</strong>
              <span>{value.high.toFixed(2)}</span>
            </div>
            <div className="flex-between row">
              <strong>L</strong>
              <span>{value.low.toFixed(2)}</span>
            </div>
            <div className="flex-between row">
              <strong>C</strong>
              <span>{value.close.toFixed(2)}</span>
            </div>
          </div>
        )}
        {comparisonValue && (
          <div className="flex-between row">
            <strong>OMXS30GI</strong>
            <span>{comparisonValue.toFixed(2)}</span>
          </div>
        )}
        {tr.map((t) => (
          <div key={t.timestamp + "_" + t.totalAmount} className="flex-between row">
            <strong>{(t as any).side}</strong>
            <span>{t.totalAmount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Candlestick = ({
  x,
  y,
  width,
  height,
  open,
  close,
  low,
  high,
}: Partial<{
  x: number;
  y: number;
  width: number;
  height: number;
  open: number;
  close: number;
  low: number;
  high: number;
}>) => {
  if (
    typeof x === "undefined" ||
    typeof y === "undefined" ||
    typeof width === "undefined" ||
    typeof height === "undefined" ||
    typeof open === "undefined" ||
    typeof close === "undefined" ||
    typeof low === "undefined" ||
    typeof high === "undefined"
  ) {
    throw new Error("Unexpected undefind parameter in Candlestick");
  }
  const isGrowing = open < close;
  const color = isGrowing ? "blue" : "red";
  const ratio = Math.abs(height / (open - close));

  return (
    <g stroke={color} fill={color} strokeWidth="1">
      <path
        d={`
          M ${x},${y}
          L ${x},${y + height}
          L ${x + width},${y + height}
          L ${x + width},${y}
          L ${x},${y}
        `}
      />
      {isGrowing ? (
        <path
          d={`
            M ${x + width / 2}, ${y + height}
            v ${(open - low) * ratio}
          `}
        />
      ) : (
        <path
          d={`
            M ${x + width / 2}, ${y}
            v ${(close - low) * ratio}
          `}
        />
      )}
      {isGrowing ? (
        <path
          d={`
            M ${x + width / 2}, ${y}
            v ${(close - high) * ratio}
          `}
        />
      ) : (
        <path
          d={`
            M ${x + width / 2}, ${y + height}
            v ${(open - high) * ratio}
          `}
        />
      )}
    </g>
  );
};

export const CandlestickChart = ({ data }: { data: MergedDataPoint[] }) => {
  const { xMin, xMax, yMin, yMax, ticks } = calculateAxisParameters(data);
  return (
    <ComposedChart width={800} height={400} data={data}>
      <XAxis dataKey="timestamp" tickFormatter={(v) => shortDateFormatter.format(v)} domain={[xMin, xMax]} />
      <YAxis domain={[yMin, yMax]} ticks={ticks} allowDecimals={false} tickFormatter={(v: number) => v.toFixed(0)} />
      <Tooltip position={{ x: 80, y: 8 }} content={<OHLCTooltip />} />
      <Bar dataKey="openClose" fill="#8884d8" shape={<Candlestick />} isAnimationActive={false}>
        {data.map(({ timestamp }) => (
          <Cell key={`cell-${timestamp}`} />
        ))}
      </Bar>
      <Area type={"monotone"} dataKey="comparison" stroke="#FFD624" fillOpacity={0} isAnimationActive={false} />
      {transactions.sell.map((t) => (
        <ReferenceDot
          key={t.timestamp + "_" + t.totalAmount}
          x={t.timestamp}
          y={t.averagePrice}
          shape={<TransactionReferenceDot transaction={t} />}
        />
      ))}
    </ComposedChart>
  );
};
