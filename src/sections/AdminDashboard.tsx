
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, LayoutDashboard, Newspaper, Briefcase, Camera, Globe, FileText, CreditCard, ShieldAlert, ChevronDown, Sparkles, Settings, Mail, X, Send, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SimulatedEmail } from '../types';

// Import Modular Views
import { LeadsView } from './admin/LeadsView';
import { AuditorView } from './admin/AuditorView';
import { ResearchView } from './admin/ResearchView';
import { DrafterView } from './admin/DrafterView';
import { CMSView } from './admin/CMSView';
import { FinanceView } from './admin/FinanceView';
import { LogsView } from './admin/LogsView';

interface AdminDashboardProps {
  onBack: () => void;
}

type AdminTab = 'leads' | 'news' | 'cases' | 'research' | 'drafter' | 'auditor' | 'finance' | 'logs';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { login, logout, isAdmin, user, authReady, loginError, loginErrorCode } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('leads');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'ai' | 'cms' | null>(null);
  const [dispatchedEmail, setDispatchedEmail] = useState<SimulatedEmail | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleEmailEvent = (e: any) => {
      setDispatchedEmail(e.detail);
    };
    window.addEventListener('elite_email_dispatched', handleEmailEvent);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('elite_email_dispatched', handleEmailEvent);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.4em]">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      await login(email, password);
      setSubmitting(false);
    };
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative text-center">
        <div className="w-full max-w-md bg-slate-900 p-12 border border-white/10 rounded-sm shadow-2xl animate-reveal-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif-legal font-bold text-white mb-2 italic">Elite Portal</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black">Authorized Access Only</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-10">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-5 text-white outline-none focus:border-[#c5a059] text-center text-xl"
              placeholder={t('อีเมล', 'Email')}
              required
            />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-5 text-white outline-none focus:border-[#c5a059] text-center text-2xl"
              placeholder="••••••••"
              required
            />
            {loginError && (
              <div className="text-center space-y-1">
                <p className="text-red-400 text-sm">{loginError}</p>
                {loginErrorCode && (
                  <p className="text-slate-500 text-[10px] font-mono">Firebase: {loginErrorCode}</p>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#c5a059] text-white py-6 font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-slate-900 transition-all disabled:opacity-60"
            >
              {submitting ? t('กำลังเข้าสู่ระบบ...', 'Logging in...') : 'INITIATE ACCESS'}
            </button>
            <button type="button" onClick={onBack} className="w-full text-slate-600 text-[9px] uppercase font-black tracking-widest">Return to Public Site</button>
          </form>
        </div>
      </div>
    );
  }

  const handleTabSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setOpenDropdown(null);
  };

  const isTabInAI = ['auditor', 'research', 'drafter'].includes(activeTab);
  const isTabInCMS = ['news', 'cases'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 text-left">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-[#c5a059]"></div>
              <span className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.4em]">ADMINISTRATIVE CONTROL ({user?.role?.toUpperCase()})</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isOnline ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                <span className="text-[8px] font-black uppercase tracking-widest">{isOnline ? 'Firebase Connected' : 'Connection Lost'}</span>
              </div>
            </div>
            <h1 className="text-5xl font-serif-legal font-bold text-white italic">Admin Dashboard</h1>
          </div>
          <button 
            onClick={logout} 
            className="text-slate-500 hover:text-red-400 text-[15px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors border border-white/5 px-6 py-3 rounded-sm hover:bg-white/5"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-20 border-b border-white/5 pb-0" ref={dropdownRef}>
          <div className="flex items-center">
            <button 
              onClick={() => handleTabSelect('leads')}
              className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest px-6 py-5 transition-all relative ${activeTab === 'leads' ? 'text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <LayoutDashboard size={14} /> Management
              {activeTab === 'leads' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c5a059]"></div>}
            </button>
            
            {user?.role === 'admin' && (
              <button 
                onClick={() => handleTabSelect('finance')}
                className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest px-6 py-5 transition-all relative ${activeTab === 'finance' ? 'text-white' : 'text-slate-500 hover:text-white'}`}
              >
                <CreditCard size={14} /> Finance
                {activeTab === 'finance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c5a059]"></div>}
              </button>
            )}
          </div>

          <div className="h-8 w-px bg-white/10 mx-4"></div>

          <div className="relative">
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'ai' ? null : 'ai')}
              className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest px-8 py-5 transition-all relative ${isTabInAI ? 'text-[#c5a059]' : 'text-slate-500 hover:text-white'}`}
            >
              <Sparkles size={14} className={isTabInAI ? 'animate-pulse' : ''} /> AI Workspace <ChevronDown size={12} className={`transition-transform duration-300 ${openDropdown === 'ai' ? 'rotate-180' : ''}`} />
              {isTabInAI && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c5a059]"></div>}
            </button>

            {openDropdown === 'ai' && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-[#c5a059]/30 shadow-2xl z-[100] p-2 rounded-sm animate-reveal-up">
                <button onClick={() => handleTabSelect('auditor')} className={`w-full text-left px-5 py-4 rounded-sm transition-all flex items-center gap-4 group ${activeTab === 'auditor' ? 'bg-[#c5a059] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <Camera size={14} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Document Auditor</p>
                    <p className="text-[8px] opacity-40 uppercase">AI Red Flag Review</p>
                  </div>
                </button>
                <button onClick={() => handleTabSelect('research')} className={`w-full text-left px-5 py-4 rounded-sm transition-all flex items-center gap-4 group ${activeTab === 'research' ? 'bg-[#c5a059] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <Globe size={14} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Legal Research</p>
                    <p className="text-[8px] opacity-40 uppercase">Global Search Grounding</p>
                  </div>
                </button>
                <button onClick={() => handleTabSelect('drafter')} className={`w-full text-left px-5 py-4 rounded-sm transition-all flex items-center gap-4 group ${activeTab === 'drafter' ? 'bg-[#c5a059] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <FileText size={14} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Document Drafter</p>
                    <p className="text-[8px] opacity-40 uppercase">AI Clause Generation</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'cms' ? null : 'cms')}
              className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest px-8 py-5 transition-all relative ${isTabInCMS ? 'text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <Settings size={14} /> CMS Control <ChevronDown size={12} className={`transition-transform duration-300 ${openDropdown === 'cms' ? 'rotate-180' : ''}`} />
              {isTabInCMS && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c5a059]"></div>}
            </button>

            {openDropdown === 'cms' && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-white/10 shadow-2xl z-[100] p-2 rounded-sm animate-reveal-up">
                <button onClick={() => handleTabSelect('news')} className={`w-full text-left px-5 py-4 rounded-sm transition-all flex items-center gap-4 group ${activeTab === 'news' ? 'bg-[#c5a059] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <Newspaper size={14} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">News & Insights</p>
                    <p className="text-[8px] opacity-40 uppercase">Blog Content</p>
                  </div>
                </button>
                <button onClick={() => handleTabSelect('cases')} className={`w-full text-left px-5 py-4 rounded-sm transition-all flex items-center gap-4 group ${activeTab === 'cases' ? 'bg-[#c5a059] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <Briefcase size={14} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Case Studies</p>
                    <p className="text-[8px] opacity-40 uppercase">Success Portfolio</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-white/10 mx-4"></div>

          {user?.role === 'admin' && (
            <button 
              onClick={() => handleTabSelect('logs')}
              className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest px-6 py-5 transition-all relative ${activeTab === 'logs' ? 'text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <ShieldAlert size={14} /> Activity Logs
              {activeTab === 'logs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c5a059]"></div>}
            </button>
          )}

        </div>

        <div className="min-h-[600px]">
          {activeTab === 'leads' && <LeadsView />}
          {activeTab === 'finance' && <FinanceView />}
          {activeTab === 'auditor' && <AuditorView />}
          {activeTab === 'research' && <ResearchView />}
          {activeTab === 'drafter' && <DrafterView />}
          {activeTab === 'news' && <CMSView type="news" />}
          {activeTab === 'cases' && <CMSView type="cases" />}
          {activeTab === 'logs' && <LogsView />}
        </div>
      </div>

      {/* Simulated Email Dispatcher Overlay */}
      {dispatchedEmail && (
        <div className="fixed inset-0 z-[200000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
           <div className="w-full max-w-2xl bg-slate-900 border border-[#c5a059]/30 shadow-2xl overflow-hidden animate-reveal-up flex flex-col rounded-sm">
              <div className="bg-slate-950 p-6 flex justify-between items-center border-b border-[#c5a059]/20">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059] rounded-full">
                       <Mail size={20} />
                    </div>
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Email Dispatch Simulation</p>
                 </div>
                 <button onClick={() => setDispatchedEmail(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              
              <div className="p-8 bg-slate-100 text-slate-900 font-sans">
                 <div className="border-b border-slate-200 pb-4 mb-6">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">TO:</p>
                    <p className="text-sm font-bold">{dispatchedEmail.to}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-4 mb-1">SUBJECT:</p>
                    <p className="text-base font-serif font-bold text-slate-800">{dispatchedEmail.subject}</p>
                 </div>
                 
                 <div className="bg-white p-8 border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
                    <div className="mb-8 flex justify-between">
                       <div className="text-xs font-serif font-bold tracking-tighter text-slate-800">
                         <span className="text-[#c5a059]">T</span>HANATHEP LAW
                       </div>
                       <div className="text-[8px] text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString()}</div>
                    </div>
                    
                    <div className="flex-grow whitespace-pre-line text-sm text-slate-700 leading-relaxed font-light">
                      {dispatchedEmail.body}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
                       <a href="#" className="bg-slate-950 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#c5a059] transition-all">View Portal Case Status</a>
                       
                       {dispatchedEmail.canReply ? (
                         <div className="bg-blue-50 border border-blue-100 p-4 w-full flex items-center justify-between group cursor-pointer hover:bg-blue-100 transition-all">
                            <div className="flex items-center gap-3">
                               <Send size={14} className="text-blue-600" />
                               <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Reply directly to Attorney</span>
                            </div>
                            <div className="text-[8px] text-blue-400 font-black uppercase">Secure Channel Active</div>
                         </div>
                       ) : (
                         <div className="text-[9px] text-slate-400 uppercase font-black italic">
                           This is an automated broadcast notification. Replies are not monitored.
                         </div>
                       )}
                    </div>
                 </div>
                 
                 <div className="mt-6 text-center">
                    <p className="text-[8px] text-slate-400 uppercase tracking-[0.5em]">&copy; 2024 THANATHEP LAW FIRM | CONFIDENTIALITY NOTICE</p>
                 </div>
              </div>

              <div className="bg-slate-950 p-6 border-t border-white/5 flex justify-center">
                 <button 
                  onClick={() => setDispatchedEmail(null)}
                  className="bg-[#c5a059] text-white px-10 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all"
                 >
                   CLOSE PREVIEW
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
