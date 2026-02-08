
import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Search } from 'lucide-react';
import { NavLink, ServiceCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getServiceCategories } from '../sections/Expertise';

interface NavbarProps {
  onSelectService?: (service: ServiceCategory) => void;
  onNavigate?: (href: string) => void;
  activeContext?: 'home' | 'about' | 'expertise' | 'news' | 'contact' | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectService, onNavigate, activeContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isClient, setIsClient] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Check if user is a client (has registered or tracked before)
    const checkClientStatus = () => {
      const status = localStorage.getItem('elite_is_client');
      setIsClient(status === 'true');
    };

    checkClientStatus();
    window.addEventListener('storage', checkClientStatus);
    // Listen for local custom event when user submits contact form
    window.addEventListener('elite_client_verified', checkClientStatus);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkClientStatus);
      window.removeEventListener('elite_client_verified', checkClientStatus);
    };
  }, []);

  useEffect(() => {
    if (activeContext) {
      setActiveSection(activeContext);
      return;
    }

    const sections = ['home', 'about', 'expertise', 'news', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      return {
        id,
        observer: new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                setActiveSection(id);
              }
            });
          },
          { threshold: [0.3, 0.5, 0.7] }
        )
      };
    });

    observers.forEach(obs => {
      if (obs) {
        const el = document.getElementById(obs.id);
        if (el) obs.observer.observe(el);
      }
    });

    return () => {
      observers.forEach(obs => {
        if (obs) {
          const el = document.getElementById(obs.id);
          if (el) obs.observer.unobserve(el);
        }
      });
    };
  }, [activeContext]);

  const serviceCats = getServiceCategories(t);

  const links: NavLink[] = [
    { name: t('หน้าแรก', 'HOME'), href: '#home', id: 'home' },
    { name: t('เกี่ยวกับเรา', 'ABOUT'), href: '#about', id: 'about' },
    {
      name: t('บริการของเรา', 'SERVICES'),
      href: '#expertise',
      id: 'expertise',
      children: serviceCats.map(cat => ({
        name: cat.title,
        href: '#expertise',
        id: cat.id
      }))
    },
    { name: t('บทความ', 'INSIGHTS'), href: '#news', id: 'news' },
    { name: t('ติดต่อเรา', 'CONTACT'), href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
    setIsOpen(false);
  };

  const handleServiceClick = (e: React.MouseEvent, catId?: string) => {
    if (catId && onSelectService) {
      e.preventDefault();
      const service = serviceCats.find(s => s.id === catId);
      if (service) {
        onSelectService(service);
        setIsOpen(false);
      }
    }
  };

  const openTracker = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('elite_open_tracker'));
    setIsOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-slate-950/98 shadow-2xl py-2 sm:py-3 backdrop-blur-2xl border-b border-[#c5a059]/30' : 'bg-transparent py-4 sm:py-8'}`}>
        <div className="max-w-[1536px] mx-auto px-4 md:px-6 lg:px-10 flex justify-between items-center relative">
          {/* Logo Section */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tighter text-white whitespace-nowrap">
              <span className="text-[#c5a059] font-serif-legal italic">T</span>HANATHEP<span className="font-light tracking-[0.15em] ml-1 opacity-60 text-[7px] sm:text-[8px] xl:text-xs uppercase">LAW FIRM</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-nowrap">
            {/* Language Switcher */}
            <div className="flex items-center mr-2 lg:mr-4 xl:mr-8 pr-2 lg:pr-4 xl:pr-8 border-r border-white/10 gap-3 lg:gap-4 xl:gap-6 flex-shrink-0">
              <button onClick={() => setLang('th')} className={`text-[11px] font-black tracking-widest transition-all ${lang === 'th' ? 'text-[#c5a059] scale-110' : 'text-white/40 hover:text-white'}`}>TH</button>
              <span className="text-white/10 text-[10px]">|</span>
              <button onClick={() => setLang('en')} className={`text-[11px] font-black tracking-widest transition-all ${lang === 'en' ? 'text-[#c5a059] scale-110' : 'text-white/40 hover:text-white'}`}>EN</button>
            </div>

            {/* Nav Links */}
            <div className="flex items-center">
              {links.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <div key={link.name} className="relative group flex-shrink-0">
                    <a
                      href={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      className={`flex items-center gap-1.5 px-3 xl:px-5 py-4 uppercase tracking-[0.1em] transition-all duration-500 whitespace-nowrap relative
                        ${isActive
                          ? 'text-[#c5a059] text-[13px] font-black'
                          : 'text-white/70 text-[14px] font-bold hover:text-white'
                        }`}
                    >
                      {link.name}
                      {link.children && <ChevronDown size={12} className={`transition-transform duration-300 ${isActive ? 'opacity-100' : 'opacity-40'} group-hover:rotate-180`} />}

                      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#c5a059] transition-all duration-500 ease-out
                        ${isActive ? 'w-1/2 opacity-100' : 'w-0 opacity-0 group-hover:w-1/3 group-hover:opacity-50'}
                      `}></div>
                    </a>

                    {link.children && (
                      <div className="absolute left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                        <div className="bg-slate-900 border border-[#c5a059]/30 p-1 min-w-[280px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] rounded-sm">
                          {link.children.map((child) => (
                            <a
                              key={child.name}
                              href={child.href}
                              onClick={(e) => {
                                if (link.id === 'expertise') handleServiceClick(e, child.id);
                              }}
                              className="block px-6 py-4 text-[14px] font-bold text-slate-300 hover:text-[#c5a059] hover:bg-white/5 transition-all uppercase tracking-[0.1em] border-b border-white/5 last:border-0"
                            >
                              <span className="line-clamp-1">{child.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Global Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Track Case Button - Only for Clients */}
            {isClient && (
              <button
                onClick={openTracker}
                className="hidden sm:flex items-center gap-2 border border-[#c5a059]/40 text-[#c5a059] px-6 py-2.5 rounded-sm text-[12px] font-black uppercase tracking-[0.2em] hover:bg-[#c5a059] hover:text-white transition-all"
              >
                <Search size={14} />
                {t('ติดตามสถานะคดี', 'TRACK CASE')}
              </button>
            )}

            <div className="relative group">
              <div className="absolute -inset-1 bg-[#c5a059] rounded-sm blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>

              <a
                href="#contact"
                onClick={() => handleLinkClick('#contact')}
                className="relative bg-[#c5a059] hover:bg-[#b08d4a] text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-sm text-[10px] sm:text-[11px] font-black transition-all shadow-xl uppercase tracking-[0.2em] sm:tracking-[0.4em] inline-flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">{t('ปรึกษาทนาย', 'CONSULTATION')}</span>
                <ArrowRight size={12} className="relative z-10 hidden sm:block group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white p-1 hover:text-[#c5a059] transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - ย้ายออกจาก nav เพื่อแก้ stacking context issue */}
      <div className={`lg:hidden fixed inset-0 bg-slate-950 z-[9999] transition-transform duration-700 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 sm:p-8 flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            <div className="text-xl sm:text-2xl font-bold text-white"><span className="text-[#c5a059]">T</span>HANATHEP</div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-[#c5a059] transition-colors"><X size={32} /></button>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12 border-b border-white/10 pb-6 sm:pb-8">
            <div className="flex gap-8">
              <button onClick={() => { setLang('th'); setIsOpen(false); }} className={`text-sm font-black tracking-widest ${lang === 'th' ? 'text-[#c5a059]' : 'text-white/40'}`}>TH</button>
              <button onClick={() => { setLang('en'); setIsOpen(false); }} className={`text-sm font-black tracking-widest ${lang === 'en' ? 'text-[#c5a059]' : 'text-white/40'}`}>EN</button>
            </div>

            {isClient && (
              <button
                onClick={openTracker}
                className="w-full bg-slate-900 border border-[#c5a059] text-[#c5a059] py-4 rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <Search size={16} /> {t('ติดตามสถานะคดีของคุณ', 'TRACK YOUR CASE STATUS')}
              </button>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6 flex-grow">
            {links.map((link) => (
              <div key={link.name}>
                <a
                  href={link.href}
                  className={`block text-2xl sm:text-3xl font-bold transition-colors ${activeSection === link.id ? 'text-[#c5a059]' : 'text-white'}`}
                  onClick={() => handleLinkClick(link.href)}
                >
                  {link.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
