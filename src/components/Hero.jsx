import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';


// Get Cloudinary cloud name from environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dhzhuobu2';


const carouselImages = [
  { src: `https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677382/pic_vth_someone_unsqn2.jpg`, alt: 'With Someone' },
  { src: `https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677381/PIC_VTH_MODI_dgwo9n.jpg`, alt: 'With Modi' },
  { src: `https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677381/pic_Vth_modi_1_libkxc.png`, alt: 'With Modi - Event 1' },
  { src: `https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677380/pic_vth_amit_bauivg.jpg`, alt: 'With Amit Shah' },
  { src: `https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677383/pic_Vth_Modi_2_zpiwe8.png`, alt: 'With Modi - Event 2' },
  { src: `https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677381/pic_Vth_VIP_fluo9c.jpg`, alt: 'With VIP' },
  { src: `https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677382/PIC_VTH_MODI_3_hgpsai.png`, alt: 'With Modi - Event 3' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.20 * i, duration: 0.7, ease: 'easeOut' },
  }),
};

const Hero = ({ currentLanguage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    let interval = null;
    const scrollStep = 1; // px per scroll for slower, softer animation
    const scrollDelay = 24; // ms (slower speed)

    function autoScroll() {
      if (!carousel || isDragging) return;
      // If near the end, reset for seamless loop
      if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - scrollStep) {
        carousel.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        carousel.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }

    interval = setInterval(autoScroll, scrollDelay);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="home" className="w-full bg-[#fdf6ec] mt-8 md:mt-0 pt-20 pb-2 md:pt-24 md:pb-4 scroll-mt-20 md:scroll-mt-28">
      <div className="container px-2 mx-auto sm:px-4 md:px-6 lg:px-8">
        <div className="relative flex flex-col-reverse items-center justify-between gap-4 p-2 mb-4 overflow-hidden shadow-xl lg:flex-row md:gap-16 bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl sm:p-4 md:p-8 md:mb-8">
          {/* Background Image for Main Content Div */}
          <div className="absolute inset-0 z-0">
            <img
              src={`https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677383/pic_Vth_Modi_2_zpiwe8.png`}
              alt="Political Event Background"
              className="object-cover object-center w-full h-full opacity-60 md:opacity-100"
            />
            {/* Black overlay for readability */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          {/* Left: Text Content */}
          <motion.div
            className="relative z-10 flex-1 w-full max-w-full p-4 text-center sm:max-w-xl lg:text-left lg:mt-40 rounded-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            <motion.h1
              className="mb-1 font-serif text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl sm:mb-2"
              style={{
                textShadow: '0 4px 16px #F47216, 0 2px 8px rgba(0,0,0,0.25)'
              }}
              custom={1}
              variants={fadeIn}
            >
              {currentLanguage === 'hi' ? 'यल्ला वेंकट राममोहन राव (डोराबाबू)' : 'Yalla Venkata Ramamohan Rao '}
            </motion.h1>
            {/* Removed underline divider */}
            <motion.div
              className="inline-block px-3 py-1 mb-2 text-base font-semibold text-orange-700 bg-orange-100 rounded-full shadow-sm"
              custom={2}
              variants={fadeIn}
            >
              {currentLanguage === 'hi' ? 'डोराबाबू' : 'Dorababu'}
            </motion.div>
            <motion.div
              className="mb-2 text-lg font-bold text-orange-600 sm:text-xl drop-shadow"
              style={{
                textShadow: '0 1px 4px rgba(0,0,0,0.10)',
                WebkitTextStroke: '0.5px #fff',
                textStroke: '0.5px #fff'
              }}
              custom={3}
              variants={fadeIn}
            >
              <span>
                {currentLanguage === 'hi' ? '25+ वर्ष की अनुभवी भाजपा लीडर' : 'Senior BJP leader with 25+ years of experience'}
              </span>
            </motion.div>
            <motion.p
              className="mb-2 text-sm sm:text-base md:text-lg sm:mb-4 text-white/90"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
              custom={4}
              variants={fadeIn}
            >
              {currentLanguage === 'hi' ? 'सामाजिक सेवा, राजनीति और विकास के लिए एक भाजपा लीडर।' : 'Dedicated to public service, rural development, and strong leadership. Committed to empowering communities and driving positive change across the region.'}
            </motion.p>
            <motion.div
              custom={5}
              variants={fadeIn}
            >
              <button 
                className="px-6 py-2 text-base font-semibold text-white transition rounded-lg shadow sm:px-8 sm:py-3 bg-gradient-to-r from-orange-500 to-yellow-400 sm:text-lg hover:from-orange-600 hover:to-yellow-500"
                onClick={() => {
                  const aboutSection = document.querySelector('#about');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                {currentLanguage === 'hi' ? 'और जानें' : 'Learn More'}
              </button>
            </motion.div>
          </motion.div>
          {/* Right: Image */}
          <motion.div
            className="relative z-10 flex justify-center flex-1 w-full mt-4 lg:justify-end sm:mt-8 lg:mt-0 lg:-ml-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
            custom={2}
          >
            <img
              src={`https://res.cloudinary.com/dhzhuobu2/image/upload/v1753677380/dorababumain_optimized_iejtzu.png`}
              alt={currentLanguage === 'hi' ? 'वेंकट राममोहन राव (डोराबाबू)' : 'Venkata Ramamohan Rao (Dorababu)'}
              className="object-cover rounded-2xl md:rounded-3xl shadow-xl border-2 md:border-4 border-[#fdf6ec] w-36 h-36 sm:w-52 sm:h-52 md:w-72 md:h-72"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </motion.div>
        </div>
      </div>
      {/* Carousel Section */}
      <div className="mt-2 sm:mt-4">
        <h2 className="mb-4 font-serif text-lg font-bold tracking-tight text-center text-orange-700 sm:text-2xl md:text-3xl sm:mb-8">
          {currentLanguage === 'hi' ? 'सामाजिक सेवा, राजनीति और विकास के लिए एक बीजीपी लीडर।' : 'Moments in Public Life'}
        </h2>
        <div 
          className="w-full overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          // Touch events for mobile
          onTouchStart={e => handleMouseDown(e.touches[0])}
          onTouchEnd={handleMouseUp}
          onTouchMove={e => handleMouseMove(e.touches[0])}
        >
          <div
            className={`flex whitespace-nowrap ${!isDragging ? 'animate-scroll-slow' : ''}`}
            style={{ minWidth: 'min-content' }}
          >
            {[...carouselImages, ...carouselImages].map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={img.alt}
                className="w-48 h-32 sm:w-[400px] sm:h-[280px] object-cover rounded-lg sm:rounded-xl shadow-lg mx-2 sm:mx-4 border border-orange-100 bg-white select-none"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
