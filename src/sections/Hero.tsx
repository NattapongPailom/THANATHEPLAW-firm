
import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-start overflow-hidden bg-slate-950 py-20 lg:py-0">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522165078649-823cf4dbaf46?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
          alt="Partnership and Support Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40 lg:via-slate-950/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 w-full">
        <div className="flex flex-col items-start max-w-5xl">
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold font-serif-legal text-white mb-6 sm:mb-10 leading-[1.1] animate-reveal-up" style={{animationDelay: '0.2s'}}>
            {t('ให้บริการทางกฎหมาย', 'LEGAL ADVICE')} <br />
            <span className="text-[#c5a059]">
              {t('อย่างมืออาชีพ', 'WITH EXCELLENCE')}
            </span><br />
            <span className="text-xl sm:text-3xl md:text-5xl font-light italic text-white/80 block mt-2 sm:mt-4">
              {t('เคียงข้างคุณในทุกขั้นตอน', 'BY YOUR SIDE AT EVERY STEP')}
            </span>
          </h1>

          {/* Descriptive Content */}
          <div className="max-w-2xl mb-10 sm:mb-16 animate-reveal-up" style={{animationDelay: '0.4s'}}>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-6 sm:mb-8">
              {t(
                'เราไม่ได้เป็นเพียงแค่ที่ปรึกษากฎหมาย แต่เราคือหุ้นส่วนทางยุทธศาสตร์ที่พร้อมจะสนับสนุนคุณในทุกความท้าทาย เพื่อให้คุณก้าวข้ามทุกอุปสรรคได้อย่างมั่นใจ',
                'An evolved market requires an evolved approach. We build dynamic and commercially-minded solutions for our clients across a range of practice areas.'
              )}
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full sm:w-auto animate-reveal-up" style={{animationDelay: '0.6s'}}>
            <a href="#contact" className="group bg-[#c5a059] hover:bg-white text-white hover:text-slate-950 px-8 sm:px-16 py-5 sm:py-7 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-all flex items-center justify-center gap-4 sm:gap-6 shadow-2xl relative overflow-hidden">
              <span className="relative z-10">{t('ปรึกษาทนาย', 'FIND OUT MORE')}</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </a>
            
            <a href="#about" className="group border border-white/20 hover:border-[#c5a059] px-8 sm:px-16 py-5 sm:py-7 text-[11px] sm:text-[12px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-all flex items-center justify-center gap-4 hover:bg-[#c5a059]/5">
              {t('ทำความรู้จักเรา', 'OUR STORY')}
              <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator - Hidden on Mobile */}
      <div className="absolute bottom-12 left-20 hidden lg:flex items-center gap-6 animate-bounce pointer-events-none">
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c5a059] vertical-text">SCROLL</span>
      </div>
    </section>
  );
};
