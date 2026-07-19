"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { fetchSheetData, type Deal } from '@/lib/api';
import PipelineTable from '@/components/PipelineTable';
import { Loader2, AlertCircle, FilterX, ChevronDown, LayoutGrid, List } from 'lucide-react';

const mockPipelineData: Deal[] = [
  { id: '1', sales: 'TOS', createDate: '9/2/2026', customer: 'NT', project: 'WB / NT DC Power supplier', rev: 250000, gp: 50000, percentClose: 90, status: 'Proposal' },
  { id: '2', sales: 'TOS', createDate: '12/3/2026', customer: 'งาน Topaz Datacenter', project: 'Project Cabling', rev: 13128000, gp: 2363040, percentClose: 99, status: 'Proposal' },
  { id: '3', sales: 'TOS', createDate: '9/2/2026', customer: 'DGA', project: 'UPS 10 KVA', rev: 513000, gp: 109224, percentClose: 100, status: 'Proposal' },
  { id: '4', sales: 'JIK', createDate: '11/3/2026', customer: 'บริษัท ซินพูน', project: 'Cabling', rev: 750000, gp: 75000, percentClose: 0, status: 'Proposal' },
  { id: '5', sales: 'JIK', createDate: '6/1/2026', customer: 'บริษัท เอ็มเอส ไอจี', project: 'Server & VM', rev: 3160000, gp: 412000, percentClose: 0, status: 'Proposal' },
  { id: '6', sales: 'JIK', createDate: '8/4/2026', customer: 'บริษัท พรีเมี่ยม', project: 'Firewall 120G', rev: 180000, gp: 31200, percentClose: 50, status: 'Proposal' },
  { id: '7', sales: 'PUD', createDate: '23/3/2026', customer: 'ASIA HOTEL', project: 'Cloud', rev: 900000, gp: 135000, percentClose: 50, status: 'Proposal' },
  { id: '8', sales: 'PUD', createDate: '23/3/2026', customer: 'กลุ่มบริษัทไทย', project: 'New Server', rev: 5400000, gp: 450000, percentClose: 50, status: 'Proposal' },
  { id: '9', sales: 'HALL', createDate: '6/1/2026', customer: 'บริษัท เหรียญไทย', project: 'Replace Server', rev: 1200000, gp: 96000, percentClose: 0, status: 'Proposal' },
  { id: '10', sales: 'HALL', createDate: '5/1/2026', customer: 'บริษัท ศรีนานาพร', project: 'Sangfor 501 Lic', rev: 280560, gp: 45290, percentClose: 0, status: 'Proposal' }
];

export default function PipelinePage() {
  const [data, setData] = useState<Deal[]>(mockPipelineData);
  const [loading, setLoading] = useState(false); // Set to false since we use mock data
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedSales, setSelectedSales] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // View State
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  useEffect(() => {
    let isMounted = true;
    
    /* TEMPORARILY DISABLED API FETCHING
    fetchSheetData<Deal>('Pipeline')
      .then((fetchedData) => {
        if (isMounted) {
          setData(fetchedData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "An unexpected error occurred while fetching Pipeline data.");
          setLoading(false);
        }
      });
    */

    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique sales reps dynamically
  const uniqueSalesReps = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    // Generate a clean list of unique Sales Reps for the dropdown
    const reps = Array.from(
      new Set(
        data
          .filter(deal => {
            const customerStr = String(deal.customer || '').trim();
            const projectStr = String(deal.project || '').trim();
            const salesStr = String(deal.sales || '').trim();

            const hasContent = customerStr.length > 0 || projectStr.length > 0;
            const isValidSalesName = salesStr.length > 0 && salesStr.length <= 25;

            return hasContent && isValidSalesName;
          })
          .map(deal => String(deal.sales).trim().toUpperCase())
      )
    ).filter(Boolean).sort();
    
    return reps;
  }, [data]);

  const statusOptions = [
    'Closed Won',
    'Negotiation',
    'Proposal',
    'Waiting for announcement',
    'Lost'
  ];

  // Apply filters
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(deal => {
      const matchSales = selectedSales === 'All' || deal.sales === selectedSales;
      const matchStatus = selectedStatus === 'All' || deal.status === selectedStatus;
      return matchSales && matchStatus;
    });
  }, [data, selectedSales, selectedStatus]);

  // 1. Sanitize the data to filter out corrupted rows
  const sanitizedData = useMemo(() => {
    return filteredData.filter(deal => {
      const customerStr = String(deal.customer || '').trim();
      const projectStr = String(deal.project || '').trim();
      const salesStr = String(deal.sales || '').trim();

      // Deal must have at least a customer OR a project name
      const hasContent = customerStr.length > 0 || projectStr.length > 0;
      // Sales rep name must not be a massive sentence
      const isValidSalesName = salesStr.length > 0 && salesStr.length <= 25; 

      return hasContent && isValidSalesName;
    });
  }, [filteredData]);

  // Group data by Sales Rep (Table View)
  const groupedByRep = useMemo(() => {
    return sanitizedData.reduce((acc, deal) => {
      const rep = String(deal.sales).trim().toUpperCase();
      if (!acc[rep]) {
        acc[rep] = [];
      }
      acc[rep].push(deal);
      return acc;
    }, {} as Record<string, Deal[]>);
  }, [sanitizedData]);

  // Group data by Stage/Percent Close (Kanban View)
  const groupedByStage = useMemo(() => {
    return sanitizedData.reduce((acc, deal) => {
      const pct = Number(deal.percentClose || 0);
      let stageKey = 0;
      // Map to exact columns based on percentage
      if (pct >= 100) stageKey = 100;
      else if (pct >= 99) stageKey = 99;
      else if (pct >= 90) stageKey = 90;
      else if (pct >= 50) stageKey = 50;
      else stageKey = 0;

      if (!acc[stageKey]) acc[stageKey] = [];
      acc[stageKey].push(deal);
      return acc;
    }, {} as Record<number, Deal[]>);
  }, [sanitizedData]);

  // Kanban Stage Definitions
  const kanbanStages = [
    { key: 0, name: 'Lead / Survey (0%)', borderColor: 'border-t-rose-500' },
    { key: 50, name: 'Proposal / Pricing (50%)', borderColor: 'border-t-amber-500' },
    { key: 90, name: 'Negotiation (90%)', borderColor: 'border-t-cyan-400' },
    { key: 99, name: 'Finalizing (99%)', borderColor: 'border-t-blue-500' },
    { key: 100, name: 'Closed Won (100%)', borderColor: 'border-t-emerald-500' },
  ];

  const clearFilters = () => {
    setSelectedSales('All');
    setSelectedStatus('All');
  };

  const isFiltered = selectedSales !== 'All' || selectedStatus !== 'All';

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto pb-20 relative min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-xl font-bold text-white">Active Pipeline Overview</h2>
        
        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-4 bg-[#252936] p-2 rounded-xl border border-white/5 shadow-md">
          {/* Sales Rep Filter */}
          <div className="relative group">
            <select 
              value={selectedSales}
              onChange={(e) => setSelectedSales(e.target.value)}
              className="appearance-none bg-[#1c202b] border border-white/10 text-white text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer transition-colors min-w-[140px]"
            >
              <option value="All">All Sales Reps</option>
              {uniqueSalesReps.map(rep => (
                <option key={rep} value={rep}>{rep}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-cyan-400 transition-colors" />
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-[#1c202b] border border-white/10 text-white text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer transition-colors min-w-[160px]"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-cyan-400 transition-colors" />
          </div>

          {/* Clear Filters Button */}
          {isFiltered && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-colors font-medium ml-1"
            >
              <FilterX className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}

          {/* View Toggle */}
          <div className="flex items-center bg-[#1c202b] rounded-lg p-1 border border-white/5 ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'kanban' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400" />
          <p className="text-rose-400 font-medium">{error}</p>
        </div>
      ) : (
        <div className="w-full">
          {Object.keys(sanitizedData).length > 0 ? (
            viewMode === 'table' ? (
              <PipelineTable data={groupedByRep} />
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-8 w-full items-start kanban-scroll-area">
                {kanbanStages.map((stage) => {
                  const stageDeals = groupedByStage[stage.key] || [];
                  const totalRev = stageDeals.reduce((sum, d) => sum + (Number(d.rev) || 0), 0);
                  
                  return (
                    <div key={stage.key} className={`min-w-[320px] w-[320px] bg-[#1c202b]/50 rounded-xl p-4 border border-white/5 border-t-2 flex flex-col gap-4 ${stage.borderColor}`}>
                      <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{stage.name}</h3>
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-slate-400">{stageDeals.length} deals</span>
                          <span className="text-cyan-400">Total: ${totalRev.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {stageDeals.map(deal => (
                          <div key={deal.id} className="bg-[#252936] rounded-lg p-4 shadow-lg border border-white/5 flex flex-col gap-2 cursor-pointer hover:bg-white/5 hover:border-cyan-500/30 transition-all group">
                            <span className="text-white font-bold text-sm leading-snug group-hover:text-cyan-400 transition-colors">
                              {deal.project || 'Unnamed Project'}
                            </span>
                            <span className="text-xs text-slate-400 truncate">
                              {deal.customer || 'Unknown Customer'}
                            </span>
                            
                            <hr className="border-t border-white/10 my-1" />
                            
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                  {deal.sales ? String(deal.sales).charAt(0).toUpperCase() : '?'}
                                </div>
                                <span className="text-xs text-slate-300 font-medium truncate max-w-[80px]">
                                  {deal.sales || 'Unassigned'}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-cyan-400">
                                ${Number(deal.rev || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {stageDeals.length === 0 && (
                          <div className="py-6 flex justify-center text-center text-slate-500/50 text-sm border-2 border-dashed border-white/5 rounded-lg">
                            No deals in this stage
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : !loading && (
            <div className="text-center py-12 text-slate-400">
               No deals found matching your filters.
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#1c202b]/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all duration-300 rounded-xl">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="w-10 h-10 absolute border-4 border-white/5 border-b-pink-500 rounded-full animate-spin direction-reverse"></div>
            <Loader2 className="w-5 h-5 absolute text-cyan-400 animate-pulse" />
          </div>
          <p className="mt-4 text-cyan-400 font-medium tracking-wide animate-pulse">Syncing Pipeline Data...</p>
        </div>
      )}
    </div>
  );
}
