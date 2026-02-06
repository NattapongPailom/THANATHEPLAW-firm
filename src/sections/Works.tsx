
import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { useLanguage } from '../context/LanguageContext';
import { useReveal } from '../hooks/useReveal';
import { ArrowRight, Trophy, Loader2, Scale } from 'lucide-react';
import { CaseStudy } from '../types';
import { backendService } from '../services/backend';

interface WorksProps {
  onSelectCase: (caseItem: CaseStudy) => void;
}

export const Works: React.FC<WorksProps> = ({ onSelectCase }) => {
  const { t } = useLanguage();
  const { ref, className } = useReveal();
  const [activeTab, setActiveTab] = useState('all');
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const data = await backendService.getAllCases();
        setCases(data);
      } catch (e) {
        console.error('Failed to load cases:', e);
      }
      setLoading(false);
    };
    loadCases();
  }, []);

  const categories = [
    { id: 'all', label: t('ทั้งหมด', 'ALL') },
    { id: 'labor', label: t('แรงงาน', 'LABOR') },
    { id: 'dispute', label: t('คดีความ', 'DISPUTE') },
    { id: 'ip', label: t('ทรัพย์สินทางปัญญา', 'IP') },
    { id: 'visa', label: t('วีซ่า', 'VISA') },
    { id: 'enforcement', label: t('บังคับคดี', 'EXECUTION') },
    { id: 'realestate', label: t('อสังหาฯ', 'REAL ESTATE') },
    { id: 'family', label: t('ครอบครัว', 'FAMILY') },
    { id: 'business', label: t('ธุรกิจ/แพ่ง', 'BUSINESS') }
  ];

  const filteredCases = activeTab === 'all' 
    ? cases 
    : cases.filter(c => c.category === activeTab);

  return (
    <section id="works" className="py-48 bg-slate-950 relative overflow-hidden">
      {/* Subtle Luxury Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="grid grid-cols-12 h-full">
           {[...Array(12)].map((_, i) => <div key={i} className="border-r border-white/20 h-full"></div>)}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-left relative z-10">
        <div ref={ref} className={className}>
          <SectionHeader 
            title={t('Major Milestones', 'Significant Milestones')} 
            subtitle={t('ลูกค้าของเรา', 'Proven Excellence')} 
            light 
          />
          
          <div className="flex flex-wrap gap-12 mb-24 border-b border-white/5 pb-10">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all relative pb-6 ${
                  activeTab === cat.id ? 'text-[#c5a059]' : 'text-slate-500 hover:text-white'
                }`}
              >
                {cat.label}
                <div className={`absolute bottom-0 left-0 h-[2px] bg-[#c5a059] transition-all duration-700 ${activeTab === cat.id ? 'w-full' : 'w-0'}`}></div>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center text-[#c5a059] animate-pulse">
              <Loader2 className="animate-spin mb-6" size={48} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Authenticating Records</span>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-sm">
              <Scale size={48} className="text-slate-800 mb-6" />
              <p className="text-slate-500 text-lg font-serif-legal italic">{t('ข้อมูลจะถูกนำมาแสดงในภายหลัง', 'Content will be available soon')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredCases.map((work) => (
                <div 
                  key={work.id} 
                  onClick={() => onSelectCase(work)}
                  className="group bg-slate-900/40 border border-white/5 overflow-hidden rounded-sm hover:border-[#c5a059]/40 transition-all duration-700 flex flex-col h-full cursor-pointer relative shadow-2xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <img 
                      src={work.mainImage} 
                      alt={work.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] opacity-40 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  </div>
                  
                  <div className="p-12 flex flex-col flex-grow relative z-10">
                    <div className="flex items-center gap-3 text-[#c5a059] mb-6">
                      <Trophy size={14} />
                      <span className="text-[13px] font-black uppercase tracking-[0.2em]">{work.impact}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold font-serif-legal text-white mb-6 leading-snug group-hover:text-[#c5a059] transition-colors h-[4rem] overflow-hidden italic">
                      {work.title}
                    </h3>
                    
                    <div className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">{work.categoryLabel}</span>
                      <button className="text-[10px] font-black uppercase tracking-[0.4em] text-white group-hover:text-[#c5a059] transition-all flex items-center gap-4">
                        {t('รายละเอียด', 'VIEW')} 
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#c5a059] group-hover:w-full transition-all duration-700"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
