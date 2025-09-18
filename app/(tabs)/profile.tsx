import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Headphones, Bell, Shield, CircleHelp as HelpCircle, Star, ChevronRight, Volume2, Brain } from 'lucide-react-native';

interface ProfileStat {
  label: string;
  value: string;
  color: string;
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'switch' | 'navigation';
  value?: boolean;
  icon: any;
  color: string;
}

const profileStats: ProfileStat[] = [
  { label: 'Current Level', value: 'Focus 3', color: '#8b5cf6' },
  { label: 'Total Sessions', value: '47', color: '#10b981' },
  { label: 'Hours Meditated', value: '24.5h', color: '#f59e0b' },
  { label: 'Streak', value: '12 days', color: '#ef4444' },
];

const settingItems: SettingItem[] = [
  {
    id: 'notifications',
    title: 'Session Reminders',
    description: 'Get reminded to maintain your practice',
    type: 'switch',
    value: true,
    icon: Bell,
    color: '#8b5cf6',
  },
  {
    id: 'background_audio',
    title: 'Background Audio',
    description: 'Continue sessions when app is minimized',
    type: 'switch',
    value: true,
    icon: Volume2,
    color: '#10b981',
  },
  {
    id: 'biometric_sync',
    title: 'Biometric Integration',
    description: 'Connect EEG and wearable devices',
    type: 'switch',
    value: false,
    icon: Brain,
    color: '#f59e0b',
  },
  {
    id: 'audio_settings',
    title: 'Audio Settings',
    description: 'Customize frequency ranges and volumes',
    type: 'navigation',
    icon: Headphones,
    color: '#3b82f6',
  },
  {
    id: 'privacy',
    title: 'Privacy & Data',
    description: 'Manage your personal information',
    type: 'navigation',
    icon: Shield,
    color: '#ef4444',
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'FAQs and customer support',
    type: 'navigation',
    icon: HelpCircle,
    color: '#64748b',
  },
];

export default function ProfileScreen() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    notifications: true,
    background_audio: true,
    biometric_sync: false,
  });

  const handleSettingToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0c29', '#24243e', '#302b63']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.avatar}
              >
                <User size={40} color="#ffffff" strokeWidth={2} />
              </LinearGradient>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Consciousness Explorer</Text>
              <Text style={styles.profileEmail}>explorer@mindsync.com</Text>
              <View style={styles.profileBadge}>
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.badgeText}>Gateway Practitioner</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Journey</Text>
            <View style={styles.statsGrid}>
              {profileStats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <LinearGradient
                    colors={['#1e293b', '#334155']}
                    style={styles.statGradient}
                  >
                    <Text style={[styles.statValue, { color: stat.color }]}>
                      {stat.value}
                    </Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            {settingItems.map((item) => (
              <View key={item.id} style={styles.settingCard}>
                <LinearGradient
                  colors={['#1e293b', '#334155']}
                  style={styles.settingGradient}
                >
                  <View style={styles.settingContent}>
                    <View style={styles.settingIcon}>
                      <item.icon size={24} color={item.color} strokeWidth={2} />
                    </View>
                    
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingDescription}>
                        {item.description}
                      </Text>
                    </View>
                    
                    <View style={styles.settingControl}>
                      {item.type === 'switch' ? (
                        <Switch
                          value={settings[item.id]}
                          onValueChange={() => handleSettingToggle(item.id)}
                          trackColor={{ false: '#374151', true: item.color }}
                          thumbColor={settings[item.id] ? '#ffffff' : '#9ca3af'}
                        />
                      ) : (
                        <TouchableOpacity style={styles.navigationButton}>
                          <ChevronRight size={20} color="#64748b" strokeWidth={2} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>

          {/* Gateway Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>About Gateway Process</Text>
            <View style={styles.infoCard}>
              <LinearGradient
                colors={['#1e293b', '#334155']}
                style={styles.infoGradient}
              >
                <Text style={styles.infoTitle}>
                  Scientific Foundation
                </Text>
                <Text style={styles.infoText}>
                  MindSync is based on the declassified CIA Gateway Process, 
                  utilizing precise binaural beat frequencies to achieve hemispheric 
                  synchronization and expanded states of consciousness.
                </Text>
                <TouchableOpacity style={styles.learnMoreButton}>
                  <Text style={styles.learnMoreText}>Learn More</Text>
                  <ChevronRight size={16} color="#8b5cf6" strokeWidth={2} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* App Version */}
          <View style={styles.versionSection}>
            <Text style={styles.versionText}>MindSync v1.0.0</Text>
            <Text style={styles.versionSubtext}>Gateway Process Implementation</Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
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
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  settingControl: {
    marginLeft: 16,
  },
  navigationButton: {
    padding: 4,
  },
  infoSection: {
    marginBottom: 32,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
    marginBottom: 16,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '600',
    marginRight: 6,
  },
  versionSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  bottomPadding: {
    height: 40,
  },
});