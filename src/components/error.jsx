import React, { useState, useEffect } from 'react';
import FallingText from './FallingText';

const ErrorPage = () => {
  const [sparkles, setSparkles] = useState([]);

  const goHome = () => {
    // In a real application, you would use React Router
    // navigate('/') or window.location.href = '/';
    window.location.href = '/';
  };

  const goBack = () => {
    window.history.back();
  };

  const createSparkle = (x, y) => {
    const id = Date.now() + Math.random();
    const newSparkle = { id, x, y };
    
    setSparkles(prev => [...prev, newSparkle]);
    
    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(sparkle => sparkle.id !== id));
    }, 1000);
  };

  const handleMouseMove = (e) => {
    if (Math.random() > 0.9) {
      createSparkle(e.clientX, e.clientY);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const FloatingCircle = ({ className, delay = 0 }) => (
    <div 
      className={`absolute bg-white bg-opacity-10 rounded-full animate-pulse ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite ${delay}s`,
      }}
    />
  );

  const Sparkle = ({ x, y, id }) => (
    <div
      key={id}
      className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        animation: 'sparkle 1s ease-out forwards',
      }}
    />
  );

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative"
         style={{
           background: 'linear-gradient(135deg, #ff6b35, #f7931e, #ff8c42)'
         }}>
      
      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes sparkle {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(180deg);
            opacity: 0;
          }
        }

        .bounce-animation {
          animation: bounce 2s infinite;
        }

        .rotate-animation {
          animation: rotate 20s linear infinite;
        }

        .gradient-text {
          background: linear-gradient(45deg, #fff, #ffe4d6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingCircle className="w-15 h-15 top-1/5 left-1/10" delay={0} />
        <FloatingCircle className="w-10 h-10 top-3/5 right-1/6" delay={2} />
        <FloatingCircle className="w-20 h-20 bottom-1/5 left-1/5" delay={4} />
        <FloatingCircle className="w-8 h-8 top-1/3 right-1/3" delay={1} />
      </div>

      {/* Rotating background effect */}
      <div 
        className="absolute inset-0 pointer-events-none rotate-animation"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          transform: 'scale(2)',
        }}
      />

      {/* Main content */}
      <div className="text-center text-white max-w-2xl px-8 relative z-10">
        {/* 404 Code */}
        <div 
          className="text-9xl md:text-[12rem] font-black leading-none mb-4 bounce-animation gradient-text"
          style={{
            textShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          404
        </div>

        {/* Title */}
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{
            textShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <FallingText text="Oops! Page Not Found" />
        </h1>

        {/* Message */}
        <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
          <FallingText text={"This page wandered off. Don’t worry — we’ll guide you back!"} />
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={goHome}
            className="px-8 py-3 bg-white text-orange-500 rounded-full font-semibold text-lg
                     transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
                     shadow-lg min-w-[200px] sm:min-w-0"
          >
            Take Me Home
          </button>
        </div>
      </div>

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <Sparkle 
          key={sparkle.id} 
          x={sparkle.x} 
          y={sparkle.y} 
          id={sparkle.id} 
        />
      ))}
    </div>
  );
};

export default ErrorPage;