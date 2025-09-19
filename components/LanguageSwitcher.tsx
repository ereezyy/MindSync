import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Check, Globe } from 'lucide-react-native';
import { useTranslation, useLocale } from '@/hooks/useTranslation';
import { RTLSafeView } from './RTLSafeView';

const { width, height } = Dimensions.get('window');

interface LanguageSwitcherProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const { currentLocale, supportedLocales, changeLocale } = useLocale();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (localeCode: string) => {
    if (localeCode === currentLocale) {
      onClose();
      return;
    }

    setIsChanging(true);
    try {
      await changeLocale(localeCode);
      onClose();
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={['#0f0c29', '#24243e', '#302b63']}
          style={styles.modalContainer}
        >
          {/* Header */}
          <RTLSafeView style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Globe size={24} color="#8b5cf6" strokeWidth={2} />
              <Text style={styles.modalTitle}>{t('profile.settings.language.title')}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </RTLSafeView>

          <Text style={styles.modalSubtitle}>
            {t('profile.settings.language.description')}
          </Text>

          {/* Language List */}
          <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
            {supportedLocales.map((locale) => (
              <TouchableOpacity
                key={locale.code}
                style={[
                  styles.languageItem,
                  currentLocale === locale.code && styles.selectedLanguageItem
                ]}
                onPress={() => handleLanguageChange(locale.code)}
                disabled={isChanging}
              >
                <LinearGradient
                  colors={
                    currentLocale === locale.code
                      ? ['#8b5cf6', '#7c3aed']
                      : ['#1e293b', '#334155']
                  }
                  style={styles.languageGradient}
                >
                  <RTLSafeView style={styles.languageContent}>
                    <View style={styles.languageInfo}>
                      <RTLSafeView style={styles.languageHeader}>
                        <Text style={styles.languageFlag}>{locale.flag}</Text>
                        <View style={styles.languageNames}>
                          <Text style={[
                            styles.languageName,
                            currentLocale === locale.code && styles.selectedLanguageName
                          ]}>
                            {locale.name}
                          </Text>
                          <Text style={[
                            styles.languageNativeName,
                            currentLocale === locale.code && styles.selectedLanguageNativeName
                          ]}>
                            {locale.nativeName}
                          </Text>
                        </View>
                      </RTLSafeView>
                    </View>
                    
                    {currentLocale === locale.code && (
                      <View style={styles.checkmark}>
                        <Check size={20} color="#ffffff" strokeWidth={2} />
                      </View>
                    )}
                  </RTLSafeView>

                  {/* RTL Indicator */}
                  {locale.isRTL && (
                    <View style={styles.rtlBadge}>
                      <Text style={styles.rtlBadgeText}>RTL</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('common.loading', { defaultValue: 'Changes will take effect immediately' })}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    maxHeight: height * 0.8,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
    lineHeight: 22,
  },
  languageList: {
    flex: 1,
    marginBottom: 16,
  },
  languageItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedLanguageItem: {
    // Additional styling for selected item if needed
  },
  languageGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageInfo: {
    flex: 1,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageNames: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: '#ffffff',
  },
  languageNativeName: {
    fontSize: 14,
    color: '#94a3b8',
  },
  selectedLanguageNativeName: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkmark: {
    marginLeft: 12,
  },
  rtlBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rtlBadgeText: {
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});