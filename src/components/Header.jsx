import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Search, ChevronDown } from 'lucide-react';

const Header = ({ currentLanguage, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const navigation = [
    { name: 'Home', href: '#home', id: 'home', hindi: 'मुख्य पृष्ठ' },
    { name: 'About', href: '#about', id: 'about', hindi: 'परिचय' },
    { name: 'Timeline', href: '#timeline', id: 'timeline', hindi: 'समयरेखा' },
    { name: 'Speeches', href: '#speeches', id: 'speeches', hindi: 'भाषण' },
    { name: 'Press Release', href: '#press-release', id: 'press-release', hindi: 'प्रेस विज्ञप्ति' },
    { name: 'Gallery', href: '#gallery', id: 'gallery', hindi: 'गैलरी' },
    { name: 'Connect', href: '#connect', id: 'connect', hindi: 'संपर्क' },
  ];

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const offset = 120; // adjust for header height
      let foundActive = false;
      for (let i = 0; i < navigation.length; i++) {
        const section = navigation[i];
        if (section.href === '#') continue; // skip invalid selector
        const element = document.querySelector(section.href);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top - offset <= 0 && rect.bottom - offset > 0) {
            setActiveLink(section.id);
            foundActive = true;
            break;
          }
        }
      }
      if (!foundActive && window.scrollY < 50) {
        setActiveLink('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [navigation]);

  const toggleLanguage = () => {
    onLanguageChange(currentLanguage === 'en' ? 'hi' : 'en');
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="container px-4 mx-auto">
        <div className={`backdrop-blur-lg bg-white/70 rounded-xl shadow-lg p-3 border border-white/20 ${scrolled ? 'py-2' : 'py-3'}`}>
          <div className="flex justify-between items-center w-full">
            {/* Left: Logo + Name */}
            <div 
              className="flex flex-shrink-0 items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveLink('home');
                setIsMenuOpen(false);
              }}
            >
              <img 
                src="https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677379/BJPFlag_fvzmdy.webp" 
                alt="BJP Flag" 
                className="w-auto h-10 rounded shadow" 
              />
              <span
                className="text-3xl font-extrabold tracking-wide"
                style={{
                  color: '#F47216',
                  fontFamily: 'serif',
                  letterSpacing: '1px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                {currentLanguage === 'hi' ? '\u092f\u0932\u094d\u0932\u093e \u0926\u094b\u0930\u093e\u092c\u093e\u092c\u0942' : 'Yalla Dorababu'}
              </span>
            </div>

            {/* Center/Right: Navigation and Language Switcher */}
            <div className="flex items-center ml-auto">
              <nav className="hidden items-center space-x-6 md:flex">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-semibold text-orange-600 transition-all duration-300 glare-hover`}
                    style={{textShadow: '0 2px 8px rgba(255,106,0,0.10)'}} 
                    onClick={e => {
                      e.preventDefault();
                      if (item.id === 'home') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveLink('home');
                      } else {
                        const el = document.querySelector(item.href);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setActiveLink(item.id);
                        }
                      }
                    }}
                  >
                    {currentLanguage === 'hi' ? item.hindi : item.name}
                    <span className={`absolute bottom-1 left-0 w-full h-0.5 bg-orange-600 transform transition-all duration-300 ${
                      activeLink === item.id ? 'scale-100' : 'scale-0'
                    }`}></span>
                  </a>
                ))}
              </nav>
              {/* Hamburger menu button for mobile */}
              <button
                className="flex justify-center items-center p-2 ml-4 rounded md:hidden focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                {isMenuOpen ? (
                  <X className="w-7 h-7 text-orange-600" />
                ) : (
                  <Menu className="w-7 h-7 text-orange-600" />
                )}
              </button>
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex hidden items-center px-3 py-2 ml-8 text-sm font-medium transition-colors duration-200 focus:outline-none md:flex"
                style={{ color: '#F47216' }}
              >
                <Globe className="mr-1 w-5 h-5" style={{ color: '#F47216' }} />
                {currentLanguage === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="overflow-hidden mt-4 rounded-lg shadow-lg backdrop-blur-md md:hidden bg-white/80">
              <div className="px-2 pt-2 pb-4 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      activeLink === item.id 
                        ? 'text-orange-600 bg-orange-50' 
                        : 'text-gray-800 hover:bg-gray-50 hover:text-orange-600'
                    }`}
                    onClick={e => {
                      e.preventDefault();
                      if (item.id === 'home') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveLink('home');
                        setIsMenuOpen(false);
                      } else {
                        const el = document.querySelector(item.href);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setActiveLink(item.id);
                      setIsMenuOpen(false);
                        }
                      }
                    }}
                  >
                    {currentLanguage === 'hi' ? item.hindi : item.name}
                  </a>
                ))}
                
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMenuOpen(false);
                  }}
                  className="flex justify-center items-center px-4 py-3 mt-2 w-full text-base font-medium text-gray-700 rounded-md transition-colors hover:bg-gray-50 hover:text-orange-600"
                >
                  <Globe className="mr-2 w-5 h-5" />
                  {currentLanguage === 'en' ? 'हिंदी में देखें' : 'View in English'}
                </button>
              </div>
            </div>
        )}

        </div>
      </div>
    </header>
  );
};

export default Header;
