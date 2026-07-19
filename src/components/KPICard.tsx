import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  progress: number;
  color: 'cyan' | 'pink' | 'amber';
}

export default function KPICard({ title, value, trend, progress, color }: KPICardProps) {
  const isPositive = trend >= 0;
  
  const colors = {
    cyan: { stroke: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
    pink: { stroke: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
    amber: { stroke: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' }
  };

  const activeColor = colors[color];
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-[#252936] p-6 rounded-2xl flex items-center justify-between shadow-lg border border-white/5 hover:border-white/10 transition-colors group">
      <div className="space-y-4">
        <h3 className="text-slate-400 font-medium text-sm tracking-wide">{title}</h3>
        <div>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          <div className="flex items-center gap-1.5 text-sm">
            <span className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
              isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
            )}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>
      </div>

      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={activeColor.bg}
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={activeColor.stroke}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            style={{ 
              filter: `drop-shadow(0 0 4px ${activeColor.stroke}80)` 
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
