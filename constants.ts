
import { F1Event, Ticket, TicketCategory, Standing } from './types';

// Configuration
export const ADMIN_PASSWORD = 'f1adminDoGShitty?'; // Change this for production if needed

export const DEFAULT_TICKETS: Ticket[] = [
  {
    id: 'main-grandstand',
    name: 'Main Grandstand',
    category: TicketCategory.MainGrandstand,
    price: 650,
    currency: '€',
    available: true,
    imageUrl: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%202018/Qatar%20GP/Qatar%20GP%202021%20Main%20Grandstand',
    description: 'Overlooking the start/finish line, the Main Grandstand offers an exceptional view of the pre-race grid preparations, the dramatic start, and the checkered flag finish.',
    features: ['Giant Screen', 'Numbered Seating'],
    format: '3-day E-ticket'
  },
  {
    id: 'north-grandstand',
    name: 'North Grandstand',
    category: TicketCategory.NorthGrandstand,
    price: 450,
    currency: '€',
    available: true,
    imageUrl: 'https://www.grandprixevents.com/media/wysiwyg/qatar_f1_north_grandstand.jpg',
    description: 'Located after Turn 1, the North Grandstand provides views of the cars braking hard into the first corner, a key overtaking spot.',
    features: ['Giant Screen'],
    format: '3-day E-ticket'
  },
  {
    id: 't2-grandstand',
    name: 'T2 Grandstand',
    category: TicketCategory.T2Grandstand,
    price: 320,
    currency: '€',
    available: false,
    imageUrl: 'https://dve-images.imggaming.com/original/dve-images/OC_T2_Grandstand_Hero_Image_1.jpg',
    description: 'Positioned at the exit of Turn 2, this stand offers a great perspective on the cars accelerating out of the opening complex.',
    features: [],
    format: '3-day E-ticket'
  },
  {
    id: 'general-admission',
    name: 'General Admission',
    category: TicketCategory.GeneralAdmission,
    price: 150,
    currency: '€',
    available: true,
    imageUrl: 'https://www.gpt-worldwide.com/f1/img/qatar-f1-general-admission-2.jpg',
    description: 'Freedom to roam around various viewing areas. Find your favorite spot and enjoy the race from different angles throughout the weekend.',
    features: [],
    format: '3-day E-ticket'
  },
];


export const EVENTS: F1Event[] = [
  {
    id: 'qatar-grand-prix-2025',
    name: 'Qatar Grand Prix',
    location: 'Lusail International Circuit',
    date: '2025-11-30',
    year: 2025,
    imageUrl: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%202018/Qatar%20GP/Qatar%20GP%202021%20Main%20Grandstand',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/1280px-Flag_of_Qatar.svg.png',
    tickets: JSON.parse(JSON.stringify(DEFAULT_TICKETS))
  },
  {
    id: 'italian-grand-prix-2025',
    name: 'Italian Grand Prix',
    location: 'Monza Circuit',
    date: '2025-09-07',
    year: 2025,
    imageUrl: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%202018/Italy/2021-Race-Hub-Header-ITALY',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png',
    tickets: JSON.parse(JSON.stringify(DEFAULT_TICKETS))
  }
];


export const DRIVER_STANDINGS: Standing[] = [
    { position: 1, name: 'Max Verstappen', team: 'Red Bull Racing', points: 429 },
    { position: 2, name: 'Lando Norris', team: 'McLaren', points: 349 },
    { position: 3, name: 'Charles Leclerc', team: 'Ferrari', points: 341 },
    { position: 4, name: 'Oscar Piastri', team: 'McLaren', points: 292 },
    { position: 5, name: 'Carlos Sainz', team: 'Ferrari', points: 272 },
];
  
export const TEAM_STANDINGS: Standing[] = [
    { position: 1, name: 'McLaren', points: 641 },
    { position: 2, name: 'Ferrari', points: 619 },
    { position: 3, name: 'Red Bull Racing', points: 581 },
    { position: 4, name: 'Mercedes', points: 438 },
    { position: 5, name: 'Aston Martin', points: 92 },
];
