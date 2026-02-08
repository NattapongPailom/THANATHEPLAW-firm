
import React from 'react';
import { useReveal } from '../hooks/useReveal';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  light?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, light = false }) => {
  const { ref, className } = useReveal();
  return (
    <div ref={ref} className={`${className} mb-8 sm:mb-12 md:mb-20 max-w-4xl text-left`}>
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="h-[2px] w-8 sm:w-12 md:w-20 bg-[#c5a059]"></div>
        <span className="uppercase tracking-[0.3em] sm:tracking-[0.6em] font-black text-[9px] sm:text-[10px] text-[#c5a059]">
          {title}
        </span>
      </div>
      <h2 className={`text-3xl sm:text-5xl md:text-7xl font-bold font-serif-legal leading-[1.1] ${light ? 'text-white' : 'text-slate-100'}`}>
        {subtitle}
      </h2>
    </div>
  );
};
