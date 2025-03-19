
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  TooltipProps
} from 'recharts';

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  layout?: 'vertical' | 'horizontal';
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  index,
  categories,
  colors = ['hsl(var(--primary))'],
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  layout = 'vertical'
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        layout={layout === 'horizontal' ? 'vertical' : 'horizontal'}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {layout === 'horizontal' ? (
          <>
            <XAxis type="category" dataKey={index} />
            <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
          </>
        ) : (
          <>
            <XAxis type="number" tickFormatter={valueFormatter} />
            <YAxis width={yAxisWidth} type="category" dataKey={index} />
          </>
        )}
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export interface PieArcDatum {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieArcDatum[];
  index: string;
  category: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  index,
  category,
  colors = ['hsl(var(--primary))'],
  valueFormatter = (value) => `${value}`
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey={category}
          nameKey={index}
          cx="50%"
          cy="50%"
          outerRadius={80}
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip formatter={valueFormatter} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  index,
  categories,
  colors = ['hsl(var(--primary))'],
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
