import * as React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'page 1', visit: 4000, session: 2400, amt: 2400 },
  { name: 'page 2', visit: 3000, session: 1398, amt: 2210 },
  { name: 'page 3', visit: 2000, session: 9800, amt: 2290 },
  { name: 'page 4', visit: 2780, session: 3908, amt: 2000 },
  { name: 'page 5', visit: 1890, session: 4800, amt: 2181 },
  { name: 'page 6', visit: 2390, session: 3800, amt: 2500 },
  { name: 'page 7', visit: 3490, session: 4300, amt: 2400 },
  { name: 'page 8', visit: 2490, session: 5300, amt: 2200 },
  { name: 'page 9', visit: 3490, session: 6000, amt: 2300 },
  { name: 'page 10', visit: 5000, session: 6100, amt: 2100 },
  { name: 'page 11', visit: 4000, session: 4300, amt: 2000 },
  { name: 'page 12', visit: 3200, session: 3300, amt: 1900 },
];

const LineChartExample: React.SFC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
      <XAxis dataKey="name" stroke="#8a8f98" axisLine={false} tickLine={false} />
      <YAxis stroke="#8a8f98" axisLine={false} tickLine={false} />
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef1" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="visit" stroke="#e6b800" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
      <Line type="monotone" dataKey="session" stroke="#15171c" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
    </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartExample;
