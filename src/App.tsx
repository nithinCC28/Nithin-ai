import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Globe, ImagePlus, ArrowRightCircle, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import ImageGenerator from './pages/ImageGenerator';

type Language = {
  code: string;
  name: string;
  flag: string;
};

function MainContent() {
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>({
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  });

  return (
    <div className="min-h-screen bg-primary-black text-white flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 md:p-6">
        <div className="text-3xl tracking-tighter">
          <span className="bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] bg-clip-text text-transparent chillax-tight">NK</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-dark hover:bg-primary-gray/50 transition-colors chillax-regular"
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              <Globe className="w-4 h-4" />
              <span>{selectedLang.flag} {selectedLang.code.toUpperCase()}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLangOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-primary-dark rounded-xl shadow-lg py-2 border border-primary-gray/20">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="w-full px-4 py-2 text-left hover:bg-primary-gray/20 flex items-center gap-2 chillax-regular"
                    onClick={() => {
                      setSelectedLang(lang);
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="px-6 py-1.5 rounded-full bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] text-primary-black hover:opacity-90 transition-opacity chillax-regular">
            {t('signUp')}
          </button>
          <button className="p-2 text-primary-accent hover:text-white">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-7xl mb-6 leading-none chillax-tight bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] bg-clip-text text-transparent">
            All In One Advanced AI Tool
          </h1>
          <p className="text-primary-accent text-lg md:text-xl max-w-3xl mx-auto chillax-regular">
            Unlock the full potential of artificial intelligence with our comprehensive suite of AI tools. From image generation to advanced processing, experience the next generation of creative and technological possibilities.
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <div className="bg-[#141517] rounded-3xl p-6 backdrop-blur-xl border border-primary-gray/20">
            <div className="bg-[#212224] rounded-2xl p-6 backdrop-blur-sm border border-primary-gray/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] rounded-full flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-primary-black" />
                </div>
                <h2 className="text-xl chillax-tight text-white">{t('aiImageGenerator')}</h2>
              </div>

              <p className="text-white/90 mb-6 chillax-regular leading-relaxed">
                {t('transformText')}
              </p>
              <ul className="space-y-4 chillax-regular mb-6">
                <li className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#E7EDEA] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="text-white/90 group-hover:text-white transition-colors">{t('features.textToImage')}</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#E7EDEA] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="text-white/90 group-hover:text-white transition-colors">{t('features.customStyles')}</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#E7EDEA] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="text-white/90 group-hover:text-white transition-colors">{t('features.instantRendering')}</span>
                </li>
              </ul>

              <button 
                onClick={() => navigate('/generator')}
                className="w-full bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] text-primary-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-6 chillax-regular group"
              >
                <span className="group-hover:translate-x-0.5 transition-transform">{t('tryNow')}</span>
                <ArrowRightCircle className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative h-[320px] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1686572603111-d3ab8e1e9ab9?auto=format&fit=crop&w=800&h=800" 
                    alt="AI-Generated Cityscape" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-lg chillax-tight mb-1">AI-Generated Cityscape</p>
                    <p className="text-sm text-white/80 chillax-regular">{t('generatedWithAi')}</p>
                  </div>
                </div>

                <div className="relative h-[320px] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1686739692310-399f31481fdb?auto=format&fit=crop&w=800&h=800" 
                    alt="AI Digital Artwork" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-lg chillax-tight mb-1">AI Digital Artwork</p>
                    <p className="text-sm text-white/80 chillax-regular">{t('generatedWithAi')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-primary-gray/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl chillax-tight bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] bg-clip-text text-transparent">NK</span>
              <span className="text-primary-accent">|</span>
              <span className="text-sm text-primary-accent chillax-regular">AI Tools</span>
            </div>
            <div className="text-sm text-primary-accent chillax-regular">
              © {new Date().getFullYear()} NK AI Tools. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/generator" element={<ImageGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;