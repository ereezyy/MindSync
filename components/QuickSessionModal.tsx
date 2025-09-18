import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Play, Clock, Waves, Brain, Zap } from 'lucide-react-native';
import { useSession } from '@/contexts/SessionContext';
import UserDataService from '@/services/UserDataService';

const { width, height } = Dimensions.get('window');

interface QuickSessionOption {
  id: string;
  title: string;
  description: string;
  duration: number;
  focusLevel: number;
  frequency: string;
  brainwave: string;
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
  color: string;
  icon: any;
}

interface QuickSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onSessionStart: () => void;
}

export const QuickSessionModal: React.FC<QuickSessionModalProps> = ({
  visible,
  onClose,
  onSessionStart,
}) => {
  const [currentFocusLevel, setCurrentFocusLevel] = useState(1);
  const [quickOptions, setQuickOptions] = useState<QuickSessionOption[]>([]);
  const { startSession } = useSession();

  useEffect(() => {
    if (visible) {
      loadUserLevel();
    }
  }, [visible]);

  const loadUserLevel = async () => {
    try {
      const userProfile = await UserDataService.getUserProfile();
      const level = userProfile?.currentFocusLevel || 1;
      setCurrentFocusLevel(level);
      generateQuickOptions(level);
    } catch (error) {
      console.error('Error loading user level:', error);
      generateQuickOptions(1);
    }
  };

  const generateQuickOptions = (level: number) => {
    const options: QuickSessionOption[] = [
      {
        id: 'current-level',
        title: `Focus ${level} Session`,
        description: `Continue your journey at your current level`,
        duration: 20,
        focusLevel: level,
        frequency: level === 1 ? '15 Hz' : level === 3 ? '10 Hz' : level === 10 ? '8 Hz' : '6 Hz',
        brainwave: level <= 3 ? 'Alpha' : level <= 12 ? 'Theta' : 'Deep Theta',
        category: level <= 3 ? 'focus' : 'creativity',
        color: '#8b5cf6',
        icon: Brain,
      },
      {
        id: 'quick-focus',
        title: 'Quick Focus Boost',
        description: 'Short 10-minute session for mental clarity',
        duration: 10,
        focusLevel: Math.min(level, 3),
        frequency: '15 Hz',
        brainwave: 'Beta',
        category: 'focus',
        color: '#f59e0b',
        icon: Zap,
      },
      {
        id: 'relaxation',
        title: 'Stress Relief',
        description: 'Calming 15-minute alpha wave session',
        duration: 15,
        focusLevel: 3,
        frequency: '10 Hz',
        brainwave: 'Alpha',
        category: 'relaxation',
        color: '#10b981',
        icon: Waves,
      },
    ];

    // Add advanced option if user has progressed
    if (level >= 10) {
      options.push({
        id: 'deep-meditation',
        title: 'Deep Meditation',
        description: 'Advanced 25-minute theta exploration',
        duration: 25,
        focusLevel: 10,
        frequency: '6-8 Hz',
        brainwave: 'Theta',
        category: 'creativity',
        color: '#3b82f6',
        icon: Brain,
      });
    }

    setQuickOptions(options);
  };

  const handleStartSession = async (option: QuickSessionOption) => {
    try {
      await startSession({
        focusLevel: option.focusLevel,
        title: option.title,
        duration: option.duration,
        frequency: option.frequency,
        brainwave: option.brainwave,
        category: option.category,
      });
      onSessionStart();
      onClose();
    } catch (error) {
      console.error('Error starting session:', error);
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Quick Session</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Choose a session perfectly tailored to your current level
          </Text>

          <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
            {quickOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleStartSession(option)}
              >
                <LinearGradient
                  colors={['#1e293b', '#334155']}
                  style={styles.optionGradient}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.optionIconContainer}>
                      <option.icon size={24} color={option.color} strokeWidth={2} />
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                    <TouchableOpacity style={styles.playButtonSmall}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.playButtonGradient}
                      >
                        <Play size={20} color="#ffffff" strokeWidth={2} />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.optionFooter}>
                    <View style={styles.optionDetail}>
                      <Clock size={16} color="#64748b" strokeWidth={2} />
                      <Text style={styles.optionDetailText}>{option.duration} min</Text>
                    </View>
                    <View style={styles.optionDetail}>
                      <Waves size={16} color="#64748b" strokeWidth={2} />
                      <Text style={styles.optionDetailText}>{option.frequency}</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={[styles.categoryText, { color: option.color }]}>
                        {option.brainwave}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Custom Session Button */}
          <TouchableOpacity style={styles.customSessionButton} onPress={onClose}>
            <Text style={styles.customSessionText}>Browse All Sessions</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
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
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  playButtonSmall: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  optionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionDetailText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customSessionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  customSessionText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
});