
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Phone, Mail, 
  User, Star, Calendar, Trash2, Edit2, 
  X, Save, MoreVertical, Briefcase, 
  Package, Truck, Globe, MapPin
} from 'lucide-react';
import { Supplier } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, setSuppliers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Partial<Supplier> | null>(null);

  const categories = ['Todos', 'Toxinas', 'Preenchedores', 'Equipamentos', 'Descartáveis', 'Outros'];

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingSupplier({
      name: '',
      category: 'Outros',
      contactPerson: '',
      phone: '',
      email: '',
      rating: 5
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja remover este fornecedor?')) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;

    if (editingSupplier.id) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? (editingSupplier as Supplier) : s));
    } else {
      const newSupplier: Supplier = {
        ...(editingSupplier as Supplier),
        id: `s-${Date.now()}`
      };
      setSuppliers(prev => [...prev, newSupplier]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 bg-[#fffcfd]">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-[#1e1b4b] uppercase leading-none">Rede de Fornecedores</h2>
          <p className="text-[#be185d] text-xs font-black uppercase tracking-[0.3em] mt-3">Gestão de Insumos e Parcerias JM</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-[#be185d] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar fornecedor..." 
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-rose-100/50 focus:border-[#be185d] focus:ring-4 focus:ring-rose-500/10 outline-none text-sm font-black text-[#1e1b4b] placeholder:text-[#1e1b4b]/30 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button onClick={handleOpenAdd} className="w-full md:w-auto flex items-center justify-center space-x-2 px-10 py-4 bg-gradient-to-r from-rose-400 to-[#be185d] text-white rounded-2xl hover:shadow-xl hover:shadow-rose-300/30 transition-all active:scale-95 font-black text-xs uppercase tracking-widest">
            <Plus size={20} />
            <span>Novo Parceiro</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              categoryFilter === cat
                ? 'bg-rose-200/50 text-[#1e1b4b] border-rose-300 shadow-sm'
                : 'bg-white text-[#1e1b4b]/40 border-rose-100 hover:bg-rose-50 hover:text-[#1e1b4b]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] border border-rose-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              {/* Cabeçalho Navy sobre Fundo Rosado - Regra 7 */}
              <tr className="border-b border-rose-100 bg-rose-50/50">
                <th className="py-7 px-10 text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">Fornecedor / Categoria</th>
                <th className="py-7 px-10 text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">Contato Direto</th>
                <th className="py-7 px-10 text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">Rating</th>
                <th className="py-7 px-10 text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">Último Pedido</th>
                <th className="py-7 px-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100/30">
              {filteredSuppliers.map(supplier => (
                <tr key={supplier.id} className="group hover:bg-rose-50/30 transition-all duration-300">
                  <td className="py-8 px-10">
                    <div className="flex items-center space-x-5">
                      {/* Círculo de Iniciais em Rosa Suave - Regra 2 */}
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-xl border border-rose-200/50 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        {supplier.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-[#1e1b4b] uppercase tracking-tight leading-none">{supplier.name}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-rose-50 text-[#be185d] text-[9px] font-black uppercase tracking-widest rounded-lg border border-rose-200/30">
                          {supplier.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <div className="space-y-1.5">
                      <p className="text-sm font-black text-[#1e1b4b] flex items-center">
                        <User size={14} className="mr-2 text-rose-300" /> {supplier.contactPerson}
                      </p>
                      <p className="text-[10px] font-black text-[#1e1b4b]/40 uppercase tracking-widest flex items-center">
                        <Phone size={12} className="mr-2 text-rose-300" /> {supplier.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < Math.floor(supplier.rating) ? 'text-[#be185d] fill-[#be185d]' : 'text-rose-100 fill-rose-100'} 
                        />
                      ))}
                      <span className="ml-2 text-xs font-black text-[#1e1b4b]">{supplier.rating}</span>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    {supplier.lastOrder ? (
                      <div className="flex items-center text-[#1e1b4b] font-black text-xs uppercase tracking-tight bg-rose-50 px-4 py-2 rounded-xl w-fit border border-rose-100/50">
                        <Calendar size={14} className="mr-2 text-[#be185d]" />
                        {new Date(supplier.lastOrder + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-[#1e1b4b]/20 uppercase">Nenhum pedido</span>
                    )}
                  </td>
                  <td className="py-8 px-10 text-right">
                    <div className="flex justify-end items-center space-x-3">
                      <button onClick={() => handleOpenEdit(supplier)} className="p-3 text-rose-200 hover:text-[#be185d] hover:bg-rose-50 rounded-xl transition-all">
                        <Edit2 size={20} />
                      </button>
                      <button onClick={() => handleDelete(supplier.id)} className="p-3 text-rose-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSuppliers.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                <Truck size={32} className="text-rose-200" />
              </div>
              <p className="text-[#1e1b4b]/30 text-xs font-black uppercase tracking-widest">Nenhum parceiro encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cadastro/Edição - Off-White Quente (Regra 4) */}
      {isModalOpen && editingSupplier && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#fffcfd] w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-300">
            <header className="p-10 border-b border-rose-100 flex items-center justify-between bg-rose-50/20">
              <div>
                <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight">
                  {editingSupplier.id ? 'Editar Parceiro' : 'Novo Fornecedor'}
                </h3>
                <p className="text-[10px] font-black text-[#be185d] uppercase mt-2 tracking-[0.25em]">Cadeia de Suprimentos JM</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-rose-100 rounded-full text-[#1e1b4b]/30 transition-all">
                <X size={32} />
              </button>
            </header>
            
            <form onSubmit={handleSave} className="p-12 space-y-8">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Nome da Empresa</label>
                  <input 
                    required 
                    className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#be185d] transition-all font-black text-sm text-[#1e1b4b]" 
                    placeholder="Ex: Allergan Aesthetics" 
                    value={editingSupplier.name} 
                    onChange={e => setEditingSupplier({...editingSupplier, name: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Categoria</label>
                    <select 
                      className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b] appearance-none"
                      value={editingSupplier.category}
                      onChange={e => setEditingSupplier({...editingSupplier, category: e.target.value as any})}
                    >
                      {categories.filter(c => c !== 'Todos').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">Pessoa de Contato</label>
                    <input 
                      required 
                      className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#be185d] transition-all font-black text-sm text-[#1e1b4b]" 
                      placeholder="Ex: Carlos Silva" 
                      value={editingSupplier.contactPerson} 
                      onChange={e => setEditingSupplier({...editingSupplier, contactPerson: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">WhatsApp / Telefone</label>
                    <input 
                      required 
                      className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b]" 
                      placeholder="Ex: 11 99999-0000" 
                      value={editingSupplier.phone} 
                      onChange={e => setEditingSupplier({...editingSupplier, phone: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#be185d] uppercase tracking-[0.3em] ml-1">E-mail Corporativo</label>
                    <input 
                      required 
                      type="email"
                      className="w-full p-5 rounded-2xl border border-rose-100 bg-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-black text-sm text-[#1e1b4b]" 
                      placeholder="Ex: vendas@empresa.com" 
                      value={editingSupplier.email} 
                      onChange={e => setEditingSupplier({...editingSupplier, email: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 border-2 border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#1e1b4b]/30 hover:bg-rose-50 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-5 bg-[#1e1b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-900/20 hover:bg-[#be185d] transition-all">Efetivar Cadastro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
