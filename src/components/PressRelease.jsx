import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, ExternalLink, Play, ChevronRight, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMedia } from '../utils/api';

const PressRelease = ({ currentLanguage = 'en' }) => {
  const [media, setMedia] = useState([]);
  const [activeTab, setActiveTab] = useState('press'); // Show Press Releases by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Move these two hooks up here
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  // Add state for modal for press releases
  const [selectedPressRelease, setSelectedPressRelease] = useState(null);
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);
  // Add state for modal for photos
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  // Add state for showing all press releases or just 6
  const [showAllPress, setShowAllPress] = useState(false);

  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      try {
        const data = await fetchMedia(); // Should call /api/media
        setMedia(data);
      } catch (err) {
        setError('Failed to load media');
      } finally {
        setLoading(false);
      }
    };
    loadMedia();
  }, []);

  // Filter by type using new backend structure
  const pressReleases = useMemo(() => media.filter(item => item.type === 'press_release'), [media]);
  const interviews = useMemo(() => media.filter(item => item.type === 'interview'), [media]);
  const photos = useMemo(() => media.filter(item => item.type === 'photo'), [media]);

  // Process media data for the current language
  const getPressReleaseItems = (items) => items.map(item => ({
    id: item.id,
    title: currentLanguage === 'hi' ? item.titleHi : item.titleEn,
    date: item.date,
    description: currentLanguage === 'hi' ? (item.descriptionHi || '') : (item.descriptionEn || ''),
    imageUrl: item.imageUrl,
    thumbnail: item.thumbnail || '', // Add thumbnail property
  }));
  const getInterviewItems = (items) => items.map(item => ({
    id: item.id,
    title: currentLanguage === 'hi' ? item.titleHi : item.titleEn,
    date: item.date,
    description: currentLanguage === 'hi' ? (item.descriptionHi || '') : (item.descriptionEn || ''),
    videoUrl: item.videoUrl,
    thumbnail: item.thumbnail || '',
  }));
  const getPhotoItems = (items) => items.map(item => ({
    id: item.id,
    title: currentLanguage === 'hi' ? item.titleHi : item.titleEn,
    date: item.date,
    imageUrl: item.imageUrl,
  }));

  const pressReleasesItems = getPressReleaseItems(pressReleases);
  const interviewsItems = getInterviewItems(interviews);
  const photosItems = getPhotoItems(photos);
  
  // Fallback data if no media items exist
  const fallbackData = {
    id: 1,
    title: currentLanguage === 'hi' ? 'कोई मीडिया उपलब्ध नहीं' : 'No media available',
    date: '2024-01-01',
    content: currentLanguage === 'hi' ? 'कृपया बाद में पुनः प्रयास करें' : 'Please check back later',
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: '#',
    duration: '00:00',
    views: '0',
    thumbnail: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400'
  };
  
  const displayPressReleases = showAllPress ? pressReleasesItems : pressReleasesItems.slice(0, 8);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : 'en-US', options);
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center bg-[#FFF6ED] py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        <p className="mt-4 text-gray-600">
          {currentLanguage === 'hi' ? 'मीडिया लोड हो रहा है...' : 'Loading media...'}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center bg-[#FFF6ED] py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
        >
          {currentLanguage === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
        </button>
      </div>
    );
  }

  // Helper to check if a URL is a YouTube link
  const isYouTubeUrl = (url) => {
    return /youtube\.com|youtu\.be/.test(url);
  };
  const openVideoModal = (item) => {
    if (item.videoUrl && item.videoUrl !== '#') {
      setSelectedVideo(item);
      setIsVideoModalOpen(true);
    } else {
      alert(currentLanguage === 'hi' ? 'वीडियो उपलब्ध नहीं है' : 'Video not available');
    }
  };
  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsVideoModalOpen(false);
  };
  const openPressModal = (item) => {
    setSelectedPressRelease(item);
    setIsPressModalOpen(true);
  };
  const closePressModal = () => {
    setSelectedPressRelease(null);
    setIsPressModalOpen(false);
  };
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setIsPhotoModalOpen(true);
  };
  const closePhotoModal = () => {
    setSelectedPhoto(null);
    setIsPhotoModalOpen(false);
  };

  // Handle image download
  const handleDownload = (imageUrl, title) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'press':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayPressReleases.length > 0 ? displayPressReleases.map((item) => {
                const previewLength = 200;
                const isLong = item.description && item.description.length > previewLength;
                return (
                  <motion.div
                    key={item.id}
                    className="group bg-white card-wow animate-fade-in rounded-2xl shadow-lg hover:shadow-wow transition-all duration-500 overflow-hidden cursor-pointer border-2 border-orange-100"
                    whileHover={{ y: -8, scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    onClick={() => openPressModal(item)}
                  >
                    <div className="relative overflow-hidden" style={{ height: '240px' }}>
                      <img
                        src={item.thumbnail || item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{formatDate(item.date)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-orange-600 mb-3 leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full shadow-orange flex items-center group-hover:scale-105 transition-all duration-200">
                          {currentLanguage === 'hi' ? 'पूरा पढ़ें' : 'Read More'}
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="text-center py-10 w-full col-span-2">
                  <p className="text-gray-500">{currentLanguage === 'hi' ? 'कोई प्रेस विज्ञप्ति उपलब्ध नहीं है' : 'No press releases available'}</p>
                </div>
              )}
              {/* Press Release Modal */}
              {isPressModalOpen && selectedPressRelease && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg relative">
                    <button
                      onClick={closePressModal}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                      ×
                    </button>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedPressRelease.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <i className="fa fa-calendar mr-2" aria-hidden="true"></i>
                        <span className="font-medium">{formatDate(selectedPressRelease.date)}</span>
                      </div>
                      <img
                        src={selectedPressRelease.imageUrl}
                        alt={selectedPressRelease.title}
                        className="w-full h-auto max-h-[80vh] object-contain rounded mb-4 bg-gray-100"
                        loading="lazy"
                      />
                      <p className="text-gray-700 whitespace-pre-line">{selectedPressRelease.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Read More / Read Less Button */}
            {pressReleasesItems.length > 8 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAllPress((prev) => !prev)}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg shadow hover:from-orange-600 hover:to-orange-700 transition"
                >
                  {showAllPress
                    ? (currentLanguage === 'hi' ? 'कम दिखाएं' : 'Read Less')
                    : (currentLanguage === 'hi' ? 'और पढ़ें' : 'Read More')}
                </button>
              </div>
            )}
          </>
        );
      case 'interviews':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {interviewsItems.length > 0 ? interviewsItems.map((interview) => (
              <motion.div
                key={interview.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col"
                whileHover={{ y: -8, scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative overflow-hidden" style={{ height: '240px' }}>
                  <img
                    src={interview.thumbnail || 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={interview.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      className="bg-white/90 backdrop-blur-sm text-orange-600 rounded-full p-6 shadow-xl border-2 border-orange-200 hover:bg-orange-50 transition-all duration-300 opacity-90 group-hover:scale-110 group-hover:opacity-100"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openVideoModal(interview)}
                      aria-label={currentLanguage === 'hi' ? 'साक्षात्कार देखें' : 'Watch Interview'}
                    >
                      <Play className="h-10 w-10" fill="currentColor" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-orange-600">{interview.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{interview.description}</p>
                  <div className="mt-auto">
                    <button
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center group"
                      onClick={() => openVideoModal(interview)}
                    >
                      {currentLanguage === 'hi' ? 'साक्षात्कार देखें' : 'Watch Interview'}
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-10 w-full col-span-2">
                <p className="text-gray-500">{currentLanguage === 'hi' ? 'कोई साक्षात्कार उपलब्ध नहीं है' : 'No interviews available'}</p>
              </div>
            )}
          </div>
        );
      case 'photos':
        return photosItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {photosItems.map((photo) => (
              <motion.div 
                key={photo.id} 
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100 cursor-pointer"
                whileHover={{ y: -8, scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onClick={() => openPhotoModal(photo)}
              >
                <div className="overflow-hidden" style={{ height: '200px' }}>
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <h3 className="text-gray-900 font-semibold text-sm mb-2 line-clamp-2">{photo.title}</h3>
                    <div className="flex items-center text-xs text-gray-600">
                      <svg className="w-3 h-3 mr-1.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{formatDate(photo.date)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Photo Modal */}
            {isPhotoModalOpen && selectedPhoto && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg relative">
                  <button
                    onClick={closePhotoModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                  <div className="p-6 flex flex-col items-center">
                    <img
                      src={selectedPhoto.imageUrl}
                      alt={selectedPhoto.title}
                      className="w-full h-auto max-h-[85vh] object-contain rounded mb-4 bg-gray-100"
                    />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPhoto.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="font-medium">{formatDate(selectedPhoto.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {currentLanguage === 'hi' ? 'कोई फोटो उपलब्ध नहीं है' : 'No photos available'}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="press-release" className="py-20 bg-[#FFF6ED] scroll-mt-24 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6" style={{ color: '#F47216' }}>
            {currentLanguage === 'hi' ? 'प्रेस विज्ञप्ति' : 'Press Release'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full mb-6"></div>
         
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-16">
          <div className="relative flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100 w-fit">
            {[
              { id: 'press', label: currentLanguage === 'hi' ? 'प्रेस विज्ञप्ति' : 'Press Release', icon: '📰' },
              { id: 'interviews', label: currentLanguage === 'hi' ? 'साक्षात्कार' : 'Interviews', icon: '🎤' },
              { id: 'photos', label: currentLanguage === 'hi' ? 'तस्वीरें' : 'Photos', icon: '📸' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 px-6 py-3 font-semibold text-sm md:text-base rounded-xl transition-all duration-300 focus:outline-none flex items-center space-x-2
                  ${activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:text-orange-600'}`}
                style={{ minWidth: '140px' }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="mediaTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        
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
      </div>
    </section>
  );
};

export default PressRelease;
