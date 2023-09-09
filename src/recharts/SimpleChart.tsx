import { Area, AreaChart, ReferenceDot, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { MergedDataPoint, Transaction, calculateAxisParameters, longDateFormatter, shortDateFormatter } from "../utils";

import * as transactions from "../assets/transactions.json";
import { TransactionReferenceDot } from "./shared";

const CustomTooltip = ({ payload, label }: TooltipProps<any, any>) => {
  let value: number | null = null;
  let comparisonValue: number | null = null;
  let tr: Transaction[] = [];
  if (payload && payload[0]) {
    value = payload[0].value;
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
          <div className="flex-between row">
            <strong>AZA</strong>
            <span>{value.toFixed(2)}</span>
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

export const SimpleChart = ({ data }: { data: MergedDataPoint[] }) => {
  const { xMin, xMax, yMin, yMax, ticks } = calculateAxisParameters(data);
  return (
    <ResponsiveContainer width={"100%"} height={400}>
      <AreaChart data={data} margin={{ left: 0, right: 0 }}>
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="timestamp" tickFormatter={(v) => shortDateFormatter.format(v)} domain={[xMin, xMax]} />
        <YAxis
          domain={[yMin, yMax]}
          ticks={ticks}
          allowDecimals={false}
          tickFormatter={(v: number) => v.toFixed(0)}
          width={35}
          mirror={true}
        />
        <Tooltip position={{ x: 40, y: 8 }} content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="close"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
          isAnimationActive={false}
        />
        <Area type={"monotone"} dataKey="comparison" stroke="#FFD624" fillOpacity={0} isAnimationActive={false} />
        {transactions.sell.map((t) => (
          <ReferenceDot
            key={t.timestamp + "_" + t.totalAmount}
            x={t.timestamp}
            y={t.averagePrice}
            shape={<TransactionReferenceDot transaction={t} />}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
