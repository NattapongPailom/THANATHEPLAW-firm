
import React from 'react';
import { CheckCircle2, Briefcase } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../context/LanguageContext';

export const LaborService: React.FC = () => {
  const { ref, className } = useReveal();
  const { t } = useLanguage();
  
  const services = [
    { th: "จัดทำสัญญาจ้างแรงงาน ครอบคลุมทั้งสัญญาจ้างแบบมีกำหนดระยะเวลา และไม่มีกำหนดระยะเวลา รวมถึงสัญญาสำหรับผู้บริการ", en: "Employment Contracts: Preparation of employment agreements covering both fixed-term employment contracts and indefinite-term employment contracts, including service agreements for independent contractors." },
    { th: "ข้อบังคับเกี่ยวกับการทำงาน การร่างและตรวจสอบข้อบังคับให้สอดคล้องกับกฎหมายว่าด้วยคุ้มครองแรงงาน", en: "Work Rules and Regulations: Drafting and reviewing work rules to ensure compliance with labor protection legislation." },
    { th: "นโยบายและสวัสดิการ การลา การจ่ายโบนัส หรือนโยบายการทำงานจากที่บ้าน (Remote Working)", en: "Policies and Benefits: Leave policies, bonus payment schemes, and remote working policies." },
    { th: "ข้อตกลงเกี่ยวกับสหภาพการจ้าง การเจรจาต่อรองกับสหภาพแรงงาน", en: "Agreements: Negotiation with labor unions regarding terms and conditions of employment." },
    { th: "การควบรวมหรือโอนย้ายกิจการ การจัดการสิทธิของลูกจ้างเมื่อมีการเปลี่ยนแปลงโครงสร้างองค์กร", en: "Merger or Transfer of Undertakings: Management of employee rights during organizational restructuring and business transfers."},
    { th: "การเป็นตัวแทนในชั้นพนักงานตรวจแรงงาน เมื่อมีการร้องเรียนต่อกรมสวัสดิการและคุ้มครองแรงงาน", en: "Representation before Labor Inspectors: Representation in proceedings before the Department of Labor Protection and Welfare when complaints are filed." },
    { th: "การระงับข้อพิพาททางแรงงาน การเป็นตัวแทนว่าต่างหรือแก้ต่างในชั้นศาล ครอบคลุมคดีเลิกจ้างไม่เป็นธรรม การค้างจ่ายค่าจ้าง ", en: "Labor Dispute Resolution: Legal representation and advocacy in court proceedings, covering cases of wrongful termination and wage arrears." },
    { th: "ค่าชดเชย ค่าบอกกล่าวล่วงหน้า รวมถึงการเจรจาไกล่เกลี่ยทำสัญญาประนีประนอมยอมความเพื่อจบข้อพิพาททั้งในศาลและนอกศาล", en: "Severance Pay and Notice Pay: Including negotiation and mediation for settlement agreements to resolve disputes both in and out of court through compromise." }
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
            <div 
              className="w-full h-full opacity-5 grayscale group-hover:opacity-10 transition-opacity duration-[5s] ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='g'%3E%3Cstop offset='0%25' style='stop-color:%23c5a059;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%23ffffff;stop-opacity:0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='%23000'/%3E%3Ccircle cx='800' cy='450' r='600' fill='url(%23g)'/%3E%3Ctext x='800' y='450' text-anchor='middle' dominant-baseline='middle' font-size='120' font-weight='bold' fill='%23c5a059' opacity='0.2'%3ELabor Law%3C/text%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
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
