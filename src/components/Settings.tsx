import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Database, 
  Mail,
  Lock,
  ChevronRight,
  Check,
  Clock,
  Wand2,
  Loader2
} from 'lucide-react';
import { cn } from '../utils';
import { useAuth } from '../contexts/AuthContext';
import { seedContracts } from '../services/seedService';

const SettingSection = ({ title, description, children }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon: Icon, label, description, action, toggle, onClick, disabled }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center">
      <div className="p-2 bg-slate-50 rounded-xl mr-4 group-hover:bg-blue-50 transition-colors">
        <Icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
    {toggle ? (
      <button className="w-10 h-6 bg-blue-600 rounded-full relative transition-colors">
        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
      </button>
    ) : (
      <button 
        onClick={onClick}
        disabled={disabled}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {action}
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    )}
  </div>
);

export const Settings = () => {
  const { user, isAdmin } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [activeSettingTab, setActiveSettingTab] = useState('Profile');

  const handleSeedData = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      await seedContracts(user.uid);
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to seed data:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  const navItems = [
    { label: 'Profile', icon: User },
    { label: 'Notifications', icon: Bell },
    { label: 'Security', icon: Shield },
    { label: 'Integrations', icon: Globe },
    { label: 'Data Export', icon: Database },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-12 px-4 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your account preferences and system configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {/* Sidebar Nav */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-1 no-scrollbar">
          {navItems.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveSettingTab(item.label)}
              className={cn(
                "flex items-center whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-xl transition-all shrink-0",
                activeSettingTab === item.label
                  ? "bg-white text-blue-700 shadow-sm border border-slate-200" 
                  : "text-slate-600 hover:bg-slate-100 border border-transparent"
              )}
            >
              <item.icon className={cn("w-4 h-4 mr-3", activeSettingTab === item.label ? "text-blue-600" : "text-slate-400")} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6 md:space-y-8">
          {activeSettingTab === 'Profile' && (
            <>
              {isAdmin && (
                <SettingSection 
                  title="Admin Tools" 
                  description="System maintenance and data management tools."
                >
                  <div className="space-y-6">
                    <SettingItem 
                      icon={isSeeding ? Loader2 : Wand2} 
                      label="Seed Realistic Contracts" 
                      description="Populate the database with a set of 10 realistic legal contracts for testing."
                      action={seedSuccess ? "Done!" : (isSeeding ? "Seeding..." : "Seed Data")}
                      onClick={handleSeedData}
                      disabled={isSeeding}
                    />
                  </div>
                </SettingSection>
              )}

              <SettingSection 
                title="Personal Information" 
                description="Update your photo and personal details here."
              >
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                  <div className="relative w-fit">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-10 h-10" />
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 hover:text-blue-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{user?.displayName}</h4>
                    <p className="text-sm text-slate-500 capitalize">{user?.role} • LexisManage</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input type="text" defaultValue={user?.displayName} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center">
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </SettingSection>
            </>
          )}

          {activeSettingTab === 'Notifications' && (
            <SettingSection 
              title="Notification Preferences" 
              description="Control how and when you receive alerts."
            >
              <div className="space-y-6">
                <SettingItem 
                  icon={Mail} 
                  label="Email Notifications" 
                  description="Receive daily summaries and critical alerts via email."
                  toggle={true}
                />
                <SettingItem 
                  icon={Bell} 
                  label="Desktop Push" 
                  description="Get real-time browser notifications for mentions."
                  toggle={true}
                />
                <SettingItem 
                  icon={Clock} 
                  label="Renewal Reminders" 
                  description="Alert me 30, 60, and 90 days before contract expiry."
                  toggle={true}
                />
              </div>
            </SettingSection>
          )}

          {activeSettingTab === 'Security' && (
            <SettingSection 
              title="Security" 
              description="Keep your account secure with these settings."
            >
              <div className="space-y-6">
                <SettingItem 
                  icon={Lock} 
                  label="Two-Factor Authentication" 
                  description="Add an extra layer of security to your account."
                  action="Enable"
                />
                <SettingItem 
                  icon={Shield} 
                  label="Session Management" 
                  description="View and manage your active sessions on other devices."
                  action="Manage"
                />
              </div>
            </SettingSection>
          )}

          {activeSettingTab === 'Integrations' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-900">Integrations</h3>
              <p className="text-sm text-slate-500 mt-2">Connect LexisManage with your favorite tools.</p>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">Explore Integrations</button>
            </div>
          )}

          {activeSettingTab === 'Data Export' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-900">Data Export</h3>
              <p className="text-sm text-slate-500 mt-2">Download all your contract data in various formats.</p>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">Request Export</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Edit3 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);
