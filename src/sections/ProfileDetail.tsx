
import React, { useEffect } from 'react';
import { ArrowLeft, Quote, Mail, Phone, Award, Briefcase, GraduationCap, UserCheck, Scale, Facebook, MessageCircle, MessageSquare, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProfileDetailProps {
  onBack: (targetId?: string) => void;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({ onBack }) => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactItems = [
    { 
      label: 'Email', 
      value: 'thanathep.lawfirm@gmail.com', 
      icon: <Mail size={18} />, 
      href: 'mailto:thanathep.lawfirm@gmail.com' 
    },
    { 
      label: 'Phone', 
      value: '(+66) 0843170627', 
      icon: <Phone size={18} />, 
      href: 'tel:+66843170627' 
    },
    { 
      label: 'Line ID', 
      value: 'f.thanathep', 
      icon: <MessageCircle size={18} />, 
      href: 'https://line.me/ti/p/~f.thanathep' 
    },
    { 
      label: 'Facebook', 
      value: 'Thanathep Prohmchana', 
      icon: <Facebook size={18} />, 
      href: 'https://www.facebook.com/profile.php?id=61577107148720' 
    },
    { 
      label: 'WhatsApp', 
      value: '+66 84 317 0627', 
      icon: <MessageSquare size={18} />, 
      href: 'https://wa.me/66843170627' 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 animate-reveal-up overflow-x-hidden">
      {/* Back Button */}
      <div className="fixed top-16 sm:top-28 left-4 sm:left-6 lg:left-20 z-[110] flex items-center pointer-events-none">
        <button 
          onClick={() => onBack('about')}
          className="pointer-events-auto flex items-center gap-3 text-white hover:text-slate-950 hover:bg-[#c5a059] transition-all bg-slate-900/95 backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-4 border border-white/10 rounded-full group shadow-2xl scale-90 sm:scale-100"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('ย้อนกลับ', 'BACK')}</span>
        </button>
      </div>

      {/* 1. Main Profile Section (Split Image/Text) */}
      <div className="flex flex-col lg:flex-row min-h-screen relative border-b border-white/5">
        {/* Visual Column (Left) */}
        <div className="w-full lg:w-2/5 h-[50vh] sm:h-[60vh] lg:h-screen relative lg:sticky lg:top-0 overflow-hidden bg-slate-900">
          <img 
            src="./profile.jpg" 
            alt="Thanathep Prohmchana" 
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 15%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div className="absolute top-10 right-10 opacity-10 hidden lg:block rotate-12 pointer-events-none">
            <Scale size={120} className="text-[#c5a059]" strokeWidth={0.5} />
          </div>
          <div className="absolute bottom-6 sm:bottom-20 left-4 sm:left-10 right-4 sm:right-10 p-5 sm:p-10 bg-slate-950/80 backdrop-blur-xl border-l-4 border-[#c5a059] shadow-2xl">
            <Quote className="text-[#c5a059] opacity-30 mb-2 sm:mb-4" size={24} />
            <p className="text-sm sm:text-xl font-serif-legal italic text-white/90 leading-relaxed">
              {t(
                "ผมเชื่อว่าความเชี่ยวชาญต้องมาคู่กับจริยธรรม ทุกคดีที่ผมทำคือความรับผิดชอบที่ยิ่งใหญ่ที่สุด",
                "I believe that expertise must be paired with ethics. Every case I handle is my greatest responsibility."
              )}
            </p>
          </div>
        </div>

        {/* Content Column (Right) */}
        <div className="w-full lg:w-3/5 p-6 sm:p-12 lg:p-24 lg:pt-40 text-left bg-slate-950 space-y-24 sm:space-y-32">
          {/* Hero Content */}
          <section className="animate-reveal-up">
            <div className="flex items-center gap-4 mb-4 sm:mb-8">
              <div className="w-8 sm:w-12 h-[1px] bg-[#c5a059]"></div>
              <span className="text-[#c5a059] text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em]">ATTORNEY AT LAW</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif-legal font-bold text-white mb-6 sm:mb-10 leading-tight">
              ธนเทพ <span className="text-white block sm:inline">พรหมชนะ</span>
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl font-light text-slate-400 mb-8 sm:mb-12 italic border-l-2 border-white/10 pl-5 sm:pl-8">
              {t('ทนายความผู้เชี่ยวชาญด้านกฎหมายแพ่ง ธุรกิจ และแรงงาน', 'Expert Attorney specializing in Civil, Business, and Labor Law')}
            </p>
            <div className="prose prose-invert max-w-none text-sm sm:text-xl text-slate-300 font-light leading-relaxed">
              <p>
                {t(
                  "ผมมุ่งเน้นการสร้างผลลัพธ์ที่จับต้องได้จริงให้กับลูกความ การทำงานของผมไม่ใช่เพียงแค่การสู้คดีในศาล แต่คือการวางแผนป้องกันความเสี่ยง และหาทางออกที่ดีที่สุดในเชิงยุทธศาสตร์ให้กับองค์กรและบุคคลทั่วไป",
                  "I focus on delivering tangible results for my clients. My work goes beyond court battles; it involves risk prevention planning and finding the best strategic solutions for both corporations and individuals."
                )}
              </p>
            </div>
          </section>

          {/* Info Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
            <div className="space-y-12">
              <div className="group">
                <div className="flex items-center gap-4 text-[#c5a059] mb-4 sm:mb-6">
                  <GraduationCap size={20} className="sm:size-[24px]" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest">{t('ประวัติการศึกษา', 'EDUCATION')}</h3>
                </div>
                <div className="space-y-4 text-slate-300 font-light pl-6 sm:pl-10 border-l border-white/5">
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base">{t('นิติศาสตรบัณฑิต (LL.B.)', 'Bachelor of Laws (LL.B.)')}</p>
                    <p className="text-xs sm:text-sm text-[#c5a059]">{t('เกียรตินิยมอันดับ ๒ มหาวิทยาลัยศรีนครินทรวิโรฒ', 'Second Class Honors, SWU')}</p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base">{t('ประกาศนียบัตรวิชาว่าความ', 'Lawyer License')}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{t('สภาทนายความในพระบรมราชูปถัมภ์', 'Lawyers Council of Thailand')}</p>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="flex items-center gap-4 text-[#c5a059] mb-4 sm:mb-6">
                  <Briefcase size={20} className="sm:size-[24px]" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest">{t('การเป็นสมาชิก', 'MEMBERSHIPS')}</h3>
                </div>
                <div className="space-y-3 text-slate-300 font-light pl-6 sm:pl-10 border-l border-white/5 text-xs sm:text-base">
                   <p>{t('• สมาชิกสภาทนายความ ในพระบรมราชูปถัมภ์', '• Member of the Lawyers Council of Thailand')}</p>
                   <p>{t('• สมาชิกวิสามัญแห่งเนติบัณฑิตยสภา', '• Extraordinary Member of the Thai Bar Association')}</p>
                </div>
              </div>
            </div>
            <div className="space-y-12">
              <div className="group">
                <div className="flex items-center gap-4 text-[#c5a059] mb-4 sm:mb-6">
                  <Award size={20} className="sm:size-[24px]" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest">{t('ความเชี่ยวชาญ', 'EXPERTISE')}</h3>
                </div>
                <div className="space-y-3 text-slate-300 font-light pl-6 sm:pl-10 border-l border-white/5 text-xs sm:text-base">
                   <p>{t('• คดีแพ่ง และคดีธุรกิจ', '• Civil and Business Law')}</p>
                   <p>{t('• คดีแรงงาน และคดีล้มละลาย', '• Labor and Bankruptcy Law')}</p>
                   <p>{t('• คดีทรัพย์สินทางปัญญา', '• Intellectual Property Law')}</p>
                </div>
              </div>
              <div className="group">
                <div className="flex items-center gap-4 text-[#c5a059] mb-4 sm:mb-6">
                  <UserCheck size={20} className="sm:size-[24px]" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest">{t('ทักษะพิเศษ', 'SKILLS')}</h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 pl-6 sm:pl-10">
                   {['Business Law', 'Labor Law', 'Litigation', 'Contract Law', 'Litigation & Mediation'].map(skill => (
                     <span key={skill} className="px-3 py-1 border border-white/10 text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-[#c5a059] transition-all">
                       {skill}
                     </span>
                   ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 2. Standalone Centered Contact Section (Transparent Background) */}
      <section className="py-24 sm:py-32 bg-transparent text-center px-6 relative overflow-hidden">
        {/* Subtle Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
        
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h3 className="text-3xl sm:text-5xl font-serif-legal font-bold text-white mb-6">
              {t('ข้อมูลติดต่อส่วนตัว', 'Direct Communication Channels')}
            </h3>
            <div className="w-12 h-1 bg-[#c5a059] mx-auto opacity-50"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactItems.map((item, idx) => (
              <a 
                key={idx}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-5 p-6 bg-white/5 border border-white/10 hover:border-[#c5a059] transition-all duration-300 group/link text-left"
              >
                <div className="w-12 h-12 bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] group-hover/link:bg-[#c5a059] group-hover/link:text-white transition-all">
                  {item.icon}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[9px] font-black uppercase text-slate-500 mb-0.5 tracking-widest group-hover/link:text-[#c5a059]/80">{item.label}</p>
                  <p className="text-white font-bold text-[12px] sm:text-[14px] truncate">{item.value}</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-slate-700 group-hover/link:text-[#c5a059] transition-transform group-hover/link:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Standalone Centered CTA Section */}
      <section className="py-32 bg-slate-900 border-t border-white/5 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#c5a059] uppercase tracking-[0.5em] text-[10px] font-black mb-8 animate-pulse">
            {t('พร้อมสำหรับการเริ่มต้น', 'READY TO MOVE FORWARD?')}
          </p>
          <h4 className="text-4xl sm:text-6xl font-serif-legal font-bold text-white mb-16 italic">
            {t('นัดหมายปรึกษาทนายธนเทพ', 'Schedule Your Consultation')}
          </h4>
          
          <div className="relative inline-block group w-full sm:w-auto">
            <div className="absolute -inset-1 bg-[#c5a059] rounded-sm blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <button 
              onClick={() => onBack('about')}
              className="relative w-full sm:w-auto bg-[#c5a059] text-white px-12 sm:px-24 py-6 sm:py-8 text-[12px] sm:text-[14px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] transition-all duration-500 overflow-hidden shadow-2xl flex items-center justify-center gap-6"
            >
              <span className="relative z-10">{t('จองเวลาปรึกษาทันที', 'BOOK YOUR SESSION NOW')}</span>
              <div className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-500"></div>
              
              {/* Shine effect */}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
            </button>
          </div>

          <div className="mt-20 flex justify-center items-center gap-6 opacity-20">
            <div className="h-[1px] w-20 bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-[#c5a059]"></div>
            <div className="h-[1px] w-20 bg-white"></div>
          </div>
        </div>
      </section>

      {/* Profile Footer */}
      <footer className="py-12 bg-slate-950 border-t border-white/5 text-center">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-40 text-[9px] uppercase tracking-[0.4em] font-bold">
          <p>&copy; 2024 THANATHEP PROHMCHANA</p>
          <div className="flex gap-8">
            <span>PROFESSIONAL LEGAL SERVICE</span>
            <span>EXPERTISE & INTEGRITY</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};
