
import React from 'react';
import { useReveal } from '../hooks/useReveal';
import { ExternalLink, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutProps {
  onShowProfile?: () => void;
}

export const About: React.FC<AboutProps> = ({ onShowProfile }) => {
  const { ref, className } = useReveal();
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 lg:py-48 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Artistic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] bg-[#c5a059]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-px h-1/2 bg-[#c5a059]"></div>
        <div className="absolute top-1/4 right-1/4 w-px h-1/2 bg-[#c5a059]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 w-full flex flex-col items-center">
        <div ref={ref} className={`${className} relative z-10 w-full max-w-2xl`}>
          
          {/* Enhanced Centered Profile Container */}
          <div className="relative group cursor-pointer" onClick={onShowProfile}>
            {/* Animated Glow Backlight */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#c5a059]/20 to-transparent rounded-sm blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            {/* Luxury Offset Frames */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-[#c5a059]/20 z-0 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <div className="absolute -top-6 -left-6 w-full h-full border border-white/5 z-0 transition-transform duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
            
            <div className="relative z-10 aspect-[4/5] overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] bg-slate-900">
              <img 
                src="./profile.jpg" 
                alt="Thanathep Prohmchana" 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2s] ease-out"
                style={{ objectPosition: '50% 15%' }}
              />
              
              {/* Refined Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center">
                <div className="w-24 h-24 border border-[#c5a059]/30 rounded-full flex items-center justify-center mb-8 scale-50 group-hover:scale-100 transition-transform duration-700 delay-100 relative">
                   <div className="absolute inset-0 border border-[#c5a059]/10 rounded-full animate-ping"></div>
                   <ExternalLink className="text-[#c5a059]" size={36} />
                </div>
                
                <div className="overflow-hidden">
                  <div className="bg-[#c5a059] text-white px-10 py-5 text-[14px] font-black uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-700 delay-200 shadow-2xl">
                    {t('ดูประวัติส่วนตัว', 'VIEW BIOGRAPHY')}
                  </div>
                </div>
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-[#c5a059]/40 m-4 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#c5a059]/40 m-4 pointer-events-none"></div>
              
              {/* Professional Icon Accent */}
              <div className="absolute top-8 left-8 opacity-40">
                <Shield size={24} className="text-[#c5a059]" />
              </div>
            </div>

            {/* Vertical Name Accent - Centered with image */}
            <div className="absolute -right-12 top-1/2 -rotate-90 origin-center z-20 hidden xl:block">
               <span className="text-[10px] font-black uppercase tracking-[1.2em] text-white/10 whitespace-nowrap">THANATHEP PROHMCHANA</span>
            </div>
          </div>

          {/* Simple Centered Action Button below image */}
          <div className="mt-10 sm:mt-14 md:mt-20 flex flex-col items-center space-y-4 sm:space-y-6">
            <div className="w-px h-10 sm:h-16 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
            <button
              onClick={onShowProfile}
              className="group flex items-center gap-3 sm:gap-6 text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#c5a059] hover:text-white transition-all"
            >
              {t('อ่านประวัติโดยละเอียด', 'OPEN PORTFOLIO')}
              <div className="w-8 sm:w-12 h-[1px] bg-[#c5a059] group-hover:w-16 sm:group-hover:w-24 group-hover:bg-white transition-all duration-700"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
