import React from 'react';
import { Check } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  title = "F1 tickets to Qatar GP 2025", 
  subtitle = "Doha - Lusail International Circuit", 
  imageUrl = "https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%202018/Qatar%20GP/Qatar%20GP%202021%20Main%20Grandstand"
}) => {
  const scrollToTickets = () => {
    const element = document.getElementById('tickets-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[80vh] md:h-[600px] w-full bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl} 
          alt="GP Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay to make text pop */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="absolute inset-0 z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center pb-8">
        
        {/* Title Section */}
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg tracking-tight uppercase max-w-5xl leading-tight">
          {title}
        </h1>
        
        <p className="text-white/90 text-lg md:text-xl mb-8 font-light">
          {subtitle}
        </p>

        {/* Trust Badges */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-10 text-sm md:text-base font-bold text-white">
           <div className="flex items-center gap-2">
             <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
             <span>100% Secure e-tickets</span>
           </div>
           <div className="flex items-center gap-2">
             <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
             <span>Secure payments</span>
           </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={scrollToTickets}
          className="bg-[#E10600] text-white text-xl font-bold py-3 px-12 rounded hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Tickets
        </button>

      </div>
    </div>
  );
};

export default Hero;