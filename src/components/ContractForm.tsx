import React, { useState } from 'react';
import { 
  Save, 
  X, 
  Upload, 
  Info,
  Calendar,
  DollarSign,
  Users,
  Tag,
  Loader2
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Contract } from '../types';

export const ContractForm = ({ onCancel, initialData }: { onCancel: () => void, initialData?: Contract | null }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    party: initialData?.party || '',
    value: initialData?.value?.toString() || '',
    category: initialData?.category || 'IT Services',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    description: initialData?.description || '',
    renewalType: (initialData as any)?.renewalType || 'Fixed Term'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const contractData = {
        ...formData,
        value: parseFloat(formData.value) || 0,
        status: initialData?.status || 'Active',
        authorId: initialData?.authorId || user.uid,
        updatedAt: serverTimestamp(),
      };

      if (initialData?.id) {
        await updateDoc(doc(db, 'contracts', initialData.id), contractData);
      } else {
        await addDoc(collection(db, 'contracts'), {
          ...contractData,
          createdAt: serverTimestamp(),
        });
      }
      onCancel();
    } catch (error) {
      handleFirestoreError(error, initialData ? OperationType.UPDATE : OperationType.CREATE, 'contracts');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{initialData ? 'Edit Contract' : 'Create New Contract'}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{initialData ? 'Update the details of the existing agreement.' : 'Enter the details of the new agreement to start tracking.'}</p>
        </div>
        <button 
          onClick={onCancel}
          disabled={isSubmitting}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50 shrink-0"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                Contract Title
              </label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text" 
                placeholder="e.g. Enterprise License Agreement 2024"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  Counterparty
                </label>
                <input 
                  required
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  type="text" 
                  placeholder="Company Name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none text-sm sm:text-base"
                >
                  <option>IT Services</option>
                  <option>Real Estate</option>
                  <option>Marketing</option>
                  <option>Professional Services</option>
                  <option>Legal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  Contract Value
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input 
                    required
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    type="number" 
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  Renewal Type
                </label>
                <select 
                  name="renewalType"
                  value={formData.renewalType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none text-sm sm:text-base"
                >
                  <option>Fixed Term</option>
                  <option>Auto-Renewal</option>
                  <option>Perpetual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Start Date</label>
                <input 
                  required
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  type="date" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">End Date</label>
                <input 
                  required
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  type="date" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description / Summary</label>
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Briefly describe the purpose and key terms of this contract..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none text-sm sm:text-base"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 sm:space-x-4">
            <button 
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Saving...' : 'Save Contract'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Document Upload</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors cursor-pointer group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-blue-500" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">PDF, DOCX up to 10MB</p>
            </div>
          </div>

          <div className="bg-blue-50 p-5 md:p-6 rounded-2xl border border-blue-100">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-blue-900">Pro Tip</h4>
                <p className="text-[10px] sm:text-xs text-blue-700 mt-1 leading-relaxed">
                  Adding a clear description and accurate end dates helps the system generate better renewal reminders and analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
