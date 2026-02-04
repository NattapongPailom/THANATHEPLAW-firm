
import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Quote, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CaseStudy } from '../types';

interface CaseDetailProps {
  caseData: CaseStudy;
  onBack: (targetId?: string) => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseData, onBack }) => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [caseData.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 animate-reveal-up pb-32 overflow-x-hidden">
      {/* Back Button Floating */}
      <button 
        onClick={() => onBack('works')}
        className="fixed top-32 left-6 lg:left-12 z-[110] bg-[#c5a059] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Hero Section */}
      <header className="relative h-[75vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={caseData.mainImage} alt={caseData.title} className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16 pb-24 w-full text-left">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-[#c5a059] text-white text-[10px] font-black px-6 py-2 uppercase tracking-[0.4em]">{caseData.year}</span>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">{caseData.categoryLabel}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif-legal font-bold text-white leading-[1.1] max-w-5xl italic">
            {caseData.title}
          </h1>
        </div>
      </header>

      {/* Success Metrics Bar */}
      <section className="bg-[#c5a059] py-14">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-xl">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.5em] mb-2">{t('ผลลัพธ์คดี', 'CASE OUTCOME')}</p>
                <p className="text-3xl font-bold text-white uppercase tracking-wider">{caseData.impact}</p>
              </div>
            </div>
            <div className="hidden md:block h-16 w-[1px] bg-white/20"></div>
            <div className="flex gap-16">
              {caseData.highlights.map((h, i) => (
                <div key={i} className="text-center">
                  <p className="text-white/70 text-[9px] font-black uppercase tracking-[0.5em] mb-2">{t('ความสำเร็จ', 'ACHIEVEMENT')} {i + 1}</p>
                  <p className="text-xl font-bold text-white uppercase tracking-widest">{h}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Gallery */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-40">
        <div className="flex flex-col lg:flex-row gap-24">
          {/* Article Text */}
          <div className="lg:w-3/5 text-left">
            <div className="prose prose-invert prose-2xl max-w-none">
              {caseData.fullContent.map((paragraph, i) => (
                <p key={i} className={`text-slate-300 font-light leading-relaxed mb-12 text-xl md:text-2xl ${i === 0 ? 'first-letter:text-8xl first-letter:font-serif-legal first-letter:text-[#c5a059] first-letter:float-left first-letter:mr-6 first-letter:font-bold first-letter:leading-none' : ''}`}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Blockquote */}
            <div className="my-24 p-16 bg-slate-900 border-l-[8px] border-[#c5a059] relative shadow-2xl rounded-sm">
              <Quote className="absolute top-10 left-10 text-[#c5a059]/10" size={160} />
              <p className="text-3xl md:text-4xl font-serif-legal italic text-white relative z-10 leading-relaxed">
                {t(
                  "ความยุติธรรมไม่ใช่เรื่องบังเอิญ แต่คือผลลัพธ์ของการวางกลยุทธ์ที่แม่นยำและการรักษาจริยธรรมวิชาชีพอย่างสูงสุด",
                  "Justice is not accidental; it is the result of precise strategy and the highest professional ethics."
                )}
              </p>
              <footer className="mt-10 text-[#c5a059] font-black uppercase tracking-[0.5em] text-xs">— Thanathep Prohmchana</footer>
            </div>
          </div>

          {/* Sidebar Gallery / Info */}
          <div className="lg:w-2/5 space-y-16">
            <div className="bg-slate-900/50 p-12 border border-white/5 rounded-sm shadow-xl">
              <h4 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.6em] mb-10 flex items-center gap-4">
                <ImageIcon size={18} /> {t('คลังภาพประกอบคดี', 'CASE GALLERY')}
              </h4>
              <div className="grid grid-cols-2 gap-6">
                {caseData.gallery.map((img, i) => (
                  <div key={i} className={`overflow-hidden rounded-sm bg-slate-800 shadow-lg ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 cursor-pointer opacity-80 hover:opacity-100" />
                  </div>
                ))}
              </div>
              <p className="mt-8 text-[11px] text-slate-500 italic font-light">
                * {t('เพื่อรักษาความลับของลูกความ บางภาพเป็นภาพจำลองบรรยากาศที่เกี่ยวข้อง', 'For confidentiality, some images represent related atmospheres.')}
              </p>
            </div>

            <div className="bg-white/[0.03] p-12 border-l-[2px] border-[#c5a059]/40 rounded-sm">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-8">{t('ประเภทความช่วยเหลือ', 'SERVICE SCOPE')}</h4>
              <ul className="space-y-6">
                {['Strategic Litigation', 'Contractual Framework', 'Alternative Dispute Resolution', 'High-Court Representation'].map((s, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-slate-400 text-lg font-light italic">
                    <div className="w-2 h-2 bg-[#c5a059] rounded-full"></div> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Closing Action */}
        <div className="mt-60 py-24 border-t border-white/5 text-center">
           <p className="text-slate-500 uppercase tracking-[0.8em] font-black text-[10px] mb-12">{t('หากคุณกำลังเผชิญปัญหาในลักษณะเดียวกัน', 'FACING A SIMILAR LEGAL ISSUE?')}</p>
           <h3 className="text-5xl md:text-7xl font-serif-legal font-bold text-white mb-16 italic">{t('ให้เราช่วยคุณหาทางออก', 'Let us guide you to justice.')}</h3>
           <button onClick={() => onBack('works')} className="bg-[#c5a059] text-white px-20 py-8 inline-block font-black uppercase tracking-[0.6em] hover:bg-white hover:text-slate-950 transition-all shadow-2xl">
             {t('จองเวลาปรึกษาทนาย', 'BOOK A CONSULTATION')}
           </button>
        </div>
      </section>
    </div>
  );
};
