'use client';

import { useEffect, useState } from 'react';

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  className?: string;
  showPlusSign?: boolean;
  showMinusSign?: boolean;
}

const CURRENCY_FORMATS: Record<string, { locale: string, symbol: string }> = {
  USD: { locale: 'en-US', symbol: '$' },
  EUR: { locale: 'de-DE', symbol: '€' },
  GBP: { locale: 'en-GB', symbol: '£' },
  JPY: { locale: 'ja-JP', symbol: '¥' },
  CAD: { locale: 'en-CA', symbol: 'CA$' },
  AUD: { locale: 'en-AU', symbol: 'A$' },
  CHF: { locale: 'de-CH', symbol: 'CHF' },
  CNY: { locale: 'zh-CN', symbol: '¥' },
  // Additional 12 currencies
  INR: { locale: 'en-IN', symbol: '₹' },
  KRW: { locale: 'ko-KR', symbol: '₩' },
  BRL: { locale: 'pt-BR', symbol: 'R$' },
  MXN: { locale: 'es-MX', symbol: 'MX$' },
  SGD: { locale: 'en-SG', symbol: 'S$' },
  HKD: { locale: 'en-HK', symbol: 'HK$' },
  SEK: { locale: 'sv-SE', symbol: 'kr' },
  NOK: { locale: 'nb-NO', symbol: 'kr' },
  ZAR: { locale: 'en-ZA', symbol: 'R' },
  RUB: { locale: 'ru-RU', symbol: '₽' },
  TRY: { locale: 'tr-TR', symbol: '₺' },
  NGN: { locale: 'en-NG', symbol: '₦' }
};

export default function CurrencyDisplay({ 
  amount, 
  currency, 
  className = '',
  showPlusSign = false,
  showMinusSign = false
}: CurrencyDisplayProps) {
  const [formattedAmount, setFormattedAmount] = useState('');

  useEffect(() => {
    const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.USD;
    let formatted = new Intl.NumberFormat(format.locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
    
    if ((showPlusSign && amount > 0) || (showMinusSign && amount < 0)) {
      const sign = amount >= 0 ? '+' : '-';
      formatted = `${sign} ${formatted}`;
    }
    
    setFormattedAmount(formatted);
  }, [amount, currency, showPlusSign, showMinusSign]);

  return <span className={className}>{formattedAmount}</span>;
}