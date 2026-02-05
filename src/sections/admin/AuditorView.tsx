
import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Loader2, ShieldAlert } from 'lucide-react';
import { backendService } from '../../services/backend';
import { useLanguage } from '../../context/LanguageContext';

export const AuditorView: React.FC = () => {
  const { t } = useLanguage();
  const [auditImage, setAuditImage] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAuditImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAudit = async () => {
    if (!auditImage) return;
    setIsAuditing(true);
    setAuditResult('');
    try {
      const result = await backendService.auditDocument(auditImage);
      setAuditResult(result);
    } catch (e) { 
      alert("Auditing Failed: " + (e as Error).message); 
    }
    setIsAuditing(false);
  };

  return (
    <div className="animate-reveal-up space-y-12">
      <div className="bg-slate-900/50 p-12 border border-[#c5a059]/30 rounded-sm">
        <div className="flex items-center gap-4 mb-6">
          <Camera className="text-[#c5a059]" size={32} />
          <h3 className="text-3xl font-serif-legal font-bold text-white italic">Elite Document Auditor</h3>
        </div>
        <p className="text-slate-400 text-sm mb-10">{t('อัปโหลดภาพถ่ายสัญญาหรือเอกสารกฎหมายเพื่อให้ AI ตรวจสอบจุดเสี่ยง (Red Flags) และสรุปประเด็นสำคัญทันที', 'Upload photos of contracts or legal documents for AI to review red flags and summarize key issues instantly')}</p>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="border-2 border-dashed border-white/10 aspect-[4/5] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#c5a059]/50 transition-all cursor-pointer bg-slate-950">
              {auditImage ? (
                <img src={auditImage} className="w-full h-full object-contain" alt="Preview" />
              ) : (
                <>
                  <ImageIcon size={48} className="text-slate-800 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Click to upload document photo</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <button 
              disabled={!auditImage || isAuditing} 
              onClick={handleAudit} 
              className="w-full bg-[#c5a059] text-white py-6 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-white hover:text-slate-900 transition-all disabled:opacity-50 shadow-2xl"
            >
              {isAuditing ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />} 
              {isAuditing ? 'ANALYZING DOCUMENT...' : 'AUDIT DOCUMENT NOW'}
            </button>
          </div>
          
          <div className="bg-slate-950 p-10 border border-white/5 h-full min-h-[500px] flex flex-col">
             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                <ShieldAlert size={16} className="text-[#c5a059]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#c5a059]">Audit Intelligence Report</h4>
             </div>
             
             {auditResult ? (
               <div className="prose prose-invert prose-sm text-slate-300 whitespace-pre-line leading-loose italic font-light overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
                 {auditResult}
               </div>
             ) : (
               <div className="flex-grow flex items-center justify-center text-slate-800 text-[10px] uppercase font-black italic border border-dashed border-white/5">
                 Waiting for document input...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
