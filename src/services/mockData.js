// Mock data for development when backend is not available

export const mockRoutes = [
  {
    id: 1,
    origin: 'Kigali',
    destination: 'Musanze',
    distance: 107,
    duration: 2.5,
    description: 'Scenic route through the hills',
    base_price: 15000
  },
  {
    id: 2,
    origin: 'Kigali',
    destination: 'Huye',
    distance: 133,
    duration: 3,
    description: 'Southern route with beautiful landscapes',
    base_price: 18500
  },
  {
    id: 3,
    origin: 'Kigali',
    destination: 'Rubavu',
    distance: 157,
    duration: 3.5,
    description: 'Western route to Lake Kivu',
    base_price: 20000
  },
  {
    id: 4,
    origin: 'Kigali',
    destination: 'Nyagatare',
    distance: 94,
    duration: 2,
    description: 'Eastern route through the plains',
    base_price: 12500
  },
  {
    id: 5,
    origin: 'Musanze',
    destination: 'Rubavu',
    distance: 62,
    duration: 1.5,
    description: 'Northern scenic route',
    base_price: 10000
  }
];

export const mockSchedules = [
  {
    id: 1,
    route_id: 1,
    departure_time: new Date(2025, 4, 10, 8, 0).toISOString(),
    arrival_time: new Date(2025, 4, 10, 10, 30).toISOString(),
    bus_name: 'Volcano Express',
    available_seats: 32,
    price: 15000
  },
  {
    id: 2,
    route_id: 1,
    departure_time: new Date(2025, 4, 10, 14, 0).toISOString(),
    arrival_time: new Date(2025, 4, 10, 16, 30).toISOString(),
    bus_name: 'Virunga Deluxe',
    available_seats: 28,
    price: 18000
  },
  {
    id: 3,
    route_id: 2,
    departure_time: new Date(2025, 4, 11, 9, 0).toISOString(),
    arrival_time: new Date(2025, 4, 11, 12, 0).toISOString(),
    bus_name: 'Southern Comfort',
    available_seats: 35,
    price: 18500
  },
  {
    id: 4,
    route_id: 3,
    departure_time: new Date(2025, 4, 12, 7, 30).toISOString(),
    arrival_time: new Date(2025, 4, 12, 11, 0).toISOString(),
    bus_name: 'Lake Express',
    available_seats: 30,
    price: 20000
  }
];

export const mockBookings = [
  {
    id: 1,
    user_id: 1,
    schedule: {
      id: 1,
      departure_time: new Date(2025, 4, 10, 8, 0).toISOString(),
      arrival_time: new Date(2025, 4, 10, 10, 30).toISOString(),
      route: {
        id: 1,
        origin: 'Kigali',
        destination: 'Musanze'
      }
    },
    booking_reference: 'BK-12345',
    seat_count: 2,
    total_amount: 30000,
    status: 'confirmed',
    payment_status: 'paid',
    created_at: new Date(2025, 4, 5).toISOString()
  },
  {
    id: 2,
    user_id: 1,
    schedule: {
      id: 3,
      departure_time: new Date(2025, 4, 11, 9, 0).toISOString(),
      arrival_time: new Date(2025, 4, 11, 12, 0).toISOString(),
      route: {
        id: 2,
        origin: 'Kigali',
        destination: 'Huye'
      }
    },
    booking_reference: 'BK-12346',
    seat_count: 1,
    total_amount: 18500,
    status: 'pending',
    payment_status: 'pending',
    created_at: new Date(2025, 4, 6).toISOString()
  }
];

export const mockUser = {
  id: 1,
  full_name: 'John Doe',
  email: 'john@example.com',
  phone_number: '+250788123456',
  role: 'customer'
};
