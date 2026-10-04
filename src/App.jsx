import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hotels, setHotels] = useState([]);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  // Booking form state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Customer details state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const API_URL = 'http://localhost/manzil/api.php';

  const fetchHotels = async (searchLoc = location, searchCat = category) => {
    try {
      const res = await fetch(`${API_URL}?action=get_hotels&location=${encodeURIComponent(searchLoc)}&category=${encodeURIComponent(searchCat)}`);
      const data = await res.json();
      setHotels(data);
    } catch (e) {
      console.error("Failed to fetch hotels from PHP backend:", e);
    }
  };

  useEffect(() => {
    fetchHotels(location, category);
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHotels(location, category);
    document.getElementById('hotel-listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (catName) => {
    setCategory(catName);
    fetchHotels(location, catName);
    document.getElementById('hotel-listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const bookingPayload = {
      fullName, email, phone, password,
      hotelId: selectedHotel.id,
      checkIn: checkIn || new Date().toISOString().split('T')[0],
      checkOut: checkOut || new Date().toISOString().split('T')[0],
      adults, children,
      totalPrice: selectedHotel.price_per_night,
      paymentMethod
    };

    try {
      const res = await fetch(`${API_URL}?action=book_hotel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      const result = await res.json();
      alert(result.message);
      if (result.status === 'success') {
        setSelectedHotel(null);
      }
    } catch (e) {
      alert('Error connecting to backend API.');
    }
  };

  return (
    <div className="app-container">
      <div className="promo-bar">
        ✨ Exclusive Deal: Save up to <span>25% OFF</span> on your next luxury stay with MANZIL!
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="brand-logo" onClick={() => handleNavClick('All')}>
          <i className="fa-solid fa-hotel"></i> Manzil
        </div>
        <ul className="nav-links">
          <li className={category === 'All' ? 'active' : ''} onClick={() => handleNavClick('All')}>Home</li>
          <li className={category === 'Luxury' ? 'active' : ''} onClick={() => handleNavClick('Luxury')}>Luxury Rooms</li>
          <li className={category === 'Premium' ? 'active' : ''} onClick={() => handleNavClick('Premium')}>Premium Rooms</li>
          <li onClick={() => document.getElementById('occasions')?.scrollIntoView({behavior:'smooth'})}>Special Occasions</li>
        </ul>
      </nav>

      {/* Hero Banner */}
      <header className="hero-section">
        <h1>Find Your Stay, Find Your Manzil</h1>
        <p>Discover heritage palaces, luxury villas, and scenic resorts across India.</p>
      </header>

      {/* Search Filter Box */}
      <div className="search-container">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <div className="form-group">
            <label><i className="fa-solid fa-location-dot"></i> Destination</label>
            <input type="text" placeholder="City or Region" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="form-group">
            <label><i className="fa-solid fa-calendar"></i> Check-In</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="form-group">
            <label><i className="fa-solid fa-calendar-check"></i> Check-Out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="form-group">
            <label><i className="fa-solid fa-user"></i> Adults</label>
            <select value={adults} onChange={(e) => setAdults(e.target.value)}>
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
            </select>
          </div>
          <button type="submit" className="btn-search"><i className="fa-solid fa-magnifying-glass"></i> Search</button>
        </form>
      </div>

      {/* Marquee Banner */}
      <section className="marquee-section">
        <h2 className="section-title">Trending Stays Across India</h2>
        <div className="marquee-container">
          <div className="marquee-card"><img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" /><div className="info">Taj Palace, Mumbai</div></div>
          <div className="marquee-card"><img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" /><div className="info">Oberoi Amarvilas, Agra</div></div>
          <div className="marquee-card"><img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" /><div className="info">Kumarakom Resort, Kerala</div></div>
          <div className="marquee-card"><img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" /><div className="info">The Elgin, Darjeeling</div></div>
        </div>
      </section>

      {/* Hotel Listings Grid */}
      <main className="main-container" id="hotel-listings">
        <h2 className="section-title">{category === 'All' ? 'Featured Accommodations' : `${category} Accommodations`}</h2>
        <div className="hotel-grid">
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                {hotel.discount_percent > 0 && <div className="badge-discount">{hotel.discount_percent}% OFF</div>}
                <img src={hotel.image_url} alt={hotel.name} />
                <div className="hotel-content">
                  <div className="hotel-meta">
                    <span><i className="fa-solid fa-location-pin" style={{color:'#ff2a74'}}></i> {hotel.city}, {hotel.region}</span>
                    <span className="rating"><i className="fa-solid fa-star"></i> {hotel.rating}</span>
                  </div>
                  <h3>{hotel.name}</h3>
                  <p className="hotel-desc">{hotel.description}</p>
                  <div className="price-row">
                    <div className="price">₹{Number(hotel.price_per_night).toLocaleString('en-IN')} <span>/ night</span></div>
                    <button className="btn-book" onClick={() => setSelectedHotel(hotel)}>Book Now</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No accommodations found matching your search destination.</p>
          )}
        </div>
      </main>

      {/* Booking & Payment Modal */}
      {selectedHotel && (
        <div className="modal-overlay">
          <div className="modal-card">
            <span className="close-btn" onClick={() => setSelectedHotel(null)}>&times;</span>
            <h3>Book {selectedHotel.name}</h3>
            <p>Enter your details and select your payment mode to complete reservation.</p>
            <form className="modal-form" onSubmit={handleBookingSubmit}>
              <input type="text" placeholder="Full Name" required value={fullName} onChange={(e)=>setFullName(e.target.value)} />
              <input type="email" placeholder="Email Address" required value={email} onChange={(e)=>setEmail(e.target.value)} />
              <input type="tel" placeholder="Phone Number" required value={phone} onChange={(e)=>setPhone(e.target.value)} />
              <input type="password" placeholder="Create Password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
              
              <label className="payment-label">Select Payment Mode:</label>
              <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Credit/Debit Card">Credit / Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Pay at Hotel">Pay at Hotel (Cash / Card on Arrival)</option>
              </select>

              <button type="submit" className="btn-submit">
                Confirm Reservation (₹{Number(selectedHotel.price_per_night).toLocaleString('en-IN')})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Special Occasions Section */}
      <section className="occasions-section" id="occasions">
        <h2 className="section-title" style={{color:'#fff'}}>Special Occasion Packages</h2>
        <p className="occasions-subtitle">Explore bespoke venues and luxury stays for your celebrations.</p>
        <div className="occasions-grid">
          <div className="occasion-card" onClick={() => alert('Enquiring for Weddings!')}>
            <i className="fa-solid fa-ring"></i>
            <h3>Weddings</h3>
            <p>Grand banquet halls & destination stay packages.</p>
          </div>
          <div className="occasion-card" onClick={() => alert('Enquiring for Birthdays!')}>
            <i className="fa-solid fa-cake-candles"></i>
            <h3>Birthdays</h3>
            <p>Private party suites & customized event setups.</p>
          </div>
          <div className="occasion-card" onClick={() => alert('Enquiring for Engagements!')}>
            <i className="fa-solid fa-wine-glass"></i>
            <h3>Engagements</h3>
            <p>Romantic arrangements with premium catering.</p>
          </div>
          <div className="occasion-card" onClick={() => alert('Enquiring for Anniversaries!')}>
            <i className="fa-solid fa-heart"></i>
            <h3>Anniversaries</h3>
            <p>Candle-light dinners and relaxing spa suites.</p>
          </div>
          <div className="occasion-card" onClick={() => alert('Enquiring for Corporate Meets!')}>
            <i className="fa-solid fa-briefcase"></i>
            <h3>Corporate Meets</h3>
            <p>Executive conference halls & team retreats.</p>
          </div>
        </div>
      </section>

      <footer>
        &copy; {new Date().getFullYear()} Manzil Booking Portal. All Rights Reserved. | Find Your Stay, Find Your Manzil.
      </footer>
    </div>
  );
}

export default App;