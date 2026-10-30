import * as React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Chrome', value: 50 },
  { name: 'Mozilla Firefox', value: 30 },
  { name: 'Opera Browser', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#ffce03', '#15171c', '#8a8f98', '#d9dce1'];

class PieChartExample extends React.Component<any> {
  state = {
    activeIndex: 0,
  };

  getInitialState() {
    return {
      activeIndex: 0,
    };
  }

  onPieEnter(data: any, index: any) {
    this.setState({
      activeIndex: index,
    });
  }

  render() {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={70} outerRadius={105} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default PieChartExample;
