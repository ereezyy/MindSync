import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Clock, Waves, Settings, Filter } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Session {
  id: string;
  title: string;
  duration: number;
  frequency: string;
  description: string;
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
  level: number;
  popularity: number;
}

const sessions: Session[] = [
  {
    id: '1',
    title: 'Gateway Introduction',
    duration: 15,
    frequency: '10 Hz',
    description: 'Begin your journey with basic hemispheric synchronization',
    category: 'focus',
    level: 1,
    popularity: 95,
  },
  {
    id: '2',
    title: 'Deep Alpha Resonance',
    duration: 20,
    frequency: '8-12 Hz',
    description: 'Enhanced relaxation with maintained awareness',
    category: 'relaxation',
    level: 3,
    popularity: 88,
  },
  {
    id: '3',
    title: 'Theta Exploration',
    duration: 30,
    frequency: '4-8 Hz',
    description: 'Access deeper states of consciousness',
    category: 'creativity',
    level: 10,
    popularity: 82,
  },
  {
    id: '4',
    title: 'Delta Sleep Induction',
    duration: 45,
    frequency: '0.5-4 Hz',
    description: 'Deep restorative sleep preparation',
    category: 'sleep',
    level: 12,
    popularity: 91,
  },
  {
    id: '5',
    title: 'Beta Enhancement',
    duration: 12,
    frequency: '14-30 Hz',
    description: 'Heightened focus and cognitive performance',
    category: 'focus',
    level: 1,
    popularity: 76,
  },
  {
    id: '6',
    title: 'Schumann Resonance',
    duration: 25,
    frequency: '7.83 Hz',
    description: 'Earth frequency synchronization for grounding',
    category: 'relaxation',
    level: 3,
    popularity: 84,
  },
];

const categories = [
  { id: 'all', name: 'All', color: '#8b5cf6' },
  { id: 'focus', name: 'Focus', color: '#f59e0b' },
  { id: 'relaxation', name: 'Relaxation', color: '#10b981' },
  { id: 'creativity', name: 'Creativity', color: '#ef4444' },
  { id: 'sleep', name: 'Sleep', color: '#3b82f6' },
];

export default function SessionsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredSessions, setFilteredSessions] = useState(sessions);

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(session => session.category === categoryId));
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : '#8b5cf6';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0c29', '#24243e', '#302b63']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Binaural Sessions</Text>
          <Text style={styles.headerSubtitle}>
            Precisely calibrated frequencies for consciousness exploration
          </Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => handleCategoryFilter(category.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {filteredSessions.map((session) => (
            <TouchableOpacity key={session.id} style={styles.sessionCard}>
              <LinearGradient
                colors={['#1e293b', '#334155']}
                style={styles.sessionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <View style={styles.sessionMeta}>
                      <View style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(session.category) }
                      ]}>
                        <Text style={styles.categoryBadgeText}>
                          Focus {session.level}
                        </Text>
                      </View>
                      <View style={styles.popularityBadge}>
                        <Text style={styles.popularityText}>
                          {session.popularity}% ★
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <Text style={styles.sessionDescription}>
                      {session.description}
                    </Text>
                  </View>
                  
                  <TouchableOpacity style={styles.playButton}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.playButtonGradient}
                    >
                      <Play size={24} color="#ffffff" strokeWidth={2} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View style={styles.sessionFooter}>
                  <View style={styles.sessionDetail}>
                    <Clock size={16} color="#64748b" strokeWidth={2} />
                    <Text style={styles.sessionDetailText}>
                      {session.duration} min
                    </Text>
                  </View>
                  
                  <View style={styles.sessionDetail}>
                    <Waves size={16} color="#64748b" strokeWidth={2} />
                    <Text style={styles.sessionDetailText}>
                      {session.frequency}
                    </Text>
                  </View>
                  
                  <TouchableOpacity style={styles.sessionDetail}>
                    <Settings size={16} color="#8b5cf6" strokeWidth={2} />
                    <Text style={[styles.sessionDetailText, { color: '#8b5cf6' }]}>
                      Customize
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
          
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
  categoryScroll: {
    marginBottom: 20,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  categoryText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sessionGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sessionInfo: {
    flex: 1,
    marginRight: 16,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  categoryBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  popularityBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularityText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
  },
  sessionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  playButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  sessionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDetailText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  bottomPadding: {
    height: 40,
  },
});