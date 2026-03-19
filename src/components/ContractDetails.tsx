import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  Tag, 
  Clock, 
  FileText, 
  Download, 
  History, 
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Trash2,
  Loader2,
  X
} from 'lucide-react';
import { Contract } from '../types';
import { formatCurrency, cn } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

import { analyzeContract } from '../services/geminiService';
import Markdown from 'react-markdown';

interface ContractDetailsProps {
  contract: Contract;
  onBack: () => void;
  onEdit: () => void;
  onRenew: () => void;
}

export const ContractDetails = ({ contract, onBack, onEdit, onRenew }: ContractDetailsProps) => {
  const { user, isAdmin, isEditor } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Kwame Mensah', initials: 'KM', color: 'bg-blue-100 text-blue-700', text: "I've reviewed the liability clauses. Everything looks standard for this category.", time: '2 hours ago' },
    { id: 2, user: 'Abena Osei', initials: 'AO', color: 'bg-blue-100 text-blue-700', text: "Thanks Kwame. I'll proceed with the signature request tomorrow.", time: '1 hour ago' },
  ]);

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment = {
      id: Date.now(),
      user: user.displayName || 'Me',
      initials: (user.displayName || 'M').split(' ').map(n => n[0]).join('').toUpperCase(),
      color: 'bg-blue-600 text-white',
      text: newComment,
      time: 'Just now'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleDownload = (fileName: string) => {
    setDownloadingFile(fileName);
    // Simulate download delay
    setTimeout(() => {
      setDownloadingFile(null);
      // In a real app, this would trigger a window.open or a blob download
      alert(`Simulated download of ${fileName} complete.`);
    }, 1500);
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const details = `Title: ${contract.title}, Party: ${contract.party}, Value: ${contract.value}, Category: ${contract.category}, Description: ${contract.description}`;
      const analysis = await analyzeContract(details);
      setAiInsights(analysis || 'No insights generated.');
    } catch (error) {
      setAiInsights('Failed to generate AI insights.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'contracts', contract.id));
      onBack();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contracts/${contract.id}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isExpiringSoon = contract.endDate ? (new Date(contract.endDate).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 30) : false;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Repository</span>
        </button>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {isAdmin && (
            <div className="relative">
              <button 
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                disabled={isDeleting}
                className="px-3 sm:px-4 py-2 border border-rose-200 rounded-lg text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1.5 sm:mr-2" />}
                <span className="hidden xs:inline">Delete</span>
              </button>
              
              {showDeleteConfirm && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50">
                  <p className="text-sm text-slate-900 font-bold mb-3">Delete this contract?</p>
                  <p className="text-xs text-slate-500 mb-4">This action cannot be undone and will remove all associated data.</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="flex-1 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {isEditor && (
            <button 
              onClick={onEdit}
              className="px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-white transition-colors"
            >
              Edit <span className="hidden xs:inline">Contract</span>
            </button>
          )}
          <button 
            onClick={onRenew}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Renew <span className="hidden xs:inline">Agreement</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                    contract.status === 'Active' ? "bg-blue-50 text-blue-700" :
                    contract.status === 'Review' ? "bg-amber-50 text-amber-700" :
                    "bg-slate-100 text-slate-700"
                  )}>
                    {contract.status}
                  </span>
                  <span className="text-slate-400 text-xs sm:text-sm">{contract.id}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{contract.title}</h1>
                <p className="text-slate-500 mt-2 text-base sm:text-lg">{contract.party}</p>
              </div>
              <div className="md:text-right pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <p className="text-[10px] sm:text-sm text-slate-400 font-medium uppercase tracking-wider">Total Value</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{formatCurrency(contract.value)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 border-y border-slate-100">
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Start Date</p>
                <div className="flex items-center text-slate-900 font-medium text-sm sm:text-base">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  {contract.startDate}
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">End Date</p>
                <div className="flex items-center text-slate-900 font-medium text-sm sm:text-base">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  {contract.endDate}
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Category</p>
                <div className="flex items-center text-slate-900 font-medium text-sm sm:text-base">
                  <Tag className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  {contract.category}
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Owner</p>
                <div className="flex items-center text-slate-900 font-medium text-sm sm:text-base">
                  <Users className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  {contract.owner}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-slate-900 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {contract.description}
              </p>
            </div>

            {/* AI Insights Section */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                  AI Contract Insights
                </h3>
                {!aiInsights && (
                  <button 
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center disabled:opacity-50 w-fit"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1.5" />
                        Run AI Analysis
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {aiInsights ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 prose prose-slate prose-sm max-w-none"
                >
                  <Markdown>{aiInsights}</Markdown>
                  <button 
                    onClick={() => setAiInsights(null)}
                    className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600"
                  >
                    Clear Analysis
                  </button>
                </motion.div>
              ) : (
                <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-6 sm:p-8 text-center">
                  <p className="text-sm text-slate-500 italic">No AI analysis has been performed on this contract yet.</p>
                </div>
              )}
            </div>

            {isExpiringSoon && (
              <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start">
                <AlertTriangle className="w-5 h-5 text-rose-600 mr-3 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">Expiring Soon</h4>
                  <p className="text-xs text-rose-700 mt-1">
                    This contract is set to expire in less than 30 days. Please initiate the renewal process or prepare for termination.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Timeline / Audit Trail */}
          <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center">
                <History className="w-5 h-5 mr-2 text-slate-400" />
                Audit Trail & History
              </h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">View Full Log</button>
            </div>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-100 before:ml-1">
              {[
                { date: '2024-03-15', user: 'Kwame Mensah', action: 'Approved contract terms', icon: ShieldCheck, color: 'text-blue-500' },
                { date: '2024-03-12', user: 'Abena Osei', action: 'Modified financial terms', icon: Edit3, color: 'text-blue-500' },
                { date: '2024-03-10', user: 'System', action: 'Contract uploaded to repository', icon: FileText, color: 'text-slate-400' },
              ].map((item, i) => (
                <div key={i} className="relative pl-10">
                  <div className={cn("absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10", item.color)}>
                    <item.icon className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{item.action}</span>
                    <span className="text-xs text-slate-500 mt-0.5">by {item.user} • {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6 md:space-y-8">
          {/* Document Preview Placeholder */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-slate-400" />
              Documents
            </h3>
            <div className="space-y-3">
              <div 
                onClick={() => handleDownload('Main_Agreement.pdf')}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center group cursor-pointer hover:bg-white hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:bg-blue-50 transition-colors shrink-0">
                  <FileText className="w-5 h-5 text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">Main_Agreement.pdf</p>
                  <p className="text-xs text-slate-400">2.4 MB • PDF</p>
                </div>
                {downloadingFile === 'Main_Agreement.pdf' ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                )}
              </div>
              <div 
                onClick={() => handleDownload('Exhibit_A_Pricing.docx')}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center group cursor-pointer hover:bg-white hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:bg-blue-50 transition-colors shrink-0">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">Exhibit_A_Pricing.docx</p>
                  <p className="text-xs text-slate-400">1.1 MB • DOCX</p>
                </div>
                {downloadingFile === 'Exhibit_A_Pricing.docx' ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                )}
              </div>
            </div>
            <button 
              onClick={() => setShowViewer(true)}
              className="w-full mt-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Viewer
            </button>
          </div>

          {/* Viewer Modal */}
          <AnimatePresence>
            {showViewer && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowViewer(false)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-5xl h-full bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 shrink-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-rose-50 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-rose-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-none">Main_Agreement.pdf</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Document Viewer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button 
                        onClick={() => handleDownload('Main_Agreement.pdf')}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setShowViewer(false)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-100 overflow-y-auto p-4 sm:p-8 flex justify-center">
                    <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 sm:p-12 min-h-[1200px] space-y-8">
                      <div className="border-b border-slate-100 pb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{contract.title}</h2>
                        <p className="text-sm sm:text-base text-slate-500">Master Service Agreement • v2.4</p>
                      </div>
                      <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
                        <p className="font-bold text-slate-900">1. PARTIES</p>
                        <p>This Agreement is made between LexisManage Corp ("Client") and {contract.party} ("Service Provider").</p>
                        
                        <p className="font-bold text-slate-900">2. SCOPE OF SERVICES</p>
                        <p>{contract.description}</p>
                        
                        <p className="font-bold text-slate-900">3. TERM AND TERMINATION</p>
                        <p>The term of this Agreement shall commence on {contract.startDate} and continue until {contract.endDate} unless terminated earlier in accordance with the provisions herein.</p>
                        
                        <p className="font-bold text-slate-900">4. COMPENSATION</p>
                        <p>Client shall pay Service Provider the sum of {formatCurrency(contract.value)} for the services rendered under this Agreement.</p>
                        
                        <div className="pt-12 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                          <div className="space-y-4">
                            <div className="h-px w-full bg-slate-200"></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Signature</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-px w-full bg-slate-200"></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Provider Signature</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Comments Section */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-slate-400" />
              Team Comments
            </h3>
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className={cn("w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold", comment.color)}>
                    {comment.initials}
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none flex-1">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-900">{comment.user}</p>
                    <p className="text-[10px] sm:text-xs text-slate-600 mt-1">{comment.text}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">{comment.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="relative">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..." 
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Edit3 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);
