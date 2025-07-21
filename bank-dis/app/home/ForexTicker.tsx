"use client";
import React, { useEffect, useState } from 'react';

const ForexTicker = () => {
  // Hardcoded fallback values (using your initial prices)
  const HARDCODED_DATA = [
    { pair: "EUR/USD", price: 1.08, change: 1.16 },
    { pair: "GBP/USD", price: 1.26, change: 1.34 },
    { pair: "USD/JPY", price: 151.50, change: 148.49 },
    { pair: "USD/CAD", price: 1.36, change: 1.37 },
    { pair: "AUD/USD", price: 0.66, change: 0.65 },
    { pair: "USD/CHF", price: 0.91, change: 0.80 },
    { pair: "NZD/USD", price: 0.60, change: 0.60 },
    { pair: "USD/CNY", price: 7.24, change: 7.18 }
  ];

  const [forexData, setForexData] = useState(HARDCODED_DATA);
  const [usingLiveData, setUsingLiveData] = useState(false);

  useEffect(() => {
    const fetchForexData = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/c967c06350a885894fc6a855/latest/USD`
        );
        
        // Check if API limit is reached
        if (res.status === 429) {
          console.log("API limit reached - using hardcoded values");
          setUsingLiveData(false);
          return;
        }

        const data = await res.json();
        
        // Critical validation to prevent "EUR undefined" error
        if (!data?.conversion_rates) {
          throw new Error("Invalid API response");
        }

        setForexData(prev => prev.map(item => {
          const [baseCurrency, targetCurrency] = item.pair.split('/');
          let rate;
          
          if (baseCurrency === "USD") {
            rate = data.conversion_rates[targetCurrency] || item.price;
          } else {
            const baseRate = data.conversion_rates[baseCurrency];
            rate = baseRate ? 1 / baseRate : item.price;
          }

          const change = ((rate - item.price) / item.price) * 100;
          return { ...item, price: rate, change };
        }));

        setUsingLiveData(true);
      } catch (error) {
        console.log("Using hardcoded data due to error:", error);
        setUsingLiveData(false);
      }
    };

    // Try fetching live data first
    fetchForexData();
    
    // Check daily if API limit has reset (instead of every minute)
    const interval = setInterval(fetchForexData, 24 * 60 * 60 * 1000); // 24 hours
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#03305c] py-3 border-t-2 border-[#e8742c] overflow-hidden">
      <div className="max-w-full mx-auto">
        {!usingLiveData && (
          <div className="text-center text-yellow-400 text-xs pb-1">
            {/* Showing static rates (API limit reached - updates automatically when available) */}
          </div>
        )}
        <div className="flex overflow-x-hidden">
          {[...forexData, ...forexData].map((item, index) => (
            <div 
              key={`${item.pair}-${index}`}
              className="flex items-center px-6 py-2 shrink-0 animate-marquee"
            >
              <span className="font-bold text-white min-w-[90px]">
                {item.pair}
              </span>
              <span className="text-white mx-3 min-w-[80px] text-right">
                {item.price.toFixed(4)}
              </span>
              <span className={`min-w-[80px] text-right ${
                item.change >= 0 ? 'text-green-400' : 'text-[#e8742c]'
              }`}>
                {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForexTicker;