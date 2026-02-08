
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onAdminLink?: () => void;
  onCaseTracker?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminLink, onCaseTracker }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 py-12 sm:py-16 md:py-24 lg:py-32 relative z-10 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-20 mb-10 sm:mb-14 md:mb-20 border-b border-white/5 pb-10 sm:pb-14 md:pb-20">
          <div className="sm:col-span-2">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter text-white mb-6 sm:mb-8 md:mb-10">
              <span className="text-[#c5a059] font-serif-legal italic">T</span>HANATHEP<span className="font-light tracking-[0.2em] ml-2 opacity-30 text-sm sm:text-base lg:text-lg uppercase">Law Firm</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              {t(
                'สำนักงานกฎหมายทนายธนเทพ พรหมชนะ มุ่งเน้นการให้บริการทางกฎหมายที่มีประสิทธิภาพ แม่นยำ และรักษาผลประโยชน์สูงสุดของลูกความด้วยจริยธรรมวิชาชีพ',
                'Thanathep Prohmchana Law Office focuses on providing efficient, precise legal services and safeguarding client interests with the highest professional ethics.'
              )}
            </p>
          </div>
          <div>
            <h4 className="text-[13px] sm:text-[15px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#c5a059] mb-4 sm:mb-6 md:mb-8">{t('สถานที่ตั้ง', 'Location')}</h4>
            <p className="text-slate-400 text-[13px] sm:text-[14px] leading-relaxed font-bold tracking-wider uppercase">
              {t('11 ซอยท้ายบ้าน 16 ต.ปากน้ำ', '11 Soi Thai Ban 16, Pak Nam')} <br />
              {t('อ.เมืองสมุทรปราการ', 'Mueang Samut Prakan')} <br />
              {t('จ.สมุทรปราการ 10270', 'Samut Prakan 10270')}
            </p>
          </div>
          <div>
            <h4 className="text-[13px] sm:text-[15px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#c5a059] mb-4 sm:mb-6 md:mb-8">{t('ติดต่อเรา', 'Contact')}</h4>
            <p className="text-slate-400 text-[13px] sm:text-[14px] leading-relaxed font-bold tracking-wider uppercase">
              Tel: 084-317-0627 <br />
              Line: f.thanathep <br />
              {t('เวลาทำการ', 'Hours')}: 08:30 - 17:30
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-10">
          <div className="text-[10px] sm:text-[12px] text-slate-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-center md:text-left">
            &copy; 2024 THANATHEP PROHMCHANA. {t('สำนักงานที่ปรึกษากฎหมายและการว่าความ', 'ATTORNEY AT LAW & CONSULTANT.')}
          </div>
          <div className="flex gap-6 sm:gap-8 md:gap-12 text-[11px] sm:text-[13px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-slate-700">
            <a href="#" className="hover:text-[#c5a059] transition-colors">{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</a>
            {window.location.hostname === 'localhost' && (
              <button onClick={onAdminLink} className="hover:text-[#c5a059] transition-all">
                {t('จัดการระบบ', 'ADMIN')}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
