
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, Brush, Sector, Rectangle,
  ReferenceLine
} from 'recharts';
import { 
  Users, TrendingUp, Heart, ShoppingBag, Sparkles, 
  ArrowUpRight, Download, Filter, MousePointer2, ZoomIn, Info
} from 'lucide-react';
import { Client, Appointment, Transaction } from '../types';
import { getSmartInsights } from '../services/gemini';

interface ClientAnalyticsProps {
  clients: Client[];
  appointments: Appointment[];
  transactions: Transaction[];
}

const COLORS = ['#be185d', '#1e1b4b', '#4338ca', '#db2777', '#f43f5e', '#312e81'];

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#fffcfd] border border-rose-100 p-5 rounded-[1.5rem] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase text-[#be185d] tracking-[0.2em]">{label}</p>
          <Info size={12} className="text-[#be185d] opacity-50" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#1e1b4b] shadow-[0_0_10px_rgba(30,27,75,0.2)]"></div>
          <p className="text-xl font-black text-[#1e1b4b] tracking-tighter">
            {prefix}{payload[0].value.toLocaleString('pt-BR')}{suffix}
          </p>
        </div>
        {payload[0].payload.clients !== undefined && (
          <div className="mt-3 pt-3 border-t border-rose-100">
            <p className="text-[10px] font-black text-[#1e1b4b]/60 uppercase tracking-widest flex items-center">
              <Users size={10} className="mr-2" />
              {payload[0].payload.clients} Pacientes Atendidos
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#1e1b4b" className="font-black text-sm uppercase tracking-tighter">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 15}
        outerRadius={outerRadius + 18}
        fill={fill}
        opacity={0.3}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} strokeWidth={2} fill="none" />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#be185d" className="text-xs font-black uppercase tracking-widest">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#1e1b4b" className="text-[10px] font-bold">
        {`R$ ${value.toLocaleString('pt-BR')}`}
      </text>
    </g>
  );
};

const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({ clients, appointments, transactions }) => {
  const [insight, setInsight] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePieIndex, setActivePieIndex] = useState(0);
  const [isPieLocked, setIsPieLocked] = useState(false);

  const onPieEnter = (_: any, index: number) => {
    if (!isPieLocked) setActivePieIndex(index);
  };

  const onPieClick = (_: any, index: number) => {
    setActivePieIndex(index);
    setIsPieLocked(!isPieLocked);
  };

  // Data Memos
  const ageData = useMemo(() => {
    const now = new Date();
    const groups = { 'Sub 25': 0, '25-35': 0, '36-45': 0, '46-60': 0, '60+': 0 };
    clients.forEach(c => {
      const birth = new Date(c.birthDate);
      let age = now.getFullYear() - birth.getFullYear();
      if (age < 25) groups['Sub 25']++;
      else if (age <= 35) groups['25-35']++;
      else if (age <= 45) groups['36-45']++;
      else if (age <= 60) groups['46-60']++;
      else groups['60+']++;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [clients]);

  const procedureData = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach(a => { counts[a.procedure] = (counts[a.procedure] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [appointments]);

  const spendingTiers = useMemo(() => {
    const tiers = { 'Novos': 0, 'Recorrentes': 0, 'Fidelizados': 0, 'VIPs': 0 };
    clients.forEach(c => {
      if (c.totalSpent < 1000) tiers['Novos']++;
      else if (c.totalSpent < 3000) tiers['Recorrentes']++;
      else if (c.totalSpent < 5000) tiers['Fidelizados']++;
      else tiers['VIPs']++;
    });
    return Object.entries(tiers).map(([name, value]) => ({ name, value }));
  }, [clients]);

  const timeSeriesData = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (59 - i));
      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        value: 2000 + Math.floor(Math.random() * 8000),
        clients: Math.floor(Math.random() * 12)
      };
    });
  }, []);

  const handleAISuggestions = async () => {
    setIsAnalyzing(true);
    const context = `Análise de Pacientes: ${clients.length} totais. Top procedimentos: ${procedureData.map(d => d.name).join(', ')}. LTV Médio: R$ ${(clients.reduce((acc, c) => acc + c.totalSpent, 0) / clients.length || 0).toFixed(2)}`;
    const res = await getSmartInsights(context);
    setInsight(res || 'Erro ao gerar análise.');
    setIsAnalyzing(false);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm group hover:-translate-y-1 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="p-4 bg-rose-50 text-[#be185d] rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-indigo-900/5">
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-600 font-black text-[10px] bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-green-100/50">
            <TrendingUp size={12} />
            <span> trend: {trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-[#1e1b4b]/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
      <p className="text-4xl font-black text-[#1e1b4b] tracking-tighter">{value}</p>
      <p className="text-[10px] text-[#be185d] font-bold mt-2 uppercase tracking-widest opacity-80">{subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 bg-[#fffcfd]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-[#1e1b4b] uppercase">Inteligência Estratégica</h2>
          <p className="text-[#be185d] text-xs font-black uppercase tracking-[0.2em] mt-1">Dados Exploratórios e Análise Preditiva</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleAISuggestions}
            disabled={isAnalyzing}
            className="flex items-center space-x-3 px-8 py-4 bg-rose-50 text-[#be185d] border border-rose-100 rounded-2xl hover:bg-[#be185d] hover:text-white transition-all font-black text-xs uppercase tracking-[0.15em] shadow-sm disabled:opacity-50"
          >
            <Sparkles size={18} />
            <span>{isAnalyzing ? 'Processando IA...' : 'Análise Preditiva IA'}</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#1e1b4b] to-[#be185d] text-white rounded-2xl hover:shadow-xl shadow-indigo-900/10 transition-all font-black text-xs uppercase tracking-[0.15em] active:scale-95">
            <Download size={18} />
            <span>Extrair Relatório</span>
          </button>
        </div>
      </div>

      {insight && (
        <div className="bg-rose-50 text-[#1e1b4b] p-10 rounded-[3rem] border border-rose-100 shadow-xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[#be185d]"><Sparkles size={140} /></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
               <div className="p-3 bg-white rounded-xl text-[#be185d] shadow-sm">
                 <Sparkles size={20} />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#be185d]">Executive Insight by Dra. IA</h4>
            </div>
            <div className="text-base font-bold leading-relaxed whitespace-pre-line text-[#1e1b4b]">
              {insight}
            </div>
            <button onClick={() => setInsight('')} className="mt-8 text-[9px] font-black uppercase tracking-widest border-b border-rose-200 hover:border-[#be185d] transition-all pb-1">Fechar Análise</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="LTV Médio (Ticket)" value={`R$ ${(clients.reduce((acc, c) => acc + c.totalSpent, 0) / clients.length || 0).toLocaleString('pt-BR')}`} subtitle="Fidelidade Financeira" icon={TrendingUp} trend="+12%" />
        <StatCard title="Captação Mensal" value={clients.filter(c => c.status === 'ACTIVE').length} subtitle="Novos Pacientes" icon={Users} trend="+18" />
        <StatCard title="Nível de Engajamento" value="Excepcional" subtitle="Interatividade de Dados" icon={MousePointer2} />
        <StatCard title="Recorrência Clínica" value="79%" subtitle="Índice de Retenção" icon={ShoppingBag} trend="+3%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pirâmide Etária Interativa */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase flex items-center">
              Perfil por Faixa Etária
              <MousePointer2 size={16} className="ml-3 text-[#be185d] animate-bounce" />
            </h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#1e1b4b]/40">Passe o mouse para detalhes</span>
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#be185d" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#1e1b4b', fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#1e1b4b', fontSize: 10, fontWeight: 900 }} />
                <Tooltip content={<CustomTooltip suffix=" Pacientes" />} cursor={{ fill: 'rgba(190, 24, 93, 0.05)' }} />
                <Bar 
                  dataKey="value" 
                  fill="#be185d" 
                  radius={[12, 12, 0, 0]} 
                  barSize={55}
                  activeBar={<Rectangle fill="#1e1b4b" stroke="#be185d" strokeWidth={3} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking de Procedimentos Dinâmico */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <h3 className="text-xl font-black mb-10 tracking-tight text-[#1e1b4b] uppercase">TOP Procedimentos</h3>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={procedureData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#be185d" opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  width={140}
                  tick={{ fill: '#1e1b4b', fontSize: 10, fontWeight: 900 }} 
                />
                <Tooltip content={<CustomTooltip suffix=" Procedimentos" />} cursor={{ fill: 'rgba(30, 27, 75, 0.05)' }} />
                <Bar 
                  dataKey="value" 
                  fill="#1e1b4b" 
                  radius={[0, 12, 12, 0]} 
                  barSize={32}
                  activeBar={<Rectangle fill="#be185d" stroke="#1e1b4b" strokeWidth={3} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LTV Tiers com Interatividade de Drill-Down */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase">Segmentação Financeira (LTV)</h3>
            {/* Botão de filtro ativo conforme regra 3 */}
            <button 
              onClick={() => setIsPieLocked(false)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isPieLocked ? 'bg-rose-200/50 text-[#1e1b4b] shadow-sm' : 'text-[#1e1b4b]/40 hover:text-[#be185d]'}`}
            >
              {isPieLocked ? 'Desbloquear Foco' : 'Clique para focar'}
            </button>
          </div>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  {...({
                    activeIndex: activePieIndex,
                    activeShape: renderActiveShape,
                    data: spendingTiers, 
                    cx: "50%", 
                    cy: "50%", 
                    innerRadius: 90, 
                    outerRadius: 125, 
                    paddingAngle: 8, 
                    dataKey: "value",
                    stroke: "none",
                    onMouseEnter: onPieEnter,
                    onClick: onPieClick,
                  } as any)}
                >
                  {spendingTiers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolução Temporal com Zoom (Brush) Premium */}
        <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase flex items-center">
              Evolução e Zoom Temporal
              <ZoomIn size={18} className="ml-3 text-[#1e1b4b]" />
            </h3>
            <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-[#1e1b4b]/40">
              <span className="w-2 h-2 rounded-full bg-[#be185d]"></span>
              <span>Faturamento Diário</span>
            </div>
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#be185d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#be185d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#be185d" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#1e1b4b', fontSize: 9, fontWeight: 900 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#1e1b4b', fontSize: 9, fontWeight: 900 }} 
                />
                <Tooltip content={<CustomTooltip prefix="R$ " />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#be185d" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={1500}
                />
                <ReferenceLine y={5000} label={{ position: 'right', value: 'Meta Diária', fill: '#be185d', fontSize: 10, fontWeight: 900 }} stroke="#be185d" strokeDasharray="3 3" opacity={0.3} />
                <Brush 
                  dataKey="date" 
                  height={40} 
                  stroke="#1e1b4b" 
                  fill="rgba(190, 24, 93, 0.05)" 
                  className="rounded-xl"
                  travellerWidth={15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAnalytics;
