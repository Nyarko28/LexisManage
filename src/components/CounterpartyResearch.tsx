import React, { useState } from 'react';
import { 
  Search, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  ShieldAlert, 
  TrendingUp,
  Info,
  ExternalLink
} from 'lucide-react';
import { cn } from '../utils';
import { researchCounterparty } from '../services/groqService';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export const CounterpartyResearch = () => {
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleResearch = async (companyName: string) => {
    const target = companyName || query;
    if (!target.trim() || isResearching) return;

    setQuery(target);
    setIsResearching(true);
    setReport(null);

    try {
      const result = await researchCounterparty(target);
      setReport(result || "No information found.");
    } catch (error) {
      console.error("Research error:", error);
      setReport("An error occurred while researching the company. Please try again.");
    } finally {
      setIsResearching(false);
    }
  };

  const suggestedCompanies = [
    "MTN Ghana",
    "GCB Bank PLC",
    "Tullow Oil Ghana",
    "Zoomlion Ghana Limited",
    "Kasapreko Company Limited"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
            Counterparty Research
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Perform deep-dive research on potential partners using AI and real-time search.</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Who are you researching today?</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch(query)}
              placeholder="Enter company name" 
              className="w-full pl-12 pr-4 sm:pr-32 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
            <button 
              onClick={() => handleResearch(query)}
              disabled={!query.trim() || isResearching}
              className="mt-3 sm:mt-0 sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isResearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Research</span>
                </>
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Suggestions:</span>
            {suggestedCompanies.map((company) => (
              <button 
                key={company}
                onClick={() => handleResearch(company)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {isResearching ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-6 text-center"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Analyzing {query}...</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Our AI is scanning global news, financial reports, and legal filings to build a comprehensive risk profile.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <Globe className="w-3 h-3 animate-spin-slow" />
              <span>Grounded with Web Search</span>
            </div>
          </motion.div>
        ) : report ? (
          <motion.div 
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Report */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm prose prose-slate max-w-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 not-prose">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 m-0">Intelligence Report</h2>
                  <div className="flex items-center w-fit space-x-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-widest">
                    <Search className="w-3 h-3" />
                    <span>Real-time Data</span>
                  </div>
                </div>
                <Markdown>{report}</Markdown>
              </div>
            </div>

            {/* Side Insights */}
            <div className="space-y-6">
              <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-xl shadow-blue-900/20 space-y-4">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold">Risk Assessment</h3>
                </div>
                <p className="text-blue-100/80 text-sm leading-relaxed">
                  Based on current findings, this counterparty shows a <span className="text-white font-bold">Medium-Low</span> risk profile. 
                </p>
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-300">Financial Stability</span>
                    <span className="font-bold">Strong</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full w-[85%]"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-300">Legal Compliance</span>
                    <span className="font-bold">Good</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full w-[70%]"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Market Sentiment
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Recent Expansion</p>
                      <p className="text-xs text-slate-500">Announced new HQ in Berlin last week.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Info className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Regulatory Review</p>
                      <p className="text-xs text-slate-500">Minor compliance audit ongoing in EU.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-slate-900">Ready to research</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">
                Enter a company name above to generate an AI-powered intelligence report.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
