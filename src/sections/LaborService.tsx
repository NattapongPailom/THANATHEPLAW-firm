
import React from 'react';
import { CheckCircle2, Briefcase } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../context/LanguageContext';

export const LaborService: React.FC = () => {
  const { ref, className } = useReveal();
  const { t } = useLanguage();
  
  const services = [
    { th: "จัดทำสัญญาจ้างแรงงาน ครอบคลุมทั้งสัญญาจ้างแบบมีกำหนดระยะเวลา และไม่มีกำหนดระยะเวลา รวมถึงสัญญาสำหรับผู้บริการ", en: "Drafting employment contracts (fixed, non-fixed terms, and executive agreements)" },
    { th: "ข้อบังคับเกี่ยวกับการทำงาน การร่างและตรวจสอบข้อบังคับให้สอดคล้องกับกฎหมายว่าด้วยคุ้มครองแรงงาน", en: "Drafting and reviewing work regulations to comply with labor protection laws" },
    { th: "นโยบายและสวัสดิการ การลา การจ่ายโบนัส หรือนโยบายการทำงานจากที่บ้าน (Remote Working)", en: "Designing employment policies, benefits, leave, and remote working structures" },
    { th: "ข้อตกลงเกี่ยวกับสหภาพการจ้าง การเจรจาต่อรองกับสหภาพแรงงาน", en: "Negotiations with labor unions and collective bargaining agreements" },
    { th: "การควบรวมหรือโอนย้ายกิจการ การจัดการสิทธิของลูกจ้างเมื่อมีการเปลี่ยนแปลงโครงสร้างองค์กร", en: "Managing employee rights during mergers, acquisitions, or business transfers" },
    { th: "การเป็นตัวแทนในชั้นพนักงานตรวจแรงงาน เมื่อมีการร้องเรียนต่อกรมสวัสดิการและคุ้มครองแรงงาน", en: "Representative at the Department of Labor Protection and Welfare" },
    { th: "การระงับข้อพิพาททางแรงงาน การเป็นตัวแทนว่าต่างหรือแก้ต่างในชั้นศาล ครอบคลุมคดีเลิกจ้างไม่เป็นธรรม การค้างจ่ายค่าจ้าง ", en: "Litigation for unfair dismissal, unpaid wages, severance, and notice pay" },
    { th: "ค่าชดเชย ค่าบอกกล่าวล่วงหน้า รวมถึงการเจรจาไกล่เกลี่ยทำสัญญาประนีประนอมยอมความเพื่อจบข้อพิพาททั้งในศาลและนอกศาล", en: "Mediation and settlement agreements inside and outside of court" }
  ];

  return (
    <section className="py-24 sm:py-48 bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#c5a059]/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
        <div 
          ref={ref} 
          className={`${className} relative bg-slate-900 border border-[#c5a059]/30 rounded-sm overflow-hidden flex flex-col lg:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] group`}
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1521791136364-798a7bc0d262?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
              alt="Labor Law Background" 
              className="w-full h-full object-cover opacity-5 grayscale group-hover:scale-105 transition-transform duration-[5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/95 lg:via-slate-950/90"></div>
          </div>

          {/* Left Column: Featured Title */}
          <div className="lg:w-1/3 p-8 sm:p-16 lg:p-20 bg-[#c5a059] text-white flex flex-col justify-center text-left relative z-10 overflow-hidden shadow-2xl">
            {/* Visual Accent */}
            <div className="absolute -top-10 -right-10 opacity-10 transform rotate-12 pointer-events-none">
               <Briefcase size={250} />
            </div>
            
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif-legal font-bold mb-4 sm:mb-8 leading-tight relative z-10">
              {t('เชี่ยวชาญพิเศษด้านกฎหมายแรงงาน', 'Specialized in Labor Law')}
            </h3>
            <div className="w-12 sm:w-16 h-1 bg-white/40 mb-4 sm:mb-8 relative z-10"></div>
            <p className="text-white/90 text-sm sm:text-lg font-light leading-relaxed sm:leading-loose relative z-10">
              {t('เราดูแลครอบคลุมทุกมิติของการจ้างงาน ตั้งแต่การวางโครงสร้างสัญญาไปจนถึงการปกป้องสิทธิในศาลแรงงานอย่างมืออาชีพ', 'Comprehensive expertise in employment law, from contractual structuring to professional representation in labor court.')}
            </p>
          </div>

          {/* Right Column: Detailed List */}
          <div className="lg:w-2/3 p-6 sm:p-16 lg:p-20 bg-transparent text-left relative z-10">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 sm:gap-y-10">
              {services.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 sm:gap-5 group/item opacity-0 animate-[revealUp_0.8s_ease-out_forwards]"
                  style={{ animationDelay: `${0.1 * idx}s` }}
                >
                  {/* Fixed: Removed sm:size prop which is invalid on Lucide icons and adjusted size */}
                  <CheckCircle2 className="text-[#c5a059] flex-shrink-0 mt-1 transition-all duration-300 group-hover/item:scale-110" size={20} />
                  
                  <p className="text-slate-200 text-[13px] sm:text-base leading-relaxed sm:leading-loose font-light group-hover/item:text-white transition-colors">
                    {t(item.th, item.en)}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Subtle Decorative Line */}
            <div className="mt-10 sm:mt-16 w-full h-px bg-gradient-to-r from-[#c5a059]/40 to-transparent"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};
