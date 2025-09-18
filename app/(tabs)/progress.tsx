import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Award, Calendar, Brain, Clock, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
}

interface ProgressStat {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: any;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Gateway Explorer',
    description: 'Completed your first binaural session',
    icon: '🚪',
    earned: true,
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Alpha Master',
    description: 'Achieved consistent Alpha state synchronization',
    icon: '🧠',
    earned: true,
    date: '2024-01-20',
  },
  {
    id: '3',
    title: 'Theta Pioneer',
    description: 'Successfully accessed Theta consciousness state',
    icon: '🌊',
    earned: false,
  },
  {
    id: '4',
    title: 'Consistent Practice',
    description: '7 consecutive days of meditation',
    icon: '🔥',
    earned: true,
    date: '2024-01-25',
  },
  {
    id: '5',
    title: 'Deep Explorer',
    description: 'Reached Focus Level 12',
    icon: '⭐',
    earned: false,
  },
];

const progressStats: ProgressStat[] = [
  {
    label: 'Focus Levels',
    value: 3,
    maxValue: 7,
    color: '#8b5cf6',
    icon: Brain,
  },
  {
    label: 'Hours Meditated',
    value: 24.5,
    maxValue: 50,
    color: '#10b981',
    icon: Clock,
  },
  {
    label: 'Sessions Completed',
    value: 47,
    maxValue: 100,
    color: '#f59e0b',
    icon: Target,
  },
  {
    label: 'Streak Days',
    value: 12,
    maxValue: 30,
    color: '#ef4444',
    icon: Calendar,
  },
];

const weeklyData = [
  { day: 'Mon', sessions: 2, duration: 45 },
  { day: 'Tue', sessions: 1, duration: 30 },
  { day: 'Wed', sessions: 3, duration: 60 },
  { day: 'Thu', sessions: 2, duration: 40 },
  { day: 'Fri', sessions: 1, duration: 20 },
  { day: 'Sat', sessions: 4, duration: 80 },
  { day: 'Sun', sessions: 2, duration: 50 },
];

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const ProgressBar = ({ value, maxValue, color }: { value: number; maxValue: number; color: string }) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${(value / maxValue) * 100}%`, 
              backgroundColor: color 
            }
          ]} 
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0c29', '#24243e', '#302b63']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>
            Track your consciousness exploration journey
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Progress Stats */}
          <View style={styles.statsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <TrendingUp size={24} color="#10b981" strokeWidth={2} />
            </View>
            
            <View style={styles.statsGrid}>
              {progressStats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <LinearGradient
                    colors={['#1e293b', '#334155']}
                    style={styles.statGradient}
                  >
                    <View style={styles.statHeader}>
                      <stat.icon size={20} color={stat.color} strokeWidth={2} />
                      <Text style={styles.statValue}>
                        {stat.label === 'Hours Meditated' ? `${stat.value}h` : stat.value}
                      </Text>
                    </View>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <ProgressBar 
                      value={stat.value} 
                      maxValue={stat.maxValue} 
                      color={stat.color} 
                    />
                    <Text style={styles.statProgress}>
                      {stat.maxValue === 100 ? `${stat.value}%` : `${stat.value}/${stat.maxValue}`}
                    </Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          {/* Weekly Activity Chart */}
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <View style={styles.chartContainer}>
              <LinearGradient
                colors={['#1e293b', '#334155']}
                style={styles.chartGradient}
              >
                <View style={styles.chartBars}>
                  {weeklyData.map((day, index) => (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.bar}>
                        <View 
                          style={[
                            styles.barFill,
                            { 
                              height: `${(day.duration / 80) * 100}%`,
                              backgroundColor: '#8b5cf6'
                            }
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>{day.day}</Text>
                      <Text style={styles.barValue}>{day.sessions}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.chartLegend}>
                  <Text style={styles.legendText}>Sessions per day</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Award size={24} color="#fbbf24" strokeWidth={2} />
            </View>
            
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <LinearGradient
                  colors={achievement.earned ? ['#065f46', '#047857'] : ['#1e293b', '#334155']}
                  style={styles.achievementGradient}
                >
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <View style={styles.achievementInfo}>
                      <Text style={[
                        styles.achievementTitle,
                        !achievement.earned && styles.achievementTitleLocked
                      ]}>
                        {achievement.title}
                      </Text>
                      <Text style={[
                        styles.achievementDescription,
                        !achievement.earned && styles.achievementDescriptionLocked
                      ]}>
                        {achievement.description}
                      </Text>
                      {achievement.earned && achievement.date && (
                        <Text style={styles.achievementDate}>
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    {achievement.earned ? (
                      <View style={styles.achievementBadge}>
                        <Text style={styles.achievementBadgeText}>✓</Text>
                      </View>
                    ) : (
                      <View style={styles.achievementLocked}>
                        <Text style={styles.achievementLockedText}>🔒</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>

          <View style={styles.bottomPadding} />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  statProgress: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  chartSection: {
    marginBottom: 32,
  },
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  chartGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  chartLegend: {
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
    color: '#64748b',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  achievementCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
    marginRight: 16,
  },
  achievementTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#64748b',
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  achievementDescriptionLocked: {
    color: '#475569',
  },
  achievementDate: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 4,
  },
  achievementBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  achievementLocked: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementLockedText: {
    fontSize: 16,
  },
  bottomPadding: {
    height: 40,
  },
});