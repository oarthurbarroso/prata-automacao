
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, ComposedChart, Line, Rectangle
} from 'recharts';
import { 
  Calendar, Users, Clock, AlertTriangle, Sparkles, 
  Download, Filter, ChevronDown, CheckCircle, XCircle, 
  Activity, TrendingUp, RefreshCw, Info
} from 'lucide-react';
import { Appointment, User } from '../types';
import { getSmartInsights } from '../services/gemini';

interface OperationalReportsProps {
  appointments: Appointment[];
  users: User[];
}

const COLORS = ['#be185d', '#fb7185', '#fda4af', '#fecdd3', '#1e1b4b', '#4338ca'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#fffcfd] border border-rose-100 p-4 rounded-2xl shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black uppercase text-[#be185d] tracking-[0.2em] mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <p className="text-xs font-black text-[#1e1b4b]">
              {entry.name}: <span className="text-[#be185d]">{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const OperationalReports: React.FC<OperationalReportsProps> = ({ appointments, users }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');

  const occupancyMetrics = useMemo(() => {
    const totalSlots = 30 * 14; 
    const filledSlots = appointments.length;
    const rate = (filledSlots / totalSlots) * 100;
    
    const canceled = appointments.filter(a => a.status === 'CANCELED').length;
    const completed = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED').length;
    
    return {
      rate: rate.toFixed(1),
      canceled,
      completed,
      noShow: Math.floor(canceled * 0.2) 
    };
  }, [appointments]);

  const professionalData = useMemo(() => {
    return users.map(user => {
      const userApps = appointments.filter(a => a.professionalId === user.id);
      return {
        name: user.name.split(' ')[0],
        total: userApps.length,
        completed: userApps.filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED').length,
        canceled: userApps.filter(a => a.status === 'CANCELED').length
      };
    });
  }, [appointments, users]);

  const statusData = useMemo(() => {
    const counts = { 
      'Concluídos': appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED').length,
      'Cancelados': appointments.filter(a => a.status === 'CANCELED').length,
      'Agendados': appointments.filter(a => a.status === 'SCHEDULED').length
    };
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  const trendData = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      day: i + 1,
      agendamentos: 5 + Math.floor(Math.random() * 10),
      efetivacao: 4 + Math.floor(Math.random() * 8)
    }));
  }, []);

  const handleGenerateAIReport = async () => {
    setIsAnalyzing(true);
    const context = `
      Relatório Operacional da Clínica:
      Total de agendamentos: ${appointments.length}.
      Taxa de ocupação: ${occupancyMetrics.rate}%.
      Agendamentos concluídos: ${occupancyMetrics.completed}.
      Agendamentos cancelados: ${occupancyMetrics.canceled}.
      Profissionais mais produtivos: ${professionalData.map(p => `${p.name} (${p.total})`).join(', ')}.
    `;
    const res = await getSmartInsights(context);
    setAiReport(res || 'Erro ao gerar análise.');
    setIsAnalyzing(false);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`p-4 bg-rose-50 text-[#be185d] rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className="px-4 py-1.5 bg-rose-200/50 rounded-full border border-rose-200/20">
           <span className="text-[9px] font-black uppercase text-[#1e1b4b] tracking-widest">Indicador Mensal</span>
        </div>
      </div>
      <h3 className="text-[#1e1b4b]/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1 relative z-10">{title}</h3>
      <p className="text-4xl font-black text-[#1e1b4b] tracking-tighter relative z-10">{value}</p>
      <p className="text-[10px] text-[#be185d] font-bold mt-2 uppercase tracking-widest relative z-10">{subtitle}</p>
      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/20 rounded-full blur-3xl -mr-8 -mt-8"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 bg-[#fffcfd]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-[#1e1b4b] uppercase">Relatórios Operacionais</h2>
          <p className="text-[#be185d] text-xs font-black uppercase tracking-[0.2em] mt-1">Eficiência da Agenda e Fluxo de Pacientes</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleGenerateAIReport}
            disabled={isAnalyzing}
            className="flex items-center space-x-3 px-8 py-4 bg-rose-50 text-[#be185d] border border-rose-100 rounded-2xl hover:bg-[#be185d] hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-sm disabled:opacity-50"
          >
            <Sparkles size={18} />
            <span>{isAnalyzing ? 'Processando IA...' : 'Análise Narrativa IA'}</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#1e1b4b] to-[#be185d] text-white rounded-2xl hover:shadow-xl shadow-indigo-900/10 transition-all font-black text-xs uppercase tracking-widest active:scale-95">
            <Download size={18} />
            <span>Gerar PDF</span>
          </button>
        </div>
      </div>

      {aiReport && (
        <div className="bg-rose-50 text-[#1e1b4b] p-10 rounded-[3rem] border border-rose-100 shadow-xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[#be185d]"><Sparkles size={140} /></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
               <div className="p-3 bg-white rounded-xl text-[#be185d] shadow-sm border border-rose-100">
                 <Sparkles size={20} />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#be185d]">Executive Briefing by Dra. IA</h4>
            </div>
            <div className="text-base font-bold leading-relaxed whitespace-pre-line text-[#1e1b4b]">
              {aiReport}
            </div>
            <button onClick={() => setAiReport('')} className="mt-8 text-[9px] font-black uppercase tracking-widest border-b-2 border-rose-200 hover:border-[#be185d] transition-all pb-1">Ocultar Análise</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Taxa de Ocupação" value={`${occupancyMetrics.rate}%`} subtitle="Otimização da Agenda" icon={Activity} />
        <StatCard title="Total Atendimentos" value={appointments.length} subtitle="Volume Mensal Bruto" icon={Calendar} />
        <StatCard title="Cancelamentos" value={occupancyMetrics.canceled} subtitle="Índice de Evasão" icon={XCircle} />
        <StatCard title="Taxa de No-Show" value={`${((occupancyMetrics.noShow / (appointments.length || 1)) * 100).toFixed(1)}%`} subtitle="Perda Operacional" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Produtividade por Profissional */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase flex items-center">
              Ranking de Produtividade
              <TrendingUp size={16} className="ml-3 text-[#be185d]" />
            </h3>
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#be185d]"></div>
                 <span className="text-[9px] font-black text-[#1e1b4b]/50 uppercase tracking-widest">Concluídos</span>
               </div>
               <div className="flex items-center space-x-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-200"></div>
                 <span className="text-[9px] font-black text-[#1e1b4b]/50 uppercase tracking-widest">Cancelados</span>
               </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionalData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#be185d" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#1e1b4b', fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#1e1b4b', fontSize: 10, fontWeight: 900 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(190, 24, 93, 0.03)' }} />
                <Bar 
                  dataKey="completed" 
                  name="Concluídos" 
                  fill="#be185d" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24} 
                  activeBar={<Rectangle fill="#1e1b4b" stroke="#be185d" strokeWidth={2} />}
                />
                <Bar 
                  dataKey="canceled" 
                  name="Cancelados" 
                  fill="#fecdd3" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24} 
                  activeBar={<Rectangle fill="#fda4af" stroke="#be185d" strokeWidth={1} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolução Diária da Agenda */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase">Evolução de Atendimentos</h3>
            <div className="flex items-center space-x-2 text-[9px] font-black uppercase text-[#1e1b4b]/40 tracking-[0.2em]">
              <div className="w-2 h-2 rounded-full bg-[#be185d]"></div>
              <span>Meta Diária Estimada</span>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#be185d" opacity={0.1} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#1e1b4b', fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#1e1b4b', fontSize: 10, fontWeight: 900 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="agendamentos" 
                  name="Total Agendados"
                  fill="#fff1f2" 
                  stroke="#be185d" 
                  fillOpacity={1} 
                  strokeWidth={2}
                />
                <Bar 
                  dataKey="agendamentos" 
                  name="Volume"
                  barSize={15} 
                  fill="#be185d" 
                  opacity={0.1}
                  radius={[4, 4, 0, 0]} 
                />
                <Line 
                  type="monotone" 
                  dataKey="efetivacao" 
                  name="Efetivados"
                  stroke="#1e1b4b" 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: '#1e1b4b', stroke: '#fff', strokeWidth: 2 }} 
                  activeDot={{ r: 8 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown (Donut) */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <h3 className="text-xl font-black mb-10 tracking-tight text-[#1e1b4b] uppercase text-center">Saúde da Agenda</h3>
          <div className="h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={120}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  iconType="circle" 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value) => <span className="text-[10px] font-black uppercase text-[#1e1b4b] tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-black text-[#1e1b4b] tracking-tighter">{appointments.length}</span>
               <span className="text-[9px] font-black uppercase text-[#be185d] tracking-widest">Total</span>
            </div>
          </div>
        </div>

        {/* Resumo de Metas Operacionais */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm flex flex-col justify-center space-y-10">
           <div className="space-y-8">
              <div className="group">
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-[#be185d] tracking-widest">Ocupação Clínica</span>
                  <span className="text-xs font-black text-[#1e1b4b]">{occupancyMetrics.rate}% / 100%</span>
                </div>
                <div className="w-full h-4 bg-rose-50 rounded-full overflow-hidden border border-rose-100 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1e1b4b] to-[#be185d] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(Number(occupancyMetrics.rate), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-[#be185d] tracking-widest opacity-60">Meta de Retenção</span>
                  <span className="text-xs font-black text-[#1e1b4b]">75% Alçado</span>
                </div>
                <div className="w-full h-4 bg-rose-50 rounded-full overflow-hidden border border-rose-100 shadow-inner">
                  <div 
                    className="h-full bg-rose-200 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-rose-50">
                 <div className="flex items-start space-x-4">
                   <div className="p-3 bg-rose-50 text-[#be185d] rounded-2xl shrink-0">
                     <Info size={18} />
                   </div>
                   <p className="text-sm font-black text-[#1e1b4b]/70 leading-relaxed italic border-l-4 border-rose-200 pl-4 py-1">
                     "A performance clínica atual reflete uma alta demanda por novos procedimentos. Recomenda-se a otimização de horários ociosos via IA."
                   </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalReports;
