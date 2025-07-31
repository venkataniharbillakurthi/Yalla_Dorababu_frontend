import React, { useState, useMemo, useEffect } from 'react';
import { Play, X, Download, Eye, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGalleryPhotos, fetchGalleryPhotosByCategory, searchGalleryPhotos } from '../utils/api';

const Gallery = ({ currentLanguage = 'en' }) => {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gallery items (photos + videos) from backend
  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedItems;
        if (searchTerm.trim()) {
          fetchedItems = await searchGalleryPhotos(searchTerm);
        } else if (selectedCategory !== 'all') {
          fetchedItems = await fetchGalleryPhotosByCategory(selectedCategory);
        } else {
          fetchedItems = await fetchGalleryPhotos();
        }

        // Split into photos and videos
        setPhotos(fetchedItems.filter(item => item.type === 'photo'));
        setVideos(fetchedItems.filter(item => item.type === 'video'));
      } catch (err) {
        console.error('Error fetching gallery items:', err);
        setError('Failed to load gallery items');
      } finally {
        setLoading(false);
      }
    };

    loadGalleryItems();
  }, [searchTerm, selectedCategory, activeTab]);

  // Process photos with current language
  const processedPhotos = useMemo(() => 
    photos.map(photo => ({
      ...photo,
      title: currentLanguage === 'hi' ? (photo.titleHi || photo.titleEn) : (photo.titleEn || photo.titleHi),
      description: currentLanguage === 'hi' ? (photo.descriptionHi || '') : (photo.descriptionEn || '')
    })),
    [photos, currentLanguage]
  );

  // Process videos with current language
  const processedVideos = useMemo(() => 
    videos.map(video => ({
      ...video,
      title: currentLanguage === 'hi' ? (video.titleHi || video.titleEn) : (video.titleEn || video.titleHi),
      description: currentLanguage === 'hi' ? (video.descriptionHi || '') : (video.descriptionEn || '')
    })),
    [videos, currentLanguage]
  );

  // Get unique categories from photos
  const categories = ['all', ...new Set([
    ...photos.map(p => p.category)
  ])].filter(Boolean);

  // Filter items based on search term and selected category
  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredPhotos = processedPhotos;
  const filteredVideos = processedVideos;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : 'en-US', options);
  };

  // Get category label based on current language
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      all: currentLanguage === 'hi' ? 'सभी' : 'All',
      official: currentLanguage === 'hi' ? 'सरकारी' : 'Official',
      events: currentLanguage === 'hi' ? 'कार्यक्रम' : 'Events',
      public: currentLanguage === 'hi' ? 'जनता' : 'Public',
      media: currentLanguage === 'hi' ? 'प्रेस विज्ञप्ति' : 'Press Release',
      infrastructure: currentLanguage === 'hi' ? 'बुनियादी ढांचा' : 'Infrastructure',
      education: currentLanguage === 'hi' ? 'शिक्षा' : 'Education',
      speeches: currentLanguage === 'hi' ? 'भाषण' : 'Speeches',
      interviews: currentLanguage === 'hi' ? 'इंटरव्यू' : 'Interviews',
      documentaries: currentLanguage === 'hi' ? 'डॉक्यूमेंट्री' : 'Documentaries'
    };
    return categoryLabels[category] || category;
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  // Helper function to check if a URL is an image
  function isImageUrl(url) {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
  }

  // Render the gallery UI
  return (
    <div className="w-full bg-[#FFF6ED] py-8">
      <div id="gallery" className="container mx-auto px-4 py-8 scroll-mt-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-300 text-transparent bg-clip-text drop-shadow-lg mb-8 animate-fade-in" style={{ lineHeight: '1.2', paddingBottom: '0.25em' }}>
          {currentLanguage === 'hi' ? 'गैलरी' : 'Gallery'}
        </h2>
        <div className="w-24 h-1 mx-auto rounded-full mb-8" style={{ background: '#F47216' }}></div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="relative flex bg-orange-50 rounded-full p-1 shadow-inner w-fit">
            {[
              { id: 'photos', label: currentLanguage === 'hi' ? 'प्रधान वृत्त' : 'photo' },
              { id: 'videos', label: currentLanguage === 'hi' ? 'मुख्य आकर्षण' : 'Highlights' }
            ].map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative z-10 px-7 py-2 font-semibold text-lg rounded-full transition-colors duration-200 focus:outline-none
                  ${activeTab === tab.id ? 'text-white' : 'text-orange-700 hover:text-orange-900'}`}
                style={{ minWidth: '110px' }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="galleryTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={currentLanguage === 'hi' ? 'खोजें...' : 'Search...'}
              className="w-full px-4 py-2 border border-orange-200 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-orange-50 text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 bg-orange-50 rounded-full p-1.5 shadow-sm transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {/* Removed category selection dropdown */}
        </div>
        
        {/* Content */}
        <div className="mb-12">
          {activeTab === 'photos' && (
            <>
              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="mt-4 text-gray-600">
                    {currentLanguage === 'hi' ? 'तस्वीरें लोड हो रही हैं...' : 'Loading photos...'}
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="text-center py-12">
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
                </div>
              )}

              {/* Photos Grid */}
              {!loading && !error && filteredPhotos.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {currentLanguage === 'hi' 
                    ? 'कोई तस्वीरें नहीं मिलीं' 
                    : 'No photos found'}
                </p>
              ) : !loading && !error ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPhotos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      whileHover={{ y: -5 }}
                      layout
                    >
                      <div className="relative aspect-video bg-gray-100">
                        <img
                          src={photo.thumbnail || photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          onClick={() => setSelectedImage(photo)}
                        />
                        {/* Overlay and Eye icon removed. Entire image is clickable. */}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 line-clamp-1 text-orange-600">{photo.title}</h3>
                        {photo.date && (
                          <p className="text-sm text-orange-500 mb-2">
                            {formatDate(photo.date)}
                          </p>
                        )}
                        {photo.description && (
                          <p className="text-orange-700 text-sm line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : null}
            </>
          )}
          
          {activeTab === 'videos' && (
            <>
              {filteredVideos.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {currentLanguage === 'hi' 
                    ? 'कोई वीडियो नहीं मिले' 
                    : 'No videos found'}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => {
                    const isImageOnly = (!video.url || video.url.trim() === '') && video.thumbnail;
                    return (
                      <motion.div
                        key={video.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        whileHover={{ y: -5 }}
                        layout
                      >
                        <div 
                          className="relative aspect-video bg-gray-100 cursor-pointer"
                          onClick={() => (isImageOnly || isImageUrl(video.url)) ? setSelectedImage(video) : setSelectedVideo(video)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Only show play button and duration if video.url exists and is not an image */}
                          {video.url && !isImageUrl(video.url) && (
                            <>
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                <div className="bg-white bg-opacity-80 rounded-full p-3 text-orange-600">
                                  <Play size={24} fill="currentColor" />
                                </div>
                              </div>
                              {video.duration && (
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                  {video.duration}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {/* Removed title, date, and description for video cards in grid */}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
              <motion.div 
                className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-700 hover:bg-gray-100 z-10"
                >
                  <X size={24} />
                </button>
                <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
                  <img loading="lazy" 
                    src={selectedImage.url && isImageUrl(selectedImage.url) ? selectedImage.url : selectedImage.thumbnail} 
                    alt={selectedImage.title} 
                    className="w-full h-auto"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                  {selectedImage.date && (
                    <p className="text-gray-500 text-sm mb-3">
                      {formatDate(selectedImage.date)}
                    </p>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-700">{selectedImage.description}</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            (isImageUrl(selectedVideo.url) || (!selectedVideo.url && selectedVideo.thumbnail)) ? (
              <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                <motion.div 
                  className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-700 hover:bg-gray-100 z-10"
                  >
                    <X size={24} />
                  </button>
                  <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
                    <img loading="lazy" 
                      src={selectedVideo.url && isImageUrl(selectedVideo.url) ? selectedVideo.url : selectedVideo.thumbnail} 
                      alt={selectedVideo.title} 
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
                    {selectedVideo.date && (
                      <p className="text-gray-500 text-sm mb-3">
                        {formatDate(selectedVideo.date)}
                      </p>
                    )}
                    {selectedVideo.description && (
                      <p className="text-gray-700">{selectedVideo.description}</p>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                <motion.div 
                  className="relative bg-black rounded-lg max-w-4xl w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="absolute -top-10 right-0 bg-white rounded-full p-2 text-gray-700 hover:bg-gray-100 z-10"
                  >
                    <X size={24} />
                  </button>
                  <div className="aspect-video w-full">
                    <iframe
                      src={selectedVideo.url}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      {selectedVideo.date && (
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatDate(selectedVideo.date)}
                        </span>
                      )}
                      {selectedVideo.views && (
                        <span className="ml-4 flex items-center">
                          <Eye size={14} className="mr-1" />
                          {selectedVideo.views}
                        </span>
                      )}
                    </div>
                    {selectedVideo.description && (
                      <p className="text-gray-700">{selectedVideo.description}</p>
                    )}
                  </div>
                </motion.div>
              </div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;
   