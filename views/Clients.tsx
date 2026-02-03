
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, MoreVertical, Phone, Edit2, Trash2, X, Save, 
  DollarSign, User, Globe, Stethoscope, PlusCircle, Clock, 
  Camera, Image as ImageIcon, CheckCircle, ShieldCheck, Loader2
} from 'lucide-react';
import { Client, ClinicalRecord, LeadSource } from '../types';
import { api } from '../services/api';

interface ClientsProps {
  clients: Client[];
  setClients: (clients: Client[] | ((prev: Client[]) => Client[])) => void;
}

type StatusFilter = 'ALL' | 'ACTIVE' | 'LEAD' | 'INACTIVE';

const Clients: React.FC<ClientsProps> = ({ clients, setClients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [showEvolutionForm, setShowEvolutionForm] = useState(false);
  const [newRecord, setNewRecord] = useState({ 
    procedure: '', 
    notes: '', 
    date: new Date().toISOString().split('T')[0],
    attachments: [] as string[]
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedClient) return;

    setIsUploading(true);
    try {
      // FIX: Added explicit type cast to File to resolve unknown type error during map
      const uploadPromises = Array.from(files).map(async (file: File) => {
        const path = `${selectedClient.id}/${Date.now()}-${file.name}`;
        return await api.uploadPhoto(file, path);
      });

      const urls = await Promise.all(uploadPromises);
      setNewRecord(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...urls]
      }));
    } catch (error) {
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    
    const clientToSave = {
      id: editingClient.id || crypto.randomUUID(),
      name: editingClient.name || '',
      cpf: editingClient.cpf || '',
      birthDate: editingClient.birthDate || '',
      phone: editingClient.phone || '',
      email: editingClient.email || '',
      address: editingClient.address || '',
      clinicalNotes: editingClient.clinicalNotes || '',
      clinicalHistory: editingClient.clinicalHistory || [],
      lgpdConsent: editingClient.lgpdConsent || false,
      status: editingClient.status || 'LEAD',
      source: editingClient.source || 'Instagram',
      tags: editingClient.tags || [],
      totalSpent: editingClient.totalSpent || 0,
      lgpdTimestamp: editingClient.lgpdConsent ? new Date().toISOString() : undefined,
    } as Client;

    try {
      await api.saveClient(clientToSave);
      setClients(prev => {
        const index = prev.findIndex(c => c.id === clientToSave.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = clientToSave;
          return next;
        }
        return [...prev, clientToSave];
      });
      setIsModalOpen(false);
    } catch (error) {
      alert('Erro ao salvar cliente.');
    }
  };

  const handleAddClinicalEvolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newRecord.procedure) return;

    const evolution: ClinicalRecord = {
      id: crypto.randomUUID(),
      date: newRecord.date,
      procedure: newRecord.procedure,
      notes: newRecord.notes,
      professionalName: 'Dra. Jéssica Motta',
      attachments: newRecord.attachments
    };

    const updatedHistory = [evolution, ...(selectedClient.clinicalHistory || [])];
    const updatedClient = { ...selectedClient, clinicalHistory: updatedHistory };
    
    try {
      await api.saveClient(updatedClient);
      setClients(prev => prev.map(c => c.id === selectedClient.id ? updatedClient : c));
      setSelectedClient(updatedClient);
      setNewRecord({ procedure: '', notes: '', date: new Date().toISOString().split('T')[0], attachments: [] });
      setShowEvolutionForm(false);
    } catch (error) {
      alert('Erro ao salvar evolução clínica.');
    }
  };

  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation();
    if (confirm('Remover permanentemente este cadastro?')) {
      try {
        await api.deleteClient(id);
        setClients(prev => prev.filter(c => c.id !== id));
        setOpenMenuId(null);
        if (selectedClient?.id === id) setIsDetailOpen(false);
      } catch (error) {
        alert('Erro ao remover cadastro.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-[#fffcfd]">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
        <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-4xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 group-focus-within:text-[#1e1b4b] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou CPF..." 
              className="w-full pl-12 pr-6 py-5 rounded-[2rem] bg-white border border-rose-100 outline-none shadow-sm font-black text-[#1e1b4b]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-rose-50 p-2 rounded-[1.8rem] border border-rose-100">
            {(['ALL', 'ACTIVE', 'LEAD'] as StatusFilter[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === opt ? 'bg-rose-200/50 text-[#1e1b4b]' : 'text-[#1e1b4b]/60'
                }`}
              >
                {opt === 'ALL' ? 'Todos' : opt === 'ACTIVE' ? 'Ativos' : 'Leads'}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => { setEditingClient({ name: '', status: 'LEAD', lgpdConsent: false }); setIsModalOpen(true); }} className="px-10 py-5 bg-gradient-to-r from-rose-400 to-[#be185d] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg">
          <Plus size={20} className="inline mr-2" /> Novo Paciente
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-rose-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-rose-100 bg-rose-50/50">
              <th className="px-10 py-7 text-[10px] font-black text-[#1e1b4b] uppercase tracking-[0.25em]">Paciente</th>
              <th className="px-10 py-7 text-[10px] font-black text-[#1e1b4b] uppercase tracking-[0.25em]">Status</th>
              <th className="px-10 py-7 text-[10px] font-black text-[#1e1b4b] uppercase tracking-[0.25em]">Investimento LTV</th>
              <th className="px-10 py-7"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100/30">
            {filteredClients.map((client) => (
              <tr key={client.id} onClick={() => { setSelectedClient(client); setIsDetailOpen(true); }} className="group cursor-pointer hover:bg-rose-50/50 transition-all">
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-xl border border-rose-200/50">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-base text-[#1e1b4b] tracking-tight">{client.name}</p>
                      <p className="text-[10px] font-bold text-[#1e1b4b]/40 uppercase mt-1">{client.cpf}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                    client.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <span className="font-black text-lg text-[#be185d] tracking-tighter">R$ {client.totalSpent?.toLocaleString('pt-BR') || '0,00'}</span>
                </td>
                <td className="px-10 py-8 text-right relative">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === client.id ? null : client.id); }} className="p-4 text-[#1e1b4b]/30 hover:text-[#be185d]"><MoreVertical size={24} /></button>
                  {openMenuId === client.id && (
                    <div ref={containerRef} className="absolute right-10 top-full mt-2 w-56 bg-white rounded-[2rem] shadow-2xl border border-rose-100 p-3 z-[100] animate-in zoom-in-95">
                      <button onClick={(e) => { e.stopPropagation(); setEditingClient(client); setIsModalOpen(true); }} className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-rose-50 text-xs font-black uppercase tracking-widest text-[#1e1b4b]">
                        <Edit2 size={16} className="text-rose-500" /> <span>Editar</span>
                      </button>
                      <button onClick={(e) => handleDelete(client.id, e)} className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-red-50 text-xs font-black uppercase tracking-widest text-red-600">
                        <Trash2 size={16} /> <span>Remover</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDetailOpen && selectedClient && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#fffcfd] w-full max-w-6xl h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col border border-rose-100 animate-in zoom-in-95">
            <header className="p-10 border-b border-rose-100/50 flex items-center justify-between bg-rose-50/20">
              <div className="flex items-center space-x-8">
                <div className="w-20 h-20 rounded-[2rem] bg-rose-100 text-[#1e1b4b] flex items-center justify-center text-4xl font-black">{selectedClient.name.charAt(0)}</div>
                <div>
                  <h3 className="text-3xl font-black text-[#1e1b4b] uppercase tracking-tighter leading-none">{selectedClient.name}</h3>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg">{selectedClient.cpf}</span>
                    {selectedClient.lgpdConsent && (
                      <div className="flex items-center text-green-600 text-[9px] font-black uppercase tracking-widest"><ShieldCheck size={14} className="mr-1" /> Consentimento LGPD Ativo</div>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-4 hover:bg-rose-100 rounded-full text-[#1e1b4b]/30"><X size={32} /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-6">
                  <div className="p-8 bg-rose-100/20 rounded-[2.5rem] border border-rose-100">
                    <h4 className="text-[10px] font-black uppercase text-[#be185d] tracking-widest mb-4">Investimento Acumulado</h4>
                    <p className="text-4xl font-black text-[#1e1b4b]">R$ {selectedClient.totalSpent?.toLocaleString('pt-BR') || '0,00'}</p>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-rose-100/30 pb-6">
                    <h4 className="text-xl font-black uppercase text-[#1e1b4b]">Prontuário Evolutivo</h4>
                    <button onClick={() => setShowEvolutionForm(!showEvolutionForm)} className="flex items-center space-x-2 px-6 py-3 bg-[#1e1b4b] text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-[#be185d] transition-all">
                      <PlusCircle size={18} /> <span>{showEvolutionForm ? 'Cancelar' : 'Nova Evolução'}</span>
                    </button>
                  </div>

                  {showEvolutionForm && (
                    <div className="p-8 bg-white border border-rose-100 rounded-[2.5rem] animate-in slide-in-from-top-4">
                      <form onSubmit={handleAddClinicalEvolution} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <input required type="date" className="w-full px-6 py-4 rounded-xl border border-rose-100 bg-[#fffcfd] font-black text-sm" value={newRecord.date} onChange={e => setNewRecord({...newRecord, date: e.target.value})} />
                          <input required type="text" placeholder="Procedimento" className="w-full px-6 py-4 rounded-xl border border-rose-100 bg-[#fffcfd] font-black text-sm" value={newRecord.procedure} onChange={e => setNewRecord({...newRecord, procedure: e.target.value})} />
                        </div>
                        <textarea required rows={3} placeholder="Notas da evolução..." className="w-full px-6 py-4 rounded-xl border border-rose-100 bg-[#fffcfd] font-black text-sm resize-none" value={newRecord.notes} onChange={e => setNewRecord({...newRecord, notes: e.target.value})} />
                        
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-[#be185d] tracking-widest flex items-center"><Camera size={14} className="mr-2"/> Fotos Antes & Depois</label>
                          <div className="flex flex-wrap gap-4">
                            {newRecord.attachments.map((img, i) => (
                              <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-rose-100 relative group">
                                <img src={img} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setNewRecord(prev => ({...prev, attachments: prev.attachments.filter((_, idx) => idx !== i)}))} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><Trash2 size={20}/></button>
                              </div>
                            ))}
                            <button 
                              type="button" 
                              disabled={isUploading}
                              onClick={() => fileInputRef.current?.click()} 
                              className="w-24 h-24 rounded-xl border-2 border-dashed border-rose-200 flex flex-col items-center justify-center text-rose-300 hover:text-[#be185d] hover:border-[#be185d] transition-all bg-rose-50/30 disabled:opacity-50"
                            >
                              {isUploading ? <Loader2 className="animate-spin" size={24} /> : <ImageIcon size={24} />}
                              <span className="text-[8px] font-black uppercase mt-1">{isUploading ? 'Enviando...' : 'Anexar'}</span>
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileUpload} />
                          </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#1e1b4b] to-[#be185d] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Efetivar no Histórico</button>
                      </form>
                    </div>
                  )}

                  <div className="space-y-6 pb-20">
                    {selectedClient.clinicalHistory?.map((history) => (
                      <div key={history.id} className="bg-white p-8 rounded-[2.5rem] border border-rose-50 shadow-sm relative pl-16">
                        <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-rose-100" />
                        <div className="absolute left-3.5 top-8 w-6 h-6 rounded-full bg-rose-500 border-4 border-white shadow-sm" />
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-[10px] font-black text-rose-500 uppercase bg-rose-50 px-3 py-1 rounded-lg">{new Date(history.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                           <span className="text-[10px] font-black text-[#1e1b4b]/30 uppercase">{history.professionalName}</span>
                        </div>
                        <h5 className="text-base font-black text-[#1e1b4b] uppercase mb-2">{history.procedure}</h5>
                        <p className="text-sm font-bold text-[#1e1b4b]/60 italic mb-6">"{history.notes}"</p>
                        
                        {history.attachments && history.attachments.length > 0 && (
                          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {history.attachments.map((img, idx) => (
                              <img key={idx} src={img} className="w-32 h-32 rounded-2xl object-cover border border-rose-100 flex-shrink-0 cursor-zoom-in hover:scale-105 transition-transform" onClick={() => window.open(img, '_blank')} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95">
            <header className="p-10 border-b border-rose-100 flex items-center justify-between bg-rose-50/20">
              <h3 className="text-3xl font-black text-[#1e1b4b] uppercase tracking-tighter">{editingClient.id ? 'Editar Cadastro' : 'Novo Paciente'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-[#1e1b4b]/30"><X size={32} /></button>
            </header>
            <form onSubmit={handleSave} className="p-12 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-widest ml-1">Nome Completo</label>
                  <input required className="w-full px-6 py-4 rounded-2xl border border-rose-100 bg-[#fffcfd] font-black text-sm" value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-widest ml-1">CPF</label>
                  <input required className="w-full px-6 py-4 rounded-2xl border border-rose-100 bg-[#fffcfd] font-black text-sm" value={editingClient.cpf} onChange={e => setEditingClient({...editingClient, cpf: e.target.value})} />
                </div>
              </div>

              <div className="p-8 bg-rose-50/50 rounded-[2rem] border border-rose-100 space-y-4">
                 <label className="flex items-center space-x-4 cursor-pointer group">
                   <input 
                     type="checkbox" 
                     className="w-6 h-6 rounded-lg border-rose-200 text-rose-600 focus:ring-rose-500 transition-all cursor-pointer" 
                     checked={editingClient.lgpdConsent}
                     onChange={e => setEditingClient({...editingClient, lgpdConsent: e.target.checked})}
                   />
                   <div>
                     <p className="text-xs font-black text-[#1e1b4b] uppercase tracking-tight">Consentimento LGPD Ativo</p>
                     <p className="text-[10px] text-[#1e1b4b]/40 font-bold leading-tight">Autoriza o processamento de dados sensíveis e histórico clínico para fins de tratamento estético.</p>
                   </div>
                 </label>
              </div>

              <div className="flex gap-6 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 border-2 border-rose-100 rounded-2xl font-black text-[10px] uppercase text-[#1e1b4b]/30">Cancelar</button>
                <button type="submit" className="flex-1 py-5 bg-[#1e1b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-900/10 hover:bg-[#be185d] transition-all">Efetivar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
