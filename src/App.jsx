import React, { useState } from 'react';
import { hotelsData } from './hoteldata'; // Matches your export const hotelsData
import './App.css';

export default function App() {
  const [searchLocation, setSearchLocation] = useState('');
  const [hotels, setHotels] = useState(hotelsData);

  // Handle live search filtering by location or hotel name
  const handleFilter = (locationInput) => {
    setSearchLocation(locationInput);
    let filtered = hotelsData;

    if (locationInput.trim() !== '') {
      filtered = filtered.filter(h => 
        h.location.toLowerCase().includes(locationInput.toLowerCase()) ||
        h.name.toLowerCase().includes(locationInput.toLowerCase())
      );
    }

    setHotels(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header / Hero Section */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12 px-6 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-2">Manzil | Luxury Stays</h1>
        <p className="text-lg opacity-90 mb-6">Find Your Perfect Stay, Experience Your Masterpiece</p>
        
        {/* Search Bar Input */}
        <div className="max-w-xl mx-auto flex bg-white rounded-lg shadow-lg overflow-hidden p-2">
          <input 
            type="text" 
            placeholder="Search by city (e.g. Mumbai, Goa, Kolkata)..." 
            value={searchLocation}
            onChange={(e) => handleFilter(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 focus:outline-none"
          />
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-semibold mb-6">Exclusive Luxury Properties ({hotels.length})</h2>

        {hotels.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No hotels found matching your search. Try searching another location!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"; }}
                  />
                  <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    ★ {hotel.rating}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                  </div>
                  <p className="text-sm text-indigo-600 font-medium mb-3">📍 {hotel.location}</p>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{hotel.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-bold text-gray-900">₹{hotel.pricePerNight.toLocaleString()}</span>
                      <span className="text-xs text-gray-500"> / night</span>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}