
import React, { useMemo } from 'react';
import { Megaphone, Plus, BarChart3, Users, Send, Calendar, Sparkles, Target, Zap, MessageSquare, Bell, Clock, Globe, Share2, MousePointer2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend, PieChart, Pie
} from 'recharts';
import { MOCK_CLIENTS } from '../constants';
import { LeadSource } from '../types';

const COLORS = ['#be185d', '#1e1b4b', '#4338ca', '#db2777', '#f43f5e', '#6366f1', '#06b6d4'];

const Marketing = () => {
  const campaigns = [
    { id: 1, name: 'Lembretes Automáticos 24h', status: 'Ativa', sent: 124, opens: 118, type: 'WhatsApp API' },
    { id: 2, name: 'Reativação de Leads (30d)', status: 'Ativa', sent: 45, opens: 32, type: 'WhatsApp API' },
    { id: 3, name: 'Promoção Verão Botox', status: 'Enviada', sent: 850, opens: 620, type: 'WhatsApp API' },
  ];

  // Cálculo de conversão por origem
  const sourceAnalytics = useMemo(() => {
    const sources: LeadSource[] = ['Instagram', 'Facebook', 'Google Ads', 'Website', 'Indicação', 'WhatsApp', 'Outros'];
    return sources.map(source => {
      const sourceClients = MOCK_CLIENTS.filter(c => c.source === source);
      const total = sourceClients.length;
      const converted = sourceClients.filter(c => c.status === 'ACTIVE').length;
      const rate = total > 0 ? (converted / total) * 100 : 0;
      return {
        name: source,
        total,
        converted,
        rate: parseFloat(rate.toFixed(1))
      };
    }).filter(s => s.total > 0);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 bg-[#fffcfd] pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-[#1e1b4b] uppercase">Marketing Estratégico</h2>
          <p className="text-[#be185d] text-xs font-black uppercase tracking-[0.2em] mt-1">Rastreamento de Leads e Conversão por Canal</p>
        </div>
        <button className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-[#1e1b4b] to-[#be185d] text-white rounded-2xl hover:shadow-xl hover:shadow-rose-300/30 transition-all font-black text-xs uppercase tracking-widest active:scale-95">
          <Plus size={20} />
          <span>Nova Campanha IA</span>
        </button>
      </div>

      {/* Seção de Análise de Origem de Leads - Regra 4 e 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribuição de Origens */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase flex items-center">
              Origem dos Novos Leads
              <Globe size={18} className="ml-3 text-rose-500" />
            </h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#1e1b4b]/40">Total de Leads: {MOCK_CLIENTS.length}</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceAnalytics}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="total"
                  stroke="none"
                >
                  {sourceAnalytics.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(190,24,93,0.05)', backgroundColor: '#fffcfd' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-[10px] font-black uppercase text-[#1e1b4b] tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taxa de Conversão por Canal */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase flex items-center">
              Eficiência de Conversão (%)
              <Target size={18} className="ml-3 text-[#be185d]" />
            </h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#1e1b4b]/40">Por canal de aquisição</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceAnalytics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#be185d" opacity={0.1} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  tick={{ fill: '#1e1b4b', fontSize: 10, fontWeight: 900 }} 
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Taxa de Conversão']}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fffcfd', color: '#1e1b4b' }}
                />
                <Bar 
                  dataKey="rate" 
                  fill="#be185d" 
                  radius={[0, 10, 10, 0]} 
                  barSize={20}
                >
                  {sourceAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner de Automação com Regra 2 para Iniciais */}
        <div className="bg-gradient-to-br from-[#1e1b4b] to-[#be185d] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform"><MessageSquare size={120} /></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/10 rounded-xl"><Bell size={20} /></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Automação 24h</h3>
            </div>
            <p className="text-3xl font-black tracking-tighter mb-1">95.2%</p>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-6 text-rose-200">Taxa de Confirmação Via WhatsApp</p>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1e1b4b] bg-rose-100 text-[#1e1b4b] flex items-center justify-center text-[10px] font-black shadow-sm">
                    {i === 1 ? 'A' : i === 2 ? 'M' : 'J'}
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-80">+48 Confirmados Hoje</span>
            </div>
          </div>
        </div>

        {[
          { label: 'Disparos Mensais', value: '12.482', icon: Zap, color: 'bg-rose-50 text-[#1e1b4b]', change: '+15%' },
          { label: 'Conversão de Leads', value: `${(MOCK_CLIENTS.filter(c => c.status === 'ACTIVE').length / MOCK_CLIENTS.length * 100).toFixed(1)}%`, icon: Target, color: 'bg-rose-100/50 text-[#be185d]', change: '78%' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border border-rose-100 shadow-sm group">
            <div className="flex items-center justify-between mb-8">
              <div className={`p-4 ${stat.color} rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <span className="text-green-600 text-[10px] font-black bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-green-100/50">{stat.change}</span>
            </div>
            <p className="text-[#1e1b4b]/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-[#1e1b4b] tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-rose-100 shadow-sm overflow-hidden">
        {/* Cabeçalho Navy sobre Fundo Rosado - Regra 7 */}
        <div className="p-10 border-b border-rose-100 flex items-center justify-between bg-rose-50/20">
          <div className="flex items-center space-x-3">
            <Sparkles size={20} className="text-[#be185d]" />
            <h3 className="font-black text-sm uppercase tracking-[0.2em] text-[#1e1b4b]">Motor de Disparo Automático</h3>
          </div>
          {/* Botão de Filtro Ativo conforme Regra 3 */}
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-green-700 bg-rose-200/50 px-6 py-2.5 rounded-full border border-rose-200/30">
            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
            <span>Status: Operação Ativa</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              {/* Tabela Header - Regra 7 */}
              <tr className="border-b border-rose-100 bg-rose-50/50">
                <th className="px-10 py-7 text-[10px] font-black uppercase text-[#1e1b4b] tracking-[0.25em]">Campanha / Automação</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-[#1e1b4b] tracking-[0.25em]">Tipo</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-[#1e1b4b] tracking-[0.25em]">Status</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-[#1e1b4b] tracking-[0.25em]">Performance (Envios/Cliques)</th>
                <th className="px-10 py-7"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-rose-50/30 transition-all group">
                  <td className="px-10 py-8">
                    <p className="font-black text-sm text-[#1e1b4b] uppercase tracking-tight">{camp.name}</p>
                    <p className="text-[10px] font-bold text-[#1e1b4b]/40 mt-1 uppercase tracking-widest flex items-center">
                      <Clock size={10} className="mr-1.5 text-[#be185d]" /> Disparo: 24h antes da consulta
                    </p>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-xs font-black text-[#be185d] uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                      {camp.type}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                      camp.status === 'Ativa' ? 'bg-green-50 text-green-700 border-green-200/50' : 'bg-rose-50 text-rose-600 border-rose-200/50'
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-10">
                      <div>
                        <p className="text-base font-black text-[#1e1b4b]">{camp.sent}</p>
                        <p className="text-[9px] font-black text-[#1e1b4b]/30 uppercase tracking-widest">Envios</p>
                      </div>
                      <div className="border-l border-rose-100 pl-10">
                        <p className="text-base font-black text-[#be185d]">{Math.round((camp.opens/camp.sent)*100)}%</p>
                        <p className="text-[9px] font-black text-[#1e1b4b]/30 uppercase tracking-widest">Conversão</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-4 bg-rose-50 text-[#be185d] rounded-2xl hover:bg-[#1e1b4b] hover:text-white transition-all shadow-sm active:scale-95">
                      <Send size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
