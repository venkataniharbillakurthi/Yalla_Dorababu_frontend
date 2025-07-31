import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, Briefcase, MapPin, Calendar, Loader2 } from 'lucide-react';
import { fetchJourneyEvents } from '../utils/api';

// This is not a Cloudinary URL, so we're keeping it as is
const IMAGE_PLACEHOLDER = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

const Timeline = ({ currentLanguage }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        let data = await fetchJourneyEvents();
        data = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        setEvents(data);
      } catch (err) {
        setError('Failed to load journey events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  if (loading) {
    return (
      <section id="timeline" className="py-20 bg-[#FFF6ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-600" />
            <p className="mt-4 text-gray-600">
              {currentLanguage === 'hi' ? 'यात्रा जानकारी लोड हो रही है...' : 'Loading journey information...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="timeline" className="py-20 bg-[#FFF6ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              {currentLanguage === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="timeline" className="py-20 bg-[#FFF6ED] scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6" style={{ color: '#F47216' }}>
            {currentLanguage === 'hi' ? 'कार्यकाल और उपलब्धियां' : 'Career Timeline & Achievements'}
          </h2>
          <div className="w-32 h-1 mx-auto mb-6 rounded-full" style={{ background: '#F47216' }}></div>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            {currentLanguage === 'hi' 
              ? 'राजनीतिक यात्रा और सामाजिक सेवा के महत्वपूर्ण पड़ाव' 
              : 'Key milestones in political journey and public service'
            }
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 bg-orange-500 h-full rounded-full shadow-orange hidden md:block"></div>
          
          {/* Timeline Events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-wow hidden md:block z-10"></div>
                
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} mb-6 md:mb-0`}>
                  <div className="card-wow animate-fade-in p-6">
                    {/* Year Badge */}
                    <div className="inline-flex items-center px-4 py-1 bg-orange-500 text-white text-sm font-bold rounded-full mb-4 shadow-orange">
  <Calendar className="w-4 h-4 mr-2" />
  {event.year}
</div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-orange-600 mb-3 leading-tight">
                      {currentLanguage === 'hi' ? event.titleHi : event.titleEn}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {currentLanguage === 'hi' ? event.descriptionHi : event.descriptionEn}
                    </p>
                  </div>
                </div>
                
                {/* Image */}
                <div className={`w-full md:w-5/12 flex justify-center ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                  <div className="relative">
                    <img
                      src={event.image || IMAGE_PLACEHOLDER}
                      alt={currentLanguage === 'hi' ? event.titleHi : event.titleEn}
                      className="w-72 h-60 object-cover rounded-lg shadow-md border border-gray-200"
                      loading="lazy"
                    />
                    {/* Image overlay for professional look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default Timeline;
