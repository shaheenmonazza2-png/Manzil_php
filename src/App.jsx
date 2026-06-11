// src/App.jsx

import React, { useState, useEffect } from 'react';
import { hotelsData } from './hotelsData';
import { premiumStyles as styles } from './theme';

// Hardcoded fake guest reviews for each hotel to enhance immersion
const mockReviews = {
  1: [ { user: "Aarav M.", text: "Absolutely phenomenal butler service. Worth every single rupee." }, { user: "Priya S.", text: "The ocean views from the grand palace suite are stunning." } ],
  2: [ { user: "Kabir D.", text: "Pure paradise. The private beach access was magnificent." } ],
  3: [ { user: "Neha Sharma", text: "Stunning historic Mughal architecture mixed with peak modern luxury." } ],
  4: [ { user: "Rohan V.", text: "Snowy balcony views and warm cozy fireplaces. Loved the suite!" } ]
};

function App() {
  // --- Core States ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  // New State: Price Filtering Tag (All, Premium, Ultra-Luxury)
  const [priceTier, setPriceTier] = useState('All');
  
  // Auth & Payment Portal Flow States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [roomCount, setRoomCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // --- 3-Second Automatic Slider Loop ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % hotelsData.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // --- Filter and Search Mechanics ---
  const executeSearchAndFilter = (locationValue, tierValue) => {
    let results = hotelsData;

    // Filter by location if something is typed
    if (locationValue.trim()) {
      results = results.filter(hotel => 
        hotel.location.toLowerCase().includes(locationValue.toLowerCase())
      );
    }

    // Filter by Tier (Ultra Luxury is > 10,000 INR, Premium is <= 10,000 INR)
    if (tierValue === 'Ultra-Luxury') {
      results = results.filter(hotel => hotel.pricePerNight > 10000);
    } else if (tierValue === 'Premium Stays') {
      results = results.filter(hotel => hotel.pricePerNight <= 10000);
    }

    setFilteredHotels(results);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) {
      alert("Please specify a location.");
      return;
    }
    executeSearchAndFilter(searchLocation, priceTier);
    setHasSearched(true);
  };

  const handleTierChange = (newTier) => {
    setPriceTier(newTier);
    if (hasSearched || searchLocation.trim()) {
      executeSearchAndFilter(searchLocation, newTier);
      setHasSearched(true);
    }
  };

  // --- Sequential Booking Flow ---
  const handleBookClick = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true); // Step 1: Force User Login
    } else {
      setShowPaymentModal(true); // Step 2: Proceed to Checkout
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (authForm.email && authForm.password) {
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setShowPaymentModal(true); // Open payment right after login completes
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setShowPaymentModal(false);
    setBookingSuccess(true); // Final Step: Display success celebration!
  };

  return (
    <div style={styles.appContainer}>
      
      {/* 1. Classy Navbar Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src="/manzil logo.jpg" alt="Manzil Logo" style={styles.logoImage} />
          <h1 style={styles.logoText}>MANZIL</h1>
        </div>
        
        {isLoggedIn ? (
          <span style={styles.userBadge}>Welcome back, Member ✨</span>
        ) : (
          <button style={styles.loginNavBtn} onClick={() => setShowAuthModal(true)}>Sign In</button>
        )}
      </header>

      {/* 2. Auto-Sliding Image Banner & Italicized Catchy Phrase */}
      <div style={styles.heroWrapper}>
        <div 
          style={{
            ...styles.heroSlide,
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(5,11,20,1)), url(${hotelsData[currentSlide].image})`
          }}
        >
          <div style={styles.heroContent}>
            <p style={styles.tagline}>book your stay. Find your Manzil</p>
          </div>
        </div>
      </div>

      {/* 3. Luxury Search Parameters & Tier Filters */}
      <div style={styles.searchSection}>
        <form onSubmit={handleSearchSubmit} style={styles.searchBar}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Where to?</label>
            <input 
              type="text" placeholder="e.g., Mumbai, Goa, Delhi" value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)} style={styles.input} required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Check-in</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Check-out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Guests</label>
            <div style={styles.guestInputs}>
              <input 
                type="number" min="1" value={guests.adults}
                onChange={(e) => setGuests({...guests, adults: parseInt(e.target.value) || 1})}
                style={{...styles.input, width: '45px'}}
              />
              <span style={{color: '#d4af37', alignSelf:'center', fontSize:'12px'}}>Adt</span>
              <input 
                type="number" min="0" value={guests.children}
                onChange={(e) => setGuests({...guests, children: parseInt(e.target.value) || 0})}
                style={{...styles.input, width: '45px', marginLeft: '5px'}}
              />
              <span style={{color: '#d4af37', alignSelf:'center', fontSize:'12px'}}>Chd</span>
            </div>
          </div>
          <button type="submit" style={styles.searchButton}>Discover</button>
        </form>

        {/* Dynamic Category Tiers Selection */}
        <div style={styles.filterWrapper}>
          {['All Stays', 'Premium Stays', 'Ultra-Luxury'].map((tier) => (
            <button 
              key={tier}
              onClick={() => handleTierChange(tier)}
              style={priceTier === tier ? styles.filterBtnActive : styles.filterBtn}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Database Search Results Card Grid */}
      <main style={styles.mainContent}>
        {hasSearched && (
          <div>
            <h2 style={styles.sectionTitle}>Available Luxury Stays ({priceTier})</h2>
            {filteredHotels.length === 0 ? (
              <p style={styles.noResults}>No properties found fitting your current parameters. Try adjusting your query.</p>
            ) : (
              <div style={styles.resultsGrid}>
                {filteredHotels.map((hotel) => (
                  <div key={hotel.id} style={styles.hotelCard} onClick={() => { setSelectedHotel(hotel); setRoomCount(1); setBookingSuccess(false); }}>
                    <img src={hotel.image} alt={hotel.name} style={styles.cardImage} />
                    <div style={styles.cardBody}>
                      <div style={styles.cardHeaderRow}>
                        <h3 style={styles.hotelName}>{hotel.name}</h3>
                        <span style={styles.ratingBadge}>★ {hotel.rating}</span>
                      </div>
                      <p style={styles.hotelLocation}>📍 {hotel.location}</p>
                      <p style={styles.hotelPrice}>₹{hotel.pricePerNight.toLocaleString('en-IN')} <span style={styles.perNight}>/ night</span></p>
                      <button style={styles.viewDetailsBtn}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Detailed Hotel Pop-up with Guest Reviews & Increment Controls */}
      {selectedHotel && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.closeModalBtn} onClick={() => setSelectedHotel(null)}>✕</button>
            <img src={selectedHotel.image} alt={selectedHotel.name} style={styles.modalImage} />
            
            <div style={styles.modalBody}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.modalHotelName}>{selectedHotel.name}</h2>
                <span style={styles.modalRating}>★ {selectedHotel.rating}</span>
              </div>
              <p style={styles.modalDescription}>{selectedHotel.description}</p>
              <p style={styles.roomTypeInfo}>✨ <strong>Room Option:</strong> Signature Premium Luxury King Suite</p>
              
              {/* Reviews Integration */}
              <div style={styles.reviewsContainer}>
                <h4 style={styles.reviewTitle}>WELCOME😌</h4>
                {(mockReviews[selectedHotel.id] || []).map((rev, idx) => (
                  <div key={idx} style={styles.reviewItem}>
                    <strong>{rev.user}:</strong> "{rev.text}"
                  </div>
                ))}
              </div>

              <hr style={styles.divider} />
              
              <div style={styles.bookingControls}>
                <div style={styles.counterSection}>
                  <span style={styles.counterLabel}>Select Rooms:</span>
                  <div style={styles.counterInterface}>
                    <button style={styles.counterBtn} onClick={() => setRoomCount(prev => Math.max(1, prev - 1))} disabled={bookingSuccess}>-</button>
                    <span style={styles.counterValue}>{roomCount}</span>
                    <button style={styles.counterBtn} onClick={() => setRoomCount(prev => prev + 1)} disabled={bookingSuccess}>+</button>
                  </div>
                </div>
                <div style={styles.priceCalculation}>
                  <p style={styles.totalPriceLabel}>Total Pricing</p>
                  <p style={styles.totalPriceValue}>₹{(selectedHotel.pricePerNight * roomCount).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div style={styles.successMessage}>
                  <strong>your room is booked 🤩🎊</strong>
                </div>
              ) : (
                <button style={styles.bookNowBtn} onClick={handleBookClick}>
                  {isLoggedIn ? "Proceed to Secure Checkout" : "Sign In to Book Stay"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Step 1 Gate: Sign In Modal */}
      {showAuthModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.authModal}>
            <button style={styles.closeModalBtn} onClick={() => setShowAuthModal(false)}>✕</button>
            <h2 style={styles.authTitle}>Access Your Manzil</h2>
            <p style={styles.authSubtitle}>Please sign in to your elite account to reserve suites.</p>
            
            <form onSubmit={handleLoginSubmit} style={styles.authForm}>
              <input 
                type="email" placeholder="Email Address" required value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})} style={styles.authInput}
              />
              <input 
                type="password" placeholder="Password" required value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})} style={styles.authInput}
              />
              <button type="submit" style={styles.authSubmitBtn}>Login & Verify</button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Step 2 Gate: Luxury Payment Form Modal */}
      {showPaymentModal && selectedHotel && (
        <div style={styles.modalOverlay}>
          <div style={styles.authModal}>
            <button style={styles.closeModalBtn} onClick={() => setShowPaymentModal(false)}>✕</button>
            <h2 style={styles.authTitle}>Secure Checkout</h2>
            <p style={styles.authSubtitle}>Finalize your payment of <strong>₹{(selectedHotel.pricePerNight * roomCount).toLocaleString('en-IN')}</strong></p>
            
            <form onSubmit={handlePaymentSubmit} style={styles.authForm}>
              <input type="text" placeholder="Cardholder Name" required style={styles.authInput} />
              <input type="text" placeholder="Card Number (#### #### #### ####)" maxLength="19" required style={styles.authInput} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="MM/YY" maxLength="5" required style={{...styles.authInput, flex: 1}} />
                <input type="password" placeholder="CVV" maxLength="3" required style={{...styles.authInput, flex: 1}} />
              </div>
              <button type="submit" style={styles.authSubmitBtn}>Authorize Payment</button>
            </form>
          </div>
        </div>
      )}

      {/* 8. Fully Customized Elegant Corporate Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerHeading}>Manzil Luxury Stays</h3>
            <p style={styles.footerText}>Curating world-class elite hospitality experiences across premium destinations in India.</p>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerHeading}>Customer Care</h3>
            <p style={styles.footerText}>📞 <strong>Phone:</strong> 1122334567</p>
            <p style={styles.footerText}>✉️ <strong>Email:</strong> manzil@gmail.com</p>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerHeading}>Corporate</h3>
            <p style={styles.footerText}> Developed by **SJEML group**.</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          © 2026 MANZIL INC. ALL RIGHTS RESERVED.
          *made for practice*
        </div>
      </footer>

    </div>
  );
}

export default App;