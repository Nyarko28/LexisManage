import React from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  FileText, 
  PlusCircle, 
  Settings, 
  Bell, 
  Search, 
  User as UserIcon,
  LogOut,
  ChevronRight,
  Library,
  Building2,
  MessageSquare,
  Users,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { cn } from '../utils';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg group",
      active 
        ? "bg-blue-50 text-blue-700" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon className={cn(
      "w-5 h-5 mr-3",
      active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
    )} />
    {label}
    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const { user, logout, isEditor, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu when tab changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Scale className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">LexisManage</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Workspace Section */}
        <div>
          <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Workspace</h3>
          <div className="space-y-1">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
            />
            <SidebarItem 
              icon={FileText} 
              label="Contracts" 
              active={activeTab === 'contracts'} 
              onClick={() => setActiveTab('contracts')}
            />
            <SidebarItem 
              icon={Library} 
              label="Templates" 
              active={activeTab === 'templates'} 
              onClick={() => setActiveTab('templates')}
            />
          </div>
        </div>

        {/* Intelligence Section */}
        <div>
          <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Intelligence</h3>
          <div className="space-y-1">
            <SidebarItem 
              icon={Building2} 
              label="Research" 
              active={activeTab === 'research'} 
              onClick={() => setActiveTab('research')}
            />
            <SidebarItem 
              icon={MessageSquare} 
              label="Legal Assistant" 
              active={activeTab === 'assistant'} 
              onClick={() => setActiveTab('assistant')}
            />
          </div>
        </div>

        {/* Administration Section */}
        {(isEditor || isAdmin) && (
          <div>
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Administration</h3>
            <div className="space-y-1">
              {isEditor && (
                <SidebarItem 
                  icon={PlusCircle} 
                  label="New Contract" 
                  active={activeTab === 'new'} 
                  onClick={() => setActiveTab('new')}
                />
              )}
              {isAdmin && (
                <SidebarItem 
                  icon={Users} 
                  label="Team" 
                  active={activeTab === 'users'} 
                  onClick={() => setActiveTab('users')}
                />
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex items-center w-full px-4 py-2 text-xs font-medium transition-colors rounded-lg group",
            activeTab === 'settings' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Settings className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600" />
          Settings
        </button>
        
        <div className="flex items-center p-2 space-x-3 rounded-xl bg-slate-50 border border-slate-100 group">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-slate-200">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-900 truncate">{user?.displayName}</p>
            <p className="text-[9px] text-slate-500 truncate capitalize font-medium">{user?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-40 md:w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden md:block h-8 w-px bg-slate-200 mx-2"></div>
            {isEditor && (
              <button 
                onClick={() => setActiveTab('new')}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Create Contract</span>
                <span className="sm:hidden">New</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
