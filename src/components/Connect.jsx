import React, { useState } from 'react';
import { Mail, Twitter, Facebook, Instagram, Youtube, Send, MessageSquare, User, Smartphone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContactMessage } from '../utils/api';

const Connect = ({ currentLanguage }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: '#',
      color: 'from-blue-400 to-blue-500',
      bg: 'bg-blue-500',
      followers: currentLanguage === 'hi' ? '52 लाख' : '5.2M',
      label: currentLanguage === 'hi' ? 'फॉलोअर्स' : 'Followers',
      comingSoon: true
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/profile.php?id=100063694931492',
      color: 'from-blue-600 to-blue-700',
      bg: 'bg-blue-600',
      followers: currentLanguage === 'hi' ? '1.2 करोड़' : '12M',
      label: currentLanguage === 'hi' ? 'फॉलोअर्स' : 'Followers',
      comingSoon: false
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/yalladorababu.official/?hl=en',
      color: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-500',
      followers: currentLanguage === 'hi' ? '85 लाख' : '8.5M',
      label: currentLanguage === 'hi' ? 'फॉलोअर्स' : 'Followers',
      comingSoon: false
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: '#',
      color: 'from-red-600 to-red-700',
      bg: 'bg-red-600',
      followers: currentLanguage === 'hi' ? '1 करोड़' : '10M',
      label: currentLanguage === 'hi' ? 'सब्सक्राइबर्स' : 'Subscribers',
      comingSoon: true
    }
  ];

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-orange-500" />,
      title: currentLanguage === 'hi' ? 'ईमेल' : 'Email',
      value: 'Satyayalla1998@gmail.com',
      link: 'mailto:Satyayalla1998@gmail.com'
    },
    {
      icon: <MapPin className="h-6 w-6 text-orange-500" />,
      title: currentLanguage === 'hi' ? 'पता' : 'Address',
      value: currentLanguage === 'hi' 
        ? 'डॉ. बी.आर. अंबेडकर कोनसीमा जिला' 
        : 'Dr. B.R. Ambedkar Konaseema District',
      link: 'https://maps.google.com/maps?q=Dr.+B.R.+Ambedkar+Konaseema+District'
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would send this to your backend
      console.log('Subscribing email:', email);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset subscription status after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitContactMessage({
        name: formData.name,
        email: email,
        message: formData.message,
      });
      
      // Clear form on successful submission
      setFormData({ name: '', message: '' });
      setEmail('');
      setSubmitSuccess(true);
      
      // Show success message
      setToastMessage(currentLanguage === 'hi' 
        ? 'संदेश सफलतापूर्वक भेजा गया!' 
        : 'Message sent successfully!');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setToastMessage(currentLanguage === 'hi' 
        ? 'संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।' 
        : 'Error sending message. Please try again.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showComingSoonToast = (platform) => {
    setToastMessage(currentLanguage === 'hi' 
      ? `${platform} जल्द ही आ रहा है!` 
      : `${platform} coming soon!`);
    setShowToast(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSocialClick = (social) => {
    if (social.comingSoon) {
      showComingSoonToast(social.name);
    } else if (social.url && social.url !== '#') {
      window.open(social.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Animation variants
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

  return (
    <section id="connect" className="py-16 bg-gradient-to-b from-gray-50 to-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6" style={{ color: '#F47216' }}>
            {currentLanguage === 'hi' ? 'जुड़ना' : 'Connect'}
          </h2>
          <div className="w-32 h-1 mx-auto mb-6 rounded-full" style={{ background: '#F47216' }}></div>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            {currentLanguage === 'hi'
              ? 'हमसे जुड़े रहें और नवीनतम अपडेट प्राप्त करें'
              : 'Stay connected and get the latest updates'}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2 bg-white card-wow animate-fade-in rounded-xl shadow-wow overflow-hidden border-2 border-orange-100"
            variants={itemVariants}
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {currentLanguage === 'hi' ? 'हमें संदेश भेजें' : 'Send Us a Message'}
                </h3>
              </div>
              
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div 
                    className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>
                      {currentLanguage === 'hi' 
                        ? 'आपका संदेश सफलतापूर्वक भेज दिया गया है! हम जल्द ही आपसे संपर्क करेंगे।' 
                        : 'Your message has been sent successfully! We will get back to you soon.'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {currentLanguage === 'hi' ? 'आपका नाम' : 'Your Name'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        placeholder={currentLanguage === 'hi' ? 'आपका नाम' : 'John Doe'}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {currentLanguage === 'hi' ? 'ईमेल पता' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    {currentLanguage === 'hi' ? 'आपका संदेश' : 'Your Message'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder={currentLanguage === 'hi' ? 'आपका संदेश यहाँ लिखें...' : 'Type your message here...'}
                    required
                  ></textarea>
                </div>
                
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-white font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {currentLanguage === 'hi' ? 'भेज रहे हैं...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        {currentLanguage === 'hi' ? 'संदेश भेजें' : 'Send Message'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                {currentLanguage === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
              </h4>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start group"
                  >
                    <span className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 group-hover:bg-orange-50 group-hover:border-orange-200 transition-colors mr-4">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500 group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-base font-medium text-gray-900 group-hover:text-orange-700 transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Social Media & Newsletter */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Social Media */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <svg className="h-6 w-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {currentLanguage === 'hi' ? 'सोशल मीडिया पर फॉलो करें' : 'Follow on Social Media'}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.div
                      key={index}
                      onClick={() => handleSocialClick(social)}
                      className={`relative overflow-hidden group rounded-xl p-4 text-white bg-gradient-to-r ${social.color} shadow-md cursor-pointer`}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="p-2 bg-white/20 rounded-full mb-2">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="font-semibold text-sm">{social.name}</span>
                        <span className="text-xs opacity-90 mt-1 font-medium">
                          {social.followers} {social.label}
                        </span>
                        {social.comingSoon && (
                          <span className="text-xs opacity-75 mt-1">
                            {currentLanguage === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div 
              className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-white/20 rounded-lg mr-3">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {currentLanguage === 'hi' ? 'न्यूज़लेटर सदस्यता' : 'Newsletter'}
                </h3>
              </div>
              
              <p className="text-orange-100 mb-6">
                {currentLanguage === 'hi'
                  ? 'हमारे न्यूज़लेटर की सदस्यता लें और नवीनतम अपडेट प्राप्त करें'
                  : 'Subscribe to our newsletter and get the latest updates'}
              </p>
              
              <AnimatePresence>
                {isSubscribed ? (
                  <motion.div 
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-white text-sm">
                        {currentLanguage === 'hi'
                          ? 'धन्यवाद! आपको जल्द ही एक पुष्टिकरण ईमेल प्राप्त होगा।'
                          : 'Thank you! Check your email to confirm.'}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-orange-200" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={currentLanguage === 'hi' ? 'आपका ईमेल पता' : 'your.email@example.com'}
                        className="pl-10 block w-full rounded-lg border-orange-300 bg-white/10 text-white placeholder-orange-200 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500 transition-all"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-orange-500 transition-all"
                    >
                      {currentLanguage === 'hi' ? 'सब्सक्राइब करें' : 'Subscribe Now'}
                    </button>
                  </form>
                )}
              </AnimatePresence>
              
              <p className="mt-4 text-xs text-orange-100 opacity-80 text-center">
                {currentLanguage === 'hi'
                  ? 'हम आपकी गोपनीयता का सम्मान करते हैं। किसी भी समय सदस्यता समाप्त कर सकते हैं।'
                  : 'We respect your privacy. Unsubscribe at any time.'}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg border-l-4 border-orange-500"
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{toastMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Connect;
