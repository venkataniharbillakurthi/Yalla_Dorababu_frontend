import React, { useState, useEffect } from 'react';
import { Play, Calendar, MapPin, Search, Filter, Eye, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchSpeeches } from '../utils/api';

const Speeches = ({ currentLanguage = 'en' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [speeches, setSpeeches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const loadSpeeches = async () => {
      setLoading(true);
      try {
        const data = await fetchSpeeches(); // Should call /api/speeches
        setSpeeches(data);
      } catch (err) {
        setError('Failed to load speeches');
      } finally {
        setLoading(false);
      }
    };
    loadSpeeches();
  }, []);

  // Process speeches for current language
  const processSpeeches = (speechesData) => {
    return speechesData.map(speech => ({
      id: speech.id,
      title: currentLanguage === 'hi' ? speech.titleHi : speech.titleEn,
      location: currentLanguage === 'hi' ? speech.locationHi : speech.locationEn,
      category: speech.category || 'general',
      description: currentLanguage === 'hi' ? (speech.descriptionHi || '') : (speech.descriptionEn || ''),
      thumbnail: speech.thumbnail, // Removed fallback image
      duration: speech.duration || '10:00',
      videoUrl: speech.videoUrl || '#'
    }));
  };

  const processedSpeeches = processSpeeches(speeches);
  
  // Fallback data if no speeches are available
  const fallbackSpeeches = [
    {
      id: 1,
      title: currentLanguage === 'hi' ? 'कोई भाषण उपलब्ध नहीं' : 'No speeches available',
      location: currentLanguage === 'hi' ? 'नई दिल्ली' : 'New Delhi',
      category: 'general',
      description: currentLanguage === 'hi' ? 'कृपया बाद में पुनः प्रयास करें' : 'Please check back later',
      thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&auto=format&fit=crop&q=80',
      duration: '00:00',
      videoUrl: '#'
    }
  ];

  const categories = [
    { id: 'all', name: currentLanguage === 'hi' ? 'सभी' : 'All' },
    { id: 'security', name: currentLanguage === 'hi' ? 'सुरक्षा' : 'Security' },
    { id: 'defense', name: currentLanguage === 'hi' ? 'रक्षा' : 'Defense' },
    { id: 'economy', name: currentLanguage === 'hi' ? 'अर्थव्यवस्था' : 'Economy' },
    { id: 'education', name: currentLanguage === 'hi' ? 'शिक्षा' : 'Education' },
    { id: 'development', name: currentLanguage === 'hi' ? 'विकास' : 'Development' },
    { id: 'infrastructure', name: currentLanguage === 'hi' ? 'अवसंरचना' : 'Infrastructure' },
    { id: 'agriculture', name: currentLanguage === 'hi' ? 'कृषि' : 'Agriculture' },
    { id: 'technology', name: currentLanguage === 'hi' ? 'प्रौद्योगिकी' : 'Technology' },
    { id: 'healthcare', name: currentLanguage === 'hi' ? 'स्वास्थ्य सेवा' : 'Healthcare' },
    { id: 'environment', name: currentLanguage === 'hi' ? 'पर्यावरण' : 'Environment' },
    { id: 'foreign', name: currentLanguage === 'hi' ? 'विदेश नीति' : 'Foreign Policy' },
    { id: 'employment', name: currentLanguage === 'hi' ? 'रोजगार' : 'Employment' },
    { id: 'other', name: currentLanguage === 'hi' ? 'अन्य' : 'Other' }
  ];

  // Only use fallbackSpeeches if the backend speeches array is truly empty
  const hasRealSpeeches = speeches && speeches.length > 0;
  const speechesToFilter = hasRealSpeeches ? speeches : fallbackSpeeches;

  const filteredSpeeches = speechesToFilter
    .map(speech => ({
      id: speech.id,
      title: currentLanguage === 'hi' ? (speech.titleHi || '') : (speech.titleEn || ''),
      location: currentLanguage === 'hi' ? (speech.locationHi || '') : (speech.locationEn || ''),
      category: (speech.category || 'general').toLowerCase(),
      description: currentLanguage === 'hi' ? (speech.descriptionHi || '') : (speech.descriptionEn || ''),
      thumbnail: speech.thumbnail, // Removed fallback image
      duration: speech.duration || '10:00',
      videoUrl: speech.videoUrl || '#'
    }))
    .filter(speech => {
      const selectedCat = (selectedCategory || '').toLowerCase();
      const matchesCategory = selectedCat === 'all' || speech.category === selectedCat;
      const matchesSearch =
        (speech.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (speech.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (speech.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });


  const openVideoModal = (speech) => {
    if (speech.videoUrl && speech.videoUrl !== '#') {
      setSelectedVideo(speech);
      setIsVideoModalOpen(true);
    } else {
      alert(currentLanguage === 'hi' ? 'वीडियो उपलब्ध नहीं है' : 'Video not available');
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsVideoModalOpen(false);
  };

  // Helper to check if a URL is a YouTube link
  const isYouTubeUrl = (url) => {
    return /youtube\.com|youtu\.be/.test(url);
  };

  return (
    <section id="speeches" className="py-16 bg-[#FFF6ED] scroll-mt-24 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-300 text-transparent bg-clip-text drop-shadow-lg mb-6 animate-fade-in">
            {currentLanguage === 'hi' ? 'भाषण और संबोधन' : 'Speeches & Addresses'}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">
              {currentLanguage === 'hi' ? 'भाषण लोड हो रहे हैं...' : 'Loading speeches...'}
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {currentLanguage === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
            </button>
          </motion.div>
        )}

        {/* Speeches Grid */}
        {!loading && !error && filteredSpeeches.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { 
                opacity: 1, 
                transition: { 
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                } 
              },
              hidden: { opacity: 0 }
            }}
          >
            {filteredSpeeches.map((speech) => {
              
              return (
                <motion.div 
                  key={speech.id}
                  className="group bg-white/90 card-wow animate-fade-in rounded-lg overflow-hidden group hover:shadow-wow transition-shadow duration-300 flex flex-col border-2 border-orange-100"
                  variants={{
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    },
                    hidden: { opacity: 0, y: 20 }
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    {speech.thumbnail ? (
                      <img 
                        src={speech.thumbnail} 
                        alt={speech.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-300 text-4xl font-bold">
                        <span role="img" aria-label="No image">🎤</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.button 
                        className="bg-orange-500 text-white rounded-full p-3 hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openVideoModal(speech)}
                      >
                        <Play className="h-6 w-6" strokeWidth={2} />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-orange-600 mb-2 line-clamp-2 leading-tight">{speech.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{speech.description}</p>
                    
                    {/* Removed category badge */}
                    
                    <div className="flex flex-wrap items-center text-xs text-orange-600 gap-4 mb-3">
                      
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <motion.button 
                        className="text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full shadow-orange flex items-center group-hover:scale-105 transition-all duration-200"
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openVideoModal(speech)}
                      >
                        {currentLanguage === 'hi' ? 'देखें' : 'Watch'}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : !loading && !error ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded-r-lg max-w-2xl mx-auto animate-fade-in">
              <p className="text-orange-700">
                {currentLanguage === 'hi' 
                  ? 'कोई भाषण नहीं मिला। कृपया कुछ अलग खोजें।' 
                  : 'No speeches found matching your criteria. Please try a different search term or category.'}
              </p>
            </div>
          </motion.div>
        ) : null}
      </div>
      
      {/* Video Modal */}
      {isVideoModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedVideo.title}
              </h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {isYouTubeUrl(selectedVideo.videoUrl) ? (
                <iframe
                  width="100%"
                  height="400"
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[40vw] max-h-[60vh]"
                ></iframe>
              ) : (
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-auto max-h-[60vh]"
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  {currentLanguage === 'hi' ? 'आपका ब्राउज़र वीडियो टैग का समर्थन नहीं करता।' : 'Your browser does not support the video tag.'}
                </video>
              )}
              <div className="mt-4">
                <p className="text-gray-600 text-sm">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Speeches;
