/**
 * UK Cities with coordinates for mapping
 * Based on Turo's main marketed cities plus additional locations
 */

export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export const UK_CITIES: City[] = [
  // Major Cities (A-C)
  { name: 'Aberdeen', latitude: 57.1497, longitude: -2.0943 },
  { name: 'Bath', latitude: 51.3758, longitude: -2.3599 },
  { name: 'Belfast', latitude: 54.5973, longitude: -5.9301 },
  { name: 'Birmingham', latitude: 52.4862, longitude: -1.8904 },
  { name: 'Blackpool', latitude: 53.8175, longitude: -3.0357 },
  { name: 'Bolton', latitude: 53.5785, longitude: -2.4292 },
  { name: 'Bradford', latitude: 53.8008, longitude: -1.7591 },
  { name: 'Brighton', latitude: 50.8225, longitude: -0.1372 },
  { name: 'Bristol', latitude: 51.4545, longitude: -2.5879 },
  { name: 'Burnley', latitude: 53.7893, longitude: -2.2405 },
  { name: 'Cambridge', latitude: 52.2053, longitude: 0.1218 },
  { name: 'Canterbury', latitude: 51.2802, longitude: 1.0789 },
  { name: 'Cardiff', latitude: 51.4816, longitude: -3.1791 },
  { name: 'Chester', latitude: 53.1910, longitude: -2.8950 },
  { name: 'Colchester', latitude: 51.8959, longitude: 0.8919 },
  { name: 'Coventry', latitude: 52.4068, longitude: -1.5197 },
  { name: 'Croydon', latitude: 51.3762, longitude: -0.0982 },
  
  // D-G
  { name: 'Derby', latitude: 52.9225, longitude: -1.4746 },
  { name: 'Doncaster', latitude: 53.5228, longitude: -1.1289 },
  { name: 'Dundee', latitude: 56.4620, longitude: -2.9707 },
  { name: 'Edinburgh', latitude: 55.9533, longitude: -3.1883 },
  { name: 'Exeter', latitude: 50.7184, longitude: -3.5339 },
  { name: 'Glasgow', latitude: 55.8642, longitude: -4.2518 },
  { name: 'Gloucester', latitude: 51.8642, longitude: -2.2382 },
  { name: 'Grimsby', latitude: 53.5654, longitude: -0.0755 },
  
  // H-L
  { name: 'Halifax', latitude: 53.7210, longitude: -1.8578 },
  { name: 'Hartlepool', latitude: 54.6917, longitude: -1.2129 },
  { name: 'Hemel Hempstead', latitude: 51.7537, longitude: -0.4693 },
  { name: 'Huddersfield', latitude: 53.6458, longitude: -1.7850 },
  { name: 'Hull', latitude: 53.7676, longitude: -0.3274 },
  { name: 'Ipswich', latitude: 52.0567, longitude: 1.1482 },
  { name: 'Kingston upon Hull', latitude: 53.7676, longitude: -0.3274 },
  { name: 'Lancaster', latitude: 54.0466, longitude: -2.8007 },
  { name: 'Leeds', latitude: 53.8008, longitude: -1.5491 },
  { name: 'Leicester', latitude: 52.6369, longitude: -1.1398 },
  { name: 'Liverpool', latitude: 53.4084, longitude: -2.9916 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  
  // M-P
  { name: 'Maidstone', latitude: 51.2704, longitude: 0.5227 },
  { name: 'Manchester', latitude: 53.4808, longitude: -2.2426 },
  { name: 'Mansfield', latitude: 53.1424, longitude: -1.1986 },
  { name: 'Middlesbrough', latitude: 54.5742, longitude: -1.2350 },
  { name: 'Newcastle', latitude: 54.9783, longitude: -1.6178 },
  { name: 'Newport', latitude: 51.5841, longitude: -2.9977 },
  { name: 'Northampton', latitude: 52.2405, longitude: -0.9027 },
  { name: 'Norwich', latitude: 52.6309, longitude: 1.2974 },
  { name: 'Nottingham', latitude: 52.9548, longitude: -1.1581 },
  { name: 'Oldham', latitude: 53.5409, longitude: -2.1114 },
  { name: 'Oxford', latitude: 51.7520, longitude: -1.2577 },
  { name: 'Paisley', latitude: 55.8473, longitude: -4.4401 },
  { name: 'Peterborough', latitude: 52.5695, longitude: -0.2405 },
  { name: 'Plymouth', latitude: 50.3755, longitude: -4.1427 },
  { name: 'Poole', latitude: 50.7150, longitude: -1.9872 },
  { name: 'Portsmouth', latitude: 50.8198, longitude: -1.0880 },
  { name: 'Preston', latitude: 53.7632, longitude: -2.7031 },
  
  // R-S
  { name: 'Reading', latitude: 51.4543, longitude: -0.9781 },
  { name: 'Rotherham', latitude: 53.4301, longitude: -1.3569 },
  { name: 'Runcorn', latitude: 53.3417, longitude: -2.7312 },
  { name: 'Salford', latitude: 53.4875, longitude: -2.2901 },
  { name: 'Sheffield', latitude: 53.3811, longitude: -1.4701 },
  { name: 'Slough', latitude: 51.5105, longitude: -0.5950 },
  { name: 'Southampton', latitude: 50.9097, longitude: -1.4044 },
  { name: 'Southport', latitude: 53.6478, longitude: -3.0065 },
  { name: 'Southend-on-Sea', latitude: 51.5459, longitude: 0.7077 },
  { name: 'Stevenage', latitude: 51.9017, longitude: -0.2026 },
  { name: 'Stockport', latitude: 53.4106, longitude: -2.1575 },
  { name: 'Stockton-on-Tees', latitude: 54.5685, longitude: -1.3142 },
  { name: 'Stoke-on-Trent', latitude: 53.0258, longitude: -2.1774 },
  { name: 'St Albans', latitude: 51.7519, longitude: -0.3369 },
  { name: 'Sutton', latitude: 51.3614, longitude: -0.1936 },
  { name: 'Swansea', latitude: 51.6214, longitude: -3.9436 },
  { name: 'Swindon', latitude: 51.5558, longitude: -1.7797 },
  
  // T-W
  { name: 'Telford', latitude: 52.6784, longitude: -2.4453 },
  { name: 'Wakefield', latitude: 53.6833, longitude: -1.5057 },
  { name: 'Walsall', latitude: 52.5862, longitude: -1.9829 },
  { name: 'Warrington', latitude: 53.3900, longitude: -2.5970 },
  { name: 'Westminster', latitude: 51.4975, longitude: -0.1357 },
  { name: 'Wigan', latitude: 53.5450, longitude: -2.6375 },
  { name: 'Woking', latitude: 51.3168, longitude: -0.5600 },
  { name: 'Wolverhampton', latitude: 52.5862, longitude: -2.1288 },
  { name: 'Worcester', latitude: 52.1920, longitude: -2.2200 },
  { name: 'Worthing', latitude: 50.8179, longitude: -0.3728 },
  
  // Y-Z
  { name: 'Yeovil', latitude: 50.9414, longitude: -2.6321 },
  { name: 'York', latitude: 53.9600, longitude: -1.0873 },
];

/**
 * Get city coordinates by name
 */
export function getCityCoordinates(cityName: string): City | undefined {
  return UK_CITIES.find(
    city => city.name.toLowerCase() === cityName.toLowerCase()
  );
}

/**
 * Get all city names
 */
export function getAllCityNames(): string[] {
  return UK_CITIES.map(city => city.name);
}

/**
 * Search cities by name (case-insensitive)
 */
export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase();
  return UK_CITIES.filter(city =>
    city.name.toLowerCase().includes(lowerQuery)
  );
}

