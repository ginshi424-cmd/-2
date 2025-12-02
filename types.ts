
export enum TicketCategory {
  MainGrandstand = 'Main Grandstand',
  NorthGrandstand = 'North Grandstand',
  T2Grandstand = 'T2 Grandstand',
  GeneralAdmission = 'General Admission',
}

export interface Ticket {
  id: string;
  name: string;
  category: TicketCategory;
  price: number;
  currency: string;
  available: boolean;
  imageUrl: string;
  description: string;
  features: string[];
  format: string;
}

export interface CartItem extends Ticket {
  quantity: number;
}

export interface F1Event {
  id: string;
  name: string;
  location: string;
  date: string; // YYYY-MM-DD
  year: number;
  imageUrl: string;
  flagUrl: string;
  tickets: Ticket[];
}

export interface Standing {
  position: number;
  name: string;
  team?: string;
  points: number;
}
