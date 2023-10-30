'use client'
import React, { useState, useEffect } from 'react';

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const userConsent = localStorage.getItem('cookieConsent');

    if (!userConsent) {
      // Use setTimeout to delay the appearance of the banner
      const timeout = setTimeout(() => {
        setVisible(true); // Set visibility to true after the specified delay
      }, 500); // Specify the delay time in milliseconds (e.g., 500ms)

      return () => clearTimeout(timeout); // Clear the timeout to avoid memory leaks
    } else {
      setVisible(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false); // Hide the banner after the user accepts
  };

  if(!visible){
    return null
  }
  
  return (
    <div
      className={`z-50 fixed bottom-0 w-full p-4 flex max-sm:flex-col items-center justify-between text-white transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none' // Use opacity for smoother transition
      }`}
      style={{ backgroundColor: '#374151' }}
    >
      <p className="max-sm:p-2 text-center">This dapp uses cookies to enhance the user experience.</p>
      <button
        onClick={handleAccept}
        className="transition-all hover:scale-[1.02] active:scale-[0.95] bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-black rounded px-4 py-2"
      >
        I Understand
      </button>
    </div>
  );
};

export default CookieConsentBanner;