
import React, { useState, useRef } from 'react';
import { X, ShieldCheck, Phone, Clock, Plus, Loader2, Trash2, FileText, ExternalLink, Mail, ChevronRight, Cloud, Lock, Eye, Save, Send, Upload } from 'lucide-react';
import { Lead, TimelineEvent, CaseFile } from '../../types';
import { backendService } from '../../services/backend';
import { useLanguage } from '../../context/LanguageContext';

interface CasePortfolioEditorProps {
  lead: Lead;
  onClose: () => void;
  onRefresh: () => void;
}

export const CasePortfolioEditor: React.FC<CasePortfolioEditorProps> = ({ lead, onClose, onRefresh }) => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notifyViaEmail, setNotifyViaEmail] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Milestone Form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  
  // Note Form
  const [leadNotes, setLeadNotes] = useState(lead.notes || '');
  const [isPublicNote, setIsPublicNote] = useState(lead.isNotePublic || false);

  // File Form - Support both file upload and link reference
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingUrl, setPendingUrl] = useState('');
  const [docName, setDocName] = useState('');
  const [skipFileAttachment, setSkipFileAttachment] = useState(false);

  const handleSetToNow = () => {
    const now = new Date();
    setEventDate(now.toISOString().split('T')[0]);
    setEventTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setPendingFile(files[0]);
      setPendingUrl(''); // Clear link if file is dropped
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPendingFile(e.target.files[0]);
      setPendingUrl(''); // Clear link if file is selected
    }
  };

  const handleClearFile = () => {
    setPendingFile(null);
    setPendingUrl('');
    setDocName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await backendService.updateLeadNotes(lead.id, leadNotes, isPublicNote);
      alert(t("บันทึกข้อมูลเรียบร้อยแล้ว", "Notes saved successfully"));
    } catch (e) {
      alert(t("เกิดข้อผิดพลาดในการบันทึก", "An error occurred while saving"));
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleFileClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      setErrorMessage(t("กรุณาระบุชื่องาน/ความคืบหน้า", "Please specify task/progress name"));
      return;
    }
    
    if (!skipFileAttachment && !pendingUrl.trim() && !pendingFile) {
      setErrorMessage(t("กรุณากำหนด Link หรือเลือกไฟล์ หรือเลือก 'ไม่แนบไฟล์'", "Please provide a link, select a file, or choose 'No attachment'"));
      return;
    }

    // Validate URL if provided
    if (!skipFileAttachment && pendingUrl.trim() && !pendingUrl.trim().startsWith('http')) {
      setErrorMessage(t("URL ไม่ถูกต้อง (ต้องเริ่มด้วย http:// หรือ https://)", "Invalid URL (must start with http:// or https://)"));
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      let finalFiles = [...(lead.files || [])];
      let finalTimeline = [...(lead.timeline || [])];
      let fileUrl = pendingUrl.trim();
      let fileName = docName.trim() || t("เอกสารแนบ", "Attachment");

      console.log(`📝 Form submission:`);
      console.log(`  - eventTitle: ${eventTitle}`);
      console.log(`  - fileName: ${fileName}`);
      console.log(`  - fileUrl: ${fileUrl}`);
      console.log(`  - pendingFile: ${pendingFile ? pendingFile.name : 'none'}`);

      if (!skipFileAttachment) {
        // Handle file upload to Firebase Storage
        if (pendingFile) {
          console.log(`📤 Uploading file to Storage...`);
          fileUrl = await backendService.uploadFileAsBase64(pendingFile, lead.id, lead.phone);
          fileName = docName.trim() || pendingFile.name;
          console.log(`✅ File uploaded: ${fileUrl.substring(0, 100)}...`);
        } else {
          console.log(`🔗 Using URL link: ${fileUrl}`);
        }

        // Validate that fileUrl exists before saving
        if (!fileUrl || fileUrl.length === 0) {
          throw new Error(t("ไม่สามารถได้รับ URL ไฟล์ - กรุณาลองใหม่", "Could not get file URL - please try again"));
        }

        // Add file reference to files array
        finalFiles.push({
          id: Date.now().toString(),
          name: fileName,
          url: fileUrl,
          type: 'other',
          fileSize: pendingFile ? (pendingFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'Cloud Link',
          uploadDate: new Date().toLocaleDateString('th-TH')
        });
      }

      const [y, m, d] = eventDate.split('-');
      const newEventDate = `${d}/${m}/${y}`;
      finalTimeline.push({
        id: (Date.now() + 1).toString(),
        date: newEventDate,
        time: eventTime,
        title: eventTitle,
        description: skipFileAttachment ? eventTitle : `${t('อัปเดตเอกสารใหม่', 'New document update')}: ${fileName}`,
        isCompleted: true
      });

      console.log(`💾 Updating lead portfolio...`);
      // Update Database
      await backendService.updateLeadPortfolio(lead.id, finalTimeline, finalFiles);
      console.log(`✅ Portfolio updated`);

      // Trigger Email Notification
      if (notifyViaEmail && lead.email) {
        console.log(`📧 Sending email to ${lead.email}...`);
        const emailBody = skipFileAttachment
          ? t(
              `เรียนคุณ ${lead.name},\n\nความคืบหน้าล่าสุดในคดีของคุณได้รับการอัปเดตในระบบแล้ว:\n\nสถานะ: ${eventTitle}\nวันที่ดำเนินการ: ${newEventDate} ${eventTime}\n\nคุณสามารถตรวจสอบรายละเอียดได้ที่ศูนย์ติดตามสถานะคดี (Client Portal) ตลอด 24 ชั่วโมง\n\nด้วยความเคารพ,\nสำนักงานกฎหมาย Thanathep Law`,
              `Dear ${lead.name},\n\nYour case has been updated with the latest progress:\n\nStatus: ${eventTitle}\nDate: ${newEventDate} ${eventTime}\n\nYou can check the details at the Client Portal 24/7.\n\nBest regards,\nThanathep Law Firm`
            )
          : t(
              `เรียนคุณ ${lead.name},\n\nความคืบหน้าล่าสุดในคดีของคุณได้รับการอัปเดตในระบบแล้ว:\n\nสถานะ: ${eventTitle}\nวันที่ดำเนินการ: ${newEventDate} ${eventTime}\n\n📎 เอกสารแนบ: ${fileName}\n🔗 Link: ${fileUrl}\n\nคุณสามารถตรวจสอบรายละเอียดและเอกสารแนบได้ที่ศูนย์ติดตามสถานะคดี (Client Portal) ตลอด 24 ชั่วโมง\n\nด้วยความเคารพ,\nสำนักงานกฎหมาย Thanathep Law`,
              `Dear ${lead.name},\n\nYour case has been updated with the latest progress:\n\nStatus: ${eventTitle}\nDate: ${newEventDate} ${eventTime}\n\n📎 Attachment: ${fileName}\n🔗 Link: ${fileUrl}\n\nYou can check the details and attachments at the Client Portal 24/7.\n\nBest regards,\nThanathep Law Firm`
            );
        
        const emailResult = await backendService.sendSimulatedEmail({
          to: lead.email,
          subject: `Elite Counsel Case Update: ${eventTitle}`,
          body: emailBody,
          type: 'milestone',
          canReply: true
        });
        console.log(`✅ Email sent: ${emailResult.id}`);
      }

      alert(t("บันทึกความคืบหน้าและส่งอีเมลเรียบร้อยแล้ว", "Progress saved and email sent successfully"));

      // Reset form
      setEventTitle('');
      handleClearFile();
      setEventDate(new Date().toISOString().split('T')[0]);
      setEventTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      onRefresh();
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      setErrorMessage(error.message || t("เกิดข้อผิดพลาดในการบันทึก", "An error occurred while saving"));
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = async (fileId: string) => {
    if (!confirm(t("ยืนยันการลบไฟล์นี้จากระบบ Cloud?", "Confirm delete this file from Cloud?"))) return;
    const updatedFiles = lead.files?.filter(f => f.id !== fileId) || [];
    await backendService.updateLeadPortfolio(lead.id, lead.timeline || [], updatedFiles);
    onRefresh();
  };

  const removeTimeline = async (eventId: string) => {
    if (!confirm(t("ยืนยันการลบไทม์ไลน์นี้?", "Confirm delete this timeline entry?"))) return;
    const updatedTimeline = lead.timeline?.filter(t => t.id !== eventId) || [];
    await backendService.updateLeadPortfolio(lead.id, updatedTimeline, lead.files || []);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-6xl bg-slate-900 border border-[#c5a059]/30 shadow-2xl relative flex flex-col max-h-[95vh] rounded-sm overflow-hidden animate-reveal-up text-left">
        
        {/* Header / Navbar ของ CasePortfolioEditor */}
        <div className="px-6 py-4 sm:px-10 sm:py-8 border-b border-white/5 bg-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#c5a059]/10 rounded-full flex items-center justify-center text-[#c5a059] flex-shrink-0 border border-[#c5a059]/20">
              <Cloud size={lead.name ? 28 : 24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-serif-legal font-bold text-white tracking-tight">
                {lead.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono tracking-tight">
                  <Phone size={14} className="text-[#c5a059]" /> {lead.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono tracking-tight">
                  <Mail size={14} className="text-[#c5a059]" /> {lead.email || 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 self-end sm:self-auto">
             <div className="hidden md:block text-right">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em] mb-1">Portfolio Management</p>
                <div className="flex items-center justify-end gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest">Counsel Access</span>
                </div>
             </div>
             <button onClick={onClose} className="text-slate-500 hover:text-white p-3 transition-all hover:bg-white/5 rounded-full border border-white/5 hover:border-[#c5a059]/30">
                <X size={28} />
             </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-8 space-y-12">
          
          {/* Section 1: Strategic Notes */}
          <div className="bg-slate-950/50 p-6 sm:p-10 border border-white/5 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-white font-serif-legal font-bold text-xl italic">Strategic Counsel Notes</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">
                  {t('บันทึกส่วนตัวของทนาย หรือข้อความที่ต้องการแจ้งลูกความเพิ่มเติม', 'Private attorney notes or additional messages for client')}
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-sm border border-white/5">
                <button 
                  onClick={() => setIsPublicNote(false)}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${!isPublicNote ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  <Lock size={12} /> Attorney Only
                </button>
                <button 
                  onClick={() => setIsPublicNote(true)}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${isPublicNote ? 'bg-[#c5a059] text-white shadow-lg' : 'text-slate-500'}`}
                >
                  <Eye size={12} /> Shared with Client
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea 
                className="w-full bg-slate-950 border border-white/10 p-6 text-white text-base leading-relaxed outline-none focus:border-[#c5a059] transition-all min-h-[120px] rounded-sm font-light italic"
                placeholder={t('เขียนบันทึกยุทธศาสตร์ที่นี่...', 'Write strategic notes here...')}
                value={leadNotes}
                onChange={(e) => setLeadNotes(e.target.value)}
              />
              <button 
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="absolute bottom-4 right-4 bg-white/5 hover:bg-[#c5a059] text-slate-500 hover:text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-white/10"
              >
                {isSavingNotes ? <Loader2 className="animate-spin" size={12} /> : <Save size={12} />}
                SAVE NOTES
              </button>
            </div>
          </div>

          {/* Section 2: Milestone Publisher */}
          <form onSubmit={handleSubmit} className="space-y-10 bg-slate-950/30 p-6 sm:p-10 border border-white/5">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-white font-serif-legal font-bold text-xl italic">New Milestone & Vault Upload</h3>
              
              <div className="flex items-center gap-3">
                 <label className="flex items-center gap-2 cursor-pointer group">
                   <div 
                    onClick={() => setNotifyViaEmail(!notifyViaEmail)}
                    className={`w-10 h-5 rounded-full relative transition-all ${notifyViaEmail ? 'bg-[#c5a059]' : 'bg-slate-800'}`}
                   >
                     <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${notifyViaEmail ? 'left-5.5' : 'left-0.5'}`}></div>
                   </div>
                   <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-white flex items-center gap-2">
                     <Mail size={12} /> Notify via Email
                   </span>
                 </label>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{t('ชื่องาน / ความคืบหน้า', 'Task / Progress')}</label>
                <input required className="w-full bg-slate-950 border border-white/10 p-4 text-white text-sm outline-none focus:border-[#c5a059]" placeholder={t('เช่น ยื่นคำฟ้องต่อศาลแพ่ง', 'e.g. Filed complaint to civil court')} value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{t('วันที่', 'Date')}</label>
                  <input type="date" className="w-full bg-slate-950 border border-white/10 p-4 text-white text-sm outline-none focus:border-[#c5a059]" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest flex justify-between items-center">
                    {t('เวลา', 'Time')}
                    <button type="button" onClick={handleSetToNow} className="text-[8px] text-[#c5a059] hover:underline flex items-center gap-1"><Clock size={10}/> NOW</button>
                  </label>
                  <input type="time" className="w-full bg-slate-950 border border-white/10 p-4 text-white text-sm outline-none focus:border-[#c5a059]" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/50 border border-white/5 p-4 rounded-sm">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => {
                    setSkipFileAttachment(!skipFileAttachment);
                    if (!skipFileAttachment) {
                      setPendingFile(null);
                      setPendingUrl('');
                      setDocName('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                  }}
                  className={`w-10 h-5 rounded-full relative transition-all ${skipFileAttachment ? 'bg-[#c5a059]' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${skipFileAttachment ? 'left-5.5' : 'left-0.5'}`}></div>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white tracking-widest">
                  {t('ไม่ต้องการแนบไฟล์หรือลิงก์ใดๆ (บันทึกเฉพาะความคืบหน้า)', 'No file or link attachment (save progress only)')}
                </span>
              </label>
            </div>

            {!skipFileAttachment && (
            <>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest flex items-center gap-2">
                  <ExternalLink size={12} className="text-[#c5a059]" /> {t('URL ลิงค์ไฟล์ (Cloud/Drive)', 'File URL (Cloud/Drive)')}
                </label>
                <div className="space-y-2">
                  <input 
                    type="url"
                    placeholder={t('เช่น https://drive.google.com/file/d/xxx หรือ Dropbox link', 'e.g. https://drive.google.com/file/d/xxx or Dropbox link')}
                    value={pendingUrl}
                    onChange={(e) => {
                      setPendingUrl(e.target.value);
                      setPendingFile(null); // Clear file if URL is entered
                    }}
                    className="w-full bg-slate-950 border border-white/10 p-4 text-white text-sm outline-none focus:border-[#c5a059] transition-all rounded-sm"
                  />
                  {pendingUrl && (
                    <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-sm">
                      <ExternalLink size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-grow min-w-0">
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Link Ready</p>
                        <p className="text-[11px] text-slate-300 break-all mt-1">{pendingUrl}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPendingUrl('')}
                        className="text-slate-500 hover:text-red-400 flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest block mt-4">{t('ระบุชื่อเอกสาร', 'Document Name')}</label>
                  <input className="w-full bg-slate-950 border border-white/10 p-4 text-white text-sm outline-none focus:border-[#c5a059] rounded-sm" placeholder={t('เช่น สำเนาคำฟ้อง', 'e.g. Copy of complaint')} value={docName} onChange={(e) => setDocName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest flex items-center gap-2">
                  <Upload size={12} className="text-[#c5a059]" /> {t('อัปโหลดเอกสาร', 'Upload Document')}
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-12 border-2 border-dashed rounded-lg transition-all cursor-pointer group min-h-[200px] flex flex-col items-center justify-center ${
                    isDragActive
                      ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059]'
                      : pendingFile
                      ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400'
                      : 'border-white/20 bg-white/5 text-slate-400 hover:border-[#c5a059]/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3 pointer-events-none">
                    <div className={`p-3 rounded-full ${pendingFile ? 'bg-emerald-500/20' : 'bg-white/10 group-hover:bg-[#c5a059]/20'}`}>
                      <Upload size={32} className={pendingFile ? 'text-emerald-400' : ''} />
                    </div>
                    <div className="text-center">
                      {pendingFile ? (
                        <>
                          <p className="text-sm font-black uppercase tracking-widest">{t('✓ ไฟล์ที่เลือก', '✓ File Selected')}</p>
                          <p className="text-[11px] font-bold mt-1">{pendingFile.name}</p>
                          <p className="text-[9px] text-slate-500 mt-1">{(pendingFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-black uppercase tracking-widest">{t('ลากไฟล์ที่นี่', 'Drag file here')}</p>
                          <p className="text-[9px] text-slate-500 mt-2">{t('หรือคลิกเพื่อเลือกจากคอมพิวเตอร์', 'or click to select from computer')}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                  />
                </div>
                {pendingFile && (
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="text-[9px] font-black uppercase text-slate-500 hover:text-red-400 transition-colors"
                  >
                    {t('✕ เลือกไฟล์อื่น', '✕ Choose another file')}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-950/50 border border-white/5 p-4 rounded-sm">
              <p className="text-[9px] text-slate-400 italic">
                {t('💡 เคล็ดลับ: เลือกไฟล์จากคอมพิวเตอร์หรือลากไฟล์เข้ามา ระบบจะอัปโหลดไปยัง Cloud Storage และส่งลิงก์ให้ลูกความผ่านทางอีเมล', '💡 Tip: Select files from your computer or drag them in. The system will upload to Cloud Storage and send the link to the client via email.')}
              </p>
            </div>
            </>
            )}

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-sm text-red-400 text-[10px] font-black">
                ⚠️ {errorMessage}
              </div>
            )}

            <button type="submit" disabled={isProcessing} className="w-full bg-[#c5a059] text-white py-6 font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-4 shadow-xl">
              {isProcessing ? <Loader2 className="animate-spin" /> : <Send size={16} />} 
              {isProcessing ? 'PROCESSING & SENDING NOTIFICATION...' : 'PUBLISH TO CLIENT PORTAL'}
            </button>
          </form>

          {/* Section 3: Records History */}
          <div className="grid lg:grid-cols-2 gap-12 pb-10">
            <div className="space-y-6">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Milestone History</h5>
              <div className="space-y-4">
                {(lead.timeline || []).sort((a,b) => b.id.localeCompare(a.id)).map(ev => (
                  <div key={ev.id} className="p-5 bg-slate-950/50 border border-white/5 flex justify-between items-center group">
                    <div>
                      <p className="text-[#c5a059] text-[9px] font-black uppercase">{ev.date} | {ev.time}</p>
                      <p className="text-white text-base font-bold italic font-serif-legal">{ev.title}</p>
                    </div>
                    <button onClick={() => removeTimeline(ev.id)} className="text-slate-700 hover:text-red-500 transition-colors p-2"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText size={12}/> Secure Document Vault</h5>
              <div className="space-y-4">
                {(lead.files || []).map(f => (
                  <div key={f.id} className="p-5 bg-slate-950/50 border border-white/5 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <FileText size={18} className="text-[#c5a059]"/>
                      <div>
                        <p className="text-white text-sm font-bold">{f.name}</p>
                        <p className="text-slate-600 text-[8px] uppercase">{f.uploadDate} | {f.fileSize}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleFileClick(f.url)} className="text-slate-600 hover:text-[#c5a059] p-2 transition-all"><ExternalLink size={16}/></button>
                      <button onClick={() => removeFile(f.id)} className="text-slate-700 hover:text-red-500 p-2 transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
