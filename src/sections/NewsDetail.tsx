
import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Calendar, Tag, Share2, Facebook, Twitter, Link as LinkIcon, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { NewsItem } from '../types';
import { backendService } from '../services/backend';

interface NewsDetailProps {
  newsItem: NewsItem;
  onBack: (targetId?: string) => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ newsItem, onBack }) => {
  const { t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    await backendService.subscribeNewsletter(email);
    setIsSubscribing(false);
    setIsSuccess(true);
    setEmail('');
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 animate-reveal-up relative selection:bg-[#c5a059] selection:text-white">
      <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-100 z-[200]">
        <div 
          className="h-full bg-[#c5a059] transition-all duration-150 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="fixed top-24 left-6 lg:left-20 z-50 flex flex-col gap-4">
        <button 
          onClick={() => onBack('news')}
          className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-[#c5a059] transition-all group"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      <header className="relative h-[85vh] lg:h-[90vh] bg-slate-950 flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={newsItem.image} 
            alt={newsItem.title} 
            className="w-full h-full object-cover scale-105 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 pb-20 w-full text-center">
          <div className="mb-10 inline-block">
            <span className="bg-[#c5a059] text-white text-[10px] font-black px-8 py-3 uppercase tracking-[0.4em] shadow-2xl">
              {newsItem.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif-legal font-bold text-white leading-tight mb-12 animate-reveal-up">
            {newsItem.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-[11px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#c5a059]" />
              {newsItem.author}
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#c5a059]" />
              {newsItem.date}
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#c5a059]" />
              {newsItem.readingTime}
            </div>
          </div>
        </div>
      </header>

      <article className="max-w-[800px] mx-auto px-6 py-32 lg:py-48 text-left">
        <div className="prose prose-slate prose-xl lg:prose-2xl max-w-none">
          {newsItem.fullContent.map((paragraph, idx) => (
            <p 
              key={idx} 
              className={`text-slate-600 font-light leading-relaxed mb-12 text-lg md:text-2xl ${idx === 0 ? 'text-3xl font-medium text-slate-800 border-b border-slate-100 pb-12 mb-16 italic' : ''}`}
            >
              {paragraph}
            </p>
          ))}
          
          <div className="h-[2px] w-32 bg-[#c5a059]/30 my-24"></div>

          <p className="text-lg text-slate-500 leading-relaxed font-light italic">
            {t(
              "หากท่านต้องการคำปรึกษาเพิ่มเติมในเชิงลึกเกี่ยวกับหัวข้อนี้ ทีมงานทนายความธนเทพพร้อมให้บริการข้อมูลที่ทันสมัยที่สุดเสมอ",
              "If you require further in-depth consultation on this topic, the Thanathep legal team is always available to provide the most up-to-date information."
            )}
          </p>
        </div>

        <div className="mt-24 pt-12 border-t border-slate-100">
           <div className="flex flex-wrap gap-4 items-center">
              <Tag size={18} className="text-[#c5a059]" />
              {newsItem.tags.map(tag => (
                <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-4 py-2 hover:border-[#c5a059] hover:text-[#c5a059] transition-all cursor-pointer">
                  #{tag}
                </span>
              ))}
           </div>
        </div>

        <div className="mt-32 p-12 lg:p-20 bg-slate-900 text-white rounded-sm shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
           
           <div className="relative z-10">
             {isSuccess ? (
               <div className="text-center py-10 animate-reveal-up">
                 <CheckCircle2 className="text-[#c5a059] mx-auto mb-6" size={48} />
                 <h4 className="text-3xl font-serif-legal font-bold mb-2">Subscription Confirmed</h4>
                 <p className="text-white/60">You are now on our list for critical legal insights.</p>
               </div>
             ) : (
               <>
                 <h4 className="text-3xl font-serif-legal font-bold mb-6 italic">{t('รับข่าวสารกฎหมายที่สำคัญ', 'Stay Informed on Legal Trends')}</h4>
                 <p className="text-white/60 font-light mb-10 text-lg">{t('สมัครรับจดหมายข่าวเพื่อไม่พลาดทุกการเปลี่ยนแปลงทางกฎหมายล่าสุด', 'Subscribe to our legal newsletter for critical updates delivered to your inbox.')}</p>
                 <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      required
                      placeholder={t('อีเมลของคุณ', 'Your email address')} 
                      className="bg-white/5 border border-white/10 px-6 py-5 flex-grow focus:outline-none focus:border-[#c5a059] transition-all font-bold text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                      disabled={isSubscribing}
                      className="bg-[#c5a059] text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubscribing ? <Loader2 className="animate-spin" size={14} /> : t('สมัครสมาชิก', 'SUBSCRIBE')}
                    </button>
                 </form>
               </>
             )}
           </div>
        </div>
      </article>

      <section className="bg-slate-50 py-32 text-center">
         <p className="text-slate-400 uppercase tracking-[0.5em] text-[10px] font-black mb-10">{t('ขอบคุณที่ติดตามบทความของเรา', 'THANK YOU FOR READING')}</p>
         <button 
           onClick={() => onBack('news')}
           className="text-slate-900 font-serif-legal text-4xl font-bold italic hover:text-[#c5a059] transition-colors"
         >
           ← {t('กลับไปยังหน้าบทความทั้งหมด', 'Back to all insights')}
         </button>
      </section>
    </div>
  );
};
