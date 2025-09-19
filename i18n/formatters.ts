import { format, parseISO } from 'date-fns';
import { enUS, es, fr, de, ja, arSA } from 'date-fns/locale';
import LocaleManager from './config';

// Date-fns locale mapping
const DATE_LOCALES = {
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  ja: ja,
  ar: arSA,
};

export class LocalizedFormatter {
  private static instance: LocalizedFormatter;

  static getInstance(): LocalizedFormatter {
    if (!LocalizedFormatter.instance) {
      LocalizedFormatter.instance = new LocalizedFormatter();
    }
    return LocalizedFormatter.instance;
  }

  // Date and Time Formatting
  formatDate(date: Date | string, formatString?: string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const locale = LocaleManager.getCurrentLocale();
    const localeConfig = LocaleManager.getCurrentLocaleConfig();
    const dateLocale = DATE_LOCALES[locale as keyof typeof DATE_LOCALES] || enUS;
    
    const defaultFormat = localeConfig.dateFormat.replace(/Y/g, 'y').replace(/D/g, 'd');
    
    return format(dateObj, formatString || defaultFormat, { locale: dateLocale });
  }

  formatTime(date: Date | string, use24Hour?: boolean): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const locale = LocaleManager.getCurrentLocale();
    const localeConfig = LocaleManager.getCurrentLocaleConfig();
    const dateLocale = DATE_LOCALES[locale as keyof typeof DATE_LOCALES] || enUS;
    
    const shouldUse24Hour = use24Hour ?? localeConfig.timeFormat === '24h';
    const timeFormat = shouldUse24Hour ? 'HH:mm' : 'h:mm a';
    
    return format(dateObj, timeFormat, { locale: dateLocale });
  }

  formatDateTime(date: Date | string): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const locale = LocaleManager.getCurrentLocale();
    const now = new Date();
    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);
    
    // Use Intl.RelativeTimeFormat for modern browsers
    if (Intl.RelativeTimeFormat) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return rtf.format(-diffInMinutes, 'minute');
      } else if (diffInHours < 24) {
        return rtf.format(-Math.floor(diffInHours), 'hour');
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return rtf.format(-diffInDays, 'day');
      }
    }
    
    // Fallback for older environments
    return this.formatDate(date);
  }

  // Number Formatting
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const locale = LocaleManager.getCurrentLocale();
    
    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (error) {
      console.warn('Number formatting failed, using fallback:', error);
      return number.toString();
    }
  }

  formatDecimal(number: number, decimals: number = 2): string {
    return this.formatNumber(number, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  formatPercent(number: number, decimals: number = 1): string {
    return this.formatNumber(number / 100, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    const locale = LocaleManager.getCurrentLocale();
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (error) {
      console.warn('Currency formatting failed, using fallback:', error);
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  // Duration Formatting (for meditation sessions)
  formatDuration(minutes: number): string {
    const locale = LocaleManager.getCurrentLocale();
    
    if (minutes < 60) {
      return this.formatDurationMinutes(minutes);
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    const hourText = this.formatDurationHours(hours);
    const minuteText = remainingMinutes > 0 ? this.formatDurationMinutes(remainingMinutes) : '';
    
    return minuteText ? `${hourText} ${minuteText}` : hourText;
  }

  private formatDurationHours(hours: number): string {
    const locale = LocaleManager.getCurrentLocale();
    
    // Localized hour formatting
    const hourFormats: Record<string, string> = {
      en: hours === 1 ? 'hour' : 'hours',
      es: hours === 1 ? 'hora' : 'horas',
      fr: hours === 1 ? 'heure' : 'heures',
      de: hours === 1 ? 'Stunde' : 'Stunden',
      ja: '時間',
      ar: hours === 1 ? 'ساعة' : 'ساعات',
    };
    
    const unit = hourFormats[locale] || hourFormats.en;
    return `${hours} ${unit}`;
  }

  private formatDurationMinutes(minutes: number): string {
    const locale = LocaleManager.getCurrentLocale();
    
    // Localized minute formatting
    const minuteFormats: Record<string, string> = {
      en: minutes === 1 ? 'minute' : 'minutes',
      es: minutes === 1 ? 'minuto' : 'minutos', 
      fr: minutes === 1 ? 'minute' : 'minutes',
      de: minutes === 1 ? 'Minute' : 'Minuten',
      ja: '分',
      ar: minutes === 1 ? 'دقيقة' : 'دقائق',
    };
    
    const unit = minuteFormats[locale] || minuteFormats.en;
    return `${minutes} ${unit}`;
  }

  // Frequency Formatting (for binaural beats)
  formatFrequency(frequency: number): string {
    const locale = LocaleManager.getCurrentLocale();
    const formattedNumber = this.formatDecimal(frequency, 1);
    
    // Hz is universal, but some languages may have different spacing
    const hzFormats: Record<string, string> = {
      en: `${formattedNumber} Hz`,
      es: `${formattedNumber} Hz`,
      fr: `${formattedNumber} Hz`,
      de: `${formattedNumber} Hz`,
      ja: `${formattedNumber}Hz`, // No space in Japanese
      ar: `${formattedNumber} هرتز`, // Arabic hertz
    };
    
    return hzFormats[locale] || hzFormats.en;
  }

  // List Formatting (for achievements, features, etc.)
  formatList(items: string[]): string {
    const locale = LocaleManager.getCurrentLocale();
    
    if (Intl.ListFormat) {
      try {
        const listFormatter = new Intl.ListFormat(locale, {
          style: 'long',
          type: 'conjunction'
        });
        return listFormatter.format(items);
      } catch (error) {
        console.warn('List formatting failed, using fallback:', error);
      }
    }
    
    // Fallback formatting
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return items.join(' and '); // This should be localized
    
    return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
  }
}

export default LocalizedFormatter.getInstance();