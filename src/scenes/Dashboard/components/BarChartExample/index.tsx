import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as React from 'react';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const BarChartExample: React.SFC = () => {
  return (
    <ResponsiveContainer width="100%" height={320}>
    <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef1" />
      <XAxis dataKey="name" stroke="#8a8f98" axisLine={false} tickLine={false} />
      <YAxis yAxisId="left" orientation="left" stroke="#8a8f98" axisLine={false} tickLine={false} />
      <YAxis yAxisId="right" orientation="right" stroke="#8a8f98" axisLine={false} tickLine={false} />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="pv" fill="#ffce03" radius={[6, 6, 0, 0]} />
      <Bar yAxisId="right" dataKey="uv" fill="#15171c" radius={[6, 6, 0, 0]} />
    </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartExample;
