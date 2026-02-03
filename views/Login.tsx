
import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.login(email, password);
      const user = await api.getCurrentUser();
      if (user) {
        onLogin(user);
      } else {
        throw new Error("Perfil de usuário não encontrado.");
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#4c0519] p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-900/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/30 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 flex flex-col items-center animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl mb-1">
            Dra. Jéssica Motta
          </h1>
          <p className="text-rose-300 font-bold tracking-[0.3em] uppercase text-[10px] opacity-90">Clínica de Estética Avançada</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-700">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Bem-vindo(a)</h2>
            <p className="text-slate-400 text-sm mt-1">Faça login no CRM de Produção</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-rose-300/60 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="admin@jm-estetica.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/5 bg-white/5 outline-none focus:ring-4 focus:ring-rose-500/20 transition-all text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-rose-300/60 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-4 rounded-2xl border border-white/5 bg-white/5 outline-none focus:ring-4 focus:ring-rose-500/20 transition-all text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 p-4 rounded-2xl text-sm border border-rose-500/20">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <span>ENTRAR NO SISTEMA</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
