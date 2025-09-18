import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, Settings, Clock, Waves, Brain } from 'lucide-react-native';
import { SessionPlayer } from '@/components/SessionPlayer';
import { FrequencyVisualizer } from '@/components/FrequencyVisualizer';

const { width, height } = Dimensions.get('window');

interface SessionData {
  id: string;
  title: string;
  description: string;
  duration: number;
  frequency: string;
  focusLevel: number;
  brainwave: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
}

const sessionData: Record<string, SessionData> = {
  '1': {
    id: '1',
    title: 'Gateway Introduction',
    description: 'Begin your journey with basic hemispheric synchronization using carefully calibrated Beta frequencies. This foundational session establishes the neural pathways for more advanced consciousness exploration.',
    duration: 15,
    frequency: '15 Hz',
    focusLevel: 1,
    brainwave: 'Beta',
    difficulty: 'Beginner',
    category: 'focus',
  },
  '3': {
    id: '3',
    title: 'Mind Awake, Body Asleep',
    description: 'Experience the Gateway Process Focus 3 state where physical consciousness relaxes while mental awareness remains sharp and alert. Alpha frequencies guide you into this fundamental consciousness state.',
    duration: 20,
    frequency: '10 Hz',
    focusLevel: 3,
    brainwave: 'Alpha',
    difficulty: 'Beginner',
    category: 'relaxation',
  },
  '10': {
    id: '10',
    title: 'Mind Alert, Body Asleep',
    description: 'Access Focus 10 - the state of heightened awareness beyond normal physical limitations. This Alpha-Theta border frequency opens doorways to expanded perception and consciousness exploration.',
    duration: 25,
    frequency: '8 Hz',
    focusLevel: 10,
    brainwave: 'Alpha/Theta',
    difficulty: 'Intermediate',
    category: 'creativity',
  },
  '12': {
    id: '12',
    title: 'Expanded Awareness',
    description: 'Journey to Focus 12 - a state of expanded awareness where consciousness transcends ordinary limits. Theta frequencies facilitate access to non-physical dimensions of experience and insight.',
    duration: 30,
    frequency: '6 Hz',
    focusLevel: 12,
    brainwave: 'Theta',
    difficulty: 'Advanced',
    category: 'creativity',
  },
};

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const session = sessionData[id || '1'];

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#0f0c29', '#24243e', '#302b63']} style={styles.background}>
          <Text style={styles.errorText}>Session not found</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#8b5cf6';
    }
  };

  const getBrainwaveColor = (brainwave: string) => {
    if (brainwave.includes('Beta')) return '#f59e0b';
    if (brainwave.includes('Alpha')) return '#10b981';
    if (brainwave.includes('Theta')) return '#8b5cf6';
    if (brainwave.includes('Delta')) return '#ef4444';
    return '#3b82f6';
  };

  const handleStartSession = () => {
    setShowPlayer(true);
    setIsPlaying(true);
  };

  const handleSessionComplete = () => {
    setShowPlayer(false);
    setIsPlaying(false);
    // Navigate to completion screen or show completion modal
    router.push('/session-complete');
  };

  const handleSessionStop = () => {
    setShowPlayer(false);
    setIsPlaying(false);
  };

  if (showPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#0f0c29', '#24243e', '#302b63']} style={styles.background}>
          <View style={styles.playerHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleSessionStop}
            >
              <ArrowLeft size={24} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.playerHeaderText}>Focus {session.focusLevel}</Text>
          </View>

          <FrequencyVisualizer
            frequency={parseFloat(session.frequency)}
            amplitude={0.8}
            isActive={isPlaying}
            focusLevel={session.focusLevel}
          />

          <SessionPlayer
            focusLevel={session.focusLevel}
            title={session.title}
            duration={session.duration}
            onSessionComplete={handleSessionComplete}
            onSessionStop={handleSessionStop}
          />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f0c29', '#24243e', '#302b63']} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Session Details</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#8b5cf6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Session Info */}
        <View style={styles.sessionInfo}>
          <View style={styles.sessionBadges}>
            <View style={styles.focusBadge}>
              <Brain size={16} color="#8b5cf6" strokeWidth={2} />
              <Text style={styles.focusBadgeText}>Focus {session.focusLevel}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(session.difficulty) }]}>
              <Text style={styles.difficultyBadgeText}>{session.difficulty}</Text>
            </View>
          </View>

          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionDescription}>{session.description}</Text>

          {/* Session Specs */}
          <View style={styles.specsContainer}>
            <LinearGradient
              colors={['#1e293b', '#334155']}
              style={styles.specsGradient}
            >
              <View style={styles.specItem}>
                <Clock size={20} color="#64748b" strokeWidth={2} />
                <View style={styles.specInfo}>
                  <Text style={styles.specLabel}>Duration</Text>
                  <Text style={styles.specValue}>{session.duration} minutes</Text>
                </View>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specItem}>
                <Waves size={20} color="#64748b" strokeWidth={2} />
                <View style={styles.specInfo}>
                  <Text style={styles.specLabel}>Frequency</Text>
                  <Text style={styles.specValue}>{session.frequency}</Text>
                </View>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specItem}>
                <View style={[styles.brainwaveIndicator, { backgroundColor: getBrainwaveColor(session.brainwave) }]} />
                <View style={styles.specInfo}>
                  <Text style={styles.specLabel}>Brainwave</Text>
                  <Text style={styles.specValue}>{session.brainwave}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>What You'll Experience</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Enhanced hemispheric synchronization</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Deepened meditative awareness</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Expanded consciousness exploration</Text>
              </View>
              {session.focusLevel >= 10 && (
                <View style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>Access to non-ordinary states</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Start Button */}
        <View style={styles.startButtonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Play size={28} color="#ffffff" strokeWidth={2} />
              <Text style={styles.startButtonText}>Begin Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  focusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
  },
  focusBadgeText: {
    color: '#8b5cf6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  difficultyBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  difficultyBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sessionTitle: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 36,
  },
  sessionDescription: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
    marginBottom: 24,
  },
  specsContainer: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  specsGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specInfo: {
    marginLeft: 16,
  },
  specLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  specDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  brainwaveIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 16,
  },
  benefitsList: {
    space: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8b5cf6',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 22,
  },
  startButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  startButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
  },
  startButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 12,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  playerHeaderText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 100,
  },
});