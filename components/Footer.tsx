import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Settings } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-racing-darker border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center transform -skew-x-12">
                  <span className="font-display text-racing-dark text-sm font-bold skew-x-12">GP1</span>
              </div>
              <span className="font-display text-white text-xl">TICKETS</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Official authorized ticket reseller for the Formula 1 Qatar Grand Prix 2025. Secure your place at the pinnacle of motorsport.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-4 tracking-wider text-sm">Event Info</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-racing-red transition-colors">Circuit Map</a></li>
              <li><a href="#" className="hover:text-racing-red transition-colors">Race Schedule</a></li>
              <li><a href="#" className="hover:text-racing-red transition-colors">Getting There</a></li>
              <li><a href="#" className="hover:text-racing-red transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-4 tracking-wider text-sm">Customer Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-racing-red transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-racing-red transition-colors">Delivery Information</a></li>
              <li><a href="#" className="hover:text-racing-red transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-racing-red transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-4 tracking-wider text-sm">Stay Updated</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-racing-red text-white transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-racing-red text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-racing-red text-white transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-racing-red text-white transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-gray-800 text-white text-sm px-4 py-2 rounded focus:outline-none border border-gray-700 w-full" />
              <button className="bg-racing-red text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700">GO</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">© 2024 GP1 Tickets. All rights reserved.</p>
          <div className="flex items-center gap-4">
             <div className="flex gap-2 opacity-50">
                <div className="h-6 w-10 bg-gray-700 rounded"></div>
                <div className="h-6 w-10 bg-gray-700 rounded"></div>
                <div className="h-6 w-10 bg-gray-700 rounded"></div>
             </div>
             <button onClick={onOpenAdmin} className="text-gray-700 hover:text-gray-500 transition-colors p-2" title="Admin Access">
               <Settings className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;