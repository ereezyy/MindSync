import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Brain, Zap, Star, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';
import UserDataService from '@/services/UserDataService';

const { width, height } = Dimensions.get('window');

interface FocusLevel {
  id: string;
  level: number;
  title: string;
  description: string;
  frequency: string;
  brainwave: string;
  unlocked?: boolean;
  sessions: number;
}

const focusLevels: FocusLevel[] = [
  {
    id: '1',
    level: 1,
    title: 'Normal Waking',
    description: 'Baseline consciousness with enhanced awareness',
    frequency: '14-30 Hz',
    brainwave: 'Beta',
    sessions: 12,
  },
  {
    id: '3',
    level: 3,
    title: 'Alpha Synchronization',
    description: 'Enhanced relaxation with maintained awareness',
    frequency: '10 Hz',
    brainwave: 'Alpha',
    sessions: 8,
  },
  {
    id: '10',
    level: 10,
    title: 'Mind Alert, Body Asleep',
    description: 'Enhanced awareness beyond physical limitations',
    frequency: '8-10 Hz',
    brainwave: 'Alpha/Theta',
    sessions: 6,
  },
  {
    id: '12',
    level: 12,
    title: 'Expanded Awareness',
    description: 'Access to non-physical dimensions of consciousness',
    frequency: '4-8 Hz',
    brainwave: 'Theta',
    sessions: 4,
  },
];

export default function HomeScreen() {
  const [userName, setUserName] = useState('Explorer');
  const [todaysSessions, setTodaysSessions] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [currentFocusLevel, setCurrentFocusLevel] = useState(1);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userProfile = await UserDataService.getUserProfile();
      const dailyStats = await UserDataService.getDailyStats();
      
      if (userProfile) {
        setUserName(userProfile.name);
        setTotalHours(userProfile.totalHours);
        setCurrentFocusLevel(userProfile.currentFocusLevel);
      }
      
      setTodaysSessions(dailyStats.sessions);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const handleQuickSession = () => {
    router.push('/sessions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0c29', '#24243e', '#302b63']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.nameText}>{userName}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{todaysSessions}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalHours.toFixed(1)}h</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>

          {/* Quick Start */}
          <View style={styles.quickStartSection}>
            <Text style={styles.sectionTitle}>Begin Your Journey</Text>
            <TouchableOpacity style={styles.quickStartButton} onPress={handleQuickSession}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.quickStartGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Play size={32} color="#ffffff" strokeWidth={2} />
                <Text style={styles.quickStartText}>Quick Session</Text>
                <Text style={styles.quickStartSubtext}>
                  Start with personalized binaural beats
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Focus Levels */}
          <View style={styles.focusSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Gateway Focus Levels</Text>
              <Brain size={24} color="#8b5cf6" strokeWidth={2} />
            </View>
            
            {focusLevels.map((level, index) => (
              const isUnlocked = level.level === 1 || currentFocusLevel >= level.level;
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelCard,
                  !isUnlocked && styles.lockedCard
                ]}
                disabled={!isUnlocked}
                onPress={() => router.push(`/session/${level.id}`)}
              >
                <LinearGradient
                  colors={isUnlocked ? ['#1e293b', '#334155'] : ['#0f172a', '#1e293b']}
                  style={styles.levelGradient}
                >
                  <View style={styles.levelHeader}>
                    <View style={styles.levelInfo}>
                      <Text style={styles.levelNumber}>Focus {level.level}</Text>
                      <Text style={styles.levelTitle}>{level.title}</Text>
                    </View>
                    <View style={styles.levelMeta}>
                      {isUnlocked ? (
                        <Star size={20} color="#fbbf24" fill="#fbbf24" />
                      ) : (
                        <View style={styles.lockedIndicator}>
                          <Text style={styles.lockedText}>🔒</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <Text style={styles.levelDescription}>{level.description}</Text>
                  
                  <View style={styles.levelFooter}>
                    <View style={styles.frequencyTag}>
                      <Zap size={14} color="#8b5cf6" strokeWidth={2} />
                      <Text style={styles.frequencyText}>{level.frequency}</Text>
                    </View>
                    <Text style={styles.brainwaveText}>{level.brainwave}</Text>
                    <Text style={styles.sessionCount}>{level.sessions} sessions</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today's Insights */}
          <View style={styles.insightsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Insights</Text>
              <TrendingUp size={24} color="#10b981" strokeWidth={2} />
            </View>
            
            <View style={styles.insightCard}>
              <LinearGradient
                colors={['#064e3b', '#065f46']}
                style={styles.insightGradient}
              >
                <Text style={styles.insightTitle}>Optimal Session Time</Text>
                <Text style={styles.insightText}>
                  Your binaural response is strongest between 7-9 PM based on your session history.
                </Text>
              </LinearGradient>
            </View>
            
            <View style={styles.insightCard}>
              <LinearGradient
                colors={['#1e1b4b', '#312e81']}
                style={styles.insightGradient}
              >
                <Text style={styles.insightTitle}>Progress Update</Text>
                <Text style={styles.insightText}>
                  You're ready to unlock Focus 10. Complete 2 more Focus 3 sessions.
                </Text>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '400',
  },
  nameText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  quickStartSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 16,
  },
  quickStartButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickStartGradient: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 20,
  },
  quickStartText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  quickStartSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  focusSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.6,
  },
  levelGradient: {
    padding: 20,
    borderRadius: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelNumber: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  levelMeta: {
    alignItems: 'center',
  },
  lockedIndicator: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedText: {
    fontSize: 14,
  },
  levelDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  levelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frequencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  frequencyText: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    marginLeft: 4,
  },
  brainwaveText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  sessionCount: {
    fontSize: 12,
    color: '#64748b',
  },
  insightsSection: {
    paddingBottom: 40,
  },
  insightCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 16,
    borderRadius: 16,
  },
  insightTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});