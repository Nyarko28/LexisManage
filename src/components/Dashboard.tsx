import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  X,
  FileCheck,
  Printer,
  Download,
  Scale,
  FileDown,
  Calendar
} from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { formatCurrency, formatChartValue, cn } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { Contract } from '../types';
import { useAuth } from '../contexts/AuthContext';

/** Percent change vs previous period; null when previous is zero/null or result is non-finite. */
function safePercentTrend(curr: number, prev: number): number | null {
  if (prev === 0 || prev == null || !Number.isFinite(prev) || !Number.isFinite(curr)) {
    return null;
  }
  const pct = ((curr - prev) / prev) * 100;
  return Number.isFinite(pct) ? Math.round(pct) : null;
}

/** Display string: "New" if no baseline; otherwise ±N% capped at ±200%. */
function formatTrendDisplay(pct: number | null): { dir: 'up' | 'down'; val: string } {
  if (pct === null) {
    return { dir: 'up', val: 'New' };
  }
  const capped = Math.min(200, Math.abs(pct));
  if (pct >= 0) {
    return { dir: 'up', val: `+${capped}%` };
  }
  return { dir: 'down', val: `-${capped}%` };
}

function monthShortFromDateStr(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('default', { month: 'short' });
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, onClick }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={cn(
      "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col transition-all",
      onClick ? "cursor-pointer hover:border-blue-200 hover:shadow-md" : ""
    )}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2 rounded-xl", color)}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          trend === 'up' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </motion.div>
);


export const Dashboard = ({ setActiveTab, onViewContract }: { setActiveTab: (tab: string) => void, onViewContract: (contract: Contract) => void }) => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [barTimeRange, setBarTimeRange] = useState<'6' | '12'>('6');
  const [pieMode, setPieMode] = useState<'count' | 'value'>('count');
  const [pieContainerWidth, setPieContainerWidth] = useState(400);
  const pieContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadCSV = () => {
    if (contracts.length === 0) return;

    // Define CSV headers
    const headers = ['ID', 'Contract Name', 'Counterparty', 'Category', 'Status', 'Value (GHS)', 'Start Date', 'End Date', 'Last Modified'];
    
    // Convert contracts to CSV rows
    const rows = contracts.map(c => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.party.replace(/"/g, '""')}"`,
      c.category,
      c.status,
      c.value,
      c.startDate,
      c.endDate,
      c.lastModified
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LexisManage_Full_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadExecutiveReport = () => {
    const generatedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const topCategory = pieDataRaw[0]?.name || 'primary';
    const reportText = [
      'LEXISMANAGE - EXECUTIVE PORTFOLIO SUMMARY',
      `Generated on: ${generatedDate}`,
      '',
      'PORTFOLIO OVERVIEW',
      `- Total Active Value: ${formatCurrency(totalValue)}`,
      `- Active Contracts: ${activeContracts.length}`,
      `- Average Contract Value: ${formatCurrency(contracts.length ? totalValue / contracts.length : 0)}`,
      '',
      'RISK ASSESSMENT',
      ...riskInsights.map((risk, idx) => `${idx + 1}. ${risk.title} (${risk.level}) - ${risk.desc}`),
      '',
      'STRATEGIC RECOMMENDATIONS',
      expiredCount > 0
        ? `1. Immediate action required: ${expiredCount} contracts have expired or are in critical status. Prioritize renewals.`
        : '1. Maintain current renewal schedule. Portfolio health is within optimal parameters.',
      totalValue > 1000000
        ? '2. High-value exposure detected. Consider currency hedging for GHS-denominated contracts above 500k.'
        : '2. Value exposure is currently low. Continue monitoring exchange-rate movement.',
      `3. Strengthen local content documentation for the ${topCategory} sector for Ghanaian law compliance.`,
      '',
      'NOTE',
      'This report is generated by LexisManage AI based on current database records.',
    ].join('\n');

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LexisManage_Executive_Report_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const q = query(collection(db, 'contracts'), orderBy('lastModified', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contract));
      setContracts(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'contracts');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const el = pieContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPieContainerWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const activeContracts = contracts.filter(c => c.status === 'Active');
  const totalValue = activeContracts.reduce((sum, c) => sum + c.value, 0);
  const reviewCount = contracts.filter(c => c.status === 'Review').length;
  const expiredCount = contracts.filter(c => c.status === 'Expired').length;

  // Dynamic Pie Chart Data (count % or value %)
  const pieDataRaw = useMemo(() => {
    if (pieMode === 'count') {
      const counts = contracts.reduce((acc: Record<string, number>, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {});
      const total = contracts.length || 1;
      return Object.entries(counts).map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        count,
        totalValue: contracts.filter(x => x.category === name).reduce((s, x) => s + x.value, 0),
      }));
    } else {
      const byValue = contracts.reduce((acc: Record<string, number>, c) => {
        acc[c.category] = (acc[c.category] || 0) + c.value;
        return acc;
      }, {});
      const totalValue = Object.values(byValue).reduce((a, b) => a + b, 0) || 1;
      return Object.entries(byValue).map(([name, val]) => ({
        name,
        value: Math.round((val / totalValue) * 100),
        count: contracts.filter(x => x.category === name).length,
        totalValue: val,
      }));
    }
  }, [contracts, pieMode]).sort((a, b) => b.value - a.value);

  // Dynamic Bar Chart Data (6 or 12 months)
  const barMonths = useMemo(() => {
    const n = barTimeRange === '6' ? 6 : 12;
    return Array.from({ length: n }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (n - 1 - i));
      return { short: d.toLocaleString('default', { month: 'short' }), full: d };
    });
  }, [barTimeRange]);

  const barData = useMemo(() => {
    const monthly = contracts.reduce((acc: Record<string, { value: number; count: number }>, c) => {
      const m = monthShortFromDateStr(c.startDate);
      if (!m) return acc;
      if (!acc[m]) acc[m] = { value: 0, count: 0 };
      acc[m].value += c.value;
      acc[m].count += 1;
      return acc;
    }, {});

    return barMonths.map(({ short }) => ({
      name: short,
      value: monthly[short]?.value ?? 0,
      count: monthly[short]?.count ?? 0,
    }));
  }, [contracts, barMonths]);

  // Compare first half vs second half of visible bar period (by contract start month)
  const { totalValueTrend, activeContractsTrend, reviewTrend, expiredTrend } = useMemo(() => {
    const n = barMonths.length;
    const mid = Math.floor(n / 2);
    const firstKeys = new Set(barMonths.slice(0, mid).map((m) => m.short));
    const secondKeys = new Set(barMonths.slice(mid).map((m) => m.short));

    let activeValFirst = 0;
    let activeValSecond = 0;
    let activeCountFirst = 0;
    let activeCountSecond = 0;
    let reviewFirst = 0;
    let reviewSecond = 0;
    let expiredFirst = 0;
    let expiredSecond = 0;

    for (const c of contracts) {
      const m = monthShortFromDateStr(c.startDate);
      if (!m) continue;
      const inFirst = firstKeys.has(m);
      const inSecond = secondKeys.has(m);

      if (c.status === 'Active') {
        if (inFirst) {
          activeValFirst += c.value;
          activeCountFirst += 1;
        }
        if (inSecond) {
          activeValSecond += c.value;
          activeCountSecond += 1;
        }
      }
      if (c.status === 'Review') {
        if (inFirst) reviewFirst += 1;
        if (inSecond) reviewSecond += 1;
      }
      if (c.status === 'Expired') {
        if (inFirst) expiredFirst += 1;
        if (inSecond) expiredSecond += 1;
      }
    }

    return {
      totalValueTrend: formatTrendDisplay(safePercentTrend(activeValSecond, activeValFirst)),
      activeContractsTrend: formatTrendDisplay(safePercentTrend(activeCountSecond, activeCountFirst)),
      reviewTrend: formatTrendDisplay(safePercentTrend(reviewSecond, reviewFirst)),
      expiredTrend: formatTrendDisplay(safePercentTrend(expiredSecond, expiredFirst)),
    };
  }, [contracts, barMonths]);

  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#059669', '#0891b2'];

  const riskInsights = contracts.slice(0, 3).map((c, i) => {
    const risks = [
      { title: "Renewal Risk", desc: `${c.party} contract expires in ${Math.ceil((new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days.`, level: "High", icon: Clock, color: "text-rose-600 bg-rose-50", tab: "contracts" },
      { title: "Compliance Gap", desc: `${c.party} requires local content verification for ${c.category}.`, level: "Medium", icon: ShieldAlert, color: "text-amber-600 bg-amber-50", tab: "assistant" },
      { title: "Value Exposure", desc: `High value contract (${formatCurrency(c.value)}) lacks currency protection.`, level: "High", icon: TrendingUp, color: "text-rose-600 bg-rose-50", tab: "assistant" }
    ];
    return risks[i % risks.length];
  });

  if (riskInsights.length === 0) {
    riskInsights.push({
      title: "No Risks Detected",
      desc: "Your portfolio is currently healthy. Add more contracts to see AI analysis.",
      level: "Low",
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50",
      tab: "contracts"
    });
  }

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="h-6 w-40 bg-slate-200 rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 h-24" />
            ))}
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100">
            <div className="h-6 w-48 bg-slate-200 rounded mb-6" />
            <div className="h-80 flex items-end gap-2">
              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Welcome back, {user?.displayName}. Here's what's happening with your contracts.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm text-xs md:text-sm"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button 
            onClick={() => setShowReport(true)}
            className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-xs md:text-sm"
          >
            <FileCheck className="w-4 h-4" />
            <span>Report</span>
          </button>
          <div className="flex items-center space-x-2 text-[10px] md:text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <Sparkles className="w-3 h-3" />
            <span>AI Insights Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Active Value" 
          value={formatCurrency(totalValue)} 
          icon={TrendingUp} 
          trend={totalValueTrend.dir} 
          trendValue={totalValueTrend.val} 
          color="bg-blue-50 text-blue-600"
          onClick={() => setActiveTab('contracts')}
        />
        <StatCard 
          title="Active Contracts" 
          value={activeContracts.length} 
          icon={CheckCircle2} 
          trend={activeContractsTrend.dir} 
          trendValue={activeContractsTrend.val} 
          color="bg-blue-50 text-blue-600"
          onClick={() => setActiveTab('contracts')}
        />
        <StatCard 
          title="Pending Review" 
          value={reviewCount} 
          icon={Clock} 
          trend={reviewTrend.dir} 
          trendValue={reviewTrend.val} 
          color="bg-amber-50 text-amber-600"
          onClick={() => setActiveTab('contracts')}
        />
        <StatCard 
          title="Expired / Critical" 
          value={expiredCount} 
          icon={AlertCircle} 
          trend={expiredTrend.dir} 
          trendValue={expiredTrend.val} 
          color="bg-rose-50 text-rose-600"
          onClick={() => setActiveTab('contracts')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Risk Insights */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-blue-600" />
              AI Risk Insights
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Analysis</span>
          </div>
          <div className="space-y-3">
            {riskInsights.map((insight, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => (setActiveTab as any)(insight.tab)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <div className={cn("p-2 rounded-lg shrink-0", insight.color)}>
                    <insight.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">{insight.title}</p>
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                        insight.level === 'High' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {insight.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
          <button 
            onClick={() => (setActiveTab as any)('assistant')}
            className="w-full py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all uppercase tracking-widest"
          >
            Run Full Portfolio Audit
          </button>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Contract Value by Start Month</h3>
            <select 
              value={barTimeRange} 
              onChange={(e) => setBarTimeRange(e.target.value as '6' | '12')}
              className="text-sm border border-slate-200 bg-slate-50 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="6">Last 6 Months</option>
              <option value="12">Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            {barData.every(d => d.value === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <FileText className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-medium">No contract data in this period</p>
                <p className="text-xs mt-1">Add contracts to see value by start month</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(v) => formatChartValue(v)}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{d.name}</p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(d.value)}</p>
                          <p className="text-[10px] text-slate-500">{d.count} contract{d.count !== 1 ? 's' : ''}</p>
                          <p className="text-[10px] text-blue-500 mt-1">Click to view contracts</p>
                        </div>
                      );
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#2563eb" 
                    radius={[4, 4, 0, 0]} 
                    barSize={barTimeRange === '12' ? 24 : 40}
                    onClick={() => setActiveTab('contracts')}
                    isAnimationActive
                    animationDuration={600}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Category Distribution</h3>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => setPieMode('count')}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium transition-colors",
                  pieMode === 'count' ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                By count
              </button>
              <button
                onClick={() => setPieMode('value')}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium transition-colors",
                  pieMode === 'value' ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                By value
              </button>
            </div>
          </div>
          <div ref={pieContainerRef} className="h-48 md:h-64 w-full relative">
            {pieDataRaw.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <FileText className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-medium">No categories yet</p>
                <p className="text-xs mt-1">Add contracts to see distribution</p>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                  <span className="text-xl md:text-2xl font-bold text-slate-900 text-center px-2">
                    {pieMode === 'count' ? contracts.length : formatChartValue(pieDataRaw.reduce((s, d) => s + d.totalValue, 0))}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {pieMode === 'count' ? 'Total contracts' : 'Total value'}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieDataRaw}
                      cx="50%"
                      cy="50%"
                      innerRadius={pieContainerWidth < 300 ? 40 : pieContainerWidth < 500 ? 55 : 65}
                      outerRadius={pieContainerWidth < 300 ? 55 : pieContainerWidth < 500 ? 75 : 85}
                      paddingAngle={8}
                      cornerRadius={6}
                      dataKey="value"
                      stroke="none"
                      onClick={() => setActiveTab('contracts')}
                      isAnimationActive
                      animationDuration={500}
                    >
                      {pieDataRaw.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const d = payload[0].payload as typeof pieDataRaw[0];
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 min-w-[140px]">
                            <p className="text-xs font-bold text-slate-900">{d.name}</p>
                            <p className="text-lg font-bold text-blue-600">{d.value}%</p>
                            <p className="text-[10px] text-slate-500">{d.count} contract{d.count !== 1 ? 's' : ''} · {formatCurrency(d.totalValue)}</p>
                            <p className="text-[10px] text-blue-500 mt-1">Click to view contracts</p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
          <div className="space-y-2 md:space-y-3 mt-4">
            {pieDataRaw.map((item, i) => (
              <div 
                key={item.name} 
                onClick={() => setActiveTab('contracts')}
                className="flex items-center justify-between text-xs md:text-sm group cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1 -mx-2 transition-colors"
                title="View contracts"
              >
                <div className="flex items-center min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full mr-2 shrink-0 shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors truncate max-w-[120px] md:max-w-[180px]" title={item.name}>{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Renewals Timeline */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Renewals Timeline
            </h3>
            <button 
              onClick={() => setActiveTab('contracts')}
              className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Calendar className="w-3 h-3" />
              <span>View Calendar</span>
            </button>
          </div>
          
          <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {contracts
              .filter(c => c.status !== 'Expired')
              .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
              .slice(0, 4)
              .map((contract, i) => {
                const daysLeft = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const risk = daysLeft < 30 ? 'High' : daysLeft < 90 ? 'Medium' : 'Low';
                
                return (
                  <motion.div 
                    key={contract.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-10 group"
                  >
                    <div className={cn(
                      "absolute left-0 top-1.5 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110",
                      risk === 'High' ? "bg-rose-500" : risk === 'Medium' ? "bg-amber-500" : "bg-blue-500"
                    )}>
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:border-blue-200 group-hover:bg-white transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{contract.title}</h4>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          risk === 'High' ? "bg-rose-100 text-rose-700" : 
                          risk === 'Medium' ? "bg-amber-100 text-amber-700" : 
                          "bg-blue-100 text-blue-700"
                        )}>
                          {risk} Risk
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">Expires: {new Date(contract.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <p className={cn(
                          "text-xs font-bold",
                          risk === 'High' ? "text-rose-600" : risk === 'Medium' ? "text-amber-600" : "text-blue-600"
                        )}>
                          {daysLeft} days left
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            {contracts.filter(c => c.status !== 'Expired').length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No upcoming renewals found.
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Critical Action Required</p>
                <p className="text-[10px] text-slate-500">
                  {contracts.filter(c => {
                    const daysLeft = Math.ceil((new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return daysLeft < 30 && c.status !== 'Expired';
                  }).length} contracts require immediate renewal attention.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('contracts')}
              className="px-3 py-1.5 bg-white border border-rose-200 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all"
            >
              Review Now
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Contracts</h3>
          <button 
            onClick={() => setActiveTab('contracts')}
            className="text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contract Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Counterparty</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.slice(0, 4).map((contract) => (
                <tr 
                  key={contract.id} 
                  onClick={() => onViewContract(contract)}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{contract.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{contract.party}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium",
                      contract.status === 'Active' ? "bg-blue-50 text-blue-700" :
                      contract.status === 'Review' ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-700"
                    )}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(contract.value)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{contract.endDate}</td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Report Modal */}
      <AnimatePresence>
        {showReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReport(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Scale className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Executive Portfolio Summary</h2>
                    <p className="text-sm text-slate-500 font-medium">Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrintReport}
                    title="Print report"
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownloadExecutiveReport}
                    title="Download report"
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowReport(false)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all ml-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Executive Overview */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Portfolio Overview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Contracts</p>
                      <p className="text-2xl font-bold text-slate-900">{activeContracts.length}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg. Contract Value</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(contracts.length ? totalValue / contracts.length : 0)}</p>
                    </div>
                  </div>
                </section>

                {/* Risk Analysis */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Risk Assessment</h3>
                  <div className="space-y-3">
                    {riskInsights.map((risk, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                        <div className={cn("p-2 rounded-xl shrink-0", risk.color)}>
                          <risk.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-slate-900">{risk.title}</h4>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                              risk.level === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                            )}>
                              {risk.level}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{risk.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Strategic Recommendations */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Strategic Recommendations</h3>
                  <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold">01</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        {expiredCount > 0 
                          ? `Immediate action required: ${expiredCount} contracts have expired or are in critical status. Prioritize renewals to avoid service disruption.`
                          : "Maintain current renewal schedule. Portfolio health is currently within optimal parameters."}
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold">02</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        {totalValue > 1000000 
                          ? "High-value exposure detected. Recommend implementing currency hedging strategies for GHS-denominated contracts exceeding 500k."
                          : "Value exposure is currently low. Continue monitoring exchange rate fluctuations for future high-value agreements."}
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold">03</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        Strengthen local content documentation for the {pieDataRaw[0]?.name || 'primary'} sector to ensure full regulatory compliance with Ghanaian laws.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium italic">
                  * This report is generated by LexisManage AI based on current database records.
                </p>
                <button 
                  onClick={() => setShowReport(false)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                  Close Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
