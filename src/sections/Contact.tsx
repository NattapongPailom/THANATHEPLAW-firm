
import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, MessageCircle, Clock, CheckCircle2, Loader2, Search, ArrowRight, X, FileText, ChevronRight, ShieldAlert, CreditCard, ExternalLink, ShieldCheck, Download, Lock, MessageSquareQuote, MessageSquare, AtSign } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useLanguage } from '../context/LanguageContext';
import { backendService } from '../services/backend';
import { Lead, Invoice } from '../types';
import { validation } from '../utils/validation';
import { rateLimiters } from '../utils/rateLimiter';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    category: 'ทั่วไป', 
    details: '' 
  });

  const [trackingPhone, setTrackingPhone] = useState('');
  const [trackingResult, setTrackingResult] = useState<Lead | null>(null);
  const [relatedInvoices, setRelatedInvoices] = useState<Invoice[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenTracker = () => {
      setShowTrackerModal(true);
      const savedPhone = localStorage.getItem('elite_client_phone');
      if (savedPhone) setTrackingPhone(savedPhone);
    };
    window.addEventListener('elite_open_tracker', handleOpenTracker);
    return () => window.removeEventListener('elite_open_tracker', handleOpenTracker);
  }, []);

  const handleFileDownload = async (url: string, fileName: string) => {
    // ถ้าเป็น Firestore file URL
    if (url.startsWith('firestore://case_files/')) {
      const fileId = url.replace('firestore://case_files/', '');
      setDownloadingFileId(fileId);
      try {
        await backendService.downloadFileFromFirestore(fileId, fileName);
      } catch (error: any) {
        alert(error.message || 'เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์');
      } finally {
        setDownloadingFileId(null);
      }
    } else {
      // ถ้าเป็น external URL
      window.open(url, '_blank');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔒 Validate all inputs
    if (!validation.isValidTextLength(formData.name, 2, 100)) {
      alert('❌ Name must be 2-100 characters');
      return;
    }
    if (!validation.isValidPhone(formData.phone)) {
      alert('❌ Invalid phone number format');
      return;
    }
    if (!validation.isValidEmail(formData.email)) {
      alert('❌ Invalid email format');
      return;
    }
    if (!validation.isValidTextLength(formData.details, 10, 2000)) {
      alert('❌ Details must be 10-2000 characters');
      return;
    }

    // 🔒 Rate limiting check
    if (!rateLimiters.contactForm.isAllowed(formData.phone)) {
      const resetTime = Math.ceil(rateLimiters.contactForm.getResetTime(formData.phone) / 1000);
      alert(`❌ Too many submissions. Please try again in ${resetTime} seconds`);
      return;
    }

    setIsSubmitting(true);
    try {
      // 🔒 Sanitize input data
      const sanitizedData = validation.sanitizeObject(formData);
      
      await backendService.createLead(sanitizedData);
      localStorage.setItem('elite_is_client', 'true');
      localStorage.setItem('elite_client_phone', formData.phone);
      window.dispatchEvent(new CustomEvent('elite_client_verified'));
      
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', category: 'ทั่วไป', details: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackCase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔒 Validate phone input
    if (!validation.isValidPhone(trackingPhone)) {
      alert('❌ Invalid phone number format');
      return;
    }

    // 🔒 Rate limiting check
    if (!rateLimiters.caseTracking.isAllowed(trackingPhone)) {
      const resetTime = Math.ceil(rateLimiters.caseTracking.getResetTime(trackingPhone) / 1000);
      alert(`❌ Too many searches. Please try again in ${resetTime} seconds`);
      return;
    }

    setIsTracking(true);
    try {
      const result = await backendService.trackCaseByPhone(trackingPhone);
      if (result) {
        const invoices = await backendService.getInvoicesByLeadId(result.id);
        setRelatedInvoices(invoices);
        localStorage.setItem('elite_is_client', 'true');
        localStorage.setItem('elite_client_phone', trackingPhone);
        window.dispatchEvent(new CustomEvent('elite_client_verified'));
      }
      setTrackingResult(result);
    } catch (error: any) {
      console.error('Case tracking error:', error);
      alert('❌ Unable to track case. Please check your phone number.');
    } finally {
      setIsTracking(false);
    }
  };

  const closeTracker = () => {
    setShowTrackerModal(false);
    setTrackingResult(null);
    setRelatedInvoices([]);
  };

  const categories = [
    { value: 'labor', label: t('กฎหมายแรงงาน', 'Labor Law') },
    { value: 'dispute', label: t('คดีแพ่ง/ธุรกิจ', 'Civil/Business Dispute') },
    { value: 'family', label: t('ครอบครัว/มรดก', 'Family/Estate') },
    { value: 'realestate', label: t('อสังหาริมทรัพย์', 'Real Estate') },
    { value: 'ip', label: t('ทรัพย์สินทางปัญญา', 'Intellectual Property') },
    { value: 'other', label: t('อื่นๆ', 'Other Matters') }
  ];

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 lg:py-48 bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="bg-slate-900/90 backdrop-blur-3xl rounded-sm overflow-hidden flex flex-col lg:flex-row border border-white/10 shadow-2xl text-left">

          <div className="lg:w-2/5 p-6 sm:p-10 md:p-12 lg:p-16 bg-slate-950 text-white flex flex-col justify-between border-r border-white/5">
            <div>
              <SectionHeader title={t("ข้อมูลติดต่อ", "Contact Info")} subtitle={t("สอบถามปรึกษา", "Get In Touch")} light />
              <div className="space-y-6 sm:space-y-8 md:space-y-10 mt-6 sm:mt-8 md:mt-10">
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8 group">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-full text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white transition-all flex-shrink-0"><Phone className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] md:text-[12px] text-slate-500 uppercase font-black tracking-widest mb-1">{t('เบอร์โทรศัพท์', 'Phone')}</p>
                    <p className="text-base sm:text-lg md:text-xl font-medium">084-317-0627 / 098-280-0020</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8 group">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-full text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white transition-all flex-shrink-0"><Mail className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] md:text-[12px] text-slate-500 uppercase font-black tracking-widest mb-1">{t('อีเมล', 'Email')}</p>
                    <p className="text-sm sm:text-lg md:text-xl font-medium break-all">thanathep.lawfirm@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8 group">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-full text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white transition-all flex-shrink-0"><MapPin className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] md:text-[12px] text-slate-500 uppercase font-black tracking-widest mb-1">{t('ที่ตั้ง', 'Location')}</p>
                    <p className="text-sm sm:text-lg md:text-xl font-medium">{t('11 ซอยท้ายบ้าน 16 ตำบลปากน้ำ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ', '11 Soi Taibaanklang 16, Paknampraksa, Muang Samutprakan, Samutprakan, Thailand')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 md:gap-8 group">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-full text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white transition-all flex-shrink-0"><Clock className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] md:text-[12px] text-slate-500 uppercase font-black tracking-widest mb-1">{t('เวลาทำการ', 'Working Hours')}</p>
                    <p className="text-base sm:text-lg md:text-xl font-medium">{t('8:30 น. - 17:30 น.', '8:30 AM - 5:30 PM')}</p>
                  </div>
                </div>

                <div className="pt-6 sm:pt-8 border-t border-white/5 grid grid-cols-1 gap-4 sm:gap-6">
                  <a href="https://www.facebook.com/profile.php?id=61577107148720" target="_blank" className="flex items-center gap-4 sm:gap-6 group hover:translate-x-2 transition-transform">
                    <div className="w-9 sm:w-10 h-9 sm:h-10 bg-blue-600/10 border border-blue-600/20 flex items-center justify-center rounded-full text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0"><Facebook className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /></div>
                    <span className="text-[12px] sm:text-[13px] md:text-[14px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{t('กลุ่มเฟซบุ๊กสำนักงาน', 'Facebook Group')}</span>
                  </a>
                  <a href="https://wa.me/66843170627" target="_blank" className="flex items-center gap-4 sm:gap-6 group hover:translate-x-2 transition-transform">
                    <div className="w-9 sm:w-10 h-9 sm:h-10 bg-green-600/10 border border-green-600/20 flex items-center justify-center rounded-full text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all flex-shrink-0"><MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /></div>
                    <span className="text-[12px] sm:text-[13px] md:text-[14px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">WhatsApp Support</span>
                  </a>
                  <a href="mailto:thanathep.lawfirm@gmail.com" target="_blank" className="flex items-center gap-4 sm:gap-6 group hover:translate-x-2 transition-transform">
                    <div className="w-9 sm:w-10 h-9 sm:h-10 bg-white-600/10 border border-white-600/20 flex items-center justify-center rounded-full text-white-500 group-hover:bg-gray-600 group-hover:text-white transition-all flex-shrink-0"><MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /></div>
                    <span className="text-[12px] sm:text-[13px] md:text-[14px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Gmail Thanathep</span>
                  </a>
                </div>
              </div>

              <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 md:pt-10 border-t border-white/5">
                <button
                  onClick={() => setShowTrackerModal(true)}
                  className="w-full border border-[#c5a059] text-[#c5a059] py-4 sm:py-5 px-4 sm:px-8 font-black uppercase tracking-wider sm:tracking-widest text-[11px] sm:text-[12px] md:text-[14px] flex items-center justify-center gap-3 sm:gap-4 hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl shadow-[#c5a059]/10"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" /> {t('ติดตามสถานะคดีของคุณ', 'TRACK YOUR CASE STATUS')}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-3/5 p-6 sm:p-10 md:p-12 lg:p-20 bg-white text-left relative overflow-hidden">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-reveal-up">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8"><CheckCircle2 size={48} /></div>
                <h3 className="text-3xl font-serif-legal font-bold text-slate-900 mb-4">{t('ส่งข้อมูลสำเร็จ', 'Message Sent!')}</h3>
                <p className="text-slate-500 max-w-sm">{t('เราได้รับข้อมูลของท่านแล้ว ทนายความจะติดต่อกลับโดยเร็วที่สุด พร้อมส่งอีเมลแจ้งความคืบหน้าให้ท่านทราบเมื่อระบบเริ่มดำเนินการ', 'We have received your details. An attorney will contact you shortly and you will receive automatic progress updates via email.')}</p>
              </div>
            ) : (
              <form className="space-y-8 sm:space-y-10 md:space-y-12" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                   <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-legal font-bold text-slate-900">{t('ส่งข้อความปรึกษาทนาย', 'Legal Consultation Request')}</h3>
                   <div className="flex items-center gap-2 text-slate-400">
                     <ShieldCheck size={14} className="sm:w-4 sm:h-4 text-[#c5a059]" />
                     <span className="text-[10px] sm:text-[11px] md:text-[12px] font-black uppercase tracking-widest">{t('ข้อมูลของคุณเป็นความลับ', 'Secure & Confidential')}</span>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 text-slate-900">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-[#c5a059]">{t('ชื่อ-นามสกุล', 'Full Name')}</label>
                    <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-b border-slate-200 py-3 sm:py-4 focus:border-[#c5a059] outline-none px-3 sm:px-4 font-bold text-sm sm:text-base" placeholder={t("กรุณากรอกชื่อ", "Full legal name")} />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-[#c5a059]">{t('เบอร์โทรศัพท์ติดต่อ', 'Phone Number')}</label>
                    <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-b border-slate-200 py-3 sm:py-4 focus:border-[#c5a059] outline-none px-3 sm:px-4 font-bold text-sm sm:text-base" placeholder={t("08x-xxx-xxxx", "Contact number")} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 text-slate-900">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-[#c5a059]">{t('อีเมลสำหรับรับแจ้งเตือน', 'Notification Email')}</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-b border-slate-200 py-3 sm:py-4 focus:border-[#c5a059] outline-none px-3 sm:px-4 font-bold text-sm sm:text-base" placeholder={t("example@mail.com", "Used for progress updates")} />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-[#c5a059]">{t('ประเภทคดีที่ปรึกษา', 'Case Category')}</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 border-b border-slate-200 py-3 sm:py-4 focus:border-[#c5a059] outline-none px-3 sm:px-4 font-bold appearance-none cursor-pointer text-sm sm:text-base"
                    >
                      {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 text-slate-900">
                  <label className="text-[12px] sm:text-[13px] md:text-[15px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-[#c5a059]">{t('รายละเอียดคดีและข้อสงสัย', 'Matter Details')}</label>
                  <textarea rows={4} required value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} className="w-full bg-slate-50 border-b border-slate-200 py-3 sm:py-4 focus:border-[#c5a059] outline-none px-3 sm:px-4 font-bold text-sm sm:text-base" placeholder={t("ระบุรายละเอียดหรือคำถามที่ต้องการให้ทนายวิเคราะห์เบื้องต้น", "Please describe your legal issue for preliminary evaluation")}></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-slate-950 text-white py-5 sm:py-6 md:py-8 font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[12px] sm:text-[13px] md:text-[15px] hover:bg-[#c5a059] transition-all flex items-center justify-center gap-3 sm:gap-4 group">
                  {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> : (
                    <>
                      {t('ลงทะเบียนปรึกษาทนายความ', 'REQUEST PROFESSIONAL COUNSEL')}
                      <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {showTrackerModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="w-full max-w-8xl bg-slate-900 border border-[#c5a059]/30 p-6 sm:p-8 md:p-12 relative animate-reveal-up overflow-y-auto max-h-[90vh] text-left">
            <button onClick={closeTracker} className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 text-slate-500 hover:text-white"><X className="w-5 h-5 sm:w-6 sm:h-6" /></button>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-legal font-bold text-white mb-6 sm:mb-8 italic pr-8">{t('ศูนย์ติดตามความคืบหน้าคดี', 'Client Legal Portal')}</h3>

            {!trackingResult ? (
              <form onSubmit={handleTrackCase} className="space-y-6 sm:space-y-8 max-w-xl mx-auto text-center py-10 sm:py-16 md:py-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#c5a059]/10 rounded-full flex items-center justify-center text-[#c5a059] mx-auto mb-6 sm:mb-10"><ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10" /></div>
                <p className="text-slate-400 text-sm sm:text-base md:text-lg font-light leading-relaxed">{t('กรุณากรอกเบอร์โทรศัพท์ที่ใช้ในการลงทะเบียนเพื่อตรวจสอบสถานะคดีและดาวน์โหลดเอกสารล่าสุด', 'Enter your registered phone number to track case milestones and access legal documents.')}</p>
                <div className="relative">
                  <input
                    required
                    className="w-full bg-transparent border-b border-white/10 py-4 sm:py-5 text-white outline-none focus:border-[#c5a059] text-xl sm:text-2xl md:text-3xl tracking-[0.1em] sm:tracking-[0.2em] text-center font-bold"
                    placeholder="08X-XXX-XXXX"
                    value={trackingPhone}
                    onChange={(e) => setTrackingPhone(e.target.value)}
                  />
                </div>
                <button className="w-full bg-[#c5a059] text-white py-4 sm:py-5 md:py-6 font-black uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-[11px] hover:bg-white hover:text-slate-900 transition-all">
                  {isTracking ? <Loader2 className="animate-spin mx-auto w-4 h-4 sm:w-5 sm:h-5" /> : t('ดึงข้อมูลจากฐานข้อมูล', 'AUTHENTICATE & ACCESS')}
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                <div className="space-y-6 sm:space-y-8 md:col-span-2 lg:col-span-1">
                  <div className="bg-slate-800 p-6 sm:p-8 border-l-4 border-[#c5a059] rounded-sm shadow-xl space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-[#c5a059] text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-1">{t('ชื่อผู้ได้รับมอบอำนาจ', 'ASSIGNED CLIENT')}</p>
                      <p className="text-xl sm:text-2xl text-white font-serif-legal font-bold">{trackingResult.name}</p>
                    </div>
                    {trackingResult.email && (
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-slate-500 text-[7px] sm:text-[8px] font-black uppercase tracking-widest mb-1">REGISTERED EMAIL</p>
                        <div className="flex items-start gap-2">
                           <Mail className="w-3 h-3 text-[#c5a059] flex-shrink-0 mt-0.5" />
                           <p className="text-xs sm:text-sm text-slate-300 font-mono break-all">{trackingResult.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-slate-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2">{t('ติดต่อทนายความของคุณ', 'DIRECT SUPPORT')}</p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                       <a href="tel:0843170627" className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-[#c5a059] p-3 sm:p-4 text-white transition-all rounded-sm border border-white/5 group">
                          <Phone className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest">Phone</span>
                       </a>
                       <a href="mailto:thanathep.lawfirm@gmail.com" className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-slate-200 hover:text-slate-900 p-3 sm:p-4 text-white transition-all rounded-sm border border-white/5 group">
                          <AtSign className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest">Gmail</span>
                       </a>
                       <a href="https://wa.me/66843170627" target="_blank" className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-green-600 p-3 sm:p-4 text-white transition-all rounded-sm border border-white/5 group">
                          <MessageSquare className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest">WhatsApp</span>
                       </a>
                       <a href="https://www.facebook.com/profile.php?id=61577107148720" target="_blank" className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-blue-600 p-3 sm:p-4 text-white transition-all rounded-sm border border-white/5 group">
                          <Facebook className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest">Facebook</span>
                       </a>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-900/20 to-slate-950 p-6 sm:p-8 border border-amber-600/30 rounded-sm shadow-lg">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-500" />
                        </div>
                        <div>
                          <p className="text-amber-500 text-[10px] sm:text-[12px] font-black uppercase tracking-widest">{t('สถานะการชำระเงิน', 'BILLING STATUS')}</p>
                          <p className="text-white text-xs sm:text-sm font-bold">{relatedInvoices.length} {t('ใบแจ้งหนี้', 'Invoice(s)')}</p>
                        </div>
                      </div>
                    </div>

                    {relatedInvoices.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {relatedInvoices.map((inv) => (
                          <div key={inv.id} className="group">
                            <div className={`p-3 sm:p-4 rounded-lg border transition-all ${
                              inv.status === 'paid'
                                ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                                : inv.status === 'overdue'
                                ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
                                : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
                            }`}>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                    <span className="text-[10px] sm:text-[11px] text-slate-300 font-mono truncate">{inv.id}</span>
                                    <span className={`text-[7px] sm:text-[8px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-widest whitespace-nowrap ${
                                      inv.status === 'paid' ? 'bg-emerald-500/30 text-emerald-300' :
                                      inv.status === 'overdue' ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'
                                    }`}>
                                      {inv.status === 'paid' ? '✓ Paid' : inv.status === 'overdue' ? '⚠ Overdue' : '⏱ Pending'}
                                    </span>
                                  </div>
                                  <p className="text-base sm:text-lg text-white font-serif-legal font-bold">฿{inv.amount.toLocaleString()}</p>
                                </div>
                                <div className="text-right whitespace-nowrap">
                                  {inv.date && <p className="text-[8px] sm:text-[9px] text-slate-400">{new Date(inv.date).toLocaleDateString('th-TH')}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 sm:py-10 text-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-wide">{t('ยังไม่มีใบแจ้งหนี้', 'NO INVOICES YET')}</p>
                        <p className="text-[10px] sm:text-[12px] text-slate-600 mt-1 sm:mt-2">{t('ใบแจ้งหนี้จะปรากฏที่นี่เมื่อการสอบปรึกษาเริ่มต้น', 'Invoices will appear here when service begins')}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-6 sm:p-8 border border-[#c5a059]/20 rounded-sm shadow-xl md:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#c5a059]/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#c5a059]" />
                      </div>
                      <div>
                        <p className="text-[#c5a059] text-[10px] sm:text-[12px] font-black uppercase tracking-widest">{t('เอกสารที่ทนายอัปโหลด', 'DOCUMENT REPOSITORY')}</p>
                        <p className="text-white text-xs sm:text-sm font-bold">{trackingResult.files?.length || 0} {t('ไฟล์', 'File(s)')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {trackingResult.files && trackingResult.files.length > 0 ? (
                      trackingResult.files.map((file) => (
                        <div key={file.id} className="group">
                          <div onClick={() => handleFileDownload(file.url, file.name)} className="flex items-start justify-between p-3 sm:p-4 bg-slate-700/40 hover:bg-[#c5a059]/20 border border-slate-600/40 hover:border-[#c5a059]/40 rounded-lg transition-all cursor-pointer gap-2 sm:gap-3">
                            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#c5a059]/30 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4 text-[#c5a059]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm text-white font-semibold break-words group-hover:text-[#c5a059] transition-colors">{file.name}</p>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{file.fileSize} • {file.uploadDate}</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {downloadingFileId === file.id ? (
                                <Loader2 className="w-4 h-4 text-[#c5a059] animate-spin" />
                              ) : (
                                <Download className="w-4 h-4 text-slate-400 group-hover:text-[#c5a059] group-hover:scale-110 transition-all" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 sm:py-12 text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700/40 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-slate-600" />
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold tracking-wide">{t('ยังไม่มีเอกสารที่อัปโหลด', 'NO DOCUMENTS YET')}</p>
                        <p className="text-[10px] sm:text-[12px] text-slate-600 mt-1 sm:mt-2">{t('ทนายความจะอัปโหลดเอกสารของคดีของคุณที่นี่', 'Your attorney will upload case documents here')}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-white/5 pb-4">
                     <p className="text-white font-black text-[12px] sm:text-[13px] md:text-[15px] uppercase tracking-wider sm:tracking-widest">{t('บันทึกความคืบหน้าเชิงยุทธศาสตร์', 'CASE STRATEGY TIMELINE')}</p>
                     <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                           <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#c5a059] animate-pulse"></span>
                           <span className="text-[7px] sm:text-[8px] font-black text-[#c5a059] uppercase tracking-widest">Latest Update</span>
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-black px-2 sm:px-4 py-1 uppercase tracking-widest border border-white/10 ${trackingResult.status === 'contracted' ? 'text-[#c5a059]' : 'text-blue-400'}`}>
                           {trackingResult.status.toUpperCase()}
                        </span>
                     </div>
                   </div>

                   {/* New: Counsel's Memo Section (Visible only if Public) */}
                   {trackingResult.notes && trackingResult.isNotePublic && (
                     <div className="bg-white/5 border border-[#c5a059]/30 p-8 rounded-sm relative overflow-hidden group animate-reveal-up">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                         <MessageSquareQuote size={80} />
                       </div>
                       <h5 className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-6 flex items-center gap-2">
                         <Mail size={12} /> Counsel's Official Memo
                       </h5>
                       <div className="text-slate-200 font-light italic text-base leading-relaxed border-l-2 border-[#c5a059]/40 pl-6">
                         "{trackingResult.notes}"
                       </div>
                       <div className="mt-6 text-[9px] text-slate-500 uppercase tracking-widest font-black text-right">
                         — ธนเทพ พรหมชนะ, Managing Attorney
                       </div>
                     </div>
                   )}

                   <div className="space-y-12 relative pt-8">
                      <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-[#c5a059] via-[#c5a059]/20 to-transparent"></div>

                      {trackingResult.timeline && trackingResult.timeline.length > 0 ? (
                        trackingResult.timeline.sort((a,b) => b.id.localeCompare(a.id)).map((event, idx) => (
                          <div key={event.id} className="relative pl-20 group">
                             {/* Pulse effect for the latest entry */}
                             <div className={`absolute left-[18px] top-1 w-3 h-3 rounded-full border-4 border-slate-900 z-10 
                                ${event.isCompleted ? 'bg-[#c5a059]' : 'bg-slate-700'} 
                                ${idx === 0 ? 'scale-125 latest-milestone-dot' : ''}`}>
                             </div>
                             
                             {idx === 0 && (
                               <div className="absolute left-20 -top-10">
                                  <span className="text-[8px] font-black bg-[#c5a059] text-white px-3 py-1 uppercase tracking-widest rounded-full">New Milestone</span>
                               </div>
                             )}

                             <p className="text-[10px] text-[#c5a059] font-black tracking-widest mb-1">
                               {event.date} {event.time && `| ${event.time}`}
                             </p>
                             <h4 className={`text-xl font-serif-legal font-bold ${event.isCompleted ? 'text-white' : 'text-slate-600'}`}>
                                {event.title}
                             </h4>
                             <p className={`text-sm mt-2 italic font-light leading-relaxed ${idx === 0 ? 'text-slate-300' : 'text-slate-500'}`}>
                                {event.description}
                             </p>
                             
                             {idx === 0 && <div className="mt-4 w-12 h-0.5 bg-[#c5a059]/40 animate-pulse"></div>}
                          </div>
                        ))
                      ) : (
                        <div className="relative pl-20">
                          <div className="absolute left-[18px] top-1 w-3 h-3 rounded-full border-4 border-slate-900 z-10 bg-[#c5a059] scale-125 latest-milestone-dot"></div>
                          <p className="text-[10px] text-[#c5a059] font-black tracking-widest mb-1">INITIAL STATE</p>
                          <h4 className="text-xl font-serif-legal font-bold text-white italic">{t('เริ่มดำเนินการวิเคราะห์คดี', 'Preliminary Analysis Started')}</h4>
                        </div>
                      )}
                   </div>
                   
                   <div className="pt-12">
                     <button onClick={closeTracker} className="text-[12px] font-black text-slate-700 hover:text-white uppercase tracking-[0.3em] transition-all flex items-center gap-4">
                       {t('← กลับไปหน้าหลัก', 'BACK TO PORTAL MAIN')}
                     </button>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
