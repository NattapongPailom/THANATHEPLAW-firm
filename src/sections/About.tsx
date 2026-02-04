import React from 'react';
import { useReveal } from '../hooks/useReveal';
import { Award, GraduationCap, Users, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutProps {
  onShowProfile?: () => void;
}

export const About: React.FC<AboutProps> = ({ onShowProfile }) => {
  const { ref, className } = useReveal();
  const { t } = useLanguage();

  return (
    <section id="about" className="py-48 bg-slate-950 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div ref={ref} className={`${className} flex flex-col lg:flex-row items-start gap-24`}>
          
          {/* Interactive Profile Image Container */}
          <div className="lg:w-1/2 relative group cursor-pointer" onClick={onShowProfile}>
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-slate-900 z-0 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"></div>
            
            <div className="relative z-10 aspect-[4/5] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="/profile.jpg" 
                alt="Professional Profile" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                style={{ objectPosition: '50% 15%' }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center">
                <div className="w-20 h-20 border border-[#c5a059]/50 rounded-full flex items-center justify-center mb-6 scale-50 group-hover:scale-100 transition-transform duration-700 delay-100">
                   <ExternalLink className="text-[#c5a059]" size={32} />
                </div>
                <div className="bg-[#c5a059] text-white px-8 py-4 text-[14px] font-black uppercase tracking-[0.2em] translate-y-10 group-hover:translate-y-0 transition-transform duration-700 delay-200 shadow-2xl">
                  {t('คลิกเพื่อดูประวัติ', 'VIEW FULL PROFILE')}
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c5a059]/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Tag */}
            <div className="absolute -left-4 top-1/2 -rotate-90 origin-left z-20 hidden lg:block">
               <span className="text-[10px] font-black uppercase tracking-[1em] text-white/20">THANATHEP PROHMCHANA</span>
            </div>
          </div>

          <div className="lg:w-1/2 text-left">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-[2px] w-12 bg-[#c5a059]"></div>
              <span className="text-[#c5a059] text-[13px] font-black uppercase tracking-[0.2em]">
                {t('ประวัติและความสำเร็จ', 'BIOGRAPHY & ACHIEVEMENTS')}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-serif-legal font-bold text-white mb-12 leading-tight">
              {t('เกียรติเเละความซื่อสัตย์ในการปฏิบัติงานวิชาชีพ', 'Honors & Integrity In Professional Practice')}
            </h2>

            <div className="space-y-12 mb-16">
              <div className="flex gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white transition-all">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h4 className="text-white text-lg font-bold mb-2 font-serif-legal">
                    {t('การศึกษา', 'EDUCATION')}
                  </h4>
                  <p className="text-slate-400 leading-relaxed font-light">
                    {t('นิติศาสตรบัณฑิต (เกียรตินิยมอันดับ ๒) มหาวิทยาลัยศรีนครินทรวิโรฒ', 'Bachelor of Laws (Second Class Honors), Srinakharinwirot University')} <br />
                    {t('ประกาศนียบัตรวิชาว่าความ สภาทนายความในพระบรมราชูปถัมภ์', 'Lawyer License Certificate, Lawyers Council of Thailand')}
                  </p>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white transition-all">
                  <Users size={28} />
                </div>
                <div>
                  <h4 className="text-white text-lg font-bold mb-2 font-serif-legal">
                    {t('การเป็นสมาชิก', 'PROFESSIONAL MEMBERSHIPS')}
                  </h4>
                  <p className="text-slate-400 leading-relaxed font-light">
                    • {t('สมาชิกสภาทนายความ ในพระบรมราชูปถัมภ์', 'Member of the Lawyers Council of Thailand')} <br />
                    • {t('สมาชิกวิสามัญแห่งเนติบัณฑิตยสภา', 'Extraordinary Member of the Thai Bar Association')}
                  </p>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white transition-all">
                  <Award size={28} />
                </div>
                <div>
                  <h4 className="text-white text-lg font-bold mb-2 font-serif-legal">
                    {t('ปรัชญาการทำงาน', 'PRACTICE PHILOSOPHY')}
                  </h4>
                  <p className="text-slate-300 italic leading-relaxed font-light">
                    "{t('มอบความใส่ใจและกลยุทธ์กฎหมายที่แม่นยำ เพื่อรักษาผลประโยชน์สูงสุดของลูกความอย่างตรงไปตรงมา', 'Dedicated attention and precise legal strategies to safeguard client interests with absolute integrity.')}"
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={onShowProfile}
                className="group flex items-center gap-6 text-[13px] font-black uppercase tracking-[0.3em] text-[#c5a059] hover:text-white transition-all"
              >
                {t('ดูประวัติส่วนตัวฉบับเต็ม', 'VIEW FULL BIOGRAPHY')}
                <div className="w-12 h-[1px] bg-[#c5a059] group-hover:w-24 group-hover:bg-white transition-all"></div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};