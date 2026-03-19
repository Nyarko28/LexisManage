import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Eye, 
  Edit3, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { formatCurrency, cn } from '../utils';
import { Contract } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ContractListProps {
  onViewContract: (contract: Contract) => void;
  onCreateNew: () => void;
}

export const ContractList = ({ onViewContract, onCreateNew }: ContractListProps) => {
  const { isEditor, isAdmin } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contracts Repository</h1>
          <p className="text-slate-500">Manage and track all legal agreements in one place.</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <button className="flex items-center space-x-2 px-3 md:px-4 py-2 border border-slate-200 rounded-lg text-xs md:text-sm font-medium text-slate-600 hover:bg-white transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
          {isEditor && (
            <button 
              onClick={onCreateNew}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>New Contract</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, party, or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border-slate-200 bg-slate-50 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option>All</option>
            <option>Active</option>
            <option>Review</option>
            <option>Draft</option>
            <option>Expired</option>
          </select>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-900">
                    <span>Contract</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Counterparty</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((contract) => (
                <tr 
                  key={contract.id} 
                  className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => onViewContract(contract)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{contract.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{contract.id} • {contract.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{contract.party}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      contract.status === 'Active' ? "bg-blue-50 text-blue-700" :
                      contract.status === 'Review' ? "bg-amber-50 text-amber-700" :
                      contract.status === 'Expired' ? "bg-rose-50 text-rose-700" :
                      "bg-slate-100 text-slate-700"
                    )}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{formatCurrency(contract.value)}</div>
                    <div className="text-xs text-slate-400">{contract.currency}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">Start: {contract.startDate}</div>
                    <div className="text-xs text-slate-400 mt-1">End: {contract.endDate}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onViewContract(contract); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isEditor && (
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Contract"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Contract"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{filteredContracts.length}</span> of <span className="font-medium text-slate-900">{filteredContracts.length}</span> results
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">1</button>
            <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
