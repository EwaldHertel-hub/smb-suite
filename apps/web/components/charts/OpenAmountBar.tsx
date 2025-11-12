"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function OpenAmountBar({
  data,
}: {
  data: { month: string; open: number }[];
}) {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="open" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
