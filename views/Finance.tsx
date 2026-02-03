
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, Plus, Download, 
  ArrowUpRight, ArrowDownRight, Package, FileText, CheckCircle2,
  AlertCircle, Clock, Calendar, X, Save, Search, Filter, Trash2, Edit2,
  User as UserIcon
} from 'lucide-react';
import { ProcedurePackage, Transaction, Client } from '../types';

interface FinanceProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  packages: ProcedurePackage[];
  setPackages: React.Dispatch<React.SetStateAction<ProcedurePackage[]>>;
  clients?: Client[]; 
}

const Finance: React.FC<FinanceProps> = ({ transactions, setTransactions, packages, setPackages, clients = [] }) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'payable' | 'receivable' | 'packages'>('flow');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Partial<Transaction> | null>(null);

  // Estados para Gestão de Pacotes
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<ProcedurePackage> | null>(null);

  const stats = [
    { label: 'Fluxo Mensal', value: `R$ ${transactions.reduce((acc, t) => t.type === 'INCOME' ? acc + t.value : acc, 0).toLocaleString('pt-BR')}`, icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Saídas Operacionais', value: `R$ ${transactions.reduce((acc, t) => t.type === 'EXPENSE' ? acc + t.value : acc, 0).toLocaleString('pt-BR')}`, icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Margem Líquida', value: 'R$ 62.050', icon: Wallet, color: 'text-[#1e1b4b]', bg: 'bg-rose-100/40' },
    { label: 'Ticket Médio', value: 'R$ 2.450', icon: TrendingUp, color: 'text-[#be185d]', bg: 'bg-rose-50' },
  ];

  const handleAddTransaction = () => {
    setEditingTransaction({
      description: '',
      value: 0,
      type: 'INCOME',
      category: 'Procedimento',
      date: new Date().toISOString().split('T')[0],
      status: 'PAID'
    });
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    const newTx: Transaction = {
      ...(editingTransaction as Transaction),
      id: `t-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Excluir este lançamento?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // Funções de Gerenciamento de Pacotes
  const handleAddPackage = () => {
    setEditingPackage({
      name: '',
      description: '',
      price: 0,
      sessions: 1,
      installments: 1
    });
    setIsPackageModalOpen(true);
  };

  const handleEditPackage = (pkg: ProcedurePackage) => {
    setEditingPackage(pkg);
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    
    if (editingPackage.id) {
      setPackages(prev => prev.map(p => p.id === editingPackage.id ? (editingPackage as ProcedurePackage) : p));
    } else {
      const newPkg: ProcedurePackage = {
        ...(editingPackage as ProcedurePackage),
        id: `pk-${Date.now()}`
      };
      setPackages(prev => [...prev, newPkg]);
    }
    setIsPackageModalOpen(false);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm('Excluir este pacote?')) {
      setPackages(prev => prev.filter(p => p.id !== id));
    }
  };

  const getClientName = (id?: string) => clients.find(c => c.id === id)?.name || 'Outros';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 bg-[#fffcfd]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-[#1e1b4b] uppercase">Gestão Financeira</h2>
          <p className="text-[#be185d] text-xs font-black uppercase tracking-[0.3em] mt-1">Controle de Fluxo e Rentabilidade JM</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-8 py-4 bg-white border border-rose-100 rounded-2xl hover:bg-rose-50 font-black text-xs uppercase tracking-widest transition-all text-[#1e1b4b] shadow-sm">
            <Download size={18} />
            <span>Extrair Relatório</span>
          </button>
          <button onClick={handleAddTransaction} className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-[#be185d] text-white rounded-2xl hover:shadow-xl hover:shadow-rose-300/30 transition-all active:scale-95 font-black text-xs uppercase tracking-widest">
            <Plus size={18} />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <p className="text-[#1e1b4b]/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-4xl font-black tracking-tighter text-[#1e1b4b]">{stat.value}</p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] border border-rose-100 shadow-sm overflow-hidden">
        <div className="flex bg-rose-50/30 p-2.5 border-b border-rose-100">
          {[
            { id: 'flow', label: 'Fluxo de Caixa' },
            { id: 'payable', label: 'Contas a Pagar' },
            { id: 'receivable', label: 'Contas a Receber' },
            { id: 'packages', label: 'Pacotes JM' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex-1 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl ${
                activeTab === tab.id
                  ? 'bg-rose-200/50 text-[#1e1b4b] shadow-sm' 
                  : 'text-[#1e1b4b]/40 hover:text-[#1e1b4b] hover:bg-rose-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-10 bg-[#fffcfd]">
          {(activeTab === 'flow' || activeTab === 'payable' || activeTab === 'receivable') && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-rose-100 bg-rose-50/50">
                    <th className="py-7 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">Data</th>
                    <th className="py-7 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">Descrição / Paciente</th>
                    <th className="py-7 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b] text-center">Categoria</th>
                    <th className="py-7 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">Valor</th>
                    <th className="py-7 px-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100/30">
                  {transactions.filter(t => activeTab === 'flow' ? true : activeTab === 'payable' ? t.type === 'EXPENSE' : t.type === 'INCOME').map(tx => (
                    <tr key={tx.id} className="group hover:bg-rose-50/30 transition-all duration-300">
                      <td className="py-8 px-8">
                        <span className="text-sm font-black text-[#1e1b4b]/40">
                          {new Date(tx.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="py-8 px-8">
                        <div className="flex items-center space-x-4">
                          {tx.clientId && (
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-xs border border-rose-200/50 shadow-sm shrink-0">
                              {getClientName(tx.clientId).charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-base font-black text-[#1e1b4b] uppercase tracking-tight leading-none">{tx.description}</p>
                            <p className="text-[10px] text-[#be185d] font-black uppercase tracking-widest mt-1.5 opacity-70">
                              {tx.paymentMethod || (tx.type === 'INCOME' ? 'Recebimento' : 'Pagamento')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-8 text-center">
                        <span className={`text-[9px] px-5 py-2 font-black uppercase tracking-[0.2em] rounded-full border shadow-sm ${
                          tx.type === 'INCOME' ? 'bg-green-50 text-green-700 border-green-200/50' : 'bg-rose-50 text-rose-600 border-rose-200/50'
                        }`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-8 px-8">
                        <span className={`font-black text-2xl tracking-tighter ${tx.type === 'INCOME' ? 'text-green-600' : 'text-[#be185d]'}`}>
                          {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.value.toLocaleString('pt-BR')}
                        </span>
                      </td>
                      <td className="py-8 px-8 text-right">
                        <button onClick={() => handleDeleteTransaction(tx.id)} className="p-3 text-rose-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText size={32} className="text-rose-200" />
                  </div>
                  <p className="text-[#1e1b4b]/30 text-xs font-black uppercase tracking-widest">Nenhum lançamento registrado</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
              {packages.map(pkg => (
                <div key={pkg.id} className="p-10 border border-rose-100 rounded-[3rem] bg-white hover:border-[#be185d] hover:shadow-2xl hover:shadow-rose-100 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rose-100/40 transition-all"></div>
                  <div className="absolute top-8 right-8 flex items-center space-x-2 z-10">
                    <button onClick={() => handleEditPackage(pkg)} className="p-2 text-rose-200 hover:text-[#be185d] transition-colors">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => handleDeletePackage(pkg.id)} className="p-2 text-rose-200 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="w-16 h-16 bg-rose-50 text-[#be185d] rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                    <Package size={32} />
                  </div>
                  <h4 className="font-black text-2xl text-[#1e1b4b] mb-3 uppercase tracking-tighter leading-tight">{pkg.name}</h4>
                  <p className="text-xs text-[#1e1b4b]/50 font-black uppercase tracking-widest leading-relaxed mb-8">{pkg.description}</p>
                  <div className="p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100">
                    <p className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.2em] mb-1">Ticket do Pacote</p>
                    <p className="text-3xl font-black text-[#1e1b4b] tracking-tighter">R$ {pkg.price.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleAddPackage}
                className="p-10 border-2 border-dashed border-rose-100 rounded-[3rem] bg-[#fffcfd] hover:bg-rose-50 hover:border-rose-300 transition-all flex flex-col items-center justify-center space-y-4 group"
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-rose-50 group-hover:scale-110 transition-transform">
                  <Plus size={32} className="text-[#be185d]" />
                </div>
                <span className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em]">Novo Pacote JM</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Transação */}
      {isModalOpen && editingTransaction && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#fffcfd] w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-300">
            <header className="p-10 border-b border-rose-100 flex items-center justify-between bg-rose-50/20">
              <div>
                <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight">Novo Lançamento</h3>
                <p className="text-[10px] font-black text-[#be185d] uppercase mt-1 tracking-[0.25em]">Fluxo de Caixa Clínica JM</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-rose-100 rounded-full text-[#1e1b4b]/30 transition-all">
                <X size={32} />
              </button>
            </header>
            
            <form onSubmit={handleSaveTransaction} className="p-12 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Descrição</label>
                  <input required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#be185d] transition-all font-black text-sm text-[#1e1b4b]" placeholder="Ex: Botox - Paciente Mariana" value={editingTransaction.description} onChange={e => setEditingTransaction({...editingTransaction, description: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Tipo</label>
                    <select className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b] appearance-none" value={editingTransaction.type} onChange={e => setEditingTransaction({...editingTransaction, type: e.target.value as any})}>
                      <option value="INCOME">Entrada (+)</option>
                      <option value="EXPENSE">Saída (-)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Valor (R$)</label>
                    <input type="number" required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b]" value={editingTransaction.value} onChange={e => setEditingTransaction({...editingTransaction, value: parseFloat(e.target.value)})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Data</label>
                    <input type="date" required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b]" value={editingTransaction.date} onChange={e => setEditingTransaction({...editingTransaction, date: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Categoria</label>
                    <input className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b]" placeholder="Ex: Botox, Aluguel..." value={editingTransaction.category} onChange={e => setEditingTransaction({...editingTransaction, category: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="pt-10 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 border-2 border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#1e1b4b]/30 hover:bg-rose-50 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-5 bg-[#1e1b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-900/20 hover:bg-[#be185d] transition-all">Efetivar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pacote (Edição/Criação) */}
      {isPackageModalOpen && editingPackage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#fffcfd] w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-300">
            <header className="p-10 border-b border-rose-100 flex items-center justify-between bg-rose-50/20">
              <div>
                <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight">
                  {editingPackage.id ? 'Editar Pacote' : 'Novo Pacote'}
                </h3>
                <p className="text-[10px] font-black text-[#be185d] uppercase mt-1 tracking-[0.25em]">Personalização de Combos JM</p>
              </div>
              <button onClick={() => setIsPackageModalOpen(false)} className="p-4 hover:bg-rose-100 rounded-full text-[#1e1b4b]/30 transition-all">
                <X size={32} />
              </button>
            </header>
            
            <form onSubmit={handleSavePackage} className="p-12 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Nome do Pacote</label>
                  <input required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#be185d] transition-all font-black text-sm text-[#1e1b4b]" placeholder="Ex: Combo Verão 360" value={editingPackage.name} onChange={e => setEditingPackage({...editingPackage, name: e.target.value})} />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Descrição</label>
                  <textarea rows={3} required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b] resize-none" placeholder="Detalhes do que está incluso..." value={editingPackage.description} onChange={e => setEditingPackage({...editingPackage, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Valor (R$)</label>
                    <input type="number" required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b]" value={editingPackage.price} onChange={e => setEditingPackage({...editingPackage, price: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Sessões</label>
                    <input type="number" required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b]" value={editingPackage.sessions} onChange={e => setEditingPackage({...editingPackage, sessions: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Parcelas</label>
                    <input type="number" required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b]" value={editingPackage.installments} onChange={e => setEditingPackage({...editingPackage, installments: parseInt(e.target.value)})} />
                  </div>
                </div>
              </div>

              <div className="pt-10 flex gap-4">
                <button type="button" onClick={() => setIsPackageModalOpen(false)} className="flex-1 py-5 border-2 border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#1e1b4b]/30 hover:bg-rose-50 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-5 bg-[#1e1b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-900/20 hover:bg-[#be185d] transition-all">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
