
import { F1Event } from '../types';
import { EVENTS } from '../constants';

// --- CONFIGURATION ---
// Set this to FALSE when you have your Node.js + MySQL server running.
// Set this to TRUE to simulate the database in the browser so the app works now.
const DEMO_MODE = true; 

// Auto-detect environment:
// In development, we point to localhost:3001.
// In production (on hosting), we use '/api' relative path, relying on Nginx/Apache proxy to route it to the backend.
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001/api'
  : '/api';

// --- API SERVICE ---

export const api = {
  /**
   * GET all events
   */
  getEvents: async (): Promise<F1Event[]> => {
    if (DEMO_MODE) {
      return getDemoData();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("API Error (getEvents):", error);
      throw error;
    }
  },

  /**
   * CREATE a new event
   */
  createEvent: async (event: F1Event): Promise<F1Event> => {
    if (DEMO_MODE) {
      return saveDemoData(event);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return await response.json();
    } catch (error) {
      console.error("API Error (createEvent):", error);
      throw error;
    }
  },

  /**
   * UPDATE an existing event
   */
  updateEvent: async (event: F1Event): Promise<F1Event> => {
    if (DEMO_MODE) {
      return updateDemoData(event);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to update event');
      return await response.json();
    } catch (error) {
      console.error("API Error (updateEvent):", error);
      throw error;
    }
  },

  /**
   * DELETE an event
   */
  deleteEvent: async (id: string): Promise<void> => {
    if (DEMO_MODE) {
      return deleteDemoData(id);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
    } catch (error) {
      console.error("API Error (deleteEvent):", error);
      throw error;
    }
  }
};

// --- MOCK DATABASE (LOCAL STORAGE SIMULATION) ---
// This allows the app to work immediately without the real MySQL server running yet.

const STORAGE_KEY = 'mysql_demo_data';

const getDemoData = async (): Promise<F1Event[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  
  // Initialize with constants if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(EVENTS));
  return EVENTS;
};

const saveDemoData = async (event: F1Event): Promise<F1Event> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updated = [...current, event];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return event;
};

const updateDemoData = async (event: F1Event): Promise<F1Event> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updated = current.map((e: F1Event) => e.id === event.id ? event : e);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return event;
};

const deleteDemoData = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updated = current.filter((e: F1Event) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
