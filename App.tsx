
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TicketCard from './components/TicketCard';
import Footer from './components/Footer';
import Standings from './components/Standings';
import AdminPanel from './components/AdminPanel';
import CheckoutModal from './components/CheckoutModal';
import { DRIVER_STANDINGS, TEAM_STANDINGS, ADMIN_PASSWORD } from './constants';
import { Ticket, TicketCategory, CartItem, F1Event } from './types';
import { ShoppingBag, Trash2, X, Check, Calendar, Ticket as TicketIcon, Lock, Loader2 } from 'lucide-react';
import { sendTelegramLog } from './services/telegramService';
import { api } from './services/api';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'tickets' | 'admin'>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Data State
  const [events, setEvents] = useState<F1Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Events from API (MySQL)
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events. Please check database connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Admin Auth State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // -- Event Management Logic --
  const handleAddEvent = async (newEvent: F1Event) => {
    try {
      setIsLoading(true);
      await api.createEvent(newEvent);
      await loadEvents(); // Reload from DB
      setCurrentView('home');
      sendTelegramLog(`📅 <b>New Event Created</b>\n\n<b>Event:</b> ${newEvent.name}`);
    } catch (e) {
      alert("Error creating event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async (updatedEvent: F1Event) => {
    try {
      setIsLoading(true);
      await api.updateEvent(updatedEvent);
      await loadEvents(); // Reload from DB
      sendTelegramLog(`📝 <b>Event Updated</b>\n\n<b>Event:</b> ${updatedEvent.name}`);
      setCurrentView('home');
    } catch (e) {
      alert("Error updating event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const eventToDelete = events.find(e => e.id === eventId);
      setIsLoading(true);
      await api.deleteEvent(eventId);
      await loadEvents(); // Reload from DB
      
      if (eventToDelete) {
         sendTelegramLog(`🗑️ <b>Event Deleted</b>\n\n<b>Event:</b> ${eventToDelete.name}`);
      }
    } catch (e) {
      alert("Error deleting event");
    } finally {
      setIsLoading(false);
    }
  };

  // -- Cart Logic --
  const addToCart = (ticket: Ticket) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === ticket.id);
      if (existing) {
        return prev.map(item => item.id === ticket.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...ticket, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handlePaymentSuccess = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');
    
    // Log to Telegram
    sendTelegramLog(`💰 <b>New Order Received!</b>\n\n<b>Total:</b> €${total}\n<b>Items:</b> ${itemsList}\n<b>Status:</b> Paid`);

    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  // -- Navigation Logic --
  const handleSelectEvent = (event: F1Event) => {
    setSelectedEventId(event.id);
    setCurrentView('tickets');
    window.scrollTo(0, 0);
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedEventId(null);
    window.scrollTo(0, 0);
  };

  // -- Admin Access Logic --
  const handleAdminRequest = () => {
    setIsLoginOpen(true);
    setLoginError(false);
    setPasswordInput('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setCurrentView('admin');
      setIsLoginOpen(false);
      setPasswordInput('');
      sendTelegramLog(`🔐 <b>Admin Login</b>\nSuccessful login detected.`);
    } else {
      setLoginError(true);
      sendTelegramLog(`⚠️ <b>Failed Admin Login</b>\nIncorrect password attempt.`);
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // -- LOADING SCREEN --
  if (isLoading && events.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-gp1-red animate-spin mb-4" />
        <h2 className="text-xl font-display font-bold">Loading Grand Prix Events...</h2>
        <p className="text-gray-500 text-sm mt-2">Connecting to database</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">
      {/* Header persists across pages */}
      <Header 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onNavigateHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-16 bg-[#111111]">
        
        {/* VIEW: HOME PAGE (Event Selection) */}
        {currentView === 'home' && (
          <HomePage events={events} onSelectEvent={handleSelectEvent} isLoading={isLoading} />
        )}

        {/* VIEW: TICKET PAGE (Specific Event) */}
        {currentView === 'tickets' && (
          <TicketPage 
            onAddToCart={addToCart} 
            event={selectedEvent} 
          />
        )}

        {/* VIEW: ADMIN PANEL */}
        {currentView === 'admin' && (
          <div className="bg-gray-100 min-h-screen relative">
            {isLoading && (
               <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-gp1-red animate-spin" />
               </div>
            )}
            <AdminPanel 
              events={events}
              onAddEvent={handleAddEvent} 
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onCancel={handleGoHome} 
            />
          </div>
        )}

      </main>

      {/* Footer with Admin Trigger */}
      <Footer onOpenAdmin={handleAdminRequest} />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal 
          total={cartTotal} 
          onClose={() => setIsCheckoutOpen(false)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-xl font-display font-bold flex items-center gap-2 text-black">
              <ShoppingBag className="w-5 h-5 text-gp1-red" />
              Shopping Cart
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto space-y-4 pr-2">
            {cart.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                   <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-gray-500 mb-4">Your cart is currently empty.</p>
                <button onClick={() => setIsCartOpen(false)} className="bg-gp1-black text-white px-6 py-2 rounded text-sm font-bold uppercase hover:bg-gray-800">
                   Start Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="bg-gray-50 p-4 rounded border border-gray-200 flex gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-200" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-black text-sm">{item.name}</h4>
                    <span className="text-xs text-gray-500 block mb-1">{item.category}</span>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-gp1-red font-bold text-sm">{item.currency} {item.price} x {item.quantity}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="text-xl font-bold text-black">€ {cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">Shipping & taxes calculated at checkout</p>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-gp1-red text-white py-4 rounded font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={cart.length === 0}
            >
              Secure Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)}></div>
           
           {/* Modal */}
           <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-gp1-black p-4 text-center">
                 <h3 className="text-white font-display font-bold text-lg flex items-center justify-center gap-2">
                   <Lock className="w-4 h-4" /> Admin Access
                 </h3>
              </div>
              
              <form onSubmit={handleLoginSubmit} className="p-6">
                 <p className="text-sm text-gray-500 mb-4 text-center">Enter the administration password to continue.</p>
                 
                 <div className="mb-4">
                   <input 
                      type="password" 
                      autoFocus
                      placeholder="Password"
                      className={`w-full border p-3 rounded text-sm outline-none focus:ring-2 ${loginError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-200'}`}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                   />
                   {loginError && <p className="text-red-600 text-xs mt-1 text-center font-bold">Incorrect password</p>}
                 </div>

                 <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsLoginOpen(false)}
                      className="flex-1 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-2 text-sm font-bold bg-gp1-red text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Login
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

// --- SUB-COMPONENTS FOR PAGES ---

// 1. HOME PAGE (Selection)
const HomePage: React.FC<{ events: F1Event[], onSelectEvent: (e: F1Event) => void, isLoading: boolean }> = ({ events, onSelectEvent, isLoading }) => {
  const [year, setYear] = useState<number>(2025);

  const displayedEvents = events.filter(e => e.year === year);

  useEffect(() => {
    document.title = `F1 Tickets ${year} | GP1 Tickets`;
  }, [year]);

  return (
    <div className="animate-in fade-in duration-500 bg-white min-h-screen">
      {/* Home Hero / Title */}
      <div className="container mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
          F1 tickets <br/> {year}
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-8">
          Buy your Official Formula 1 tickets to all Grand Prix races here! Use our easy online secure payment platform to purchase your discounted official F1 Grand Prix tickets and have them delivered to your email. Check out the calendar below to find thousands of tickets for {year}.
        </p>
        
        {/* Year Toggles */}
        <div className="flex justify-center gap-4 mb-12">
           <button 
             onClick={() => setYear(2025)}
             className={`px-6 py-3 rounded text-sm font-bold uppercase transition-all ${
               year === 2025 ? 'bg-[#D91610] text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
             }`}
           >
             F1 tickets 2025
           </button>
           <button 
             onClick={() => setYear(2026)}
             className={`px-6 py-3 rounded text-sm font-bold uppercase transition-all ${
               year === 2026 ? 'bg-[#D91610] text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
             }`}
           >
             F1 tickets 2026
           </button>
        </div>

        {/* Content Text */}
        <p className="text-xs text-gray-500 max-w-4xl mx-auto mb-6">
          So, which race is your favorite? Monza? Spa? Montmelo? Or Hungaroring? We have Official F1 tickets to all of these races and many many more. Choose from a huge range of ticket options, including Grandstand numbered seat tickets, cheaper general admission tickets, whole weekend tickets or Sunday only tickets. Relax and we will take care of you from start to finish!
        </p>

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 mb-16 text-xs font-bold text-gray-800">
           <div className="flex items-center gap-1">
             <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
             <span>100% Secure e-tickets</span>
           </div>
           <div className="flex items-center gap-1">
             <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
             <span>Secure payments</span>
           </div>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-8">F1 tickets {year}</h2>

        {/* Events List */}
        <div className="max-w-4xl mx-auto space-y-6 mb-20 min-h-[200px]">
          {isLoading && events.length > 0 && (
             <div className="text-center py-4 text-gray-400 text-sm">Refreshing events...</div>
          )}
          
          {displayedEvents.length > 0 ? (
            displayedEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-gray-100 group hover:shadow-xl transition-all">
                {/* Image */}
                <div className="md:w-[40%] h-48 md:h-auto relative overflow-hidden">
                   <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                </div>
                
                {/* Content */}
                <div className="flex-grow p-6 flex flex-col justify-center text-left">
                   <div className="flex items-center gap-3 mb-2">
                      <img src={event.flagUrl} alt="flag" className="w-6 h-auto shadow-sm rounded-sm" />
                      <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                   </div>
                   <p className="text-gray-500 text-sm mb-4">{event.location}</p>
                   
                   <div className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-6">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {event.date}
                   </div>

                   <button 
                     onClick={() => onSelectEvent(event)}
                     className="bg-[#D91610] text-white text-sm font-bold uppercase py-2 px-6 rounded w-fit hover:bg-red-700 transition-colors flex items-center gap-2 shadow-md"
                   >
                     <TicketIcon className="w-4 h-4" />
                     Buy tickets
                   </button>
                </div>
              </div>
            ))
          ) : (
             !isLoading && (
               <div className="p-12 bg-gray-50 rounded border border-dashed text-gray-400">
                 No events scheduled for {year} yet. Please check back later!
               </div>
             )
          )}
        </div>

        {/* Standings Tables */}
        <div className="max-w-4xl mx-auto">
          <Standings title="Formula One Driver Standings" data={DRIVER_STANDINGS} type="driver" />
          <Standings title="F1 Driver Teams" data={TEAM_STANDINGS} type="team" />
        </div>
      </div>
    </div>
  );
};

// 2. TICKET PAGE (Specific Event View)
const TicketPage: React.FC<{ onAddToCart: (t: Ticket) => void, event: F1Event | undefined }> = ({ onAddToCart, event }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...Object.values(TicketCategory)];

  // Update page title based on event
  useEffect(() => {
    if (event) {
      document.title = `${event.name} Tickets | GP1 Tickets`;
    }
  }, [event]);

  // Use the tickets SPECIFIC to this event, or fall back to empty array if event is undefined
  const eventTickets = event?.tickets || [];

  const filteredTickets = selectedCategory === 'All' 
    ? eventTickets
    : eventTickets.filter(t => t.category === selectedCategory);

  const eventName = event ? event.name : "Grand Prix";
  const eventLoc = event ? event.location : "";
  const eventImg = event ? event.imageUrl : undefined;

  return (
    <div className="animate-in slide-in-from-right-10 duration-500 bg-white min-h-screen">
        <Hero 
          title={`F1 tickets to ${eventName}`}
          subtitle={eventLoc}
          imageUrl={eventImg}
        />

        {/* Intro Section */}
        <section className="container mx-auto px-4 py-12 text-center max-w-4xl">
           <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 uppercase">
             {eventName.replace(/-/g, ' ').toUpperCase()} TICKETS
           </h2>
           <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-8">
             Buy your Official Formula 1 tickets here! Use our easy online secure payment platform to purchase your discounted official F1 Grand Prix tickets and have them delivered to your email.
           </p>
        </section>

        {/* Filters */}
        <div id="tickets-section" className="sticky top-16 z-30 bg-white/95 backdrop-blur py-4 border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 flex justify-center">
             <div className="flex flex-wrap gap-2 justify-center">
                 {categories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={`px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all border ${
                       selectedCategory === cat 
                         ? 'bg-gray-100 text-black border-gray-300' 
                         : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
             </div>
          </div>
        </div>

        {/* Day Header Section */}
        <div className="container mx-auto px-4 pt-10 pb-2 text-center">
            <h3 className="text-2xl font-bold text-gp1-red mb-1">Friday, Saturday & Sunday</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wide">See all 3-day ticket categories below.</p>
            <div className="h-px w-full max-w-4xl mx-auto bg-gray-100 mt-6"></div>
        </div>

        {/* Tickets Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} onAddToCart={onAddToCart} />
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">No tickets found in this category.</p>
              <button onClick={() => setSelectedCategory('All')} className="mt-4 text-gp1-red font-bold hover:underline">
                View All Tickets
              </button>
            </div>
          )}
        </div>
    </div>
  );
}

export default App;
