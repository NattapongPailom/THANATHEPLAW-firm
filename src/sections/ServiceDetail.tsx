
import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ServiceCategory } from '../types';

interface ServiceDetailProps {
  service: ServiceCategory;
  onBack: (targetId?: string) => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service.id]);

  // Specialized data for featured layouts
  const laborHighlights = [
    { th: "จัดทำสัญญาจ้างแรงงาน ครอบคลุมทั้งสัญญาจ้างแบบมีกำหนดระยะเวลา และไม่มีกำหนดระยะเวลา รวมถึงสัญญาสำหรับผู้บริการ", en: "Employment contracts including fixed-term, indefinite-term, and executive agreements." },
    { th: "ข้อบังคับเกี่ยวกับการทำงาน การร่างและตรวจสอบข้อบังคับให้สอดคล้องกับกฎหมายว่าด้วยคุ้มครองแรงงาน", en: "Drafting and auditing work regulations to ensure full compliance with labor protection laws." },
    { th: "นโยบายและสวัสดิการ การลา การจ่ายโบนัส หรือนโยบายการทำงานจากที่บ้าน (Remote Working)", en: "Company policies and benefits, including leave, bonuses, and remote working (WFH) structures." },
    { th: "ข้อตกลงเกี่ยวกับสหภาพการจ้าง การเจรจาต่อรองกับสหภาพแรงงาน", en: "Collective bargaining and negotiations with labor unions regarding employment conditions." },
    { th: "การควบรวมหรือโอนย้ายกิจการ การจัดการสิทธิของลูกจ้างเมื่อมีการเปลี่ยนแปลงโครงสร้างองค์กร", en: "Managing employee rights during M&A or organizational restructuring." },
    { th: "การเป็นตัวแทนในชั้นพนักงานตรวจแรงงาน เมื่อมีการร้องเรียนต่อกรมสวัสดิการและคุ้มครองแรงงาน", en: "Representation before labor inspectors following complaints at the Department of Labor Welfare." },
    { th: "การระงับข้อพิพาททางแรงงาน การเป็นตัวแทนว่าต่างหรือแก้ต่างในชั้นศาล ครอบคลุมคดีเลิกจ้างไม่เป็นธรรม การค้างจ่ายค่าจ้าง ค่าชดเชย ค่าบอกกล่าวล่วงหน้า รวมถึงการเจรจาไกล่เกลี่ยทำสัญญาประนีประนอมยอมความเพื่อจบข้อพิพาททั้งในศาลและนอกศาล", en: "Labor dispute resolution, including unfair dismissal, unpaid wages, and settlement mediation inside and outside court." }
  ];

  const disputeHighlights = [
    { th: "คดีผิดสัญญา การฟ้องร้องเมื่ออีกฝ่ายไม่ปฏิบัติตามข้อตกลงในสัญญา", en: "Breach of Contract: Litigation for non-compliance." },
    { th: "คดีครอบครัว การฟ้องหย่า การฟ้องชู้เรียกค่าทดแทน การร้องขออำนาจปกครองบุตร และการแบ่งสินสมรส", en: "Family Law: Divorce, alimony, child custody, and marital asset division." },
    { th: "คดีมรดก การร้องขอตั้งผู้จัดการมรดก, การฟ้องแบ่งทรัพย์มรดกระหว่างทายาท และพิพาทเรื่องพินัยกรรม", en: "Inheritance Law: Estate administrator requests and will disputes." },
    { th: "คดีละเมิด การเรียกค่าสินไหมทดแทนจากการที่ถูกผู้อื่นกระทำโดยมิชอบด้วยกฎหมาย", en: "Tort Claims: Seeking compensation for illegal acts causing damage." },
    { th: "คดีเกี่ยวกับองค์กรและธุรกิจ ข้อพิพาทระหว่างผู้ถือหุ้น การฟ้องร้องกรรมการบริษัท", en: "Corporate & Business: Shareholder and director liability disputes." },
    { th: "คดีก่อสร้าง ข้อพิพาทระหว่างเจ้าของโครงการและผู้รับเหมา เกี่ยวกับการทิ้งงาน งานล่าช้า", en: "Construction Law: Disputes regarding work abandonment or delays." },
    { th: "คดีอสังหาริมทรัพย์ คดีพิพาทเรื่องกรรมสิทธิ์ที่ดิน การขับไล่ผู้เช่า การผิดสัญญาจะซื้อจะขาย", en: "Real Estate Law: Title disputes, evictions, and breach of purchase agreements." },
    { th: "คดีคุ้มครองผู้บริโภค สินค้าหรือบริการที่ไม่ได้คุณภาพ ไม่ปลอดภัย หรือถูกเอาเปรียบจากโฆษณา", en: "Consumer Protection: Litigation regarding low-quality products or deceptive ads." },
    { th: "คดีแรงงาน ข้อพิพาทระหว่างนายจ้างและลูกจ้าง เช่น การเลิกจ้างไม่เป็นธรรม การไม่จ่ายค่าชดเชย", en: "Labor Law: Employer-employee disputes including unfair dismissal." },
    { th: "คดีทรัพย์สินทางปัญญา การฟ้องร้องละเมิดลิขสิทธิ์ สิทธิบัตร หรือเครื่องหมายการค้า", en: "IP Law: Infringement litigation for copyrights, patents, or trademarks." }
  ];

  const ipHighlights = [
    { th: "การจดทะเบียนและคุ้มครองสิทธิ (IP Registration): เครื่องหมายการค้า, สิทธิบัตร, ลิขสิทธิ์ และความลับทางการค้า", en: "IP Registration: Trademarks, Patents, Copyrights, and Trade Secrets." },
    { th: "การบริหารจัดการสัญญาและสิทธิ (IP Transactions): สัญญาอนุญาตให้ใช้สิทธิ และสัญญาแฟรนไชส์", en: "IP Transactions: Licensing and Franchise Agreements." },
    { th: "การบังคับใช้สิทธิและคดีความ (IP Enforcement & Litigation): การออกหนังสือเตือน และคดีละเมิด", en: "IP Enforcement: Cease and Desist Letters and Litigation." },
    { th: "การไกล่เกลี่ยข้อพิพาทด้านทรัพย์สินทางปัญญา เพื่อรักษาชื่อเสียงและลดระยะเวลาการดำเนินคดี", en: "IP Dispute Mediation to safeguard reputation and reduce court time." }
  ];

  const visaHighlights = [
    { th: "Business Visa (Non-B): บริการขอและต่ออายุวีซ่าทำงาน รวมถึงวีซ่าสำหรับครอบครัว (Non-O)", en: "Business Visa (Non-B): Application and renewal for work and family visas." },
    { th: "Work Permit: ดำเนินการขอใบอนุญาตทำงานใหม่ เปลี่ยนแปลงรายละเอียด และแจ้งออก", en: "Work Permit: Application, updates, and cancellations." },
    { th: "BOI Privilege: บริการช่องทางด่วน (One Stop Service) สำหรับบริษัทที่ได้รับการส่งเสริมการลงทุน", en: "BOI Privilege: OSS channel for investment-promoted companies." },
    { th: "90 Days Reporting & Re-entry: บริการดูแลรายงานตัว 90 วัน และการขออนุญาตกลับเข้าประเทศ", en: "90 Days Reporting & Re-entry permit handling." }
  ];

  const enforcementHighlights = [
    { th: "การสืบทรัพย์: บริการสืบค้นทรัพย์สินของลูกหนี้ทั่วราชอาณาจักร (ที่ดิน, บัญชีธนาคาร, ยานพาหนะ)", en: "Asset Tracing: Nationwide debtor asset searches." },
    { th: "การยึดและอายัดทรัพย์: ดำเนินการยึดอสังหาริมทรัพย์และอายัดสิทธิเรียกร้องตามคำพิพากษา", en: "Seizure & Garnishment: Real estate and claim execution." },
    { th: "การขายทอดตลาด: ประสานงานขั้นตอนการนำทรัพย์สินออกขายทอดตลาดที่กรมบังคับคดี", en: "Public Auction: Coordination at the Legal Execution Department." },
    { th: "การแถลงคัดค้าน/รวบรวมทรัพย์: ดูแลสิทธิในชั้นบังคับคดี ทั้งฝั่งเจ้าหนี้และลูกหนี้", en: "Legal Statements: Managing rights in the execution phase." }
  ];

  const realestateHighlights = [
    { th: "การตรวจสอบทรัพย์สิน (Due Diligence): ตรวจสอบโฉนดที่ดิน ภาระจำยอม และกฎหมายผังเมือง", en: "Real Estate Due Diligence: Deed and zoning law audit." },
    { th: "สัญญาซื้อขายและสัญญาเช่าระยะยาว (Leasehold): ร่างและตรวจสัญญาที่ดิน คอนโด และชาวต่างชาติ", en: "S&P and Leasehold: Contract drafting for domestic and foreign clients." },
    { th: "การจดทะเบียนสิทธิและนิติกรรม: ตัวแทนดำเนินการ ณ กรมที่ดิน ในการโอนกรรมสิทธิ์ จำนอง", en: "Land Registry: Ownership transfer and mortgage registry services." },
    { th: "สัญญาจ้างก่อสร้าง: ร่างสัญญาจ้างเหมาตามมาตรฐาน FIDIC และข้อกำหนดความรับผิดชอบ", en: "Construction Contracts: Standard drafting and liability clauses." },
    { th: "ข้อพิพาทด้านการก่อสร้าง: ว่าความคดีผิดสัญญาจ้าง งานล่าช้า หรือการทิ้งงาน", en: "Construction Disputes: Litigation for breach, delay, or abandonment." }
  ];

  const familyHighlights = [
    { th: "การจัดการมรดก: บริการร้องขอตั้งผู้จัดการมรดก และแบ่งปันทรัพย์มรดกระหว่างทายาท", en: "Estate Administration: Requesting administrators and heir distribution." },
    { th: "การทำพินัยกรรม (Wills & Trust): วางแผนส่งต่อทรัพย์สินอย่างถูกต้องตามกฎหมาย", en: "Wills & Trust: Planning legal asset succession." },
    { th: "การฟ้องหย่าและแบ่งสินสมรส: บริการตัวแทนจดทะเบียนหย่า หรือฟ้องหย่าต่อศาล", en: "Divorce & Asset Division: Representation in mutual or contested divorce." },
    { th: "สิทธิอุปการะเลี้ยงดูและปกครองบุตร: การเรียกค่าอุปการะเลี้ยงดูและการกำหนดสิทธิปกครอง", en: "Child Custody & Support maintenance fee claims." },
    { th: "การรับรองบุตรและบุตรบุญธรรม: บริการยื่นคำร้องขอรับรองบุตรให้มีสิทธิตามกฎหมาย", en: "Child Legitimation & Adoption court requests." },
    { th: "สัญญาก่อนสมรส: ร่างสัญญาแยกแยะทรัพย์สินส่วนตัวก่อนการเริ่มต้นชีวิตคู่", en: "Prenuptial Agreement drafting for property management." },
    { th: "คดีฟ้องชู้และละเมิดในครอบครัว: ฟ้องเรียกค่าทดแทนตามข้อกฎหมาย", en: "Adultery Claims: Compensation for family relationship damages." }
  ];

  const featuredDataMap: Record<string, {th: string, en: string}[]> = {
    labor: laborHighlights,
    dispute: disputeHighlights,
    ip: ipHighlights,
    visa: visaHighlights,
    enforcement: enforcementHighlights,
    realestate: realestateHighlights,
    family: familyHighlights
  };

  const featuredTitleMap: Record<string, string> = {
    labor: t('เชี่ยวชาญพิเศษด้านกฎหมายแรงงาน', 'Specialized in Labor Law'),
    dispute: t('เชี่ยวชาญพิเศษด้านคดีความและการระงับข้อพิพาท', 'Specialized in Litigation & Dispute Resolution'),
    ip: t('เชี่ยวชาญพิเศษด้านทรัพย์สินทางปัญญา', 'Specialized in Intellectual Property'),
    visa: t('เชี่ยวชาญพิเศษด้านวีซ่าและใบอนุญาตทำงาน', 'Specialized in Visa & Work Permit'),
    enforcement: t('เชี่ยวชาญพิเศษด้านการบังคับคดี', 'Specialized in Legal Execution'),
    realestate: t('เชี่ยวชาญพิเศษด้านอสังหาริมทรัพย์และการก่อสร้าง', 'Specialized in Real Estate & Construction'),
    family: t('เชี่ยวชาญพิเศษด้านครอบครัวและมรดก', 'Specialized in Family & Estate Law')
  };

  const featuredDescriptionMap: Record<string, string> = {
    labor: t('การบริหารจัดการความสัมพันธ์ระหว่างนายจ้างและลูกจ้างอย่างมืออาชีพ เพื่อลดความเสี่ยงและเพิ่มประสิทธิภาพองค์กร', 'Professional management of employer-employee relations to minimize risk and maximize organizational efficiency.'),
    dispute: t('การต่อสู้คดีและระงับข้อพิพาทเชิงกลยุทธ์เพื่อปกป้องผลประโยชน์สูงสุดของลูกความในทุกมิติทางกฎหมาย', 'Strategic litigation and dispute resolution to safeguard the client\'s best interests across all legal dimensions.'),
    ip: t('การปกป้องนวัตกรรมและความคิดสร้างสรรค์ของคุณผ่านกลไกทางกฎหมายที่เข้มแข็งทั้งในระดับประเทศและสากล', 'Protecting your innovation and creativity through robust legal mechanisms both nationally and internationally.'),
    visa: t('อำนวยความสะดวกในการโยกย้ายถิ่นฐานและขออนุญาตทำงานในประเทศไทยอย่างถูกต้องแม่นยำและรวดเร็ว', 'Facilitating global mobility and accurate work permit processing in Thailand with speed and precision.'),
    enforcement: t('การบังคับใช้สิทธิขั้นสุดท้ายตามคำพิพากษา เพื่อให้ลูกความได้รับชำระหนี้อย่างครบถ้วนและรวดเร็ว', 'Final enforcement of judgment rights to ensure complete and timely debt recovery.'),
    realestate: t('ที่ปรึกษาด้านการลงทุนและจัดการทรัพย์สิน เพื่อความมั่นคงสูงสุดในทุกโครงการพัฒนาอสังหาริมทรัพย์', 'Investment advisory and asset management for maximum security in every real estate development project.'),
    family: t('ดูแลความสัมพันธ์และทรัพย์สินในครอบครัวด้วยความเข้าใจ มุ่งเน้นความเป็นธรรมและการวางแผนที่รัดกุม', 'Managing family relationships and assets with empathy, fairness, and airtight legal planning.')
  };

  const featuredData = featuredDataMap[service.id];
  const featuredTitle = featuredTitleMap[service.id];
  const featuredDescription = featuredDescriptionMap[service.id];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 animate-reveal-up overflow-x-hidden">
      {/* Dynamic Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#c5a059]/20 z-[120]">
        <div className="h-full bg-[#c5a059] animate-[scroll-progress_auto_linear] origin-left"></div>
      </div>

      {/* Back Button */}
      <button 
        onClick={() => onBack('expertise')}
        className="fixed top-32 left-4 sm:left-6 lg:left-12 z-[110] bg-white/5 backdrop-blur-xl text-white border border-white/10 p-4 rounded-full shadow-2xl hover:bg-[#c5a059] transition-all group scale-90 hover:scale-100"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Hero Banner with Zoom Animation */}
      <div className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={service.mainImage} 
            alt={service.title} 
            className="w-full h-full object-cover opacity-50 scale-100 animate-[slowZoom_20s_infinite_alternate]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-slate-950"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="text-[#c5a059] mb-8 sm:mb-10 flex justify-center transform scale-[1.8] sm:scale-[2.5] animate-[revealUp_1.2s_cubic-bezier(0.22,1,0.36,1)]">
            {service.icon}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-serif-legal font-bold text-white mb-4 sm:mb-6 uppercase tracking-tight animate-[revealUp_1.4s_cubic-bezier(0.22,1,0.36,1)]">
            {service.title}
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl text-[#c5a059] font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase italic animate-[revealUp_1.6s_cubic-bezier(0.22,1,0.36,1)]">
            {service.subtitle}
          </p>
        </div>
      </div>

      {/* Content Narrative Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 -mt-20 sm:-mt-32 relative z-20 pb-48">
        <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/5 p-6 sm:p-12 lg:p-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-sm">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="text-left animate-[revealUp_1s_ease-out]">
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="h-[2px] w-8 sm:w-12 bg-[#c5a059]"></div>
                <span className="text-[#c5a059] text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em]">OVERVIEW</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif-legal font-bold text-white mb-6 sm:mb-10 leading-snug">
                {service.description}
              </h2>
            </div>
            
            <div className="space-y-6 sm:space-y-8 text-left animate-[revealUp_1.2s_ease-out]">
              <div className="bg-[#c5a059]/5 border-l-4 border-[#c5a059] p-6 sm:p-10 hover:bg-[#c5a059]/10 transition-colors">
                <p className="text-slate-200 italic leading-relaxed text-lg sm:text-xl font-light">
                  {t(
                    "เราไม่ได้เพียงแค่ว่าความตามตัวอักษร แต่เราวางกลยุทธ์เพื่อหาทางออกที่ดีที่สุดในเชิงธุรกิจและมนุษยธรรม",
                    "We don't just litigate by the book; we strategize to find the best solutions in both business and humanitarian terms."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Highlight Section (Optimized for Mobile) */}
          {featuredData && (
            <div className="mt-20 sm:mt-32 bg-slate-950 border border-[#c5a059]/20 rounded-sm overflow-hidden flex flex-col lg:flex-row shadow-2xl animate-[revealUp_1.4s_ease-out]">
              {/* Left Side: Category Title */}
              <div className="lg:w-1/3 p-8 sm:p-12 lg:p-16 bg-[#c5a059] text-white flex flex-col justify-center text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif-legal font-bold mb-4 sm:mb-8 leading-tight relative z-10">
                  {featuredTitle}
                </h3>
                <p className="text-white/80 text-sm sm:text-lg font-light leading-relaxed relative z-10">
                  {featuredDescription}
                </p>
              </div>
              
              {/* Right Side: Scope of Service List */}
              <div className="lg:w-2/3 p-6 sm:p-12 lg:p-16 bg-slate-950 text-left relative">
                <div className="space-y-6 sm:space-y-10">
                  {featuredData.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-4 sm:gap-6 group/item opacity-0 animate-[revealUp_0.8s_ease-out_forwards]"
                      style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                    >
                      <CheckCircle2 className="text-[#c5a059] flex-shrink-0 mt-1 transition-transform group-hover/item:scale-125" size={20} />
                      <p className="text-slate-300 text-[14px] sm:text-base md:text-lg leading-relaxed sm:leading-loose font-light hover:text-white transition-colors">
                        {t(item.th, item.en)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Extra Insights */}
        {service.extraInsights && (
          <div className="mt-20 sm:mt-24 grid lg:grid-cols-2 gap-8 lg:gap-12">
            {service.extraInsights.map((insight, i) => (
              <div 
                key={i} 
                className="bg-slate-900 p-8 sm:p-12 border-t border-[#c5a059]/40 shadow-xl text-left rounded-sm opacity-0 animate-[revealUp_1s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-6 text-[#c5a059]">
                   <Info size={24} />
                   <h5 className="font-bold uppercase tracking-[0.2em] text-xs sm:text-sm">{insight.title}</h5>
                </div>
                <p className="text-slate-300 leading-relaxed font-light text-lg sm:text-xl italic">
                  {insight.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-32 sm:mt-48 text-center py-20 sm:py-32 border-y border-white/10 relative overflow-hidden group">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-[#c5a059] to-transparent"></div>
              <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-[#c5a059] to-transparent"></div>
           </div>
           
           <h3 className="text-3xl sm:text-5xl md:text-7xl font-serif-legal font-bold text-white mb-10 sm:mb-12 italic relative z-10">
             {t('เริ่มต้นการปรึกษา', 'Start consultation')}
           </h3>
           
           <div className="relative z-10 flex justify-center">
             <button 
               onClick={() => onBack('contact')} 
               className="bg-[#c5a059] text-white px-10 sm:px-20 py-6 sm:py-8 inline-flex items-center gap-4 sm:gap-8 font-black uppercase tracking-[0.3em] sm:tracking-[0.6em] hover:bg-white hover:text-slate-950 transition-all duration-500 shadow-2xl group/btn overflow-hidden relative text-xs sm:text-sm"
             >
                <span className="relative z-10">{t('นัดหมายล่วงหน้า', 'BOOK APPOINTMENT')}</span>
                <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-3 transition-transform duration-500" />
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shine_1s_ease-in-out]"></div>
             </button>
           </div>
        </div>
      </section>

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};
