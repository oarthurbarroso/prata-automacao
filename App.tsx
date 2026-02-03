
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Clients from './views/Clients';
import Funnel from './views/Funnel';
import Chat from './views/Chat';
import Marketing from './views/Marketing';
import Settings from './views/Settings';
import CalendarView from './views/CalendarView';
import Finance from './views/Finance';
import Login from './views/Login';
import ClientAnalytics from './views/ClientAnalytics';
import OperationalReports from './views/OperationalReports';
import Suppliers from './views/Suppliers';
import { User, Client, Appointment, Transaction, ProcedurePackage, Deal, Supplier } from './types';
import { api } from './services/api';
import { RefreshCw, AlertTriangle, Database, Key } from 'lucide-react';
import { isSupabaseConfigured } from './services/supabase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Estados de Aparência da Marca
  const [primaryColor, setPrimaryColor] = useState('#be185d');
  const [secondaryColor, setSecondaryColor] = useState('#1e1b4b');

  // Estados Globais de Dados
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<ProcedurePackage[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  // Inicialização do Sistema
  useEffect(() => {
    const init = async () => {
      try {
        if (!isSupabaseConfigured) {
          setIsInitializing(false);
          return;
        }

        const session = await api.getCurrentUser();
        if (session) {
          setCurrentUser(session);
          await loadAllData();
        }
      } catch (error: any) {
        setInitError(error.message);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [c, a, t, d] = await Promise.all([
        api.getClients(),
        api.getAppointments(),
        api.getTransactions(),
        api.getDeals()
      ]);
      setClients(c);
      setAppointments(a);
      setTransactions(t);
      setDeals(d);
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    await loadAllData();
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'logout') {
      handleLogout();
      return;
    }
    if (tabId.startsWith('settings:')) {
      const sub = tabId.split(':')[1];
      setActiveTab('settings');
      setActiveSubTab(sub);
    } else {
      setActiveTab(tabId);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#fffcfd] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em] animate-pulse">Sincronizando Sistema JM...</p>
      </div>
    );
  }

  // Tela de Erro Crítico / Configuração
  if (!isSupabaseConfigured && !currentUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-center">
        <div className="max-w-xl bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-rose-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-rose-500">
            <Database size={48} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">Conecte seu Banco de Dados</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10 px-4">
            O CRM da Dra. Jéssica Motta precisa do <strong>Supabase</strong> para salvar seus pacientes e prontuários com segurança.
          </p>
          
          <div className="space-y-4 text-left mb-10">
            <div className="flex items-start space-x-4 p-5 bg-white/5 rounded-2xl border border-white/5">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Key size={18} /></div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Como Configurar:</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Procure a aba <strong>Environment Variables</strong> ou <strong>Secrets</strong> no painel da sua plataforma e adicione as chaves:
                </p>
                <div className="mt-4 space-y-2 font-mono text-[10px]">
                  <p className="text-rose-400"><span className="text-slate-500">1.</span> SUPABASE_URL</p>
                  <p className="text-rose-400"><span className="text-slate-500">2.</span> SUPABASE_ANON_KEY</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-gradient-to-r from-rose-600 to-rose-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-rose-900/20"
          >
            Verificar Conexão Novamente
          </button>
          
          <p className="mt-8 text-[9px] font-black text-slate-600 uppercase tracking-widest">
            Desenvolvido para Produção • JM Estética v2.5
          </p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-[#fffcfd] flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-8">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-4">Erro de Comunicação</h2>
        <p className="text-sm text-red-600 font-bold mb-8 max-w-sm leading-relaxed">
          {initError}. <br/>
          <span className="text-slate-400 font-normal mt-2 block">Isso pode ser causado por uma URL do Supabase incorreta ou problemas na sua rede.</span>
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-12 py-5 bg-[#1e1b4b] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/20 hover:bg-[#be185d] transition-all"
        >
          Recarregar Sistema
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (isLoading && activeTab !== 'dashboard') {
       return (
         <div className="flex-1 flex flex-col items-center justify-center opacity-50">
           <RefreshCw className="animate-spin text-rose-500 mb-4" size={32} />
           <p className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">Carregando Módulos...</p>
         </div>
       );
    }

    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard transactions={transactions} clients={clients} appointments={appointments} />;
      case 'calendar': 
        return <CalendarView 
          appointments={appointments} 
          setAppointments={setAppointments} 
          clients={clients} 
          users={users} 
        />;
      case 'clients': 
        return <Clients 
          clients={clients} 
          setClients={setClients} 
        />;
      case 'analytics':
        return <ClientAnalytics 
          clients={clients} 
          appointments={appointments} 
          transactions={transactions} 
        />;
      case 'reports':
        return <OperationalReports 
          appointments={appointments} 
          users={users} 
        />;
      case 'funnel': 
        return <Funnel 
          clients={clients} 
          deals={deals} 
          setDeals={setDeals} 
        />;
      case 'finance': 
        return <Finance 
          transactions={transactions} 
          setTransactions={setTransactions} 
          packages={packages} 
          setPackages={setPackages}
          clients={clients}
        />;
      case 'chat': return <Chat />;
      case 'marketing': return <Marketing />;
      case 'suppliers': 
        return <Suppliers 
          suppliers={suppliers} 
          setSuppliers={setSuppliers} 
        />;
      case 'settings': 
        return <Settings 
          users={users} 
          setUsers={setUsers} 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          secondaryColor={secondaryColor}
          setSecondaryColor={setSecondaryColor}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />;
      default: return <Dashboard transactions={transactions} clients={clients} appointments={appointments} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      activeSubTab={activeSubTab}
      setActiveTab={handleTabChange} 
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
