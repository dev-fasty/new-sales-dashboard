"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { fetchSheetData, type Deal } from '@/lib/api'; // Kept for easy swap back
import { 
  TrendingUp, 
  Target, 
  Activity, 
  DollarSign, 
  Briefcase,
  ChevronUp,
  Mail,
  Loader2
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Toaster, toast } from 'sonner';

// --- MOCK DATA ---
const teamSummary = {
  gpTarget: 18000000.00,
  gpActual: 2412307.04,
  gpPercent: 13.40,
  revenue: 11249385.81,
  pipelineRev: 132211920.00
};

const forecastData = [
  { name: 'Q2', Revenue: 21644170.00, GP: 4130316.17 },
  { name: 'Q3', Revenue: 13800000.00, GP: 2658854.74 },
  { name: 'Q4', Revenue: 15823000.00, GP: 2628467.16 },
];

const salesTeam = [
  {
    name: "Tosawas",
    role: "Sales Freelance",
    email: "tos@iic.co.th",
    image: "https://ui-avatars.com/api/?name=Tosawas&background=0D8ABC&color=fff&size=256",
    metrics: {
      gpTarget: 7000000.00,
      revActual: 512149.53,
      gpActual: 109224.29,
      percentActual: 1.56,
      allGpPipeline: 7295304.30
    },
    forecast: {
      q2: { rev: 0.00, gp: 0.00 },
      q3: { rev: 1800000.00, gp: 270000.00 },
      q4: { rev: 12812000.00, gp: 2403040.00 }
    }
  },
  {
    name: "Rithiron",
    role: "Product Solution",
    email: "rit@iic.co.th",
    image: "https://ui-avatars.com/api/?name=Rithiron&background=F43F5E&color=fff&size=256",
    metrics: {
      gpTarget: 6000000.00,
      revActual: 435441.00,
      gpActual: 107642.56,
      percentActual: 0.02,
      allGpPipeline: 4324232.85
    },
    forecast: {
      q2: { rev: 15727300.00, gp: 1905986.20 },
      q3: { rev: 25761500.00, gp: 2313910.00 },
      q4: { rev: 22275500.00, gp: 1609196.65 }
    }
  },
  {
    name: "Salinpas",
    role: "Sales Executive",
    email: "sal@iic.co.th",
    image: "https://ui-avatars.com/api/?name=Salinpas&background=FBBF24&color=fff&size=256",
    metrics: {
      gpTarget: 5000000.00,
      revActual: 9874895.28,
      gpActual: 1937981.69,
      percentActual: 38.76,
      allGpPipeline: 25423972.05
    },
    forecast: {
      q2: { rev: 20467870.00, gp: 3282235.25 },
      q3: { rev: 6735000.00, gp: 1441341.35 },
      q4: { rev: 60061300.00, gp: 10889692.08 }
    }
  }
];
// -----------------

export default function DashboardPage() {
  const [sendingAll, setSendingAll] = useState(false);

  const handleSendAllEmails = async () => {
    setSendingAll(true);
    const toastId = toast.loading('Sending updates to all reps...');
    try {
      const payload = salesTeam.map(rep => ({
        email: rep.email,
        name: rep.name,
        totalTarget: rep.metrics.gpTarget,
        closedAmount: rep.metrics.gpActual
      }));

      const response = await fetch('/api/notify-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send batch emails');
      }

      toast.success(`Successfully notified ${salesTeam.length} reps!`, { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSendingAll(false);
    }
  };

  /* 
  // LIVE API DATA FETCHING (Commented out for design perfection phase)
  const [liveData, setLiveData] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchSheetData<Deal>('Dashboard')
      .then((fetchedData) => {
        if (isMounted) {
          setLiveData(fetchedData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);
  */

  // Formatter utilities
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto pb-20 relative min-h-full">
      <Toaster theme="dark" position="bottom-right" />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Executive Summary</h2>
          <p className="text-slate-400 mt-1">Real-time performance metrics and forecasts.</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KPI 1 */}
            <div className="bg-[#252936] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 cursor-default bg-gradient-to-br from-cyan-900/20 to-slate-800/50">
              {/* Subtle wave SVG pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-cyan-400 fill-current">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" />
                </svg>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl group-hover:bg-cyan-400/20 transition-colors" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-medium">GP Target vs Actual</h3>
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">{formatCurrency(teamSummary.gpActual)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
                    {teamSummary.gpPercent}%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">of {formatCurrency(teamSummary.gpTarget)}</span>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-[#252936] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 cursor-default bg-gradient-to-br from-emerald-900/20 to-slate-800/50">
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-emerald-400 fill-current">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" />
                </svg>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-colors" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-medium">Total Revenue</h3>
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">{formatCurrency(teamSummary.revenue)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-500 font-medium">Closed Won</span>
                </div>
              </div>
            </div>

          </div>

          {/* Forecast Chart */}
          <div className="bg-[#252936] p-6 rounded-2xl border border-white/5 shadow-lg w-full relative flex-1 min-h-[400px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Forecast Trajectory (Q2-Q4)</h2>
                <p className="text-sm text-slate-400">Projected Revenue vs GP Output</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                  <span className="text-xs text-slate-300 font-medium">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  <span className="text-xs text-slate-300 font-medium">Gross Profit</span>
                </div>
              </div>
            </div>

            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.4} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    dx={-10}
                    tickFormatter={(value) => `$${value >= 1000000 ? (value / 1000000) + 'M' : value}`}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-700/50 shadow-2xl rounded-lg p-4 min-w-[150px]">
                            <p className="text-white font-bold mb-3">{label}</p>
                            {payload.map((p, index) => (
                              <div key={index} className="flex items-center justify-between gap-4 mb-2 last:mb-0">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.stroke }} />
                                  <span className="text-slate-300 text-sm font-medium">{p.name}</span>
                                </div>
                                <span className="text-white font-bold text-sm">${Number(p.value).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)" 
                    activeDot={{ r: 6, fill: '#1e293b', strokeWidth: 2, stroke: '#06b6d4' }}
                    dot={{ stroke: '#06b6d4', strokeWidth: 2, fill: '#252936', r: 4 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="GP" 
                    stroke="#f43f5e" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorGP)" 
                    activeDot={{ r: 6, fill: '#1e293b', strokeWidth: 2, stroke: '#f43f5e' }}
                    dot={{ stroke: '#f43f5e', strokeWidth: 2, fill: '#252936', r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Donut Chart Widget */}
          <div className="bg-[#252936] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col">
            <h2 className="text-lg font-bold text-white mb-2">% GP Achieved</h2>
            <p className="text-sm text-slate-400 mb-6">Target completion progress</p>
            
            <div className="flex-1 min-h-[250px] relative flex flex-col items-center justify-end pb-8">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Achieved', value: teamSummary.gpPercent },
                      { name: 'Remaining', value: 100 - teamSummary.gpPercent }
                    ]}
                    cx="50%"
                    cy="80%"
                    innerRadius={80}
                    outerRadius={110}
                    startAngle={180}
                    endAngle={0}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                  >
                    <Cell fill="#06b6d4" />
                    <Cell fill="#1c202b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none">
                <span className="text-4xl font-black text-white">{teamSummary.gpPercent}%</span>
                <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Achieved</span>
              </div>
            </div>
          </div>

          {/* Top Performers Widget */}
          <div className="bg-[#252936] p-6 rounded-2xl border border-white/5 shadow-lg flex-1">
            <h2 className="text-lg font-bold text-white mb-6">Sales Overview</h2>
            <div className="flex flex-col gap-2">
              {salesTeam.map((rep) => (
                <div key={rep.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden relative group-hover:border-cyan-400 transition-colors">
                      <Image src={rep.image} alt={rep.name} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{rep.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{rep.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatCurrency(rep.metrics.revActual)}</p>
                    <p className="text-[10px] text-pink-400 font-semibold uppercase tracking-wider">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="w-full h-px bg-white/5 my-10" />

      {/* BOTTOM ROW: Sales Rep Profiles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Sales Team Performance</h2>
          <button 
            onClick={handleSendAllEmails}
            disabled={sendingAll}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(8,145,178,0.3)]"
          >
            {sendingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {sendingAll ? 'Notifying All...' : 'Notify All Sales Reps'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salesTeam.map((rep) => (
            <div key={rep.name} className="bg-[#252936] rounded-2xl border border-white/5 shadow-lg p-6 group hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-cyan-400 transition-colors duration-300">
                  <Image src={rep.image} alt={rep.name} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{rep.name}</h3>
                  <p className="text-cyan-400 text-xs font-semibold tracking-wider uppercase">{rep.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1c202b] rounded-xl p-3 border border-white/5">
                    <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-1">GP Target</p>
                    <p className="text-white font-semibold">{formatCurrency(rep.metrics.gpTarget)}</p>
                  </div>
                  <div className="bg-[#1c202b] rounded-xl p-3 border border-white/5">
                    <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-1">GP Pipeline</p>
                    <p className="text-pink-400 font-semibold">{formatCurrency(rep.metrics.allGpPipeline)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1c202b] rounded-xl p-3 border border-white/5">
                    <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-1">GP Actual</p>
                    <p className="text-white font-semibold">{formatCurrency(rep.metrics.gpActual)}</p>
                  </div>
                  <div className="bg-[#1c202b] rounded-xl p-3 border border-white/5 relative overflow-hidden">
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05]">
                      <Briefcase className="w-16 h-16" />
                    </div>
                    <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-1">Rev Actual</p>
                    <p className="text-white font-semibold">{formatCurrency(rep.metrics.revActual)}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-medium mb-3">
                    <span className="text-slate-400">Target Completion</span>
                    <span className="text-white font-bold">{rep.metrics.percentActual}%</span>
                  </div>
                  <div className="w-full bg-[#1c202b] shadow-inner rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-amber-400 h-full rounded-full transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
                      style={{ 
                        width: `${Math.min(rep.metrics.percentActual, 100)}%`, 
                        minWidth: rep.metrics.percentActual > 0 ? '12px' : '0px' 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Forecast Breakdown */}
                <div className="pt-4 mt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Forecast Breakdown</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['q2', 'q3', 'q4'].map((q) => {
                      const f = rep.forecast[q as keyof typeof rep.forecast];
                      return (
                        <div key={q} className="bg-white/[0.02] rounded-lg p-2 border border-white/5 text-center group-hover:bg-white/[0.04] transition-colors">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{q}</p>
                          <p className="text-[11px] text-white font-semibold tracking-tight">{formatCurrency(f.rev)}</p>
                          <p className="text-[10px] text-cyan-400 mt-0.5">{formatCurrency(f.gp)} gp</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
