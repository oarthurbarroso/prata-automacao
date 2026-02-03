
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, Activity, CalendarCheck } from 'lucide-react';
import { Transaction, Client, Appointment } from '../types';

const data = [
  { name: 'Jan', sales: 4200, leads: 2800 },
  { name: 'Fev', sales: 3800, leads: 1900 },
  { name: 'Mar', sales: 5100, leads: 4200 },
  { name: 'Abr', sales: 4900, leads: 3100 },
  { name: 'Mai', sales: 5800, leads: 4500 },
  { name: 'Jun', sales: 6200, leads: 5100 },
];

const pieData = [
  { name: 'Botox', value: 45 },
  { name: 'Preenchimento', value: 25 },
  { name: 'Limpeza de Pele', value: 15 },
  { name: 'Laser', value: 15 },
];

const COLORS = ['#be185d', '#fb7185', '#fda4af', '#fecdd3'];

const StatCard = ({ title, value, change, icon: Icon }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-rose-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className="p-4 rounded-2xl bg-rose-50 text-[#be185d] shadow-sm">
        <Icon size={28} />
      </div>
      <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-[10px] font-black ${change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        <span>{change > 0 ? '+' : ''}{change}%</span>
        <ArrowUpRight size={14} className={change < 0 ? 'rotate-90' : ''} />
      </div>
    </div>
    <h3 className="text-[#be185d] text-[11px] font-black uppercase tracking-[0.2em] relative z-10 mb-2">{title}</h3>
    <p className="text-4xl font-black tracking-tighter text-[#1e1b4b] relative z-10">{value}</p>
  </div>
);

interface DashboardProps {
  transactions: Transaction[];
  clients: Client[];
  appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, clients, appointments }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Leads Captados" value="1.842" change={18.4} icon={Users} />
        <StatCard title="Taxa de Conversão" value="28.4%" change={5.2} icon={Target} />
        <StatCard title="Faturamento Bruto" value="R$ 68.450" change={12.1} icon={DollarSign} />
        <StatCard title="Agendamentos" value="124" change={-1.4} icon={CalendarCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico Principal */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-rose-100 relative">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-[#1e1b4b] uppercase">Fluxo de Performance Clínica</h3>
            <div className="flex space-x-6">
               <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full bg-[#be185d]"></div>
                 <span className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest">Vendas</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full bg-rose-200"></div>
                 <span className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest">Leads</span>
               </div>
            </div>
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#be185d" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#1e1b4b', fontSize: 11, fontWeight: 900 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#1e1b4b', fontSize: 11, fontWeight: 900 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fffcfd', border: '1px solid #ffe4e6', borderRadius: '16px', color: '#1e1b4b', padding: '12px' }}
                  itemStyle={{ fontWeight: 800, color: '#1e1b4b' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#be185d" 
                  strokeWidth={5} 
                  dot={{ r: 6, fill: '#be185d', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#fda4af" 
                  strokeWidth={5} 
                  dot={{ r: 6, fill: '#fda4af', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mix de Especialidades (Donut) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-rose-100 flex flex-col items-center">
          <h3 className="text-xl font-black mb-10 tracking-tight text-[#1e1b4b] uppercase self-start">Mix de Especialidades</h3>
          <div className="h-[300px] w-full flex items-center justify-center relative mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={115} paddingAngle={8} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % 4]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-4xl font-black text-[#1e1b4b]">JM</span>
               <span className="text-[10px] font-black uppercase text-[#be185d] tracking-[0.2em]">Estética</span>
            </div>
          </div>
          <div className="w-full space-y-3">
            {pieData.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % 4] }}></div>
                  <span className="font-black text-[11px] text-[#1e1b4b] uppercase tracking-tight">{p.name}</span>
                </div>
                <span className="font-black text-sm text-[#be185d]">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Monitor de Atividade com Iniciais em Rosa Suave */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-rose-100">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-100 rounded-lg text-[#be185d]">
              <Activity size={20} />
            </div>
            <h3 className="text-xl font-black tracking-tighter text-[#1e1b4b] uppercase">Monitor de Atividade</h3>
          </div>
          <button className="text-[#be185d] text-xs font-black uppercase tracking-[0.2em] border-b-2 border-[#be185d]/20 hover:border-[#be185d] transition-all pb-1">Ver Logs Completos</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { user: 'Mariana Almeida', action: 'Contratou Bioestimulador', time: 'agora' },
            { user: 'Clínica Centro', action: 'Confirmação via ChatBot', time: '15min' },
            { user: 'Google Ads', action: 'Novo Lead: Harmonização', time: '1h' }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-5 p-6 rounded-[2rem] border border-rose-50 hover:bg-rose-50/60 transition-all cursor-default group bg-white shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-xl shadow-sm group-hover:bg-[#be185d] group-hover:text-white transition-all duration-300">
                {item.user.charAt(0)}
              </div>
              <div>
                <p className="font-black text-sm text-[#1e1b4b] uppercase tracking-tight">{item.user}</p>
                <p className="text-[11px] text-[#be185d] font-bold mt-0.5">{item.action}</p>
                <p className="text-[9px] text-[#1e1b4b]/40 font-black uppercase tracking-widest mt-1.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
