import { useState, useEffect } from 'react';
import { i18n } from '@/i18n/config';
import LocaleManager from '@/i18n/config';

interface TranslationOptions {
  count?: number;
  [key: string]: any;
}

export function useTranslation() {
  const [locale, setLocale] = useState(LocaleManager.getCurrentLocale());

  useEffect(() => {
    const unsubscribe = LocaleManager.addLocaleChangeListener((newLocale) => {
      setLocale(newLocale);
    });

    return unsubscribe;
  }, []);

  const t = (key: string, options?: TranslationOptions) => {
    try {
      return i18n.t(key, options);
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`, error);
      
      // Return the key as fallback, formatted nicely
      const fallback = key.split('.').pop() || key;
      return fallback.charAt(0).toUpperCase() + fallback.slice(1);
    }
  };

  const exists = (key: string): boolean => {
    try {
      const translation = i18n.t(key);
      return translation !== key && !translation.includes('missing translation');
    } catch {
      return false;
    }
  };

  return {
    t,
    exists,
    locale,
    isRTL: LocaleManager.isRTL(),
  };
}

// Hook for accessing locale-specific formatting
export function useLocaleFormatting() {
  const [locale, setLocale] = useState(LocaleManager.getCurrentLocale());

  useEffect(() => {
    const unsubscribe = LocaleManager.addLocaleChangeListener((newLocale) => {
      setLocale(newLocale);
    });

    return unsubscribe;
  }, []);

  const formatters = {
    date: (date: Date | string, format?: string) => {
      const LocalizedFormatter = require('@/i18n/formatters').default;
      return LocalizedFormatter.formatDate(date, format);
    },
    
    time: (date: Date | string, use24Hour?: boolean) => {
      const LocalizedFormatter = require('@/i18n/formatters').default;
      return LocalizedFormatter.formatTime(date, use24Hour);
    },
    
    number: (number: number, options?: Intl.NumberFormatOptions) => {
      const LocalizedFormatter = require('@/i18n/formatters').default;
      return LocalizedFormatter.formatNumber(number, options);
    },
    
    currency: (amount: number, currency: string = 'USD') => {
      const LocalizedFormatter = require('@/i18n/formatters').default;
      return LocalizedFormatter.formatCurrency(amount, currency);
    },
    
    duration: (minutes: number) => {
      const LocalizedFormatter = require('@/i18n/formatters').default;
      return LocalizedFormatter.formatDuration(minutes);
    },
    
    frequency: (frequency: number) => {
      const LocalizedFormatter = require('@/i18n/formatters').default;
      return LocalizedFormatter.formatFrequency(frequency);
    }
  };

  return {
    ...formatters,
    locale,
    isRTL: LocaleManager.isRTL(),
  };
}

// Hook for managing locale changes
export function useLocale() {
  const [currentLocale, setCurrentLocale] = useState(LocaleManager.getCurrentLocale());
  const [isRTL, setIsRTL] = useState(LocaleManager.isRTL());

  useEffect(() => {
    const unsubscribe = LocaleManager.addLocaleChangeListener((newLocale) => {
      setCurrentLocale(newLocale);
      setIsRTL(LocaleManager.isRTL());
    });

    return unsubscribe;
  }, []);

  const changeLocale = async (locale: string) => {
    await LocaleManager.setLocale(locale);
  };

  const supportedLocales = LocaleManager.getSupportedLocales();
  const currentLocaleConfig = LocaleManager.getCurrentLocaleConfig();

  return {
    currentLocale,
    isRTL,
    supportedLocales,
    currentLocaleConfig,
    changeLocale,
  };
}