

import React, { useState } from 'react';
import { F1Event, Ticket } from '../types';
import { DEFAULT_TICKETS } from '../constants';
import { Save, X, Image as ImageIcon, Flag, MapPin, Calendar, Ticket as TicketIcon, Trash2, Plus, Edit2, RotateCcw, AlertTriangle } from 'lucide-react';
import { sendTelegramLog } from '../services/telegramService';

interface AdminPanelProps {
  events: F1Event[];
  onAddEvent: (event: F1Event) => void;
  onUpdateEvent: (event: F1Event) => void;
  onDeleteEvent: (id: string) => void;
  onCancel: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent, onCancel }) => {
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<Partial<F1Event>>({
    name: '',
    location: '',
    date: '',
    year: 2025,
    imageUrl: '',
    flagUrl: ''
  });

  // Load default tickets as the starting point for editing
  const [tickets, setTickets] = useState<Ticket[]>(JSON.parse(JSON.stringify(DEFAULT_TICKETS)));

  const handleLoadEvent = (event: F1Event) => {
    setEditingEventId(event.id);
    setShowDeleteConfirm(false);
    setFormData({
      name: event.name,
      location: event.location,
      date: event.date,
      year: event.year,
      imageUrl: event.imageUrl,
      flagUrl: event.flagUrl
    });
    setTickets(JSON.parse(JSON.stringify(event.tickets || [])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingEventId(null);
    setShowDeleteConfirm(false);
    setFormData({
      name: '',
      location: '',
      date: '',
      year: 2025,
      imageUrl: '',
      flagUrl: ''
    });
    setTickets(JSON.parse(JSON.stringify(DEFAULT_TICKETS)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date) return;

    if (editingEventId) {
      // Update Existing
      const updatedEvent: F1Event = {
        id: editingEventId,
        name: formData.name!,
        location: formData.location || 'TBA',
        date: formData.date!,
        year: formData.year || 2025,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80',
        flagUrl: formData.flagUrl || 'https://upload.wikimedia.org/wikipedia/commons/e/ec/F1_chequered_flag.svg',
        tickets: tickets
      };
      onUpdateEvent(updatedEvent);
      handleResetForm();
    } else {
      // Create New
      const newEvent: F1Event = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + formData.year,
        name: formData.name!,
        location: formData.location || 'TBA',
        date: formData.date!,
        year: formData.year || 2025,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80',
        flagUrl: formData.flagUrl || 'https://upload.wikimedia.org/wikipedia/commons/e/ec/F1_chequered_flag.svg',
        tickets: tickets
      };
      
      // Log to Telegram
      sendTelegramLog(`📅 <b>New Event Created</b>\n\n<b>Event:</b> ${newEvent.name}\n<b>Date:</b> ${newEvent.date}\n<b>Location:</b> ${newEvent.location}\n<b>Tickets Configured:</b> ${tickets.length}`);
      
      onAddEvent(newEvent);
    }
  };

  const updateTicket = (id: string, field: keyof Ticket, value: any) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR: Event List */}
        <div className="lg:w-1/3 space-y-4">
           <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <h3 className="font-display font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-gp1-red" /> Manage Events
              </h3>
              
              <button 
                onClick={handleResetForm}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded mb-4 flex items-center justify-center gap-2 transition-colors text-sm uppercase"
              >
                <Plus className="w-4 h-4" /> Create New
              </button>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                 {events.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No events found.</p>
                 ) : (
                    events.map(event => (
                      <div 
                        key={event.id}
                        className={`p-3 rounded border transition-all flex justify-between items-center ${editingEventId === event.id ? 'bg-red-50 border-gp1-red ring-1 ring-red-100' : 'bg-gray-50 border-gray-100'}`}
                      >
                         <div>
                            <div className="font-bold text-sm text-gray-800">{event.name}</div>
                            <div className="text-xs text-gray-500">{event.date}</div>
                         </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleLoadEvent(event)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* MAIN: Form */}
        <div className="lg:w-2/3 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="bg-gp1-black text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                 {editingEventId ? <><Edit2 className="w-5 h-5"/> Edit Event</> : <><Plus className="w-5 h-5"/> Create New Event</>}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                {editingEventId ? `Editing: ${formData.name}` : 'Add a new Grand Prix and customize tickets'}
              </p>
            </div>
            <button onClick={onCancel} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8 flex-grow overflow-y-auto">
            
            {/* Section: Event Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">1. Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Event Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Italian Grand Prix"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gp1-red focus:border-gp1-red block p-3"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Circuit / Location
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Monza Circuit"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gp1-red focus:border-gp1-red block p-3"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Event Date
                  </label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gp1-red focus:border-gp1-red block p-3"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Season Year</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gp1-red focus:border-gp1-red block p-3"
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: Number(e.target.value)})}
                  >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Cover Image URL
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gp1-red focus:border-gp1-red block p-3"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  />
                </div>

                {/* Flag URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                    <Flag className="w-3 h-3" /> Country Flag URL
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gp1-red focus:border-gp1-red block p-3"
                    value={formData.flagUrl}
                    onChange={e => setFormData({...formData, flagUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Section: Ticket Management */}
            <div>
              <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
                 <h3 className="text-lg font-bold text-gray-800">2. Customize Tickets</h3>
                 <span className="text-xs text-gray-400">Modify names, prices, and images for this event</span>
              </div>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                 {tickets.map((ticket, index) => (
                   <div key={ticket.id} className="bg-white p-4 rounded shadow-sm border border-gray-100 relative group">
                      <button 
                          type="button"
                          onClick={() => removeTicket(ticket.id)}
                          className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1 transition-colors"
                          title="Remove Ticket"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {/* Image Preview */}
                          <div className="w-full sm:w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0 border border-gray-200">
                              <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-full object-cover" />
                          </div>

                          {/* Fields */}
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                               {/* Name Input */}
                               <div>
                                  <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Ticket Name</label>
                                  <input 
                                    type="text" 
                                    value={ticket.name}
                                    onChange={(e) => updateTicket(ticket.id, 'name', e.target.value)}
                                    className="w-full text-sm font-bold text-gray-900 border border-gray-300 rounded px-2 py-1.5 focus:border-red-500 focus:outline-none"
                                  />
                               </div>

                               {/* Price Input */}
                               <div>
                                  <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Price (€)</label>
                                  <input 
                                    type="number" 
                                    value={ticket.price}
                                    onChange={(e) => updateTicket(ticket.id, 'price', Number(e.target.value))}
                                    className="w-full text-sm font-bold text-gray-900 border border-gray-300 rounded px-2 py-1.5 focus:border-red-500 focus:outline-none"
                                  />
                               </div>

                               {/* Image URL Input */}
                               <div className="md:col-span-2">
                                  <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block flex items-center gap-1">
                                      <ImageIcon className="w-3 h-3" /> Ticket Image URL
                                  </label>
                                  <input 
                                    type="text" 
                                    value={ticket.imageUrl}
                                    onChange={(e) => updateTicket(ticket.id, 'imageUrl', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full text-xs text-gray-600 border border-gray-300 rounded px-2 py-1.5 focus:border-red-500 focus:outline-none font-mono"
                                  />
                               </div>
                          </div>
                      </div>
                   </div>
                 ))}
                 
                 {tickets.length === 0 && (
                   <div className="text-center py-4 text-gray-500 text-sm">
                     No tickets available.
                   </div>
                 )}

                 <button 
                   type="button"
                   className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded font-bold text-xs uppercase hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 bg-white"
                   onClick={() => {
                     // Add a generic new ticket
                     const newId = `custom-${Date.now()}`;
                     const newTicket = {...DEFAULT_TICKETS[0], id: newId, name: 'New Grandstand', price: 100 };
                     setTickets([...tickets, newTicket]);
                   }}
                 >
                   <Plus className="w-4 h-4" /> Add Ticket Option
                 </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
              <div>
                {editingEventId && (
                  showDeleteConfirm ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <button
                            type="button"
                            onClick={() => {
                                onDeleteEvent(editingEventId);
                                handleResetForm();
                            }}
                            className="bg-red-600 text-white px-4 py-3 rounded text-sm font-bold uppercase hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Confirm
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="bg-gray-100 text-gray-700 px-4 py-3 rounded text-sm font-bold uppercase hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                  ) : (
                    <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowDeleteConfirm(true);
                        }}
                        className="bg-red-50 text-red-700 px-6 py-3 rounded text-sm font-bold uppercase hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Event
                    </button>
                  )
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 rounded text-sm font-bold uppercase text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gp1-red text-white px-8 py-3 rounded text-sm font-bold uppercase shadow-lg hover:bg-red-700 hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingEventId ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
