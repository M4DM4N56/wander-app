export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
console.log('[constants] API_BASE_URL:', API_BASE_URL);

export const TRAVEL_SPEED_MPM: Record<string, number> = {
  walking: 83,    // ~5 km/h
  cycling: 250,   // ~15 km/h
  driving: 500,   // ~30 km/h in urban areas
  transit: 333,   // ~20 km/h average
};

export const MIN_VENUE_TIME_MINUTES = 5;

export const MAX_RECOMMENDATIONS = 30;

export const SCORE_WEIGHTS = {
  timeAtVenue: 0.5,
  rating: 0.3,
  popularity: 0.2,
};

export const EXCLUDED_PLACE_TYPES = new Set([
  // Accommodation
  'lodging', 'hotel', 'motel', 'inn', 'campground', 'rv_park',
  // Professional services
  'real_estate_agency', 'insurance_agency', 'lawyer', 'doctor', 'dentist',
  'hospital', 'veterinary_care', 'bank', 'atm', 'finance', 'accounting',
  // Automotive
  'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'gas_station',
  // Other unwanted
  'funeral_home', 'cemetery', 'police', 'fire_station', 'local_government_office',
  'post_office', 'storage', 'moving_company', 'locksmith', 'electrician',
  'plumber', 'painter', 'roofing_contractor', 'general_contractor',
  // Administrative / geographic
  'locality', 'political', 'administrative_area_level_1', 'administrative_area_level_2',
  'administrative_area_level_3', 'sublocality', 'sublocality_level_1', 'neighborhood',
  'colloquial_area', 'country', 'postal_code', 'route', 'street_address', 'premise',
  'subpremise', 'natural_feature', 'geocode',
  // Transit
  'transit_station', 'bus_station', 'train_station', 'subway_station', 'taxi_stand',
  'airport', 'parking',
  // Religious / civic
  'establishment', 'church', 'mosque', 'synagogue', 'hindu_temple', 'place_of_worship',
  'embassy', 'courthouse', 'city_hall',
  // Retail / services not useful for wandering
  'laundry', 'travel_agency', 'bicycle_store', 'electronics_store', 'furniture_store',
  'hardware_store', 'home_goods_store', 'jewelry_store', 'pet_store', 'shoe_store', 'florist',
]);

export const PLACE_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  cafe: 'Cafe',
  bar: 'Bar',
  bakery: 'Bakery',
  meal_takeaway: 'Takeaway',
  meal_delivery: 'Delivery',
  park: 'Park',
  museum: 'Museum',
  art_gallery: 'Gallery',
  library: 'Library',
  shopping_mall: 'Mall',
  store: 'Shop',
  clothing_store: 'Clothing',
  book_store: 'Bookstore',
  convenience_store: 'Convenience',
  supermarket: 'Supermarket',
  movie_theater: 'Cinema',
  gym: 'Gym',
  spa: 'Spa',
  beauty_salon: 'Salon',
  tourist_attraction: 'Attraction',
  amusement_park: 'Amusement',
  aquarium: 'Aquarium',
  zoo: 'Zoo',
  bowling_alley: 'Bowling',
  stadium: 'Stadium',
  night_club: 'Nightclub',
  pharmacy: 'Pharmacy',
  hair_care: 'Salon',
};

export const PRICED_PLACE_TYPES = new Set([
  'restaurant', 'cafe', 'bar', 'bakery', 'meal_takeaway',
  'meal_delivery', 'night_club', 'bowling_alley',
]);

export const PLACE_CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Food & Drink', value: 'restaurant' },
  { label: 'Coffee', value: 'cafe' },
  { label: 'Nature', value: 'park' },
  { label: 'Culture', value: 'museum' },
  { label: 'Shopping', value: 'shopping_mall' },
  { label: 'Library', value: 'library' },
];
