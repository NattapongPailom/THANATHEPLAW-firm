
import React, { useState, useEffect, useMemo } from 'react';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider } from './src/context/AuthContext';
import { Navbar } from './src/components/Navbar';
import { Hero } from './src/sections/Hero';
import { About } from './src/sections/About';
import { Expertise } from './src/sections/Expertise';
import { ServiceDetail } from './src/sections/ServiceDetail';
import { ProfileDetail } from './src/sections/ProfileDetail';
import { NewsDetail } from './src/sections/NewsDetail';
import { CaseDetail } from './src/sections/CaseDetail';
import { News } from './src/sections/News';
import { Works } from './src/sections/Works';
import { Contact } from './src/sections/Contact';
import { Footer } from './src/sections/Footer';
import { AdminDashboard } from './src/sections/AdminDashboard';
import { ClientCaseTracker } from './src/sections/ClientCaseTracker';
import { ServiceCategory, NewsItem, CaseStudy } from './src/types';

const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showCaseTracker, setShowCaseTracker] = useState<boolean>(false);
  const [view, setView] = useState<'main' | 'admin'>('main');

  useEffect(() => {
    if (selectedService || showProfile || selectedNews || selectedCase || view === 'admin' || showCaseTracker) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedService, showProfile, selectedNews, selectedCase, view]);

  const handleServiceSelect = (service: ServiceCategory) => {
    setSelectedService(service);
    setSelectedNews(null);
    setSelectedCase(null);
    setShowProfile(false);
    setView('main');
  };

  const handleNewsSelect = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setSelectedService(null);
    setSelectedCase(null);
    setShowProfile(false);
    setView('main');
  };

  const handleCaseSelect = (caseItem: CaseStudy) => {
    setSelectedCase(caseItem);
    setSelectedNews(null);
    setSelectedService(null);
    setShowProfile(false);
    setView('main');
  };

  const handleShowProfile = () => {
    setShowProfile(true);
    setSelectedService(null);
    setSelectedNews(null);
    setSelectedCase(null);
    setShowCaseTracker(false);
    setView('main');
  };

  const handleBackToMain = (targetId?: string) => {
    setSelectedService(null);
    setSelectedNews(null);
    setSelectedCase(null);
    setShowProfile(false);
    setShowCaseTracker(false);
    setView('main');

    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const navContext = useMemo(() => {
    if (view === 'admin') return null;
    if (showProfile) return 'about';
    if (selectedService) return 'expertise';
    if (selectedNews) return 'news';
    return null;
  }, [showProfile, selectedService, selectedNews, view]);

  const handleNavigate = (href: string) => {
    if (href === '#admin') {
      setView('admin');
      return;
    }

    if (selectedService || showProfile || selectedNews || selectedCase || view === 'admin') {
      handleBackToMain();
      
      if (href.startsWith('#')) {
        const id = href.replace('#', '');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Navbar 
            onSelectService={handleServiceSelect} 
            onNavigate={handleNavigate} 
            activeContext={navContext as any}
          />
          <main>
            {view === 'admin' ? (
              <AdminDashboard onBack={() => handleBackToMain()} />
            ) : (
              <>
                {showCaseTracker && (
                  <ClientCaseTracker onClose={() => handleBackToMain()} />
                )}

                {showProfile && (
                  <ProfileDetail onBack={(targetId) => handleBackToMain(targetId || 'about')} />
                )}
                
                {selectedService && (
                  <ServiceDetail service={selectedService} onBack={() => handleBackToMain('expertise')} />
                )}

                {selectedNews && (
                  <NewsDetail newsItem={selectedNews} onBack={() => handleBackToMain('news')} />
                )}

                {selectedCase && (
                  <CaseDetail caseData={selectedCase} onBack={() => handleBackToMain('works')} />
                )}

                {!selectedService && !showProfile && !selectedNews && !selectedCase && !showCaseTracker && (
                  <>
                    <Hero />
                    <About onShowProfile={handleShowProfile} />
                    <Expertise onSelectService={handleServiceSelect} />
                    <Works onSelectCase={handleCaseSelect} />
                    <News onSelectNews={handleNewsSelect} />
                    <Contact />
                  </>
                )}
              </>
            )}
          </main>
          <Footer onAdminLink={() => setView('admin')} onCaseTracker={() => setShowCaseTracker(true)} />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
