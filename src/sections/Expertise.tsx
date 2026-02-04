
import React from 'react';
import { Scale, ShieldCheck, Landmark, Users, Plane, Gavel, ArrowRight, Briefcase } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useLanguage } from '../context/LanguageContext';
import { ServiceCategory } from '../types';

// Exporting data so it can be used in Navbar
export const getServiceCategories = (t: (th: string, en: string) => string): ServiceCategory[] => [
  {
    id: 'labor',
    title: t('กฎหมายแรงงาน', 'Labor Law'),
    subtitle: t('การบริหารจัดการทรัพยากรมนุษย์เชิงกลยุทธ์', 'Strategic Human Resource Management'),
    icon: <Briefcase />,
    mainImage: 'https://images.unsplash.com/photo-1521791136364-798a7bc0d262?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    description: t('บริการที่ปรึกษาและดำเนินคดีด้านแรงงานครบวงจร ตั้งแต่การวางรากฐานสัญญาจ้าง ไปจนถึงการระงับข้อพิพาทในชั้นศาลอย่างมืออาชีพ', 'Comprehensive labor law advisory and litigation services, from contract foundations to professional court dispute resolution.'),
    subServices: [
      { 
        title: t('สัญญาจ้างและข้อบังคับ', 'Employment Contracts & Rules'), 
        description: t('จัดทำสัญญาจ้างแรงงานทุกรูปแบบ (มีกำหนดเวลา/ไม่มีกำหนดเวลา/สัญญาผู้บริหาร) และตรวจสอบข้อบังคับการทำงานให้สอดคล้องกับกฎหมายคุ้มครองแรงงาน', 'Drafting all forms of employment contracts and auditing work regulations for legal compliance.') 
      },
      { 
        title: t('นโยบายและสวัสดิการ', 'Policies & Benefits'), 
        description: t('การกำหนดนโยบายการลา การจ่ายโบนัส และนโยบายการทำงานจากที่บ้าน (Remote Working) เพื่อเพิ่มประสิทธิภาพองค์กร', 'Establishing leave, bonus, and Remote Working policies to enhance organizational efficiency.') 
      },
      { 
        title: t('สหภาพแรงงานและการควบรวม', 'Unions & M&A'), 
        description: t('การเจรจาต่อรองกับสหภาพแรงงาน และการจัดการสิทธิลูกจ้างเมื่อมีการควบรวมหรือโอนย้ายกิจการ (M&A)', 'Labor union negotiations and managing employee rights during business transfers or mergers.') 
      },
      { 
        title: t('คดีแรงงานและการระงับข้อพิพาท', 'Labor Litigation & ADR'), 
        description: t('ตัวแทนในชั้นพนักงานตรวจแรงงาน และการว่าความคดีเลิกจ้างไม่เป็นธรรม ค้างจ่ายค่าจ้าง ค่าชดเชย รวมถึงการไกล่เกลี่ยทำสัญญาประนีประนอม', 'Representation in labor inspection cases, unfair dismissal litigation, and professional settlement mediation.') 
      }
    ]
  },
  {
    id: 'dispute',
    title: t('คดีความและการระงับข้อพิพาท', 'Litigation & Dispute Resolution'),
    subtitle: t('การต่อสู้เพื่อความยุติธรรมทุกมิติ', 'Strategic Defense & Litigation'),
    icon: <Scale />,
    mainImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    description: t('บริการว่าความและระงับข้อพิพาท ครอบคลุมคดีแพ่ง ธุรกิจ ละเมิด และคดีคุ้มครองผู้บริโภค เพื่อรักษาผลประโยชน์สูงสุดของลูกความ', 'Comprehensive representation in civil, business, tort, and consumer cases with a focus on safeguarding interests.'),
    subServices: [
      { title: t('คดีผิดสัญญา', 'Breach of Contract'), description: t('การฟ้องร้องเมื่ออีกฝ่ายไม่ปฏิบัติตามข้อตกลง เช่น ผิดสัญญาจ้างทำของ ผิดสัญญาซื้อขาย หรือผิดสัญญากู้ยืมเงิน', 'Legal action for non-compliance in employment, sales, or loan agreements.') },
      { title: t('คดีละเมิด', 'Tort Claims'), description: t('การเรียกค่าสินไหมทดแทนจากการที่ถูกผู้อื่นกระทำโดยมิชอบด้วยกฎหมาย ทำให้เสียหายแก่ชีวิต ร่างกาย อนามัย เสรีภาพ ทรัพย์สิน หรือสิทธิอย่างใดอย่างหนึ่ง', 'Seeking compensation for illegal acts against life, reputation, or property.') },
      { title: t('คดีเกี่ยวกับองค์กรและธุรกิจ', 'Corporate & Business'), description: t('ข้อพิพาทระหว่างผู้ถือหุ้น การฟ้องร้องกรรมการบริษัทให้รับผิดชอบต่อความเสียหาย หรือความขัดแย้งในการบริหารจัดการภายในองค์กร', 'Shareholder disputes and corporate management liability cases.') },
      { title: t('คดีคุ้มครองผู้บริโภค', 'Consumer Protection'), description: t('การฟ้องร้องสินค้าหรือบริการที่ไม่ได้คุณภาพ ไม่ปลอดภัย หรือถูกเอาเปรียบจากโฆษณาเกินจริง', 'Litigation regarding low-quality products, some safety, or false advertising.') }
    ]
  },
  {
    id: 'ip',
    title: t('ทรัพย์สินทางปัญญา', 'Intellectual Property'),
    subtitle: t('ปกป้องความคิดสร้างสรรค์ของคุณ', 'Protecting Innovation'),
    icon: <ShieldCheck />,
    mainImage: 'https://images.unsplash.com/photo-1589216532372-1c2a367900d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    description: t('การจดทะเบียน บริหารจัดการสัญญา และการบังคับใช้สิทธิ์ด้านทรัพย์สินทางปัญญาทั้งในและต่างประเทศ', 'Global registration, contract management, and enforcement of IP rights.'),
    subServices: [
      { title: t('การจดทะเบียนและคุ้มครองสิทธิ', 'IP Registration'), description: t('เครื่องหมายการค้า, สิทธิบัตร/อนุสิทธิบัตร, ลิขสิทธิ์ และความลับทางการค้า', 'Trademarks, Patents, Copyrights, and Trade Secrets.') },
      { title: t('การบริหารจัดการสัญญาและสิทธิ', 'IP Transactions'), description: t('สัญญาอนุญาตให้ใช้สิทธิ (Licensing Agreement), การโอนสิทธิ (IP Assignment) และสัญญาแฟรนไชส์', 'Licensing, Assignments, and Franchise Agreements.') },
      { title: t('การบังคับใช้สิทธิและคดีความ', 'IP Enforcement'), description: t('การออกหนังสือเตือน (Cease and Desist), การดำเนินคดีละเมิด และการไกล่เกลี่ยข้อพิพาท', 'Cease and Desist, IP litigation, and dispute mediation.') }
    ]
  },
  {
    id: 'visa',
    title: t('วีซ่าและใบอนุญาตทำงาน', 'Visa & Work Permit'),
    subtitle: t('ประตูสู่การทำงานในประเทศไทย', 'Global Mobility Services'),
    icon: <Plane />,
    mainImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    description: t('บริการที่ปรึกษาและดำเนินการด้านวีซ่าสำหรับชาวต่างชาติและบริษัทที่ต้องการจ้างงานผู้เชี่ยวชาญ', 'Expert guidance on visas and permits for expats and multinational firms.'),
    subServices: [
      { title: t('Business Visa (Non-B)', 'Business Visa'), description: t('บริการขอและต่ออายุวีซ่าทำงาน รวมถึงวีซ่าสำหรับครอบครัว (Non-O)', 'Issuance and renewal of business and family visas.') },
      { title: t('Work Permit', 'Work Permit'), description: t('ดำเนินการขอใบอนุญาตทำงานใหม่ เปลี่ยนแปลงรายละเอียด และแจ้งออก', 'New permits, detail changes, and cancellation procedures.') },
      { title: t('Special Services', 'Special Services'), description: t('BOI Privilege (One Stop Service), 90 Days Reporting และการขออนุญาตกลับเข้าประเทศ (Re-entry)', 'BOI fast track, 90 Days reports, and Re-entry permits.') }
    ]
  },
  {
    id: 'realestate',
    title: t('อสังหาริมทรัพย์และก่อสร้าง', 'Real Estate & Construction'),
    subtitle: t('ความมั่นคงในการลงทุน', 'Investment Security'),
    icon: <Landmark />,
    mainImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    description: t('บริการตรวจสอบทรัพย์สิน ตรวจสอบสัญญา และจัดการข้อพิพาทด้านการก่อสร้างและอสังหาริมทรัพย์', 'Due diligence, contract review, and dispute resolution for real estate and construction.'),
    subServices: [
      { title: t('ตรวจสอบทรัพย์สิน (Due Diligence)', 'Due Diligence'), description: t('ตรวจสอบโฉนดที่ดิน ภาระจำยอม แนวเขตทางหลวง และกฎหมายผังเมืองเพื่อความมั่นใจก่อนลงทุน', 'Deed, easement, and city law audit before investment.') },
      { title: t('สัญญาและจดทะเบียนสิทธิ', 'Contracts & Registry'), description: t('สัญญาซื้อขาย สัญญาเช่าระยะยาว (Leasehold) และการจดทะเบียนโอนกรรมสิทธิ์ จำนอง สิทธิเก็บกิน ณ กรมที่ดิน', 'S&P, Leasehold agreements, and land registry services.') },
      { title: t('งานก่อสร้างและข้อพิพาท', 'Construction & Disputes'), description: t('ร่างสัญญาจ้างเหมา (FIDIC) และว่าความคดีผิดสัญญาจ้าง งานล่าช้า หรือการทิ้งงาน', 'Drafting contracts (FIDIC) and litigating construction disputes.') }
    ]
  },
  {
    id: 'family',
    title: t('ครอบครัวและมรดก', 'Family & Estate Law'),
    subtitle: t('ส่งต่อความมั่งคั่งอย่างถูกต้อง', 'Wealth & Legacy'),
    icon: <Users />,
    mainImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    description: t('การจัดการมรดก การทำพินัยกรรม และการดำเนินการทางกฎหมายครอบครัวด้วยความเข้าใจและเป็นธรรม', 'Estate administration, wills, and family legal procedures with empathy and fairness.'),
    subServices: [
      { title: t('การจัดการมรดกและพินัยกรรม', 'Estate & Wills'), description: t('ร้องขอตั้งผู้จัดการมรดก และร่างพินัยกรรมทุกรูปแบบเพื่อวางแผนส่งต่อทรัพย์สินอย่างถูกต้อง', 'Estate administration and drafting various types of wills.') },
      { title: t('การฟ้องหย่าและแบ่งสินสมรส', 'Divorce & Assets'), description: t('บริการตัวแทนจดทะเบียนหย่า หรือฟ้องหย่า รวมถึงการเจรจาแบ่งสินสมรสและหนี้สิน', 'Mutual consent or contested divorce and asset division.') },
      { title: t('สิทธิปกครองบุตรและครอบครัว', 'Custody & Family'), description: t('เรียกร้องสิทธิปกครองบุตร ค่าอุปการะเลี้ยงดู การรับรองบุตร และคดีฟ้องชู้', 'Child custody, support, legitimation, and adultery cases.') }
    ]
  },
  {
    id: 'enforcement',
    title: t('ด้านการบังคับคดี', 'Legal Execution'),
    subtitle: t('การบังคับใช้สิทธิขั้นสุดท้าย', 'Final Enforcement'),
    icon: <Gavel />,
    mainImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    description: t('สืบทรัพย์ ยึด/อายัด และการขายทอดตลาด เพื่อนำเงินมาชำระหนี้ตามคำพิพากษาอย่างมีประสิทธิภาพ', 'Asset tracing, seizure, and public auctions for judgment debt recovery.'),
    subServices: [
      { title: t('การสืบทรัพย์', 'Asset Tracing'), description: t('บริการสืบค้นทรัพย์สินของลูกหนี้ทั่วราชอาณาจักร (ที่ดิน, บัญชีธนาคาร, ยานพาหนะ)', 'Nationwide search for debtor assets (land, bank, vehicles).') },
      { title: t('การยึดและอายัดทรัพย์', 'Seizure & Garnishment'), description: t('ดำเนินการยึดอสังหาริมทรัพย์และอายัดสิทธิเรียกร้องเพื่อชำระหนี้ตามคำพิพากษา', 'Legal seizure of real estate and garnishment for debt payment.') },
      { title: t('การขายทอดตลาด', 'Public Auction'), description: t('ประสานงานและดูแลขั้นตอนการนำทรัพย์สินออกขายทอดตลาดที่กรมบังคับคดี', 'Coordination for asset sales at the Legal Execution Department.') }
    ]
  }
];

interface ExpertiseProps {
  onSelectService: (service: ServiceCategory) => void;
}

export const Expertise: React.FC<ExpertiseProps> = ({ onSelectService }) => {
  const { t } = useLanguage();
  const serviceCategories = getServiceCategories(t);

  return (
    <section id="expertise" className="py-48 bg-slate-950 relative z-10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-left relative z-10">
        <SectionHeader title={t('Comprehensive Solutions', 'Comprehensive Solutions')} subtitle={t('บริการทางกฎหมายครบวงจร', 'Legal Practice Areas')} light />
        
        {/* Changed from gap-px and bg-white/5 to gap-4 and transparent bg to make empty areas invisible */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 bg-transparent">
          {serviceCategories.map((service) => (
            <div 
              key={service.id} 
              onClick={() => onSelectService(service)}
              className="relative bg-slate-900 p-12 lg:p-16 hover:bg-[#c5a059]/90 transition-all duration-700 group text-left cursor-pointer border border-white/5 hover:border-[#c5a059] rounded-sm overflow-hidden shadow-2xl"
            >
              {/* Image Background Layer */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] group-hover:opacity-10 transition-all duration-1000 transform group-hover:scale-110">
                <img src={service.mainImage} alt="" className="w-full h-full object-cover grayscale" />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-transparent transition-colors"></div>
              </div>

              {/* Content Layer */}
              <div className="relative z-10">
                <div className="text-[#c5a059] group-hover:text-white mb-12 transform scale-[1.8] origin-left transition-all duration-500 group-hover:scale-[1.6]">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-6 font-serif-legal text-white uppercase tracking-wider leading-snug group-hover:translate-x-2 transition-transform duration-500">
                  {service.title}
                </h3>
                <p className="text-slate-400 group-hover:text-white/90 text-sm leading-relaxed font-light mb-10 line-clamp-3">
                  {service.description}
                </p>
                
                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] group-hover:text-white transition-all">
                  {t('ดูรายละเอียดบริการ', 'EXPLORE DETAILS')} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
                
                <div className="mt-12 w-10 h-[1px] bg-[#c5a059] group-hover:bg-white group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
