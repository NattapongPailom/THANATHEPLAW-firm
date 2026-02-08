
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, Mail, Loader2, Trash2, Briefcase, ShieldCheck } from 'lucide-react';
import { backendService } from '../../services/backend';
import { Lead, LeadStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CasePortfolioEditor } from './CasePortfolioEditor';

export const LeadsView: React.FC = () => {
  const { t } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showMgmtModal, setShowMgmtModal] = useState(false);

  useEffect(() => {
    const unsubscribe = backendService.onLeadsUpdate(
      (updatedLeads) => {
        setLeads(updatedLeads);
        setLoading(false);
        setLoadError(null);
        if (selectedLead) {
          const current = updatedLeads.find(l => l.id === selectedLead.id);
          if (current) setSelectedLead(current);
        }
      },
      (error) => {
        setLoading(false);
        const msg = error?.message || String(error);
        setLoadError(msg.includes('Permission') || msg.includes('permission')
          ? t('Firestore ปฏิเสธการเข้าถึง: กรุณาใช้ Firebase Auth สำหรับ Admin หรือตรวจสอบ Firestore Rules', 'Firestore access denied: Please use Firebase Auth for Admin or check Firestore Rules')
          : t(`ไม่สามารถเชื่อมต่อฐานข้อมูล: ${msg}`, `Cannot connect to database: ${msg}`));
      }
    );
    return () => unsubscribe();
  }, [selectedLead]);

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    await backendService.updateLeadStatus(id, status);
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm(t('ยืนยันการลบข้อมูลนี้?', 'Confirm delete this data?'))) {
      await backendService.deleteLead(id);
    }
  };

  const filteredLeads = leads.filter(lead => 
    (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     lead.phone.includes(searchQuery) ||
     (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()))) && 
    (statusFilter === 'all' || lead.status === statusFilter)
  );

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contracted: leads.filter(l => l.status === 'contracted').length,
  }), [leads]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-[#c5a059]">
        <Loader2 className="animate-spin" size={48} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Connecting to Secure Database...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-left max-w-lg mx-auto">
        <p className="text-red-400 text-sm font-medium">{t('ไม่สามารถโหลดข้อมูล Leads', 'Cannot load Leads data')}</p>
        <p className="text-slate-400 text-xs">{loadError}</p>
        <p className="text-slate-500 text-[10px] mt-2">{t('ตรวจสอบ Firebase config ใน .env และ Firestore Security Rules (ต้องใช้ Firebase Auth สำหรับ Admin เพื่อให้อ่านได้)', 'Check Firebase config in .env and Firestore Security Rules (Firebase Auth required for Admin read access)')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="animate-reveal-up space-y-12 pb-20 text-left">
        
        {/* HYBRID STORAGE INDICATOR */}
        <div className="bg-slate-900 border-l-4 border-[#c5a059] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-[#c5a059]" size={20} />
            <div>
              <p className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Hybrid Storage Active</p>
              <p className="text-white text-xs">{t('ข้อมูลเคสเก็บใน Cloud | เอกสารลูกความเก็บในเครื่อง (Local Vault)', 'Case data stored in Cloud | Client documents stored locally (Local Vault)')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 p-8 border border-white/5 rounded-sm">
            <p className="text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em] mb-3">Total Leads</p>
            <p className="text-4xl text-white font-serif-legal font-bold">{stats.total}</p>
          </div>
          <div className="bg-slate-900/40 p-8 border border-white/5 rounded-sm"><p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3">New Enquiries</p><p className="text-4xl text-white font-serif-legal font-bold">{stats.new}</p></div>
          <div className="bg-slate-900/40 p-8 border border-white/5 rounded-sm"><p className="text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em] mb-3">Active Cases</p><p className="text-4xl text-white font-serif-legal font-bold">{stats.contracted}</p></div>
        </div>

        <div className="relative">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input type="text" placeholder={t('ค้นหาตามชื่อ เบอร์โทร หรืออีเมล...', 'Search by name, phone or email...')} className="w-full bg-slate-900/50 border border-white/5 py-6 pl-20 pr-8 text-white outline-none focus:border-[#c5a059]/50 rounded-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="bg-slate-900/30 border border-white/5 rounded-sm shadow-2xl overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-950/50 border-b border-white/5 text-[10px] uppercase font-black tracking-[0.3em] text-slate-500">
              <tr>
                <th className="px-12 py-8">Identification</th>
                <th className="px-12 py-8">Details</th>
                <th className="px-12 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-12 py-12 align-top">
                    <p className="text-white font-bold text-xl mb-3">{lead.name}</p>
                    <div className="space-y-2">
                      <p className="text-slate-400 text-xs flex items-center gap-3 font-mono">
                        <Phone size={14} className="text-[#c5a059]" /> {lead.phone}
                      </p>
                      <p className="text-slate-400 text-xs flex items-center gap-3 font-mono">
                        <Mail size={14} className="text-[#c5a059]" /> {lead.email || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="px-12 py-12 align-top max-w-lg">
                    <p className="text-slate-400 text-sm italic whitespace-pre-wrap break-words">"{lead.details}"</p>
                    {lead.aiSummary && <p className="mt-4 text-[10px] text-[#c5a059] font-bold uppercase tracking-widest bg-[#c5a059]/5 p-2 border-l border-[#c5a059]">AI Summary: {lead.aiSummary}</p>}
                  </td>
                  <td className="px-12 py-12 align-top text-right space-y-4">
                    <button 
                      onClick={() => { setSelectedLead(lead); setShowMgmtModal(true); }}
                      className="bg-white/5 border border-white/10 hover:border-[#c5a059] text-white text-[9px] font-black uppercase py-3 px-6 transition-all flex items-center justify-end gap-2 ml-auto"
                    >
                      <Briefcase size={12} /> Manage Portfolio
                    </button>
                    <div className="flex justify-end gap-4">
                      <select value={lead.status} onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)} className="text-[10px] font-black uppercase px-4 py-2 bg-slate-800 border border-white/5 text-[#c5a059]">
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="contracted">CONTRACTED</option>
                        <option value="closed">CLOSED</option>
                      </select>
                      <button onClick={() => handleDeleteLead(lead.id)} className="text-red-500/30 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showMgmtModal && selectedLead && (
        <CasePortfolioEditor 
          lead={selectedLead} 
          onClose={() => setShowMgmtModal(false)} 
          onRefresh={() => {}}
        />
      )}
    </>
  );
};
