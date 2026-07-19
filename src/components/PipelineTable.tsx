import React, { useState } from 'react';
import type { Deal } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Activity, DollarSign } from 'lucide-react';

interface PipelineTableProps {
  data: Record<string, Deal[]>;
}

export default function PipelineTable({ data }: PipelineTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (repName: string) => {
    setExpandedRows(prev => ({ ...prev, [repName]: !prev[repName] }));
  };

  const getStatusBadge = (status: Deal['status']) => {
    switch (status) {
      case 'Closed Won':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'Negotiation':
        return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'Proposal':
        return 'bg-purple-400/10 text-purple-400 border-purple-400/20';
      case 'Waiting for announcement':
        return 'bg-pink-400/10 text-pink-400 border-pink-400/20';
      case 'Lost':
        return 'bg-slate-400/10 text-slate-400 border-slate-400/20';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <div className="bg-[#252936] rounded-2xl border border-white/5 shadow-lg w-full overflow-hidden flex flex-col">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 text-sm bg-white/[0.02]">
              <th className="py-4 px-6 font-medium min-w-[200px]">Sales Rep</th>
              <th className="py-4 px-6 font-medium min-w-[150px]">Total Deals</th>
              <th className="py-4 px-6 font-medium min-w-[200px]">Total Pipeline Value</th>
              <th className="py-4 px-6 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {Object.entries(data).map(([rep, deals]) => {
              const totalDeals = deals.length;
              const totalRev = deals.reduce((sum, d) => sum + (Number(d.rev) || 0), 0);
              const isExpanded = expandedRows[rep];

              return (
                <React.Fragment key={rep}>
                  {/* Master Row */}
                  <tr 
                    onClick={() => toggleRow(rep)}
                    className={cn(
                      "border-b border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group",
                      isExpanded ? "bg-white/[0.02]" : ""
                    )}
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm group-hover:shadow-cyan-500/20 transition-all">
                          {rep.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white group-hover:text-cyan-400 transition-colors text-base">
                          {rep}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-300">{totalDeals}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white">{formatCurrency(totalRev)}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-cyan-400 ml-auto" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 ml-auto transition-colors" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && (
                    <tr className="border-b border-white/5 bg-black/20">
                      <td colSpan={4} className="p-0">
                        <div className="pl-14 pr-6 py-6 border-l-2 border-cyan-500 ml-4 my-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Projects</h4>
                          <div className="w-full overflow-x-auto pb-2">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-white/5 text-slate-500 text-xs">
                                  <th className="py-3 px-4 font-medium min-w-[200px]">Customer</th>
                                  <th className="py-3 px-4 font-medium min-w-[200px]">Project Name</th>
                                  <th className="py-3 px-4 font-medium min-w-[140px]">Revenue</th>
                                  <th className="py-3 px-4 font-medium min-w-[120px]">% Close</th>
                                  <th className="py-3 px-4 font-medium min-w-[300px]">Status / Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {deals.map((deal) => (
                                  <tr key={deal.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-4 text-slate-300 font-medium whitespace-normal break-words leading-relaxed min-w-[200px]">
                                      {deal.customer}
                                    </td>
                                    <td className="py-4 px-4 text-slate-300 whitespace-normal break-words leading-relaxed min-w-[200px]">
                                      {deal.project}
                                    </td>
                                    <td className="py-4 px-4 font-semibold text-white whitespace-nowrap">
                                      {formatCurrency(Number(deal.rev || 0))}
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[60px]">
                                          <div 
                                            className="h-full bg-cyan-400 rounded-full"
                                            style={{ width: `${Number(deal.percentClose || 0)}%` }}
                                          />
                                        </div>
                                        <span className="text-xs font-bold text-slate-300">{Number(deal.percentClose || 0)}%</span>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-normal break-words leading-relaxed min-w-[300px]">
                                      <span className={cn(
                                        "px-3 py-1 text-xs font-semibold rounded-full border inline-block",
                                        getStatusBadge(deal.status)
                                      )}>
                                        {deal.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {Object.keys(data).length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-500">
                  No deals found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
