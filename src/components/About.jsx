import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Users, Globe, Briefcase, Scale, Handshake, Target, Star, TrendingUp, Heart, Shield } from 'lucide-react';

const About = ({ currentLanguage }) => {
  const infoCards = [
    {
      icon: <Briefcase className="w-7 h-7" />,
      title: currentLanguage === 'hi' ? 'राजनीतिक नेतृत्व' : 'Political Leadership',
      description: currentLanguage === 'hi'
        ? 'ग्राम स्तर से जिला अध्यक्ष तक का सफर'
        : 'Journey from grassroots to BJP District President',
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50'
    },
    {
      icon: <Scale className="w-7 h-7" />,
      title: currentLanguage === 'hi' ? 'गवर्नेंस और विकास' : 'Governance & Development',
      description: currentLanguage === 'hi'
        ? 'स्थानीय प्रशासन और विकास योजनाओं का अनुभव'
        : 'Hands-on experience in local governance and development schemes',
      gradient: 'from-amber-500 to-yellow-500',
      bgGradient: 'from-amber-50 to-yellow-50'
    },
    {
      icon: <Users className="w-7 h-7 text-orange-500" />,
      title: currentLanguage === 'hi' ? 'जनसंपर्क' : 'Public Connect',
      description: currentLanguage === 'hi'
        ? 'हर वर्ग से गहरा संवाद और सेवा'
        : 'Strong connect with every section of the society',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: currentLanguage === 'hi' ? 'दृष्टिकोण' : 'Vision',
      description: currentLanguage === 'hi'
        ? 'सशक्त ग्रामीण भारत की ओर स्पष्ट दृष्टिकोण'
        : 'A clear vision for a strong rural India',
      gradient: 'from-orange-600 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  const achievements = [
    {
      icon: <Star className="w-5 h-5" />,
      text: currentLanguage === 'hi' ? '25+ वर्षों का अनुभव' : '25+ Years of Experience',
      color: 'text-orange-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: currentLanguage === 'hi' ? '10+ प्रमुख पदों पर कार्य' : 'Held 10+ Key Positions',
      color: 'text-amber-600'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      text: currentLanguage === 'hi' ? 'हजारों लोगों से जुड़ाव' : 'Thousands Impacted',
      color: 'text-orange-700'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: currentLanguage === 'hi' ? 'भरोसेमंद नेतृत्व' : 'Trusted Leadership',
      color: 'text-yellow-600'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="about" className="py-24 bg-[#FFF6ED] scroll-mt-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif" style={{ color: '#F47216' }}>
            {currentLanguage === 'hi' ? 'विषय में' : 'About'}
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 mx-auto rounded-full shadow-lg"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info Cards (now left on large screens) */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-2 gap-6 h-full"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {infoCards.map((card, index) => (
              <motion.div 
                key={index} 
                className={`bg-gradient-to-br ${card.bgGradient} p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/30 relative overflow-hidden group h-full flex flex-col justify-between`}
                variants={item}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="flex-1">
                  <div className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <span className="text-white">{card.icon}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-sans text-center">
                    {card.title}
                  </h4>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${card.gradient} opacity-20 rounded-bl-2xl`}></div>
              </motion.div>
            ))}
          </motion.div>
          {/* Bio/Intro/Achievements (now right on large screens) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-orange-50/80 rounded-3xl blur-xl -z-10"></div>
            <div className="bg-white/90 backdrop-blur-sm p-4 md:p-8 rounded-3xl shadow-2xl border border-white/20 relative h-full">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-serif bg-gradient-to-r from-orange-800 to-amber-700 bg-clip-text text-transparent">
                {currentLanguage === 'hi' 
                  ? 'यल्ला वेंकट राममोहन राव (डोराबाबू) का परिचय' 
                  : 'Introduction to Yalla Venkata Ramamohan Rao (Dorababu)'}
              </h3>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p className="relative pl-6 border-l-4 border-orange-500">
  {currentLanguage === 'hi'
    ? 'यल्ला वेंकट राममोहन राव (डोराबाबू) आंध्र प्रदेश के एक समर्पित और अनुभवी भाजपा नेता हैं। उन्होंने 1994 में वार्ड सदस्य के रूप में राजनीति में कदम रखा और डॉ. बी.आर. अंबेडकर कोनसीमा जिले के भाजपा जिला अध्यक्ष हैं।'
    : 'Yalla Venkata Ramamohan Rao (Dorababu) is a dedicated and experienced BJP leader from Andhra Pradesh. Starting his political journey in 1994 as a Ward Member, he served as the BJP District President of Dr. B.R. Ambedkar Konaseema District.'}
</p>
<p className="relative pl-6 border-l-4 border-amber-500">
  {currentLanguage === 'hi'
    ? 'अपने तीन दशकों से अधिक के राजनीतिक सफर में उन्होंने सरपंच, मंडल सरपंच यूनियन अध्यक्ष, ZPTC सदस्य, DLDA और APLDA के चेयरमैन, राज्य कार्यकारिणी सदस्य, राज्य सचिव (विशाखापट्टनम प्रभारी) और सांसद पद के प्रत्याशी जैसे महत्वपूर्ण पदों पर कार्य किया।'
    : 'With a political career spanning over three decades, he served as Sarpanch, Mandal Sarpanch Union President, ZPTC Member, Chairman of DLDA & APLDA, State Executive Member, State Secretary (in charge of Vizag), and MP Candidate.'}
</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-white to-orange-50 p-3 rounded-xl border border-orange-200"
                  >
                    <div className={`${achievement.color}`}>
                      {achievement.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{achievement.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
