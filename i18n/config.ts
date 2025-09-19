import { I18n } from 'i18n-js';
import { getLocales, getCalendars, getTimeZone } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';

export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    isRTL: false,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    isRTL: false,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    isRTL: false,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    isRTL: false,
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isRTL: false,
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    isRTL: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
  },
];

// Create i18n instance
export const i18n = new I18n({
  en,
  es,
  fr,
  de,
  ja,
  ar,
});

// Configuration
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Storage key for user preference
const LOCALE_STORAGE_KEY = 'user_locale';

export class LocaleManager {
  private static instance: LocaleManager;
  private currentLocale: string = 'en';
  private listeners: Array<(locale: string) => void> = [];

  static getInstance(): LocaleManager {
    if (!LocaleManager.instance) {
      LocaleManager.instance = new LocaleManager();
    }
    return LocaleManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Try to get saved user preference first
      const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
      
      if (savedLocale && this.isValidLocale(savedLocale)) {
        this.setLocale(savedLocale);
        return;
      }

      // Fall back to device locale
      const deviceLocales = getLocales();
      const deviceLocale = deviceLocales[0]?.languageCode || 'en';
      
      // Find best match for device locale
      const matchedLocale = this.findBestLocaleMatch(deviceLocale);
      this.setLocale(matchedLocale);
      
    } catch (error) {
      console.warn('Failed to initialize locale, using default:', error);
      this.setLocale('en');
    }
  }

  private isValidLocale(locale: string): boolean {
    return SUPPORTED_LOCALES.some(config => config.code === locale);
  }

  private findBestLocaleMatch(deviceLocale: string): string {
    // Try exact match first
    if (this.isValidLocale(deviceLocale)) {
      return deviceLocale;
    }

    // Try language code match (e.g., 'en-US' -> 'en')
    const languageCode = deviceLocale.split('-')[0];
    if (this.isValidLocale(languageCode)) {
      return languageCode;
    }

    // Default fallback
    return 'en';
  }

  async setLocale(locale: string): Promise<void> {
    if (!this.isValidLocale(locale)) {
      console.warn(`Invalid locale: ${locale}, falling back to 'en'`);
      locale = 'en';
    }

    this.currentLocale = locale;
    i18n.locale = locale;

    // Save user preference
    try {
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch (error) {
      console.warn('Failed to save locale preference:', error);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(locale));
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  getCurrentLocaleConfig(): LocaleConfig {
    return SUPPORTED_LOCALES.find(config => config.code === this.currentLocale) || SUPPORTED_LOCALES[0];
  }

  getSupportedLocales(): LocaleConfig[] {
    return SUPPORTED_LOCALES;
  }

  isRTL(): boolean {
    const config = this.getCurrentLocaleConfig();
    return config.isRTL;
  }

  addLocaleChangeListener(listener: (locale: string) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get system information for debugging
  getSystemInfo() {
    return {
      deviceLocales: getLocales(),
      calendar: getCalendars(),
      timeZone: getTimeZone(),
      currentLocale: this.currentLocale,
      isRTL: this.isRTL(),
    };
  }
}

export default LocaleManager.getInstance();