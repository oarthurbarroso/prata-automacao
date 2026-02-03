
import { Appointment, Client, User } from '../types';

export const generateWhatsAppLink = (phone: string, text: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/55${cleanPhone}?text=${encodedText}`;
};

export const getReminderMessage = (clientName: string, procedure: string, date: string, time: string) => {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  return `Olá ${clientName}! ✨ Passando para confirmar seu procedimento de *${procedure}* amanhã, dia *${formattedDate}* às *${time}* na Clínica Dra. Jéssica Motta. Podemos confirmar sua presença? 🌸`;
};

export const getProfessionalAlertMessage = (profName: string, clientName: string, procedure: string, time: string) => {
  return `Olá ${profName}! 🗓️ Lembrete de Agenda: Amanhã às *${time}* você tem um atendimento de *${procedure}* com o(a) paciente *${clientName}*.`;
};

export const isWithin24hWindow = (dateStr: string, timeStr: string) => {
  const appDate = new Date(`${dateStr}T${timeStr}`);
  const now = new Date();
  const diffInMs = appDate.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours > 0 && diffInHours <= 24;
};
