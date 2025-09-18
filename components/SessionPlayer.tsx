import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react-native';
import { AudioEngine, BinauralBeatConfig } from './AudioEngine';

const { width } = Dimensions.get('window');

interface SessionPlayerProps {
  focusLevel: number;
  title: string;
  duration: number;
  onSessionComplete?: () => void;
  onSessionStop?: () => void;
}

export const SessionPlayer: React.FC<SessionPlayerProps> = ({
  focusLevel,
  title,
  duration,
  onSessionComplete,
  onSessionStop,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioEngineRef.current = new AudioEngine();
    
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioEngineRef.current) {
      audioEngineRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  const startSession = async () => {
    if (!audioEngineRef.current) return;

    try {
      const config = AudioEngine.generateFocusLevelConfig(focusLevel);
      config.duration = duration * 60 * 1000; // Convert minutes to milliseconds
      config.volume = isMuted ? 0 : volume;

      await audioEngineRef.current.startSession(config);
      setIsPlaying(true);
      setCurrentTime(0);

      // Start time tracking
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration * 60) {
            stopSession();
            onSessionComplete?.();
            return duration * 60;
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to start audio session:', error);
    }
  };

  const pauseSession = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stopSession();
    }
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopSession = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stopSession();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onSessionStop?.();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / (duration * 60)) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#334155']}
        style={styles.gradient}
      >
        {/* Session Info */}
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{title}</Text>
          <Text style={styles.sessionLevel}>Focus Level {focusLevel}</Text>
        </View>

        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.timeText}>
              {formatTime(currentTime)}
            </Text>
            <Text style={styles.durationText}>
              / {formatTime(duration * 60)}
            </Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={stopSession}
            disabled={!isPlaying}
          >
            <Square 
              size={24} 
              color={isPlaying ? "#ffffff" : "#64748b"} 
              strokeWidth={2} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.playButton}
            onPress={isPlaying ? pauseSession : startSession}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.playButtonGradient}
            >
              {isPlaying ? (
                <Pause size={32} color="#ffffff" strokeWidth={2} />
              ) : (
                <Play size={32} color="#ffffff" strokeWidth={2} />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={toggleMute}
          >
            {isMuted ? (
              <VolumeX size={24} color="#ef4444" strokeWidth={2} />
            ) : (
              <Volume2 size={24} color="#ffffff" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
        </View>

        {/* Session Details */}
        <View style={styles.sessionDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Frequency</Text>
            <Text style={styles.detailValue}>
              {focusLevel === 1 ? '15 Hz' : 
               focusLevel === 3 ? '10 Hz' : 
               focusLevel === 10 ? '8 Hz' : 
               focusLevel === 12 ? '6 Hz' : '5 Hz'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Brainwave</Text>
            <Text style={styles.detailValue}>
              {focusLevel <= 3 ? 'Alpha' : 
               focusLevel <= 12 ? 'Theta' : 'Deep Theta'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Volume</Text>
            <Text style={styles.detailValue}>
              {Math.round(volume * 100)}%
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  gradient: {
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sessionTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  sessionLevel: {
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  progressCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  timeText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '700',
  },
  durationText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  playButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    width: '100%',
    marginBottom: 24,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});