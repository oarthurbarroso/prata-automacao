
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  User as UserIcon,
  Filter, 
  X, 
  Save, 
  Trash2, 
  MoreVertical,
  Sparkles,
  Calendar as CalendarIcon,
  Phone,
  ArrowRight,
  GripVertical,
  MessageCircle,
  CheckCircle,
  BellRing,
  Clock
} from 'lucide-react';
import { Appointment, Client, User as UserType } from '../types';
import { generateWhatsAppLink, getReminderMessage, isWithin24hWindow } from '../services/whatsapp';

interface CalendarViewProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  clients: Client[];
  users: UserType[];
}

type ViewMode = 'day' | 'week' | 'month';

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, setAppointments, clients, users }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingAppointment, setEditingAppointment] = useState<Partial<Appointment> | null>(null);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const hours = useMemo(() => {
    const h = [];
    for (let i = 8; i <= 21; i++) {
      const hourStr = i < 10 ? `0${i}` : `${i}`;
      h.push(`${hourStr}:00`);
      h.push(`${hourStr}:30`);
    }
    return h;
  }, []);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    else if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const getClient = (id: string) => clients.find(c => c.id === id);

  const handleOpenAddModal = (date?: Date, time?: string) => {
    setModalMode('add');
    const targetDate = date || selectedDate;
    setEditingAppointment({
      date: targetDate.toISOString().split('T')[0],
      time: time || '08:00',
      status: 'SCHEDULED',
      professionalId: users[0]?.id || '',
      clientId: clients[0]?.id || '',
      procedure: '',
      reminderSent: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (appointment: Appointment) => {
    setModalMode('edit');
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    if (modalMode === 'add') {
      const newApp: Appointment = { ...editingAppointment as Appointment, id: `a-${Date.now()}` };
      setAppointments([...appointments, newApp]);
    } else {
      setAppointments(appointments.map(a => a.id === editingAppointment.id ? (editingAppointment as Appointment) : a));
    }
    setIsModalOpen(false);
  };

  const handleSendReminder = (app: Appointment) => {
    const client = getClient(app.clientId);
    if (!client) return;
    const msg = getReminderMessage(client.name, app.procedure, app.date, app.time);
    const url = generateWhatsAppLink(client.phone, msg);
    window.open(url, '_blank');
    setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, reminderSent: true } : a));
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedAppId(id);
    e.dataTransfer.setData('appointmentId', id);
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
  };

  const onDragEnd = (e: React.DragEvent) => {
    setDraggedAppId(null);
    setDropTarget(null);
    (e.currentTarget as HTMLElement).style.opacity = '1';
  };

  const onDrop = (e: React.DragEvent, time: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('appointmentId');
    if (!id) return;
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, time } : app));
    setDropTarget(null);
  };

  // Lógica de Renderização da Semana
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  // Lógica de Renderização do Mês
  const monthDays = useMemo(() => {
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    
    const days = [];
    const startDay = startOfMonth.getDay();
    
    // Dias do mês anterior para preencher a grade
    for (let i = startDay; i > 0; i--) {
      const d = new Date(startOfMonth);
      d.setDate(d.getDate() - i);
      days.push({ date: d, currentMonth: false });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push({ date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i), currentMonth: true });
    }
    
    // Dias do próximo mês para fechar a grade (6 semanas = 42 dias)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(endOfMonth);
      d.setDate(d.getDate() + i);
      days.push({ date: d, currentMonth: false });
    }
    
    return days;
  }, [selectedDate]);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 bg-[#fffcfd]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-[#1e1b4b] uppercase">Agenda</h2>
          <p className="text-[#be185d] text-[10px] font-black uppercase tracking-[0.3em] mt-1">Gestão de Fluxo e Lembretes</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-rose-50 p-1.5 rounded-[1.8rem] border border-rose-100 shadow-sm">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button 
                key={mode} 
                onClick={() => setViewMode(mode)} 
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.2rem] transition-all ${
                  viewMode === mode 
                    ? 'bg-rose-200/50 text-[#1e1b4b] shadow-sm' 
                    : 'text-[#1e1b4b]/50 hover:text-[#be185d]'
                }`}
              >
                {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>
          <button onClick={() => handleOpenAddModal()} className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-[#be185d] text-white rounded-[2rem] hover:shadow-xl hover:shadow-rose-200/40 transition-all font-black text-xs uppercase tracking-widest active:scale-95">
            <Plus size={18} /><span>Novo Horário</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-rose-100 shadow-[0_10px_40px_-15px_rgba(190,24,93,0.05)] overflow-hidden flex-1 flex flex-col min-h-[650px]">
        {/* Header do Calendário */}
        <div className="p-8 border-b border-rose-100/50 flex items-center justify-between bg-rose-50/20">
          <div className="flex items-center space-x-6">
            <button onClick={() => handleNavigate('prev')} className="p-3 bg-white border border-rose-100 rounded-2xl text-[#1e1b4b] hover:bg-rose-50 transition-all shadow-sm active:scale-90">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-xl font-black text-[#1e1b4b] uppercase tracking-tighter w-64 text-center">
              {viewMode === 'month' 
                ? selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                : selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </h3>
            <button onClick={() => handleNavigate('next')} className="p-3 bg-white border border-rose-100 rounded-2xl text-[#1e1b4b] hover:bg-rose-50 transition-all shadow-sm active:scale-90">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[9px] font-black uppercase tracking-widest">Sincronizado</span>
            </div>
          </div>
        </div>

        {/* View Mode: Day */}
        {viewMode === 'day' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {hours.map((hour, idx) => {
              const dayApps = appointments.filter(a => a.date === selectedDate.toISOString().split('T')[0] && a.time === hour);
              const isTarget = dropTarget === hour;

              return (
                <div 
                  key={hour} 
                  onDragOver={(e) => { e.preventDefault(); setDropTarget(hour); }} 
                  onDrop={(e) => onDrop(e, hour)} 
                  className={`flex group transition-all min-h-[110px] border-b border-rose-100/30 ${idx % 2 === 0 ? 'bg-white' : 'bg-rose-50/5'} ${isTarget ? 'bg-rose-100/20' : ''}`}
                >
                  <div className="w-24 p-6 text-[10px] font-black text-[#1e1b4b]/40 border-r border-rose-100/30 flex items-start justify-center uppercase tracking-[0.25em] pt-8">
                    {hour}
                  </div>
                  <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                    {dayApps.map(app => {
                      const client = getClient(app.clientId);
                      const needsReminder = isWithin24hWindow(app.date, app.time) && !app.reminderSent;
                      return (
                        <div 
                          key={app.id} 
                          draggable 
                          onDragStart={(e) => onDragStart(e, app.id)} 
                          onDragEnd={onDragEnd} 
                          onClick={() => handleOpenEditModal(app)} 
                          className={`p-6 rounded-[2.5rem] border border-rose-100/50 cursor-grab hover:shadow-2xl hover:shadow-rose-100 transition-all flex flex-col justify-between group/card relative overflow-hidden ${
                            app.status === 'CONFIRMED' 
                              ? 'bg-gradient-to-br from-green-50 to-white' 
                              : 'bg-gradient-to-br from-[#fffcfd] to-white'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 rounded-[1.2rem] bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-base shadow-sm shrink-0 border border-rose-200/50 group-hover/card:scale-110 transition-transform">
                                 {client?.name.charAt(0)}
                               </div>
                               <div>
                                 <p className="font-black text-sm text-[#1e1b4b] uppercase tracking-tight truncate max-w-[140px]">{client?.name}</p>
                                 <p className="text-[10px] font-bold text-[#be185d] uppercase flex items-center mt-1">
                                   <Sparkles size={10} className="mr-1.5 opacity-70" /> {app.procedure}
                                 </p>
                               </div>
                            </div>
                            {app.reminderSent && <CheckCircle size={18} className="text-green-600" />}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-rose-100/50">
                            <div className="flex items-center text-[9px] font-black text-[#1e1b4b]/40 uppercase tracking-widest">
                              <Phone size={10} className="mr-1.5 text-[#be185d]" /> {client?.phone}
                            </div>
                            {needsReminder && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleSendReminder(app); }} 
                                className="p-2.5 bg-rose-50 text-[#be185d] rounded-xl hover:bg-[#be185d] hover:text-white transition-all shadow-sm"
                              >
                                <MessageCircle size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {dayApps.length === 0 && (
                      <button 
                        onClick={() => handleOpenAddModal(selectedDate, hour)} 
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-0"
                      >
                        <div className="flex items-center space-x-2 px-8 py-3 rounded-full border-2 border-dashed border-rose-200 bg-white/80 backdrop-blur-md text-[#be185d] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                          <Plus size={16} /><span>Marcar {hour}</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode: Week */}
        {viewMode === 'week' && (
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <div className="flex h-full min-w-[1200px] divide-x divide-rose-100">
              {weekDays.map((day) => {
                const dayStr = day.toISOString().split('T')[0];
                const dayApps = appointments.filter(a => a.date === dayStr).sort((a, b) => a.time.localeCompare(b.time));
                const isSelected = dayStr === selectedDate.toISOString().split('T')[0];

                return (
                  <div key={dayStr} className={`flex-1 flex flex-col ${isSelected ? 'bg-rose-50/20' : ''}`}>
                    <div className="p-6 border-b border-rose-100 flex flex-col items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
                      <span className="text-[10px] font-black text-[#1e1b4b]/40 uppercase tracking-widest mb-1">
                        {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </span>
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                        isSelected ? 'bg-[#be185d] text-white shadow-lg shadow-rose-200' : 'text-[#1e1b4b]'
                      }`}>
                        {day.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {dayApps.map(app => (
                        <div 
                          key={app.id} 
                          onClick={() => handleOpenEditModal(app)}
                          className="p-4 rounded-2xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black text-[#be185d] uppercase tracking-tighter bg-rose-50 px-2 py-0.5 rounded-md">{app.time}</span>
                            {app.status === 'CONFIRMED' && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                          </div>
                          <p className="text-xs font-black text-[#1e1b4b] uppercase tracking-tight truncate">{getClient(app.clientId)?.name}</p>
                          <p className="text-[9px] font-bold text-[#1e1b4b]/40 uppercase mt-1 truncate">{app.procedure}</p>
                        </div>
                      ))}
                      <button 
                        onClick={() => handleOpenAddModal(day)}
                        className="w-full py-4 border-2 border-dashed border-rose-100 rounded-2xl flex items-center justify-center text-rose-200 hover:text-[#be185d] hover:bg-rose-50 transition-all group"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode: Month */}
        {viewMode === 'month' && (
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-7 border-b border-rose-100 bg-rose-50/10">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="py-4 text-center text-[10px] font-black text-[#1e1b4b]/40 uppercase tracking-[0.2em]">{d}</div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-6">
              {monthDays.map((dayObj, i) => {
                const dayStr = dayObj.date.toISOString().split('T')[0];
                const dayApps = appointments.filter(a => a.date === dayStr);
                const isToday = new Date().toISOString().split('T')[0] === dayStr;
                const isSelected = dayStr === selectedDate.toISOString().split('T')[0];

                return (
                  <div 
                    key={i} 
                    onClick={() => {
                      setSelectedDate(dayObj.date);
                      if (dayApps.length > 0) setViewMode('day');
                    }}
                    className={`border-b border-r border-rose-100/30 p-4 transition-all cursor-pointer group relative hover:bg-rose-50/30 ${
                      !dayObj.currentMonth ? 'bg-gray-50/50 opacity-30' : 'bg-white'
                    } ${isSelected ? 'ring-2 ring-inset ring-[#be185d]/20 bg-rose-50/10' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-black transition-all ${
                        isToday ? 'w-7 h-7 bg-[#be185d] text-white rounded-lg flex items-center justify-center shadow-md' : 'text-[#1e1b4b]/60'
                      }`}>
                        {dayObj.date.getDate()}
                      </span>
                      {dayApps.length > 0 && (
                        <div className="flex -space-x-2 overflow-hidden">
                          {dayApps.slice(0, 3).map((a, idx) => (
                            <div key={idx} className="w-5 h-5 rounded-md bg-rose-100 border border-white flex items-center justify-center text-[8px] font-black text-[#be185d] shadow-sm">
                              {getClient(a.clientId)?.name.charAt(0)}
                            </div>
                          ))}
                          {dayApps.length > 3 && (
                            <div className="w-5 h-5 rounded-md bg-[#1e1b4b] border border-white flex items-center justify-center text-[7px] font-black text-white">
                              +{dayApps.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayApps.slice(0, 2).map((app, idx) => (
                        <div key={idx} className="text-[8px] font-black text-[#1e1b4b]/70 truncate uppercase tracking-tighter bg-rose-50/50 px-1.5 py-0.5 rounded border border-rose-100/30">
                          {app.time} {getClient(app.clientId)?.name.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenAddModal(dayObj.date); }}
                      className="absolute bottom-2 right-2 p-1.5 bg-rose-50 text-[#be185d] rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[#be185d] hover:text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Agendamento */}
      {isModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-300">
            <header className="p-10 border-b border-rose-100 flex items-center justify-between bg-rose-50/20">
              <div>
                <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tight">
                  {modalMode === 'add' ? 'Novo Agendamento' : 'Gestão de Horário'}
                </h3>
                <p className="text-[10px] font-black text-[#be185d] uppercase mt-1 tracking-[0.2em]">Fluxo Clínico</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-rose-100 rounded-full text-[#1e1b4b]/30 transition-colors">
                <X size={28} />
              </button>
            </header>
            
            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#be185d] tracking-widest ml-1">Paciente</label>
                  <select 
                    required 
                    className="w-full p-5 rounded-2xl border border-rose-100 bg-[#fffcfd] font-black text-sm text-[#1e1b4b] outline-none focus:ring-4 focus:ring-rose-500/10 transition-all appearance-none" 
                    value={editingAppointment.clientId} 
                    onChange={e => setEditingAppointment({...editingAppointment, clientId: e.target.value})}
                  >
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#be185d] tracking-widest ml-1">Procedimento</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Botox"
                      className="w-full p-5 rounded-2xl border border-rose-100 bg-[#fffcfd] font-black text-sm text-[#1e1b4b] outline-none focus:ring-4 focus:ring-rose-500/10 transition-all" 
                      value={editingAppointment.procedure || ''} 
                      onChange={e => setEditingAppointment({...editingAppointment, procedure: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#be185d] tracking-widest ml-1">Horário</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" />
                      <input 
                        type="time" 
                        required 
                        className="w-full pl-12 pr-5 py-5 rounded-2xl border border-rose-100 bg-[#fffcfd] font-black text-sm text-[#1e1b4b] outline-none focus:ring-4 focus:ring-rose-500/10 transition-all" 
                        value={editingAppointment.time || ''} 
                        onChange={e => setEditingAppointment({...editingAppointment, time: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
                
                {modalMode === 'edit' && isWithin24hWindow(editingAppointment.date!, editingAppointment.time!) && (
                  <div className="p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 text-[#be185d]">
                        <MessageCircle size={22} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">WhatsApp Automático</span>
                      </div>
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                        editingAppointment.reminderSent ? 'bg-green-100 text-green-700' : 'bg-rose-200 text-rose-700 shadow-sm'
                      }`}>
                        {editingAppointment.reminderSent ? 'Enviado' : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#1e1b4b]/60 leading-relaxed mb-6 italic border-l-4 border-rose-200 pl-4 py-1">
                      "Olá {getClient(editingAppointment.clientId!)?.name}! Confirmamos seu horário amanhã às {editingAppointment.time}?"
                    </p>
                    <button 
                      type="button" 
                      onClick={() => handleSendReminder(editingAppointment as Appointment)} 
                      className="w-full py-4 bg-[#1e1b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg hover:bg-[#be185d] transition-all"
                    >
                      Enviar Lembrete Agora
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 border-2 border-rose-50 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#1e1b4b]/40 hover:bg-rose-50 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-5 bg-gradient-to-r from-[#1e1b4b] to-[#be185d] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-900/20 active:scale-95 transition-all">
                  Efetivar Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
