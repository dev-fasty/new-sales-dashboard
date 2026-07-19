import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Deal } from '@/lib/api';

interface BreakdownChartProps {
  data: Deal[];
}

export default function BreakdownChart({ data }: BreakdownChartProps) {
  // Aggregate data by status
  const statusCounts = data.reduce((acc: Record<string, number>, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const total = data.length;
  const chartData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
    percentage: Math.round((statusCounts[status] / total) * 100)
  })).sort((a, b) => b.value - a.value);

  const COLORS = {
    'Closed Won': '#06b6d4', // Cyan
    'Negotiation': '#fbbf24', // Amber
    'Proposal': '#a855f7', // Purple
    'Waiting for announcement': '#f43f5e', // Pink
    'Lost': '#64748b' // Slate
  };

  return (
    <div className="bg-[#252936] p-6 rounded-2xl border border-white/5 shadow-lg w-full h-full flex flex-col">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-white">Revenue by Status</h2>
        <p className="text-sm text-slate-400">Distribution of current deals</p>
      </div>

      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS['Lost']} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c202b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value} Deals`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-white">{total}</span>
          <span className="text-xs text-slate-400">Total Deals</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-sm" 
                style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || COLORS['Lost'] }}
              />
              <span className="text-xs font-medium text-slate-300 truncate max-w-[80px]" title={item.name}>
                {item.name}
              </span>
            </div>
            <span className="text-xs font-bold text-white">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
