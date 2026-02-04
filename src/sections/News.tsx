
import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Loader2 } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useLanguage } from '../context/LanguageContext';
import { NewsItem } from '../types';
import { backendService } from '../services/backend';

interface NewsProps {
  onSelectNews?: (newsItem: NewsItem) => void;
}

export const News: React.FC<NewsProps> = ({ onSelectNews }) => {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await backendService.getAllNews();
      setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <section id="news" className="py-48 bg-slate-950 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Legal Background" 
          className="w-full h-full object-cover grayscale opacity-10 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-left relative z-10">
        <SectionHeader title={t("ข่าวสารและบทความ", "Latest Insights")} subtitle={t("บทวิเคราะห์ทางกฎหมาย", "Legal Analysis")} light />
        
        {loading ? (
          <div className="flex items-center justify-center py-32 text-[#c5a059]">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {news.map((item, idx) => (
              <div key={item.id} className="group bg-slate-900/60 backdrop-blur-md border border-white/5 p-8 rounded-sm hover:bg-slate-900/90 hover:border-[#c5a059]/50 transition-all duration-500 shadow-xl flex flex-col h-full animate-reveal-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative mb-10 overflow-hidden aspect-video bg-slate-800">
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-[#c5a059] text-white text-[9px] font-black px-4 py-2 uppercase tracking-widest shadow-lg">
                      {item.category}
                    </span>
                  </div>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100"
                  />
                </div>

                <div className="space-y-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="text-[10px] font-bold tracking-[0.2em]">{item.date}</span>
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest"><Clock size={10} /> {item.readingTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold font-serif-legal text-white group-hover:text-[#c5a059] transition-colors leading-snug h-[3.5rem] overflow-hidden">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="pt-6 border-t border-white/5 mt-auto">
                    <button 
                      onClick={() => onSelectNews && onSelectNews(item)}
                      className="inline-flex items-center gap-3 text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em] hover:gap-6 transition-all"
                    >
                      {t('อ่านเพิ่มเติม', 'Read More')} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
