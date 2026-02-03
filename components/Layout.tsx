
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, ListTodo, Megaphone, 
  Settings, LogOut, Menu, X, Briefcase, Calendar, 
  Wallet, BarChart2, PieChart, ChevronDown, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { MOCK_USERS } from '../constants';
import Logo from './Logo';

interface SubItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: (id?: string) => void;
  collapsed: boolean;
  subItems?: SubItem[];
  expanded?: boolean;
  onToggleExpand?: () => void;
  currentActiveTab?: string;
  currentActiveSubTab?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  id, icon, label, active, onClick, collapsed, subItems, expanded, onToggleExpand, 
  currentActiveTab, currentActiveSubTab 
}) => {
  const hasSubItems = subItems && subItems.length > 0;
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => {
          if (hasSubItems && !collapsed && onToggleExpand) {
            onToggleExpand();
          }
          onClick(id);
        }}
        className={`flex items-center w-full p-3.5 rounded-2xl transition-all duration-300 relative group ${
          active && (!hasSubItems || collapsed)
            ? 'bg-rose-200/50 text-[#1e1b4b] shadow-sm' 
            : 'text-[#1e1b4b]/60 hover:bg-rose-50 hover:text-[#1e1b4b]'
        } ${collapsed ? 'justify-center' : 'justify-between'}`}
        title={collapsed ? label : ''}
      >
        <div className="flex items-center space-x-3">
          <div className={`${collapsed ? 'scale-110' : ''} transition-transform duration-300`}>
            {icon}
          </div>
          {!collapsed && (
            <span className="font-black text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              {label}
            </span>
          )}
        </div>
        
        {!collapsed && hasSubItems && (
          <div className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={16} />
          </div>
        )}

        {collapsed && active && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#be185d] rounded-l-full" />
        )}
      </button>

      {!collapsed && hasSubItems && expanded && (
        <div className="ml-4 pl-4 border-l border-rose-100 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-300">
          {subItems.map(sub => {
            const isSubActive = currentActiveTab === id && currentActiveSubTab === sub.id.split(':')[1];
            return (
              <button
                key={sub.id}
                onClick={() => onClick(sub.id)}
                className={`flex items-center w-full p-2.5 rounded-lg text-xs font-black transition-all ${
                  isSubActive
                    ? 'text-[#be185d] bg-rose-50'
                    : 'text-[#1e1b4b]/40 hover:text-[#1e1b4b] hover:bg-rose-50/50'
                }`}
              >
                <div className="mr-3 opacity-70">{sub.icon}</div>
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  activeSubTab?: string;
  setActiveTab: (tab: string) => void;
  primaryColor?: string;
  secondaryColor?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, activeSubTab, setActiveTab, primaryColor, secondaryColor 
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const isSidebarExpanded = isHovered || !collapsed;

  const toggleExpand = (id: string) => {
    const next = new Set(expandedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedItems(next);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'calendar', label: 'Agenda', icon: <Calendar size={20} /> },
    { id: 'clients', label: 'Pacientes', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Inteligência Estratégica', icon: <BarChart2 size={20} /> },
    { id: 'reports', label: 'Relatórios Operacionais', icon: <PieChart size={20} /> },
    { id: 'funnel', label: 'Funil de Vendas', icon: <ListTodo size={20} /> },
    { id: 'finance', label: 'Financeiro', icon: <Wallet size={20} /> },
    { id: 'chat', label: 'WhatsApp Chat', icon: <MessageSquare size={20} /> },
    { id: 'marketing', label: 'Marketing IA', icon: <Megaphone size={20} /> },
    { id: 'suppliers', label: 'Fornecedores', icon: <Briefcase size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen flex transition-all duration-500 bg-[#fffcfd] text-[#1e1b4b]">
      <aside 
        onMouseEnter={() => collapsed && setIsHovered(true)}
        onMouseLeave={() => collapsed && setIsHovered(false)}
        className={`hidden md:flex flex-col border-r transition-all duration-500 ease-in-out relative z-30 ${
          isSidebarExpanded ? 'w-72' : 'w-24'
        } border-rose-100 bg-white/80 shadow-[10px_0_30px_rgba(190,24,93,0.02)]`}
      >
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-4 top-10 w-8 h-8 rounded-full border shadow-sm flex items-center justify-center transition-all z-40 bg-white border-rose-100 text-[#be185d] hover:bg-rose-50`}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>

        <div className={`p-6 flex items-center ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
          {isSidebarExpanded ? (
            <div className="flex items-center space-x-3 overflow-hidden animate-in fade-in duration-500">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-rose-50">
                <Logo primaryColor={primaryColor} secondaryColor={secondaryColor} size={32} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-[#1e1b4b] truncate leading-tight">Dra. Jéssica Motta</span>
                <span className="text-[10px] text-rose-500 font-black truncate uppercase tracking-widest">Estética Avançada</span>
              </div>
            </div>
          ) : (
            <div className="p-2 bg-white rounded-xl mx-auto shadow-sm border border-rose-50 hover:rotate-12 transition-transform cursor-pointer">
              <Logo primaryColor={primaryColor} secondaryColor={secondaryColor} size={36} />
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {menuItems.map(item => (
            <SidebarItem 
              key={item.id}
              {...item}
              active={activeTab === item.id}
              onClick={(id?: string) => setActiveTab(id || item.id)}
              collapsed={!isSidebarExpanded}
              expanded={expandedItems.has(item.id)}
              onToggleExpand={() => toggleExpand(item.id)}
              currentActiveTab={activeTab}
              currentActiveSubTab={activeSubTab}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-rose-100">
           <SidebarItem 
             id="logout"
             icon={<LogOut size={20} />} 
             label="Encerrar Sessão" 
             active={false} 
             onClick={() => window.location.reload()} 
             collapsed={!isSidebarExpanded} 
           />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className="h-20 flex items-center justify-between px-8 border-b transition-colors duration-500 bg-white/90 border-rose-100 backdrop-blur-md">
          <div className="flex items-center">
            <button onClick={() => setMobileOpen(true)} className="md:hidden mr-4 p-2 rounded-lg bg-rose-50">
              <Menu size={24} className="text-[#1e1b4b]" />
            </button>
            <div className="hidden md:block">
              <h1 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase flex items-center space-x-3">
                <div className="p-2 bg-rose-50 rounded-lg mr-2">
                  {menuItems.find(m => m.id === activeTab)?.icon}
                </div>
                <span>{menuItems.find(m => m.id === activeTab)?.label || activeTab}</span>
              </h1>
            </div>
            <span className="md:hidden text-lg font-black text-[#be185d]">JM CRM</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 pl-6 border-l border-rose-100">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-[#1e1b4b]">{MOCK_USERS[0].name}</p>
                <p className="text-[10px] text-rose-500 uppercase font-black tracking-widest">{MOCK_USERS[0].role}</p>
              </div>
              <div className="relative cursor-pointer group">
                <img src={MOCK_USERS[0].avatar} className="w-10 h-10 rounded-xl border-2 border-[#be185d] shadow-sm transition-transform group-hover:scale-110" alt="Avatar" />
                <div className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 transition-all duration-500 bg-[#fffcfd]">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <Logo size={40} />
              <button onClick={() => setMobileOpen(false)} className="p-2 bg-rose-50 rounded-lg">
                <X size={24} className="text-[#be185d]" />
              </button>
            </div>
            <nav className="space-y-4">
              {menuItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                  className={`flex items-center w-full p-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    activeTab === item.id ? 'bg-rose-100 text-[#be185d]' : 'text-[#1e1b4b]/60 hover:bg-rose-50'
                  }`}
                >
                  <span className="mr-4">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Layout;
