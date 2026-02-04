
import React, { useState } from 'react';
import { Sparkles, Loader2, FileText, Copy } from 'lucide-react';
import { backendService } from '../../services/backend';

export const DrafterView: React.FC = () => {
  const [docType, setDocType] = useState('หนังสือบอกกล่าวทวงถาม (Notice)');
  const [docDetails, setDocDetails] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docDetails) return;
    setIsDrafting(true);
    try {
      const result = await backendService.draftLegalDocument(docType, docDetails);
      setDraftResult(result);
    } catch (e) { alert("AI Drafting Failed"); }
    setIsDrafting(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftResult);
    alert("Copied to clipboard");
  };

  return (
    <div className="animate-reveal-up space-y-12">
      <div className="bg-slate-900/50 p-12 border border-[#c5a059]/30 rounded-sm">
        <h3 className="text-2xl font-serif-legal font-bold text-white mb-6 italic">Elite Document Drafter</h3>
        <p className="text-slate-400 text-sm mb-10">ร่างเอกสารกฎหมายเบื้องต้นด้วยความแม่นยำสูง</p>
        <form onSubmit={handleDraft} className="space-y-8">
          <select 
            className="w-full bg-slate-800 border-b border-white/10 py-5 px-6 text-white outline-none focus:border-[#c5a059]" 
            value={docType} 
            onChange={(e) => setDocType(e.target.value)}
          >
            <option>หนังสือบอกกล่าวทวงถาม (Notice)</option>
            <option>สัญญาจ้างแรงงาน</option>
            <option>บันทึกข้อตกลง (MOU)</option>
            <option>สัญญาซื้อขาย</option>
          </select>
          <textarea 
            className="w-full bg-slate-800 border border-white/10 p-8 text-white outline-none focus:border-[#c5a059] min-h-[200px]" 
            placeholder="ระบุรายละเอียดสำคัญ เช่น ชื่อคู่สัญญา, จำนวนเงิน, เงื่อนไขหลัก..." 
            value={docDetails} 
            onChange={(e) => setDocDetails(e.target.value)} 
          />
          <button 
            disabled={isDrafting} 
            className="bg-[#c5a059] text-white px-12 py-6 font-black uppercase tracking-widest flex items-center gap-4 hover:bg-white hover:text-slate-900 transition-all disabled:opacity-50"
          >
            {isDrafting ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} DRAFT NOW
          </button>
        </form>
        {draftResult && (
          <div className="mt-12 relative animate-reveal-up">
            <div className="bg-white p-12 text-slate-900 whitespace-pre-line font-serif shadow-2xl">
              {draftResult}
            </div>
            <button 
              onClick={copyToClipboard}
              className="absolute top-6 right-6 bg-slate-900 text-white p-3 hover:bg-[#c5a059] transition-all"
              title="Copy to clipboard"
            >
              <Copy size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
