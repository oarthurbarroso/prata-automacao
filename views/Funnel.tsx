
import React, { useState } from 'react';
import { Plus, MoreHorizontal, DollarSign, Clock, Sparkles, Filter, X, Save, Trash2, Edit2, User } from 'lucide-react';
import { FUNNEL_STAGES } from '../constants';
import { getSmartInsights } from '../services/gemini';
import { Client, Deal } from '../types';

interface FunnelProps {
  clients: Client[];
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
}

const Funnel: React.FC<FunnelProps> = ({ clients, deals, setDeals }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Partial<Deal> | null>(null);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const dataSummary = `Funil com ${deals.length} oportunidades. Valor total: R$ ${deals.reduce((acc, d) => acc + d.value, 0).toLocaleString('pt-BR')}.`;
    const res = await getSmartInsights(dataSummary);
    setInsight(res || '');
    setLoadingInsight(false);
  };

  const handleAddDeal = (stageId: string = 'new') => {
    setEditingDeal({
      title: '',
      clientId: clients[0]?.id || '',
      value: 0,
      stageId: stageId,
      expectedCloseDate: new Date().toISOString().split('T')[0],
      label: 'Novo'
    });
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = (id: string) => {
    if (confirm('Deseja remover esta oportunidade do funil?')) {
      setDeals(prev => prev.filter(d => d.id !== id));
      if (editingDeal?.id === id) setIsModalOpen(false);
    }
  };

  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    if (editingDeal.id) {
      setDeals(prev => prev.map(d => d.id === editingDeal.id ? (editingDeal as Deal) : d));
    } else {
      const newDeal: Deal = {
        ...(editingDeal as Deal),
        id: `d-${Date.now()}`
      };
      setDeals(prev => [...prev, newDeal]);
    }
    setIsModalOpen(false);
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Cliente Desconhecido';

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 bg-[#fffcfd]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-[#1e1b4b] uppercase">Pipeline Comercial</h2>
          <p className="text-[#be185d] text-[10px] font-black uppercase tracking-[0.3em] mt-1">Gestão de Oportunidades e Fechamentos</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={fetchInsight}
            className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-sm ${
              loadingInsight || insight 
                ? 'bg-rose-200/50 text-[#1e1b4b] border border-rose-200' 
                : 'bg-rose-50 text-[#be185d] border border-rose-100 hover:bg-rose-100'
            }`}
          >
            <Sparkles size={18} />
            <span>{loadingInsight ? 'Analisando...' : 'Insights Estratégicos IA'}</span>
          </button>
          <button onClick={() => handleAddDeal()} className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-[#be185d] text-white rounded-2xl hover:shadow-xl hover:shadow-rose-300/30 transition-all font-black text-xs uppercase tracking-widest active:scale-95">
            <Plus size={18} />
            <span>Novo Negócio</span>
          </button>
        </div>
      </div>

      {insight && (
        <div className="bg-rose-50 text-[#1e1b4b] p-10 rounded-[3rem] border border-rose-100 shadow-sm relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[#be185d]"><Sparkles size={120} /></div>
          <div className="relative z-10 flex items-start space-x-8">
            <div className="p-4 bg-white rounded-2xl text-[#be185d] shadow-sm border border-rose-100">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#be185d] mb-3">Consultoria de Vendas Dra. IA</p>
              <p className="text-base font-bold leading-relaxed text-[#1e1b4b] italic">"{insight}"</p>
              <button onClick={() => setInsight('')} className="mt-6 text-[9px] font-black uppercase tracking-widest border-b border-rose-200 hover:border-[#be185d] transition-all pb-1">Descartar Insight</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto pb-6 -mx-6 px-6 custom-scrollbar">
        <div className="flex h-full min-w-max space-x-8">
          {FUNNEL_STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stageId === stage.id);
            const stageTotal = stageDeals.reduce((acc, d) => acc + d.value, 0);
            
            return (
              <div key={stage.id} className="w-[360px] flex flex-col h-full bg-white rounded-[3rem] border border-rose-100 overflow-hidden shadow-sm">
                {/* Cabeçalho da Coluna - Navy sobre Rosa Leve (Regra 7) */}
                <div className="p-8 border-b border-rose-100/50 bg-rose-50/50 sticky top-0 z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3.5 h-3.5 rounded-full ${stage.color} shadow-sm border-2 border-white`} />
                      <h3 className="font-black text-[11px] uppercase tracking-[0.25em] text-[#1e1b4b]">{stage.title}</h3>
                    </div>
                    <span className="text-[10px] font-black bg-rose-200/50 text-[#1e1b4b] px-4 py-1.5 rounded-full shadow-sm border border-rose-200/20">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-[#1e1b4b]/40 uppercase tracking-widest">Ticket Total</span>
                    <span className="text-base font-black text-[#be185d] tracking-tighter">R$ {stageTotal.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-[500px] bg-[#fffcfd]/50">
                  {stageDeals.map(deal => (
                    <div 
                      key={deal.id} 
                      onClick={() => handleEditDeal(deal)}
                      className="bg-white p-7 rounded-[2.5rem] border border-rose-100/60 group hover:border-[#be185d] hover:shadow-2xl hover:shadow-rose-100 transition-all duration-500 cursor-pointer relative animate-in zoom-in-95"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center space-x-3">
                          {/* Círculo de iniciais (Regra 2) */}
                          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-sm border border-rose-200/50 shadow-sm group-hover:scale-110 transition-transform">
                            {getClientName(deal.clientId).charAt(0)}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border ${
                            deal.label === 'Urgente' ? 'bg-rose-500 text-white border-rose-400' :
                            deal.label === 'Quente' ? 'bg-orange-400 text-white border-orange-300' : 
                            deal.label === 'Novo' ? 'bg-rose-100 text-[#be185d] border-rose-200' : 'bg-green-100 text-green-800 border-green-200'
                          }`}>
                            {deal.label}
                          </span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteDeal(deal.id); }} className="p-2 text-rose-200 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h4 className="font-black text-base mb-1 text-[#1e1b4b] group-hover:text-[#be185d] transition-colors uppercase tracking-tight leading-tight">{deal.title}</h4>
                      <p className="text-[11px] text-[#1e1b4b]/60 font-black uppercase tracking-widest mb-6">{getClientName(deal.clientId)}</p>
                      
                      <div className="space-y-4 pt-5 border-t border-rose-100/50">
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black uppercase tracking-widest text-[#1e1b4b]/30">Valor Estimado</span>
                           <div className="flex items-center font-black text-[#be185d] text-sm tracking-tighter">
                            <DollarSign size={14} className="mr-0.5" />
                            {deal.value.toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black uppercase tracking-widest text-[#1e1b4b]/30">Previsão de Fechamento</span>
                           <div className="flex items-center text-[#1e1b4b] font-black text-[10px] uppercase tracking-tighter bg-rose-50 px-3 py-1 rounded-lg">
                            <Clock size={12} className="mr-1.5 text-[#be185d]" />
                            {new Date(deal.expectedCloseDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => handleAddDeal(stage.id)}
                    className="w-full py-8 border-2 border-dashed border-rose-100 rounded-[2.5rem] text-[#be185d]/30 hover:text-[#be185d] hover:bg-rose-50 hover:border-rose-300 transition-all flex flex-col items-center justify-center space-y-3 group"
                  >
                    <div className="p-3 bg-white rounded-full shadow-sm border border-rose-50 group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Adicionar Oportunidade</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Gestão de Oportunidades */}
      {isModalOpen && editingDeal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#fffcfd] w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-rose-100">
            <header className="p-10 border-b border-rose-100 flex items-center justify-between bg-rose-50/20">
              <div>
                <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight leading-none">
                  {editingDeal.id ? 'Gerenciar Negócio' : 'Novo Pipeline'}
                </h3>
                <p className="text-[10px] font-black text-[#be185d] uppercase mt-2 tracking-[0.25em]">Fluxo Comercial Avançado</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-rose-100 rounded-full transition-all text-[#1e1b4b]/30">
                <X size={32} />
              </button>
            </header>
            
            <form onSubmit={handleSaveDeal} className="p-12 space-y-8">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Título da Proposta</label>
                  <input required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#be185d] transition-all font-black text-sm text-[#1e1b4b]" placeholder="Ex: Pacote Verão Botox + Preenchimento" value={editingDeal.title} onChange={e => setEditingDeal({...editingDeal, title: e.target.value})} />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Paciente Alvo</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" />
                    <select 
                      className="w-full pl-12 pr-5 py-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#be185d] transition-all font-black text-sm text-[#1e1b4b] appearance-none"
                      value={editingDeal.clientId}
                      onChange={e => setEditingDeal({...editingDeal, clientId: e.target.value})}
                    >
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Valor Almejado (R$)</label>
                    <input type="number" required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#be185d] transition-all font-black text-sm text-[#1e1b4b]" value={editingDeal.value} onChange={e => setEditingDeal({...editingDeal, value: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Data Estimada</label>
                    <input type="date" required className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#be185d] transition-all font-black text-sm text-[#1e1b4b]" value={editingDeal.expectedCloseDate} onChange={e => setEditingDeal({...editingDeal, expectedCloseDate: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Prioridade Comercial</label>
                  <div className="flex gap-3">
                    {(['Novo', 'Quente', 'Urgente', 'Fidelizado'] as const).map((lbl) => (
                      <button 
                        key={lbl}
                        type="button"
                        onClick={() => setEditingDeal({...editingDeal, label: lbl})}
                        className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                          editingDeal.label === lbl 
                            ? 'bg-rose-200/50 text-[#1e1b4b] border-[#be185d]' 
                            : 'bg-white text-[#1e1b4b]/40 border-rose-100 hover:bg-rose-50'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-10 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 border-2 border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all text-[#1e1b4b]/30"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-[#1e1b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-900/20 transition-all active:scale-95 flex items-center justify-center space-x-3 hover:bg-[#be185d]"
                >
                  <Save size={18} />
                  <span>Efetivar Dados</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funnel;
