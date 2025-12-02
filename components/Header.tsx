import React, { useState } from 'react';
import { ShoppingCart, Menu, X, ChevronDown, Phone } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onNavigateHome }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateHome();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#111111] text-white border-b border-[#222] shadow-md font-sans">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        
        {/* Left Section: Logo & Nav */}
        <div className="flex items-center gap-8">
           {/* Logo */}
           <a href="#" onClick={handleNavClick} className="flex items-center gap-1 group">
              <div className="flex gap-0.5">
                  <div className="w-1.5 h-6 bg-gp1-red skew-x-[-20deg]"></div>
                  <div className="w-1.5 h-6 bg-gp1-red skew-x-[-20deg]"></div>
              </div>
              <span className="font-bold text-xl tracking-tight ml-1">gp1tickets.com</span>
              <span className="text-[10px] -mt-3 ml-0.5 text-gray-400">©</span>
           </a>

           {/* Desktop Nav */}
           <nav className="hidden lg:flex items-center gap-6 text-[15px]">
             <a href="#" onClick={handleNavClick} className="text-white hover:text-gp1-red transition-colors">Tickets</a>
             <a href="#" className="text-white hover:text-gp1-red transition-colors">FAQ</a>
             <a href="#" className="text-white hover:text-gp1-red transition-colors">Secure e-tickets</a>
             <a href="#" className="text-white hover:text-gp1-red transition-colors">About</a>
             <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300 text-sm">
               € <ChevronDown className="w-3 h-3" />
             </div>
           </nav>
        </div>

        {/* Right Section: Support & Cart */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm">
             <span className="text-gray-300">Need help?</span>
             <div className="flex items-center gap-1 font-bold">
                <Phone className="w-3 h-3 fill-current" />
                <span>+44 20 3807 2158</span>
             </div>
          </div>
          
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-white hover:text-gp1-red transition-colors flex items-center gap-2"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gp1-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </button>

          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#111] border-t border-[#222] p-4 flex flex-col gap-4 shadow-2xl z-40">
          <a href="#" onClick={handleNavClick} className="text-white font-medium py-2 border-b border-[#333]">Tickets</a>
          <a href="#" className="text-white font-medium py-2 border-b border-[#333]">FAQ</a>
          <a href="#" className="text-white font-medium py-2 border-b border-[#333]">Secure e-tickets</a>
          <a href="#" className="text-white font-medium py-2 border-b border-[#333]">About</a>
          <div className="text-white font-medium py-2 flex items-center gap-2">
             Need help? <span className="font-bold">+44 20 3807 2158</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;