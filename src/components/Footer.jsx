import React, { useState } from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

import { toast } from 'react-toastify';

const Footer = ({ currentLanguage }) => {
  const quickLinks = [
    { name: currentLanguage === 'hi' ? 'मुख्य पृष्ठ' : 'Home', href: '#home' },
    { name: currentLanguage === 'hi' ? 'परिचय' : 'About', href: '#about' },
    { name: currentLanguage === 'hi' ? 'भाषण' : 'Speeches', href: '#speeches' },
    { name: currentLanguage === 'hi' ? 'प्रेस विज्ञप्ति' : 'Press Release', href: '#press-release' },
    { name: currentLanguage === 'hi' ? 'गैलरी' : 'Gallery', href: '#gallery' }
  ];

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-orange-500" />,
      text: 'Satyayalla1998@gmail.com',
      link: 'mailto:Satyayalla1998@gmail.com',
      label: currentLanguage === 'hi' ? 'ईमेल' : 'Email'
    },
    {
      icon: <MapPin className="h-5 w-5 text-orange-500" />,
      text: currentLanguage === 'hi' 
        ? 'डॉ. बी.आर. अंबेडकर कोनसीमा जिला' 
        : 'Dr. B.R. Ambedkar Konaseema District',
      link: 'https://maps.google.com/maps?q=Dr.+B.R.+Ambedkar+Konaseema+District',
      label: currentLanguage === 'hi' ? 'पता' : 'Address'
    }
  ];

  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const [footerToasts, setFooterToasts] = useState([]);
  
  const showFooterToast = (platform) => {
    const id = Date.now() + Math.random();
    setFooterToasts((prev) => [
      ...prev,
      {
        id,
        message: currentLanguage === 'hi' 
          ? `${platform} जल्द ही आ रहा है!` 
          : `${platform} coming soon!`
      }
    ]);
    setTimeout(() => {
      setFooterToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <footer className="bg-gradient-to-b from-accent via-accent-light to-navy text-white pt-16 pb-8 border-t-4 border-accent shadow-wow animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left: Logo & About */}
          <motion.div className="lg:col-span-1 flex flex-col items-start" variants={itemVariants}>
            <div className="flex items-center mb-4">
              <img src="https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677379/BJPFlag_fvzmdy.webp" alt="BJP Flag" className="h-10 w-10 mr-3 rounded shadow-lg border-2 border-accent bg-white p-1 animate-pop" />
              <h3 className="text-3xl font-heading font-extrabold bg-gradient-to-r from-yellow to-white text-transparent bg-clip-text tracking-wide drop-shadow-lg">
                {currentLanguage === 'hi' ? '\u092f\u0932\u094d\u0932\u093e \u0921\u094b\u0930\u093e\u092c\u093e\u092c\u0942' : 'Yalla Dorababu'}
              </h3>
            </div>
            <p className="text-white mb-6 leading-relaxed max-w-xs" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
              {currentLanguage === 'hi' 
                ? 'डॉ. बी.आर. अंबेडकर कोनसीमा जिले के भाजपा जिला अध्यक्ष और अनुभवी जन नेता।' 
                : 'District President of BJP – Dr. B.R. Ambedkar Konaseema District and seasoned public leader.'}
            </p>
            <div className="flex space-x-8 mt-2">
              {[
                { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100063694931492', real: true },
                { icon: Twitter, label: 'Twitter', href: '#', real: false },
                { icon: Instagram, label: 'Instagram', href: '#', real: false },
                { icon: Youtube, label: 'YouTube', href: '#', real: false }
              ].map((social, index) => (
                social.real ? (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.40)] transition-colors duration-300"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="h-6 w-6" />
                  </motion.a>
                ) : (
                  <motion.button
                    key={index}
                    type="button"
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-300 focus:outline-none"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                    onClick={() => showFooterToast(social.label)}
                    style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                  >
                    <social.icon className="h-6 w-6" />
                  </motion.button>
                )
              ))}
            </div>
          </motion.div>

          {/* Center: Quick Links */}
          <motion.div variants={itemVariants} className="flex flex-col items-start">
            <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b-2 border-orange-600 inline-block">
              {currentLanguage === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <a 
                    href={link.href} 
                    className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center group font-heading font-semibold animate-fade-in"
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Contact Info */}
          <motion.div variants={itemVariants} className="flex flex-col items-start">
            <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b-2 border-orange-600 inline-block">
              {currentLanguage === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center group"
                  >
                    <span className="mt-0.5 mr-3 text-yellow group-hover:text-white transition-colors animate-pop">
                      {item.icon}
                    </span>
                    <span className="text-white/80 group-hover:text-yellow-400 transition-colors font-heading font-bold">
                      {item.label}:
                    </span>
                    <span className="ml-2 text-white/80 group-hover:text-yellow-400 transition-colors">
                      {item.text}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} {currentLanguage === 'hi' ? 'यल्ला डोराबाबू। सर्वाधिकार सुरक्षित।' : 'Yalla Dorababu. All rights reserved.'}
            </p>
          </div>
        </motion.div>
      </div>
      {/* Custom Toasts (top-right, styled, stacked with gap) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3">
        {footerToasts.map((toast, idx) => (
          <div
            key={toast.id}
            className="bg-navy text-white px-6 py-3 rounded-lg shadow-wow border-l-4 border-accent flex items-center animate-fade-in"
            style={{ minWidth: 220 }}
          >
            <svg className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
