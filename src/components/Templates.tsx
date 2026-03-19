import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Copy, 
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '../utils';
import { generateContractDraft } from '../services/geminiService';
import Markdown from 'react-markdown';

const TEMPLATES = [
  { id: 'nda', name: 'Non-Disclosure Agreement', category: 'Legal', icon: Lock, description: 'Standard mutual or one-way confidentiality agreement.' },
  { id: 'msa', name: 'Master Services Agreement', category: 'Professional Services', icon: Briefcase, description: 'Framework for ongoing service relationships.' },
  { id: 'sla', name: 'Service Level Agreement', category: 'IT Services', icon: Shield, description: 'Define uptime, support, and performance metrics.' },
  { id: 'employment', name: 'Employment Contract', category: 'HR', icon: Globe, description: 'Standard terms for full-time or contract hires.' },
];

export const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [partyName, setPartyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedTemplate || !partyName) return;
    setIsGenerating(true);
    try {
      const draft = await generateContractDraft(selectedTemplate.name, partyName);
      setGeneratedDraft(draft || 'Failed to generate draft.');
    } catch (error) {
      setGeneratedDraft('An error occurred while generating the draft.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Templates Library</h1>
          <p className="text-slate-500">Start from a professional template or generate a custom draft with AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Templates Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map((template) => (
              <div 
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setGeneratedDraft(null);
                }}
                className={cn(
                  "p-6 rounded-2xl border transition-all cursor-pointer group",
                  selectedTemplate?.id === template.id 
                    ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500" 
                    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl w-fit mb-4 transition-colors",
                  selectedTemplate?.id === template.id ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                )}>
                  <template.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900">{template.name}</h3>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">{template.category}</p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{template.description}</p>
                <div className="mt-4 flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Select Template</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>

          {generatedDraft && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                  AI Generated Draft
                </h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Use this Draft
                  </button>
                </div>
              </div>
              <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-6 rounded-xl border border-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                <Markdown>{generatedDraft}</Markdown>
              </div>
            </div>
          )}
        </div>

        {/* Configuration Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Draft Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Template</label>
                <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium">
                  {selectedTemplate ? selectedTemplate.name : 'Select a template'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Counterparty Name</label>
                <input 
                  type="text" 
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="e.g. MTN Ghana"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={!selectedTemplate || !partyName || isGenerating}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center disabled:opacity-50 disabled:shadow-none"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h4 className="text-sm font-bold text-blue-900 mb-2">How it works</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Our AI uses the latest legal standards to draft a comprehensive agreement based on your selected template and party details. Always review generated drafts with legal counsel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
