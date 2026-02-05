
import React, { useState } from 'react';
import { Globe, Loader2, ExternalLink, BookOpen } from 'lucide-react';
import { backendService } from '../../services/backend';
import { useLanguage } from '../../context/LanguageContext';

export const ResearchView: React.FC = () => {
  const { t } = useLanguage();
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchQuery) return;
    setIsResearching(true);
    setResearchResult(null);
    try {
      const result = await backendService.researchLegalTopic(researchQuery);
      setResearchResult(result);
    } catch (e) { 
      alert("AI Research Failed: " + (e as Error).message); 
    }
    setIsResearching(false);
  };

  return (
    <div className="animate-reveal-up space-y-12">
      <div className="bg-slate-900/50 p-12 border border-[#c5a059]/30 rounded-sm">
        <div className="flex items-center gap-4 mb-6">
          <Globe className="text-[#c5a059]" size={32} />
          <h3 className="text-3xl font-serif-legal font-bold text-white italic">Elite AI Research</h3>
        </div>
        <p className="text-slate-400 text-sm mb-10">{t('ค้นหาและสรุปประเด็นข้อกฎหมายจากแหล่งข้อมูลที่เป็นปัจจุบันที่สุดด้วยระบบ Google Search Grounding', 'Search and summarize legal issues from the most up-to-date sources using Google Search Grounding')}</p>
        
        <form onSubmit={handleResearch} className="flex gap-4 mb-12">
          <input 
            type="text" 
            className="flex-grow bg-slate-800 border-b border-white/10 py-5 px-8 text-white outline-none focus:border-[#c5a059] text-lg" 
            placeholder={t("ระบุประเด็นที่ต้องการค้นคว้า เช่น 'การเลิกจ้างพนักงานช่วงทดลองงาน 2567'...", "Enter research topic e.g. 'employee termination during probation period'...")} 
            value={researchQuery} 
            onChange={(e) => setResearchQuery(e.target.value)} 
          />
          <button 
            disabled={isResearching} 
            className="bg-[#c5a059] text-white px-12 py-5 font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white hover:text-slate-900 transition-all disabled:opacity-50"
          >
            {isResearching ? <Loader2 className="animate-spin" /> : <Globe size={16} />} 
            {isResearching ? 'RESEARCHING...' : 'START RESEARCH'}
          </button>
        </form>

        {researchResult && (
          <div className="grid lg:grid-cols-3 gap-12 animate-reveal-up">
            <div className="lg:col-span-2 bg-slate-950 p-10 border border-white/5 rounded-sm shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-8 border-b border-white/5 pb-4">Intelligence Analysis Report</h4>
              <div className="text-slate-300 whitespace-pre-line leading-relaxed text-lg font-light italic">
                {researchResult.text}
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-4">Referenced Sources</h4>
              <div className="space-y-4">
                {researchResult.sources && researchResult.sources.length > 0 ? (
                  researchResult.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-5 bg-white/5 border border-white/10 hover:border-[#c5a059] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <BookOpen size={14} className="text-[#c5a059]" />
                        <ExternalLink size={12} className="text-slate-600 group-hover:text-white" />
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-2">{source.title}</p>
                      <p className="text-[9px] text-slate-500 mt-2 truncate">{source.uri}</p>
                    </a>
                  ))
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/5 text-slate-700 text-[10px] uppercase font-black">
                    No Direct Web References
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
