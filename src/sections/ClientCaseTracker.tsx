import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, FileText, ExternalLink, Calendar, Clock, Download, AlertCircle } from 'lucide-react';
import { Lead, CaseFile } from '../types';
import { backendService } from '../services/backend';
import { useLanguage } from '../context/LanguageContext';

interface ClientCaseTrackerProps {
  onClose: () => void;
}

export const ClientCaseTracker: React.FC<ClientCaseTrackerProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [caseData, setCaseData] = useState<Lead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError(t('กรุณาใส่เบอร์โทรศัพท์', 'Please enter your phone number'));
      return;
    }

    setIsSearching(true);
    setError(null);
    setCaseData(null);
    setFiles([]);

    try {
      const lead = await backendService.trackCaseByPhone(phone);
      if (lead) {
        setCaseData(lead);
        setFiles(lead.files || []);
      } else {
        setError(t('ไม่พบข้อมูลคดีสำหรับเบอร์โทรศัพท์นี้', 'No case data found for this phone number'));
      }
    } catch (err: any) {
      setError(err.message || t('เกิดข้อผิดพลาดในการค้นหา', 'An error occurred during search'));
    } finally {
      setIsSearching(false);
    }
  };

  const getDownloadUrl = (url: string): string => {
    // Google Drive: convert view link to direct download
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    return url;
  };

  const handleOpenFile = (file: CaseFile) => {
    if (!file.url || file.url.startsWith('firestore://')) return;
    const downloadUrl = getDownloadUrl(file.url);
    window.open(downloadUrl, '_blank');
  };

  const handleDownloadFile = (file: CaseFile) => {
    if (!file.url || file.url.startsWith('firestore://')) return;
    const downloadUrl = getDownloadUrl(file.url);
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-slate-900 border border-[#c5a059]/30 shadow-2xl relative flex flex-col max-h-[95vh] rounded-sm overflow-hidden animate-reveal-up text-left">

        {/* Header */}
        <div className="px-6 py-4 sm:px-10 sm:py-8 border-b border-white/5 bg-slate-950 flex justify-between items-start gap-4">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-serif-legal font-bold text-white tracking-tight italic">
              {t('ศูนย์ติดตามสถานะคดี', 'Case Status Tracker')}
            </h2>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2">CLIENT CASE TRACKER</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-3 transition-all hover:bg-white/5 rounded-full border border-white/5 hover:border-[#c5a059]/30">
            <X size={28} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 sm:p-10 space-y-8">

          {/* Search Section */}
          {!caseData && (
            <div className="bg-slate-950/50 p-8 sm:p-10 border border-white/5 space-y-6 rounded-sm">
              <div>
                <h3 className="text-white font-serif-legal font-bold text-lg italic mb-2">{t('ค้นหาสถานะคดีของคุณ', 'Search Your Case Status')}</h3>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-black">{t('กรุณาใส่เบอร์โทรศัพท์ที่ลงทะเบียนกับสำนักงานกฎหมาย', 'Enter the phone number registered with the law firm')}</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{t('เบอร์โทรศัพท์', 'Phone Number')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('เช่น 081-2345678', 'e.g. 081-2345678')}
                    className="w-full bg-slate-950 border border-white/10 p-4 text-white text-sm outline-none focus:border-[#c5a059] rounded-sm transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-sm text-red-400 text-[11px] font-black flex items-center gap-3">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-[#c5a059] text-white py-4 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-all disabled:opacity-50"
                >
                  {isSearching ? t('กำลังค้นหา...', 'Searching...') : t('ค้นหาสถานะคดี', 'Search Case Status')}
                </button>
              </form>
            </div>
          )}

          {/* Case Data Display */}
          {caseData && (
            <>
              {/* Case Header */}
              <div className="bg-gradient-to-r from-[#c5a059]/10 to-transparent border border-[#c5a059]/30 p-8 rounded-sm space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.4em] mb-2">{t('เลขประจำตัว', 'Client ID')}</h3>
                    <p className="text-2xl font-bold text-white font-serif-legal">{caseData.name}</p>
                  </div>
                  <button
                    onClick={() => { setCaseData(null); setPhone(''); }}
                    className="text-slate-500 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-sm transition-all hover:bg-white/5"
                  >
                    {t('ค้นหาคดีอื่น', 'Search Another Case')}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-[#c5a059]" />
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-black">{t('โทรศัพท์', 'Phone')}</p>
                      <p className="text-white font-mono text-sm">{caseData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-[#c5a059]" />
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-black">{t('อีเมล', 'Email')}</p>
                      <p className="text-white font-mono text-sm">{caseData.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {(caseData.timeline && caseData.timeline.length > 0) && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-[#c5a059]" /> {t('ประวัติความคืบหน้าคดี', 'Case Progress History')}
                  </h4>
                  <div className="space-y-3">
                    {caseData.timeline.sort((a, b) => b.id.localeCompare(a.id)).map((event, idx) => (
                      <div key={event.id} className="relative pl-8 pb-6 border-l-2 border-[#c5a059]/30 last:pb-0">
                        <div className="absolute -left-3 top-0 w-5 h-5 bg-[#c5a059] rounded-full border-4 border-slate-900"></div>
                        <div className="bg-slate-950/50 p-4 rounded-sm border border-white/5">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[#c5a059] text-[10px] font-black uppercase">{event.date}</span>
                            <span className="text-slate-500 text-[9px]">{event.time}</span>
                          </div>
                          <p className="text-white font-bold text-base italic font-serif-legal mb-1">{event.title}</p>
                          {event.description && (
                            <p className="text-slate-300 text-[11px] leading-relaxed">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Vault */}
              {(files && files.length > 0) && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-[#c5a059]" /> {t('เอกสารแนบ', 'Attached Documents')}
                  </h4>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="bg-slate-950/50 border border-white/5 p-4 rounded-sm hover:border-[#c5a059]/30 transition-all group">
                        <div className="flex items-center justify-between gap-4">
                          <div
                            className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                            onClick={() => handleOpenFile(file)}
                          >
                            <div className="p-2 bg-[#c5a059]/10 rounded-sm flex-shrink-0">
                              <FileText size={20} className="text-[#c5a059]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-bold text-sm truncate group-hover:text-[#c5a059] transition-colors">{file.name}</p>
                              <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-500">
                                <span>{file.fileSize}</span>
                                <span>•</span>
                                <span>{file.uploadDate}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDownloadFile(file); }}
                            className="flex-shrink-0 p-2 hover:bg-white/5 rounded-sm transition-all text-slate-500 hover:text-[#c5a059]"
                            title={t('ดาวน์โหลด', 'Download')}
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {caseData.notes && caseData.isNotePublic && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('หมายเหตุจากทนาย', 'Attorney Notes')}</h4>
                  <div className="bg-slate-950/50 border border-[#c5a059]/20 p-6 rounded-sm">
                    <p className="text-slate-300 text-base leading-relaxed italic">{caseData.notes}</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {(!caseData.timeline || caseData.timeline.length === 0) && (!files || files.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-base">{t('ยังไม่มีการอัปเดตสถานะคดี', 'No case status updates yet')}</p>
                  <p className="text-slate-600 text-sm mt-2">{t('ทนายความจะอัปเดตสถานะคดีของคุณในระบบแล้วจะแจ้งให้ทราบทางอีเมล', 'Your attorney will update your case status and notify you via email')}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
