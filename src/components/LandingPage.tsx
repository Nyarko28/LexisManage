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
  Activity
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
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
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
              <div className="relative rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
                <img 
                  src="https://picsum.photos/seed/legal-dashboard/1600/900" 
                  alt="LexisManage Dashboard" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
              </div>
              {/* Floating UI Elements */}
              <div className="absolute -left-8 top-1/4 hidden lg:block">
                <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Contract Approved</p>
                    <p className="text-[10px] text-slate-500">2 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 bottom-1/4 hidden lg:block">
                <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Risk Detected</p>
                    <p className="text-[10px] text-slate-500">Liability clause alert</p>
                  </div>
                </div>
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
      </footer>
    </div>
  );
};
