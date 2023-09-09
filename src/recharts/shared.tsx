export const TransactionReferenceDot = (props: any) => {
  return (
    <circle
      cx={props.cx}
      r="5"
      cy={props.cy}
      fill={props.transaction.side === "BUY" ? "blue" : "red"}
      stroke={props.transaction.side === "BUY" ? "lightblue" : "pink"}
    ></circle>
  );
};
