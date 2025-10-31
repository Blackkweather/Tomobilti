import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EmailBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [weather, setWeather] = useState<any[]>([]);

  useEffect(() => {
    // Fetch weather for 5 major UK cities
    const cities = ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow'];
    const fetchWeather = async () => {
      try {
        const weatherData = await Promise.all(
          cities.map(async (city) => {
            try {
              const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${getCoords(city).lat}&longitude=${getCoords(city).lon}&current_weather=true`
              );
              if (!response.ok) throw new Error('Weather API error');
              const data = await response.json();
              return {
                city,
                temp: Math.round(data.current_weather?.temperature || 15),
                code: data.current_weather?.weathercode || 0
              };
            } catch (error) {
              // Fallback to default temperature if API fails
              return {
                city,
                temp: 15, // Default UK temperature
                code: 0
              };
            }
          })
        );
        setWeather(weatherData);
      } catch (error) {
        // Set default temperatures if all requests fail
        if (process.env.NODE_ENV === 'development') {
          console.debug('Weather fetch error:', error);
        }
        setWeather(cities.map(city => ({ city, temp: 15, code: 0 })));
      }
    };
    fetchWeather();
  }, []);

  const getCoords = (city: string) => {
    const coords: any = {
      London: { lat: 51.5074, lon: -0.1278 },
      Manchester: { lat: 53.4808, lon: -2.2426 },
      Birmingham: { lat: 52.4862, lon: -1.8904 },
      Edinburgh: { lat: 55.9533, lon: -3.1883 },
      Glasgow: { lat: 55.8642, lon: -4.2518 }
    };
    return coords[city];
  };

  if (!isVisible) return null;

  const message = "EXCLUSIVE OFFER: 10% OFF YOUR FIRST RIDE";
  const weatherMessage = weather.length > 0 
    ? weather.map(w => `${w.city} ${w.temp}°C`).join(' | ')
    : '';

  return (
    <div className="bg-black text-white py-2.5 relative overflow-hidden">
      <div className="flex">
        <div className="flex animate-marquee whitespace-nowrap hover:pause-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-xs sm:text-sm font-bold tracking-wider mx-8 uppercase">
              {message} {weatherMessage && `| ${weatherMessage}`}
            </span>
          ))}
        </div>
        <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-xs sm:text-sm font-bold tracking-wider mx-8 uppercase">
              {message} {weatherMessage && `| ${weatherMessage}`}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors z-10 bg-black/20"
      >
        <X className="h-3 w-3" />
      </button>

        <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 140s linear infinite;
        }
        /* pause animation on hover */
        .hover\:pause-marquee:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
