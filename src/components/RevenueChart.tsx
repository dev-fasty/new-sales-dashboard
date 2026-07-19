import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChevronDown } from 'lucide-react';
import type { DateFilter, Deal } from '@/lib/api';

interface RevenueChartProps {
  data: Deal[];
  filter: DateFilter;
  onFilterChange: (filter: DateFilter) => void;
}

export default function RevenueChart({ data, filter, onFilterChange }: RevenueChartProps) {
  // Aggregate data for the chart based on createDate
  const chartData = data.reduce((acc: { name: string; Revenue: number }[], curr) => {
    const dateStr = new Date(curr.createDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.name === dateStr);
    if (existing) {
      existing.Revenue += curr.rev;
    } else {
      acc.push({ name: dateStr, Revenue: curr.rev });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  return (
    <div className="bg-[#252936] p-6 rounded-2xl border border-white/5 shadow-lg w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Revenue Trend</h2>
          <p className="text-sm text-slate-400">Current vs Previous {filter.replace('ly', '')}</p>
        </div>
        
        <div className="relative group">
          <select 
            className="appearance-none bg-[#1c202b] border border-white/10 text-white text-sm rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-cyan-400 cursor-pointer transition-colors"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as DateFilter)}
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-white transition-colors" />
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value >= 1000 ? (value / 1000) + 'k' : value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c202b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#06b6d4' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="Revenue" 
              stroke="#06b6d4" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, fill: '#06b6d4', stroke: '#1c202b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
