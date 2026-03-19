import { Suspense, lazy, useState } from 'react';
import { Layout } from './components/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { Contract } from './types';
import { useAuth } from './contexts/AuthContext';

const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })));
const ContractList = lazy(() => import('./components/ContractList').then((m) => ({ default: m.ContractList })));
const ContractForm = lazy(() => import('./components/ContractForm').then((m) => ({ default: m.ContractForm })));
const ContractDetails = lazy(() => import('./components/ContractDetails').then((m) => ({ default: m.ContractDetails })));
const Notifications = lazy(() => import('./components/Notifications').then((m) => ({ default: m.Notifications })));
const Settings = lazy(() => import('./components/Settings').then((m) => ({ default: m.Settings })));
const Templates = lazy(() => import('./components/Templates').then((m) => ({ default: m.Templates })));
const CounterpartyResearch = lazy(() => import('./components/CounterpartyResearch').then((m) => ({ default: m.CounterpartyResearch })));
const LegalAssistant = lazy(() => import('./components/LegalAssistant').then((m) => ({ default: m.LegalAssistant })));
const LandingPage = lazy(() => import('./components/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./components/LoginPage').then((m) => ({ default: m.LoginPage })));
const UserManagement = lazy(() => import('./components/UserManagement').then((m) => ({ default: m.UserManagement })));

export default function App() {
  const { user, loading, login } = useAuth();
  // Check for invite ID in URL
  const urlParams = new URLSearchParams(window.location.search);
  const inviteId = urlParams.get('invite');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showLogin, setShowLogin] = useState(!!inviteId);

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setActiveTab('details');
  };

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setActiveTab('edit');
  };

  const handleRenewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setActiveTab('edit');
  };

  const contentFallback = (
    <div className="h-full flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {showLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={contentFallback}>
              <LoginPage onBack={() => setShowLogin(false)} inviteId={inviteId} />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Suspense fallback={contentFallback}>
              <LandingPage onEnter={() => setShowLogin(true)} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} onViewContract={handleViewContract} />;
      case 'contracts':
        return (
          <ContractList 
            onViewContract={handleViewContract} 
            onCreateNew={() => setActiveTab('new')} 
          />
        );
      case 'templates':
        return <Templates />;
      case 'research':
        return <CounterpartyResearch />;
      case 'assistant':
        return <LegalAssistant />;
      case 'new':
        return <ContractForm onCancel={() => setActiveTab('contracts')} />;
      case 'edit':
        return <ContractForm initialData={selectedContract} onCancel={() => setActiveTab('details')} />;
      case 'details':
        return selectedContract ? (
          <ContractDetails 
            contract={selectedContract} 
            onBack={() => setActiveTab('contracts')} 
            onEdit={() => handleEditContract(selectedContract)}
            onRenew={() => handleRenewContract(selectedContract)}
          />
        ) : null;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      case 'users':
        return <UserManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <p className="text-lg font-medium">This section is under development.</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-4 text-blue-600 hover:underline"
            >
              Return to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab === 'details' ? `details-${selectedContract?.id}` : activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-full"
        >
          <Suspense fallback={contentFallback}>
            {renderContent()}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
