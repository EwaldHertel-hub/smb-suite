'use client';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CategoryPie({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div style={{ width:'100%', height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
