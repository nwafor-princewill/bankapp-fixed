"use client";
import React, { useEffect, useState } from 'react';

const ForexTicker = () => {
  const [forexData, setForexData] = useState([
    { pair: "EUR/USD", price: 1.08, change: 0 },
    { pair: "GBP/USD", price: 1.26, change: 0 },
    { pair: "USD/JPY", price: 151.50, change: 0 },
    { pair: "USD/CAD", price: 1.36, change: 0 },
    { pair: "AUD/USD", price: 0.66, change: 0 },
    { pair: "USD/CHF", price: 0.91, change: 0 },
    { pair: "NZD/USD", price: 0.60, change: 0 },
    { pair: "USD/CNY", price: 7.24, change: 0 }
  ]);

  useEffect(() => {
    const fetchForexData = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/c967c06350a885894fc6a855/latest/USD`
        );
        const data = await res.json();
        
        setForexData(prev => prev.map(item => {
          const baseCurrency = item.pair.split('/')[0];
          const targetCurrency = item.pair.split('/')[1];
          let rate;
          
          if (baseCurrency === "USD") {
            rate = data.conversion_rates[targetCurrency];
          } else {
            rate = 1 / data.conversion_rates[baseCurrency];
          }

          const change = ((rate - item.price) / item.price) * 100;
          return { ...item, price: rate, change };
        }));
      } catch (error) {
        console.log("Using simulated data");
        simulateData();
      }
    };

    const simulateData = () => {
      setForexData(prev => prev.map(item => {
        const change = (Math.random() * 0.2 - 0.1);
        return {
          ...item,
          price: item.price * (1 + change/100),
          change
        };
      }));
    };

    fetchForexData();
    const interval = setInterval(fetchForexData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#03305c] py-3 border-t-2 border-[#e8742c] overflow-hidden">
      <div className="max-w-full mx-auto">
        <div className="flex overflow-x-hidden whitespace-nowrap">
          <div className="inline-flex animate-marquee">
            {forexData.map((item, index) => (
              <div 
                key={`${item.pair}-${index}`}
                className="flex items-center px-6 py-2 ticker-item"
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
          {/* Duplicate for seamless looping */}
          <div className="inline-flex animate-marquee" aria-hidden="true">
            {forexData.map((item, index) => (
              <div 
                key={`${item.pair}-dup-${index}`}
                className="flex items-center px-6 py-2 ticker-item"
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
    </div>
  );
};

export default ForexTicker;