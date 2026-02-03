
import React, { useState } from 'react';
import { 
  User as UserIcon, Shield, Palette, 
  Trash2, Save, Plus, Camera, Lock, X, RefreshCw
} from 'lucide-react';
import { User } from '../types';
import Logo from '../components/Logo';

interface SettingsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  users, setUsers, currentUser, setCurrentUser,
  primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor,
  activeSubTab, setActiveSubTab
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: <UserIcon size={18} /> },
    { id: 'employees', label: 'Equipe', icon: <Shield size={18} /> },
    { id: 'appearance', label: 'Aparência', icon: <Palette size={18} /> }
  ];

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
    alert('Perfil atualizado com sucesso!');
  };

  const handleAddEmployee = () => {
    setEditingUser({ name: '', role: 'ATTENDANT', email: '', active: true });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const newUser: User = {
      ...(editingUser as User),
      id: `u-${Date.now()}`,
      active: true,
      avatar: `https://picsum.photos/id/${Math.floor(Math.random()*100)}/100/100`
    };
    setUsers(prev => [...prev, newUser]);
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Remover este colaborador da equipe?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const resetAppearance = () => {
    setPrimaryColor('#be185d');
    setSecondaryColor('#1e1b4b');
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 animate-in fade-in slide-in-from-left-4 duration-700 bg-[#fffcfd]">
      <aside className="w-full md:w-80 space-y-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`w-full flex items-center space-x-4 p-5 rounded-2xl transition-all duration-300 group border ${
              activeSubTab === tab.id 
                ? 'bg-rose-200/50 text-[#1e1b4b] border-rose-300 shadow-sm' 
                : 'bg-white text-[#1e1b4b]/40 border-rose-100 hover:bg-rose-50 hover:text-[#1e1b4b]'
            }`}
          >
            <div className={`p-2 rounded-lg transition-colors ${activeSubTab === tab.id ? 'bg-white text-[#be185d]' : 'bg-rose-50 text-[#be185d]/40 group-hover:bg-[#be185d] group-hover:text-white'}`}>
              {tab.icon}
            </div>
            <span className="font-black text-xs uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </aside>

      <div className="flex-1 bg-white rounded-[3rem] border border-rose-100 shadow-sm p-12">
        {activeSubTab === 'profile' && currentUser && (
          <form onSubmit={handleUpdateProfile} className="space-y-12 max-w-3xl">
            <div className="border-b border-rose-100 pb-8">
              <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight">Meu Perfil Profissional</h3>
              <p className="text-[10px] font-black text-[#be185d] uppercase mt-1 tracking-widest">Informações de Acesso JM</p>
            </div>
            
            <div className="flex items-center space-x-10">
              <div className="relative w-32 h-32 rounded-[2.5rem] border-4 border-rose-100 overflow-hidden shadow-sm">
                <img src={currentUser.avatar} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <div>
                <p className="font-black text-2xl text-[#1e1b4b] uppercase tracking-tighter">{currentUser.name}</p>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">{currentUser.role} • {currentUser.specialty || 'Estética Avançada'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#be185d] uppercase tracking-widest ml-1">Nome de Exibição</label>
                <input required className="w-full p-5 rounded-2xl border border-rose-100 bg-[#fffcfd] outline-none font-black text-sm text-[#1e1b4b] focus:ring-4 focus:ring-rose-500/10 transition-all" value={currentUser.name} onChange={e => setCurrentUser({...currentUser, name: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#be185d] uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <input required type="email" className="w-full p-5 rounded-2xl border border-rose-100 bg-[#fffcfd] outline-none font-black text-sm text-[#1e1b4b] focus:ring-4 focus:ring-rose-500/10 transition-all" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} />
              </div>
            </div>
            
            <button type="submit" className="flex items-center space-x-3 px-10 py-5 bg-[#1e1b4b] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#be185d] transition-all shadow-xl shadow-rose-900/10">
              <Save size={20} /><span>Salvar Perfil</span>
            </button>
          </form>
        )}

        {activeSubTab === 'employees' && (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-rose-100 pb-8">
              <div>
                <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight">Equipe JM Clínica</h3>
                <p className="text-[10px] font-black text-[#be185d] uppercase mt-1 tracking-widest">Colaboradores e Permissões</p>
              </div>
              <button onClick={handleAddEmployee} className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-[#be185d] text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-rose-200 hover:scale-105 transition-transform">
                <Plus size={18} /><span>Novo Membro</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {users.map(user => (
                <div key={user.id} className="p-8 bg-white border border-rose-100 rounded-[2.5rem] flex items-center justify-between hover:shadow-xl hover:shadow-rose-100/50 transition-all group">
                   <div className="flex items-center space-x-5">
                     {user.avatar ? (
                       <img src={user.avatar} className="w-16 h-16 rounded-2xl border-2 border-rose-50 object-cover shadow-sm" alt="" />
                     ) : (
                       /* Círculo de iniciais em Rosa Suave - Regra 2 */
                       <div className="w-16 h-16 rounded-2xl bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-xl border border-rose-200/50">
                         {user.name.charAt(0)}
                       </div>
                     )}
                     <div>
                       <p className="font-black text-base text-[#1e1b4b] uppercase tracking-tight leading-none">{user.name}</p>
                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-2">{user.role}</p>
                     </div>
                   </div>
                   <button onClick={() => handleDeleteUser(user.id)} className="p-4 bg-rose-50 text-rose-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                     <Trash2 size={20} />
                   </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'appearance' && (
          <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-rose-100 pb-8">
              <div>
                <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight">Identidade Visual</h3>
                <p className="text-[10px] font-black text-[#be185d] uppercase mt-1 tracking-widest">Personalização de Marca JM</p>
              </div>
              <button 
                onClick={resetAppearance}
                className="flex items-center space-x-2 px-6 py-3 text-[#1e1b4b]/40 hover:text-[#be185d] transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <RefreshCw size={14} />
                <span>Resetar Padrão</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase text-[#1e1b4b]/40 tracking-[0.2em]">Visualização do Logo</label>
                  <div className="p-12 bg-rose-50/20 rounded-[3rem] border border-rose-100 flex flex-col items-center justify-center space-y-6">
                     <Logo primaryColor={primaryColor} secondaryColor={secondaryColor} size={140} />
                     <div className="text-center">
                       <h4 className="font-black text-2xl text-[#1e1b4b] uppercase tracking-tighter">Dra. Jéssica Motta</h4>
                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mt-1">CRM Integrado</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-10 bg-white border border-rose-100 rounded-[3rem] space-y-8 shadow-sm">
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#1e1b4b]/50 tracking-widest">Cor Principal</span>
                      <span className="text-[10px] font-mono font-black text-rose-500">{primaryColor.toUpperCase()}</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-rose-50 p-1 bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 p-5 rounded-2xl border border-rose-100 bg-[#fffcfd] outline-none font-black text-sm uppercase text-[#1e1b4b]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#1e1b4b]/50 tracking-widest">Cor de Contraste</span>
                      <span className="text-[10px] font-mono font-black text-[#1e1b4b]">{secondaryColor.toUpperCase()}</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="color" 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-rose-50 p-1 bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 p-5 rounded-2xl border border-rose-100 bg-[#fffcfd] outline-none font-black text-sm uppercase text-[#1e1b4b]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && editingUser && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#fffcfd] w-full max-w-md rounded-[3.5rem] p-12 border border-rose-100 shadow-2xl animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-center mb-10">
                 <div>
                   <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight">Novo Membro</h3>
                   <p className="text-[10px] font-black text-[#be185d] uppercase tracking-widest mt-1">Equipe Clínica JM</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-rose-50 rounded-full text-[#1e1b4b]/30 transition-all"><X size={32} /></button>
               </div>
               <form onSubmit={handleSaveUser} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-[#be185d] tracking-widest ml-1">Nome Completo</label>
                    <input required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none font-black text-[#1e1b4b] text-sm focus:ring-4 focus:ring-rose-500/10 transition-all" placeholder="Ex: Julia Santos" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-[#be185d] tracking-widest ml-1">Função Operacional</label>
                    <select className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none font-black text-[#1e1b4b] text-sm appearance-none" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}>
                      <option value="ATTENDANT">Atendimento / Recepção</option>
                      <option value="FINANCE">Gestão Financeira</option>
                      <option value="SALES">Consultoria de Vendas</option>
                      <option value="ADMIN">Administrador Geral</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-5 bg-[#1e1b4b] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-rose-900/10 hover:bg-[#be185d] transition-all active:scale-95">Efetivar Cadastro</button>
               </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
