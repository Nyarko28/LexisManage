import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Search, 
  FileText,
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Globe,
  Lock,
  BarChart3,
  Scale,
  Check,
  ChevronRight,
  Shield,
  Activity,
  LayoutDashboard,
  Library,
  Building2,
  MessageSquare,
  Users,
  Settings,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage = ({ onEnter }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Scale className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">LexisManage</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Features</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> Solutions</a>
            <a href="#security" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Security</a>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onEnter}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onEnter}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean Modern SaaS */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100 inline-block mb-6">
                Trusted by Ghana's Leading Enterprises
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Modern Contract Lifecycle <br />
                <span className="text-blue-600">Powered by Intelligence.</span>
              </h1>
              <p className="mt-8 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                The enterprise-grade platform for managing contracts, mitigating risks, and streamlining legal operations with advanced AI.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
            >
              <button 
                onClick={onEnter}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                Watch Product Tour
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 relative"
            >
              <div className="relative bg-[#1e1b4b] rounded-[24px] p-10 overflow-visible">
                <div
                  className="absolute top-8 left-1/2 -translate-x-1/2 w-[620px] h-[220px] rounded-full pointer-events-none"
                  style={{ background: 'rgba(67,56,202,0.18)', filter: 'blur(60px)' }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                  className="relative z-10 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl"
                >
                  {/* Browser chrome */}
                  <div className="h-12 bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">◀</div>
                      <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">▶</div>
                    </div>
                    <div className="mx-auto max-w-[360px] w-full bg-white border border-slate-200 rounded-full px-3 py-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-600">lexis-manage.vercel.app</span>
                    </div>
                    <div className="ml-auto flex gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200" />
                      <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200" />
                    </div>
                  </div>

                  <div className="h-[520px] flex">
                    {/* Sidebar */}
                    <aside className="w-[220px] bg-white border-r border-slate-100 flex flex-col">
                      <div className="p-4 border-b border-slate-100 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-[10px] bg-[#4338ca] flex items-center justify-center">
                          <Scale className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900">LexisManage</span>
                      </div>
                      <div className="mx-3 mt-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
                        <Search className="w-3.5 h-3.5" /> Search...
                      </div>
                      <div className="px-4 pt-3 text-[10px] font-bold text-slate-400 tracking-widest">WORKSPACE</div>
                      <div className="mx-2 mt-1 bg-blue-50 rounded-lg border-l-2 border-blue-600 px-2 py-2 text-xs text-blue-700 font-semibold flex items-center gap-2">
                        <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                      </div>
                      <div className="mx-2 mt-1 rounded-lg px-2 py-2 text-xs text-slate-600 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-slate-400" /> Contracts</span>
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full">6</span>
                      </div>
                      <div className="mx-2 mt-1 rounded-lg px-2 py-2 text-xs text-slate-600 inline-flex items-center gap-2"><Library className="w-3.5 h-3.5 text-slate-400" /> Templates</div>
                      <div className="px-4 pt-3 text-[10px] font-bold text-slate-400 tracking-widest">INTELLIGENCE</div>
                      <div className="mx-2 mt-1 rounded-lg px-2 py-2 text-xs text-slate-600 inline-flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Research</div>
                      <div className="mx-2 mt-1 rounded-lg px-2 py-2 text-xs text-slate-600 inline-flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Legal Assistant</div>
                      <div className="px-4 pt-3 text-[10px] font-bold text-slate-400 tracking-widest">ADMINISTRATION</div>
                      <div className="mx-2 mt-1 rounded-lg px-2 py-2 text-xs text-slate-600 inline-flex items-center gap-2"><Users className="w-3.5 h-3.5 text-slate-400" /> Team</div>
                      <div className="mx-2 mt-1 rounded-lg px-2 py-2 text-xs text-slate-600 inline-flex items-center gap-2"><Settings className="w-3.5 h-3.5 text-slate-400" /> Settings</div>
                      <div className="mt-auto p-3 border-t border-slate-100 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#4338ca] text-white text-xs font-bold flex items-center justify-center">L</div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900">Lemon Adimat</div>
                          <div className="text-[10px] text-slate-400">Admin</div>
                        </div>
                      </div>
                    </aside>

                    {/* Main dashboard */}
                    <div className="flex-1 bg-slate-50">
                      <div className="h-12 bg-white border-b border-slate-100 px-4 flex items-center justify-between">
                        <div className="w-60 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400">Search input</div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white relative flex items-center justify-center">
                            <Bell className="w-4 h-4 text-slate-500" />
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                          </div>
                          <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">CSV</button>
                          <button className="px-2.5 py-1.5 border border-green-200 bg-green-50 rounded-lg text-green-700">Report</button>
                          <button className="px-2.5 py-1.5 bg-[#4338ca] rounded-lg text-white font-semibold">+ Create Contract</button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Dashboard Overview</h3>
                            <p className="text-xs text-slate-500">Welcome back, Lemon Adimat</p>
                          </div>
                          <span className="px-2 py-1 rounded-md border border-indigo-200 bg-[#eef2ff] text-[10px] text-[#4338ca] font-bold">AI Insights Active</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          <div className="bg-white rounded-lg border border-slate-100 p-2.5"><p className="text-sm font-bold">GH₵58.3M</p><p className="text-[10px] text-slate-400">Total Active Value ↗ 12.4%</p></div>
                          <div className="bg-white rounded-lg border border-slate-100 p-2.5"><p className="text-sm font-bold">22</p><p className="text-[10px] text-slate-400">Active Contracts ↗ 18</p></div>
                          <div className="bg-white rounded-lg border border-slate-100 p-2.5"><p className="text-sm font-bold">6</p><p className="text-[10px] text-slate-400">Pending Review</p></div>
                          <div className="bg-white rounded-lg border border-slate-100 p-2.5"><p className="text-sm font-bold">0</p><p className="text-[10px] text-green-600">All clear</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white rounded-lg border border-slate-100 p-3">
                            <div className="flex justify-between mb-2"><p className="text-xs font-bold">AI Risk Insights</p><span className="text-[10px] text-slate-400">REAL-TIME</span></div>
                            <div className="border border-red-200 rounded-md p-2 mb-1.5"><p className="text-[11px] font-semibold">Renewal Risk <span className="text-[10px] text-red-700">HIGH</span></p><p className="text-[10px] text-slate-500">Consar Limited expires in 28 days</p></div>
                            <div className="border border-amber-200 rounded-md p-2 mb-1.5"><p className="text-[11px] font-semibold">Compliance Gap <span className="text-[10px] text-amber-700">MED</span></p><p className="text-[10px] text-slate-500">Enterprise Insurance - local content</p></div>
                            <div className="border border-red-200 rounded-md p-2"><p className="text-[11px] font-semibold">Value Exposure <span className="text-[10px] text-red-700">HIGH</span></p><p className="text-[10px] text-slate-500">GH₵800K lacks currency protection</p></div>
                          </div>
                          <div className="bg-white rounded-lg border border-slate-100 p-3">
                            <div className="flex justify-between mb-3"><p className="text-xs font-bold">Contract Value by Month</p><span className="text-[10px] text-slate-500">Last 6 Months</span></div>
                            <div className="h-36 flex items-end justify-between gap-1.5">
                              <div className="w-7 h-4 bg-indigo-200 rounded-t" /><div className="w-7 h-8 bg-indigo-300 rounded-t" /><div className="w-7 h-3 bg-indigo-200 rounded-t" />
                              <div className="w-7 h-14 bg-indigo-400 rounded-t" /><div className="w-7 h-20 bg-indigo-500 rounded-t" />
                              <div className="w-7 h-28 bg-[#4338ca] rounded-t relative"><span className="absolute -top-7 -left-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded">GH₵52M</span></div>
                            </div>
                            <div className="mt-2 text-[10px] text-slate-400 flex justify-between"><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [-6, 0, -6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden lg:flex absolute top-16 -left-5 z-20 bg-white rounded-xl border border-slate-100 px-3 py-2 shadow-[0_14px_30px_rgba(67,56,202,0.18)] items-center gap-2"
                >
                  <div className="w-8 h-8 bg-[#eef2ff] rounded-lg flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-[#4338ca]" /></div>
                  <div><p className="text-xs font-bold text-slate-900">Contract Approved</p><p className="text-[10px] text-slate-400">2 minutes ago</p></div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="hidden lg:flex absolute bottom-20 -left-5 z-20 bg-white rounded-xl border border-green-100 px-3 py-2 shadow-[0_14px_30px_rgba(34,197,94,0.16)] items-center gap-2"
                >
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"><span className="text-green-600 font-bold">+</span></div>
                  <div><p className="text-xs font-bold text-slate-900">New contract added</p><p className="text-[10px] text-slate-400">Kasapreko Ltd - GH₵800K</p></div>
                </motion.div>
                <motion.div
                  animate={{ y: [-6, 0, -6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="hidden lg:flex absolute bottom-14 -right-5 z-20 bg-white rounded-xl border border-red-100 px-3 py-2 shadow-[0_14px_30px_rgba(239,68,68,0.14)] items-center gap-2"
                >
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-red-600" /></div>
                  <div><p className="text-xs font-bold text-slate-900">Risk Detected</p><p className="text-[10px] text-slate-400">Liability clause alert</p></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Trusted by leading legal departments</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale">
            <div className="flex items-center space-x-2 font-bold text-xl text-slate-900"><span>MTN</span><span>GHANA</span></div>
            <div className="flex items-center space-x-2 font-bold text-xl text-slate-900"><span>GCB</span><span>BANK</span></div>
            <div className="flex items-center space-x-2 font-bold text-xl text-slate-900"><span>TULLOW</span><span>OIL</span></div>
            <div className="flex items-center space-x-2 font-bold text-xl text-slate-900"><span>ZOOMLION</span></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Everything you need to manage risk.</h2>
            <p className="mt-4 text-lg text-slate-500">Powerful tools designed for speed, accuracy, and enterprise-grade security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI Analysis",
                desc: "Extract key terms and obligations automatically with 99% accuracy.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: BarChart3,
                title: "Risk Reporting",
                desc: "Visualize your entire portfolio's health with automated risk heatmaps.",
                color: "bg-indigo-50 text-indigo-600"
              },
              {
                icon: Search,
                title: "Deep Research",
                desc: "Perform real-time counterparty research using global news and legal filings.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: ShieldCheck,
                title: "Compliance",
                desc: "Stay ahead of regulatory changes with automated gap analysis tools.",
                color: "bg-purple-50 text-purple-600"
              },
              {
                icon: Globe,
                title: "Global Search",
                desc: "Find any clause across thousands of documents with semantic search.",
                color: "bg-rose-50 text-rose-600"
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                desc: "SOC2 Type II compliant infrastructure with granular access controls.",
                color: "bg-slate-100 text-slate-600"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                <div className="mt-6 flex items-center text-xs font-bold text-blue-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section - Split */}
      <section id="solutions" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Legal Intelligence <br />
                <span className="text-blue-400">for the Modern GC.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                LexisManage provides the visibility and control needed to manage complex contract portfolios without the manual overhead.
              </p>
              <div className="space-y-4">
                {[
                  "Automated contract summaries",
                  "Real-time renewal alerts",
                  "Collaborative team workflows",
                  "Customizable risk scoring"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={onEnter}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
              >
                Explore Solutions
              </button>
            </div>
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">System Health</span>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded uppercase">Optimal</span>
                </div>
                <div className="space-y-6">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[75%]"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Active Contracts</p>
                      <p className="text-xl font-bold">1,284</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Risk Score</p>
                      <p className="text-xl font-bold text-blue-400">Low</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">Ready to streamline your legal operations?</h2>
          <p className="text-lg text-slate-500">Join hundreds of legal teams who trust LexisManage to manage their most critical agreements.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={onEnter}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              Get Started Now
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Scale className="text-white w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">LexisManage</span>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-8 text-sm font-medium text-slate-500">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Security</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
              </div>
            </div>

            <p className="text-sm text-slate-400">© 2026 LexisManage AI. All rights reserved.</p>
          </div>
        </div>
        <div className="text-center text-[13px] text-[#64748b] mt-6">
            Developed by{' '}
            <a
              href="https://wa.me/233534086538"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat with developer on WhatsApp"
              className="inline-flex items-center gap-1 text font-semibold transition-colors duration-200 hover:text-green-400"
            >
              Adimat
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-[#25D366]"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.833L.057 23.215a.75.75 0 00.918.919l5.382-1.453A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.7-.513-5.238-1.407l-.374-.217-3.876 1.046 1.046-3.877-.217-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
            </a>
          </div>
      </footer>
    </div>
  );
};
