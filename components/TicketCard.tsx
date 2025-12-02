
import React from 'react';
import { Ticket } from '../types';
import { Check, Info, Ticket as TicketIcon, MapPin, Monitor, Armchair, Star } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onAddToCart: (ticket: Ticket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onAddToCart }) => {
  return (
    <div data-ticket-id={ticket.id} className="bg-white rounded shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col group h-full">
      
      {/* Header Section */}
      <div className="p-4 text-center border-b border-gray-50 bg-white">
         <h3 className="font-sans font-bold text-lg text-gray-900 mb-1">
           {ticket.name}
         </h3>
         <p className="text-gp1-red text-[11px] font-bold uppercase tracking-tight">
           Thursday, Friday, Saturday & Sunday
         </p>
      </div>

      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        <img 
          src={ticket.imageUrl} 
          alt={ticket.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {!ticket.available && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="border-2 border-red-600 text-red-600 px-4 py-2 text-lg font-bold uppercase -rotate-12">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-grow p-5 flex flex-col">
        
        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed mb-6 border-b border-gray-100 pb-4">
          {ticket.description}
        </p>

        {/* Feature List */}
        <div className="space-y-2 mb-6 flex-grow">
           <div className="flex items-start gap-3">
              <Armchair className="w-4 h-4 text-gray-800 shrink-0 mt-0.5" />
              <span className="text-xs text-gray-700 font-medium">Numbered separated seats</span>
           </div>
           {ticket.features.includes('Giant Screen') && (
               <div className="flex items-start gap-3">
                  <Monitor className="w-4 h-4 text-gray-800 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700 font-medium">TV screen to follow the race</span>
               </div>
           )}
           <div className="flex items-start gap-3">
              <TicketIcon className="w-4 h-4 text-gray-800 shrink-0 mt-0.5" />
              <span className="text-xs text-gray-700 font-medium">Ticketing F1</span>
           </div>
           <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-gray-800 shrink-0 mt-0.5" />
              <span className="text-xs text-gray-700 font-medium">{ticket.format}</span>
           </div>
           <div className="flex items-start gap-1 ml-7 mt-1">
              <Star className="w-3 h-3 text-gp1-red fill-current" />
              <Star className="w-3 h-3 text-gp1-red fill-current" />
              <Star className="w-3 h-3 text-gp1-red fill-current" />
              <Star className="w-3 h-3 text-gp1-red fill-current" />
              <Star className="w-3 h-3 text-gp1-red/30 fill-current" />
           </div>
        </div>

        {/* Price & Button */}
        <div className="mt-auto">
           {ticket.available && (
               <div className="text-center mb-3">
                 <span className="text-xs text-gray-400 uppercase mr-2">Price per ticket</span>
                 <span className="font-bold text-lg text-gray-900">{ticket.currency}{ticket.price}</span>
               </div>
           )}

           <button 
              onClick={() => ticket.available && onAddToCart(ticket)}
              disabled={!ticket.available}
              className={`w-full font-bold text-xs uppercase py-3 rounded transition-colors flex items-center justify-center gap-2 ${
                ticket.available 
                  ? 'bg-gp1-red text-white hover:bg-red-700 shadow-md' 
                  : 'bg-gray-300 text-white cursor-not-allowed'
              }`}
           >
              {ticket.available ? 'Add to Cart' : 'Notify Me'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default TicketCard;
