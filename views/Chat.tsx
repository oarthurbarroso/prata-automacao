
import React, { useState } from 'react';
import { 
  Search, Send, Phone, Video, Info, Paperclip, Smile, MoreVertical,
  CheckCheck, UserCircle, Sparkles, MessageCircle, X
} from 'lucide-react';
import { suggestReply } from '../services/gemini';

const MOCK_CONVERSATIONS = [
  { id: '1', name: 'Beatriz Costa', lastMsg: 'Tudo bem, aguardo você.', time: '10:30', unread: 2, avatar: '', online: true },
  { id: '2', name: 'Renata Souza', lastMsg: 'Qual o valor do botox?', time: '09:45', unread: 0, avatar: 'https://picsum.photos/id/11/50/50', online: false },
  { id: '3', name: 'Maria Helena', lastMsg: 'Confirmado para amanhã às 14h.', time: 'Ontem', unread: 0, avatar: 'https://picsum.photos/id/12/50/50', online: true },
];

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(MOCK_CONVERSATIONS[0]);
  const [message, setMessage] = useState('');
  const [suggesting, setSuggesting] = useState(false);

  const handleSuggest = async () => {
    if (!message && selectedChat) {
      setSuggesting(true);
      const res = await suggestReply("Olá, sou a Beatriz. Gostaria de tirar dúvidas sobre o botox facial e valores.");
      setMessage(res || '');
      setSuggesting(false);
    }
  };

  return (
    <div className="h-full flex gap-0 -m-6 md:-m-10 overflow-hidden bg-[#fffcfd]">
      {/* Sidebar de Conversas - Seguindo Regra 4 e 5 */}
      <div className="w-[400px] border-r border-rose-100 flex flex-col bg-white shadow-sm">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tighter text-[#1e1b4b] uppercase">Inbox</h2>
            <button className="p-3 bg-gradient-to-br from-[#1e1b4b] to-[#be185d] text-white rounded-2xl shadow-lg shadow-rose-200/50 hover:scale-105 transition-transform active:scale-95">
               <MessageCircle size={20} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-[#be185d] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Localizar conversa..." 
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-rose-50/50 border border-rose-100/50 focus:border-[#be185d] focus:ring-4 focus:ring-rose-500/10 outline-none text-sm font-black text-[#1e1b4b] placeholder:text-[#1e1b4b]/30 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 custom-scrollbar">
          {MOCK_CONVERSATIONS.map(chat => (
            <button 
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-5 flex items-center space-x-4 rounded-[2.5rem] transition-all duration-300 relative ${
                selectedChat.id === chat.id 
                  ? 'bg-rose-100/50 shadow-sm border border-rose-100/30' 
                  : 'hover:bg-rose-50/50'
              }`}
            >
              <div className="relative shrink-0">
                {chat.avatar ? (
                  <img src={chat.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover shadow-sm border-2 border-white" alt="" />
                ) : (
                  /* Círculo de iniciais conforme Regra 2 */
                  <div className="w-16 h-16 rounded-[1.5rem] bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-xl shadow-sm border border-rose-200/50">
                    {chat.name.charAt(0)}
                  </div>
                )}
                {chat.online && (
                  <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-sm" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-black text-sm truncate uppercase tracking-tight ${selectedChat.id === chat.id ? 'text-[#be185d]' : 'text-[#1e1b4b]'}`}>
                    {chat.name}
                  </h4>
                  <span className="text-[9px] font-black text-[#1e1b4b]/30 uppercase tracking-widest">{chat.time}</span>
                </div>
                <p className="text-xs text-[#1e1b4b]/60 truncate font-bold tracking-tight">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="absolute right-6 bottom-5 w-6 h-6 bg-[#be185d] rounded-full flex items-center justify-center shadow-lg shadow-rose-200">
                  <span className="text-[10px] text-white font-black">{chat.unread}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Janela de Chat JM - Seguindo Regra 4 e 6 */}
      <div className="flex-1 flex flex-col bg-[#fffcfd] relative">
        <header className="h-24 px-8 bg-rose-50/30 border-b border-rose-100 flex items-center justify-between z-10">
          <div className="flex items-center space-x-5">
            <div className="relative">
              {selectedChat.avatar ? (
                <img src={selectedChat.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white" alt="" />
              ) : (
                /* Iniciais no Header conforme Regra 2 */
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-[#1e1b4b] flex items-center justify-center font-black text-lg border border-rose-200/50">
                  {selectedChat.name.charAt(0)}
                </div>
              )}
              <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
            </div>
            <div>
              <h3 className="font-black text-base uppercase tracking-tight text-[#1e1b4b]">{selectedChat.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Atendimento Ativo</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-3 text-[#1e1b4b]/40 hover:text-[#be185d] hover:bg-rose-50 rounded-xl transition-all"><Phone size={22} /></button>
            <button className="p-3 text-[#1e1b4b]/40 hover:text-[#be185d] hover:bg-rose-50 rounded-xl transition-all"><Video size={22} /></button>
            <div className="w-px h-8 bg-rose-100 mx-2" />
            <button className="p-3 text-[#1e1b4b]/40 hover:text-[#be185d] hover:bg-rose-50 rounded-xl transition-all"><Info size={22} /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-rose-50/10 custom-scrollbar">
          <div className="flex justify-center mb-12">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] bg-rose-100 text-[#1e1b4b] px-8 py-2.5 rounded-full border border-rose-200 shadow-sm">
              Início do Atendimento • {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="flex items-end space-x-4 group/msg">
            <div className="max-w-[70%] bg-white p-7 rounded-[2.5rem] rounded-bl-none shadow-sm border border-rose-100">
              <p className="text-sm font-black leading-relaxed text-[#1e1b4b]">
                Olá Dra. Jéssica! Gostaria de saber mais sobre o protocolo de bioestimuladores que vi no Instagram. Tem disponibilidade para avaliação essa semana?
              </p>
              <p className="text-[9px] font-black text-[#1e1b4b]/30 mt-4 text-right uppercase tracking-widest">09:42</p>
            </div>
          </div>

          <div className="flex items-end justify-end space-x-4 group/msg">
            <div className="max-w-[70%] bg-gradient-to-br from-[#1e1b4b] to-[#be185d] text-white p-7 rounded-[2.5rem] rounded-br-none shadow-xl shadow-rose-900/10">
              <p className="text-sm font-black leading-relaxed">
                Olá {selectedChat.name.split(' ')[0]}! É um prazer atendê-la. O protocolo de bioestimuladores é fantástico para firmeza da pele. Temos vaga para quinta-feira às 14:00 ou sexta às 10:30. Algum desses horários funciona para você?
              </p>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">09:45</span>
                <CheckCheck size={14} className="opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé e Input - Seguindo Regra 4, 5 e 6 */}
        <footer className="p-8 bg-white border-t border-rose-100">
          <div className="max-w-6xl mx-auto flex items-end space-x-4">
            <div className="flex items-center space-x-1 pb-2 text-[#1e1b4b]/30">
              <button className="p-3 hover:bg-rose-50 rounded-2xl transition-all hover:text-[#be185d]"><Smile size={24} /></button>
              <button className="p-3 hover:bg-rose-50 rounded-2xl transition-all hover:text-[#be185d]"><Paperclip size={24} /></button>
            </div>
            
            <div className="flex-1 relative group">
              <textarea 
                rows={1}
                placeholder="Escreva sua mensagem personalizada..."
                className="w-full bg-rose-50/50 border border-rose-100/50 focus:border-[#be185d] focus:ring-4 focus:ring-rose-500/10 rounded-[2rem] px-8 py-5 text-sm font-black outline-none resize-none transition-all placeholder:text-[#1e1b4b]/20 text-[#1e1b4b]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              
              {/* Botão de Sugestão IA - Seguindo Regra 3 (Tons rosados para filtros/ativos) */}
              <button 
                onClick={handleSuggest}
                className={`absolute right-5 top-1/2 -translate-y-1/2 flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-sm border ${
                  suggesting 
                    ? 'bg-rose-200/50 text-[#1e1b4b] border-rose-300' 
                    : 'bg-rose-50 text-[#be185d] border-rose-100 hover:bg-rose-100'
                }`}
              >
                <Sparkles size={16} />
                <span>{suggesting ? 'Processando...' : 'Sugestão Dra. IA'}</span>
              </button>
            </div>

            <button className="p-6 bg-gradient-to-br from-[#1e1b4b] to-[#be185d] text-white rounded-[2.2rem] shadow-xl shadow-rose-900/20 hover:scale-105 active:scale-95 transition-all">
              <Send size={28} />
            </button>
          </div>
          
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2 px-4 py-1.5 bg-rose-50/50 rounded-full border border-rose-100/30">
              <span className="text-[9px] font-black text-[#1e1b4b]/30 uppercase tracking-[0.2em]">Criptografia Ponta-a-Ponta JM Security</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
