"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Receipt, FileText, Calendar, User, DollarSign, Tag, Activity } from 'lucide-react';

export interface Expense {
  id: string | number;
  dateBill: string;
  sales: string;
  expenseType: string;
  jobDetail: string;
  amount: number;
  receipt: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const mockExpenses: Expense[] = [
  { id: '1', dateBill: '27/12/2025', sales: 'Pattarawadee', expenseType: 'ค่ารับรอง', jobDetail: 'ประชุมลค.สำนักงานคณะ', amount: 1320.00, receipt: '45947', status: 'Approved' },
  { id: '2', dateBill: '24/12/2025', sales: 'Chinsamith', expenseType: 'ค่าตั๋วเครื่องบิน', jobDetail: 'เดินทางไปพบ ลค. โรงพยาบาลหาดใหญ่', amount: 18651.78, receipt: '#1852402373700371366', status: 'Approved' },
  { id: '3', dateBill: '28/12/2025', sales: 'Chinsamith', expenseType: 'ค่าเช่ารถ', jobDetail: 'เดินทางไปพบ ลค. โรงพยาบาลหาดใหญ่', amount: 2200.00, receipt: 'HS2512-28002', status: 'Pending' },
  { id: '4', dateBill: '29/12/2025', sales: 'Chinsamith', expenseType: 'ค่าที่พัก', jobDetail: 'Visit ลค. โรงพยาบาลหาดใหญ่', amount: 4200.00, receipt: 'HS681229-01', status: 'Approved' },
  { id: '5', dateBill: '5/2/2026', sales: 'Pattarawadee', expenseType: 'ค่าเดินทาง', jobDetail: 'ประชุมงานกับโรงพยาบาล', amount: 1413.00, receipt: '-', status: 'Rejected' },
  { id: '6', dateBill: '19/2/2026', sales: 'Pattarawadee', expenseType: 'ค่ารับรอง', jobDetail: 'ประชุมลค.กรมควบคุมโรค', amount: 2862.00, receipt: 'เล่มที่275เลข', status: 'Pending' },
  { id: '7', dateBill: '9/1/2026', sales: 'Chinsamith', expenseType: 'ค่าใช้จ่ายอื่นๆ', jobDetail: 'ค่าบริการ ชาร์จ เดินทางไปพบ ลค.เทศบาลนครสวรรค์', amount: 428.18, receipt: 'EV6901-1-0002', status: 'Approved' }
];

export default function ExpensePage() {
  const [data, setData] = useState<Expense[]>(mockExpenses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay for mock data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto pb-20 relative min-h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Receipt className="w-6 h-6 text-cyan-400" />
            Expense Tracking
          </h2>
          <p className="text-slate-400 mt-1">Detailed view of all sales team expenses.</p>
        </div>
        
        {/* Total Aggregation Badge */}
        {!loading && (
          <div className="bg-[#252936] border border-cyan-500/30 px-6 py-3 rounded-xl flex flex-col items-end shadow-lg shadow-cyan-500/5">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Expenses</span>
            <span className="text-xl font-bold text-cyan-400">
              ฿{data.reduce((sum, item) => sum + item.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {!loading && (
        <div className="bg-[#252936] rounded-2xl border border-white/5 shadow-xl w-full overflow-hidden flex flex-col relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#1c202b]/50 text-slate-300 text-sm tracking-wide">
                  <th className="py-5 px-6 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Date
                    </div>
                  </th>
                  <th className="py-5 px-6 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      Sales Rep
                    </div>
                  </th>
                  <th className="py-5 px-6 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-400" />
                      Expense Type
                    </div>
                  </th>
                  <th className="py-5 px-6 font-semibold whitespace-nowrap min-w-[300px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Job Detail (Description)
                    </div>
                  </th>
                  <th className="py-5 px-6 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-slate-400" />
                      Receipt No.
                    </div>
                  </th>
                  <th className="py-5 px-6 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-400" />
                      Status
                    </div>
                  </th>
                  <th className="py-5 px-6 font-semibold whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      Amount (THB)
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.map((expense, idx) => (
                  <tr 
                    key={expense.id || idx} 
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="py-5 px-6 text-slate-300 font-medium whitespace-nowrap">
                      {expense.dateBill}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                          {expense.sales.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-white whitespace-nowrap">{expense.sales}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-xs font-medium whitespace-nowrap">
                        {expense.expenseType}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-slate-400 leading-relaxed whitespace-normal break-words max-w-md">
                      {expense.jobDetail}
                    </td>
                    <td className="py-5 px-6 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {expense.receipt !== '-' ? expense.receipt : <span className="text-slate-600 italic">No Receipt</span>}
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center justify-center w-fit
                        ${expense.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          expense.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                          'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 font-bold text-cyan-400 text-right whitespace-nowrap">
                      ฿{Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No expense records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
          <p className="mt-4 text-cyan-400 font-medium tracking-wide animate-pulse">Loading Expense Data...</p>
        </div>
      )}
    </div>
  );
}
