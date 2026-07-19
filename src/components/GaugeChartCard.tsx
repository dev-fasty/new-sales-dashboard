"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Customized } from 'recharts';

interface GaugeChartCardProps {
  title?: string;
  value?: number;
  targetRange?: string;
}

const RADIAN = Math.PI / 180;
const data = [
  { name: 'Low', value: 30, color: '#1e3a8a' }, // Deep Blue
  { name: 'Mid', value: 40, color: '#0ea5e9' }, // Cyan
  { name: 'High', value: 30, color: '#bae6fd' } // Light Blue
];

const renderNeedle = (value: number, data: any[], cx: number, cy: number, iR: number, oR: number, color: string) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  
  // Clamp value between 0 and total
  const clampedValue = Math.max(0, Math.min(value, total));
  
  const ang = 180.0 * (1 - clampedValue / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 6; // Radius of pivot
  
  const x0 = cx;
  const y0 = cy;
  
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <g>
      <polygon points={`${xba},${yba} ${xbb},${ybb} ${xp},${yp}`} fill={color} stroke="none" className="drop-shadow-lg" />
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" className="drop-shadow-lg" />
      <circle cx={x0} cy={y0} r={r - 2} fill="#1c202b" stroke="none" />
    </g>
  );
};

const Needle = (props: any) => {
  const { width, height, value } = props;
  const cx = width / 2;
  const cy = height * 0.8;
  const iR = 70;
  const oR = 100;
  
  return renderNeedle(value, data, cx, cy, iR, oR, '#f8fafc');
};

export default function GaugeChartCard({ 
  title = "Occupancy Rate / NPS", 
  value = 70,
  targetRange = "75% - 85%" 
}: GaugeChartCardProps) {
  return (
    <div className="bg-[#252936] rounded-2xl p-6 shadow-lg border border-white/5 flex flex-col group hover:border-white/10 transition-colors h-full">
      <h2 className="text-lg font-bold text-white mb-1">{title}</h2>
      <p className="text-sm text-slate-400 mb-4">Target metric performance</p>
      
      <div className="flex-1 relative flex flex-col items-center justify-end pb-8">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={data}
                cx="50%"
                cy="80%"
                innerRadius={70}
                outerRadius={100}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Customized component={(props: any) => <Needle {...props} value={value} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Center Text overlays */}
        <div className="relative z-10 flex flex-col items-center pointer-events-none mt-[160px]">
          <span className="text-4xl font-black text-white drop-shadow-md">{value}%</span>
          <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Target range: {targetRange}
          </span>
        </div>
      </div>
    </div>
  );
}
