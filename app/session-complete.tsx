import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CheckCircle, Star, BookOpen, Home, RotateCcw, Award } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SessionCompleteScreen() {
  const [sessionRating, setSessionRating] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');

  const handleRating = (rating: number) => {
    setSessionRating(rating);
  };

  const handleSaveAndContinue = () => {
    // Save session data, notes, and rating
    // Update user progress
    router.replace('/(tabs)');
  };

  const handleReturnHome = () => {
    router.replace('/(tabs)');
  };

  const handleRepeatSession = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f0c29', '#24243e', '#302b63']} style={styles.background}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Success Header */}
          <View style={styles.successHeader}>
            <View style={styles.successIconContainer}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.successIconGradient}
              >
                <CheckCircle size={48} color="#ffffff" strokeWidth={2} />
              </LinearGradient>
            </View>
            
            <Text style={styles.successTitle}>Session Complete!</Text>
            <Text style={styles.successSubtitle}>
              You've successfully completed your Gateway Process session
            </Text>
          </View>

          {/* Session Summary */}
          <View style={styles.summarySection}>
            <LinearGradient
              colors={['#1e293b', '#334155']}
              style={styles.summaryGradient}
            >
              <Text style={styles.summaryTitle}>Session Summary</Text>
              
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Focus Level</Text>
                  <Text style={styles.summaryValue}>3</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Duration</Text>
                  <Text style={styles.summaryValue}>20 min</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Frequency</Text>
                  <Text style={styles.summaryValue}>10 Hz</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Brainwave</Text>
                  <Text style={styles.summaryValue}>Alpha</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Achievement */}
          <View style={styles.achievementSection}>
            <LinearGradient
              colors={['#7c3aed', '#5b21b6']}
              style={styles.achievementGradient}
            >
              <View style={styles.achievementIcon}>
                <Award size={32} color="#ffffff" strokeWidth={2} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>New Achievement!</Text>
                <Text style={styles.achievementDescription}>
                  Alpha State Master - Complete 5 Focus 3 sessions
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>How was your session?</Text>
            <Text style={styles.ratingSubtitle}>
              Your feedback helps us personalize your experience
            </Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  onPress={() => handleRating(star)}
                >
                  <Star
                    size={32}
                    color={star <= sessionRating ? "#fbbf24" : "#64748b"}
                    fill={star <= sessionRating ? "#fbbf24" : "transparent"}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Session Notes</Text>
            <Text style={styles.notesSubtitle}>
              Record your experience, insights, or observations
            </Text>
            
            <View style={styles.notesInputContainer}>
              <LinearGradient
                colors={['#1e293b', '#334155']}
                style={styles.notesInputGradient}
              >
                <TextInput
                  style={styles.notesInput}
                  placeholder="What did you experience during this session?"
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={4}
                  value={sessionNotes}
                  onChangeText={setSessionNotes}
                  textAlignVertical="top"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Progress Insight */}
          <View style={styles.insightSection}>
            <LinearGradient
              colors={['#065f46', '#047857']}
              style={styles.insightGradient}
            >
              <Text style={styles.insightTitle}>Next Step in Your Journey</Text>
              <Text style={styles.insightText}>
                You're making excellent progress! Consider trying Focus 10 sessions 
                to explore deeper states of consciousness and expanded awareness.
              </Text>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSaveAndContinue}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.primaryButtonGradient}
              >
                <BookOpen size={24} color="#ffffff" strokeWidth={2} />
                <Text style={styles.primaryButtonText}>Save & Continue</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleRepeatSession}>
                <RotateCcw size={20} color="#8b5cf6" strokeWidth={2} />
                <Text style={styles.secondaryButtonText}>Repeat Session</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={handleReturnHome}>
                <Home size={20} color="#8b5cf6" strokeWidth={2} />
                <Text style={styles.secondaryButtonText}>Return Home</Text>
              </TouchableOpacity>
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
  successHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
  summarySection: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },
  achievementSection: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 8,
  },
  ratingSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    marginHorizontal: 8,
    padding: 8,
  },
  notesSection: {
    marginBottom: 32,
  },
  notesTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 8,
  },
  notesSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 22,
  },
  notesInputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  notesInputGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notesInput: {
    color: '#ffffff',
    fontSize: 16,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  insightSection: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 16,
    borderRadius: 16,
  },
  insightTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  actionsSection: {
    paddingBottom: 40,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  secondaryButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});