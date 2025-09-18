import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AudioEngine, BinauralBeatConfig } from '@/components/AudioEngine';
import UserDataService, { SessionRecord } from '@/services/UserDataService';

export interface ActiveSession {
  id: string;
  focusLevel: number;
  title: string;
  duration: number; // in minutes
  frequency: string;
  brainwave: string;
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
  startTime: Date;
  isPlaying: boolean;
  currentTime: number; // in seconds
  volume: number;
  isMuted: boolean;
}

interface SessionContextType {
  activeSession: ActiveSession | null;
  isSessionActive: boolean;
  startSession: (sessionData: Omit<ActiveSession, 'id' | 'startTime' | 'isPlaying' | 'currentTime' | 'volume' | 'isMuted'>) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  completeSession: (rating?: number, notes?: string) => Promise<void>;
  updateCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  audioEngine: AudioEngine | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);

  useEffect(() => {
    // Initialize audio engine
    const engine = new AudioEngine();
    setAudioEngine(engine);

    return () => {
      engine.dispose();
    };
  }, []);

  const startSession = async (sessionData: Omit<ActiveSession, 'id' | 'startTime' | 'isPlaying' | 'currentTime' | 'volume' | 'isMuted'>) => {
    if (!audioEngine) {
      throw new Error('Audio engine not initialized');
    }

    const newSession: ActiveSession = {
      ...sessionData,
      id: Date.now().toString(),
      startTime: new Date(),
      isPlaying: true,
      currentTime: 0,
      volume: 0.3,
      isMuted: false,
    };

    try {
      const config = AudioEngine.generateFocusLevelConfig(sessionData.focusLevel);
      config.duration = sessionData.duration * 60 * 1000; // Convert minutes to milliseconds
      config.volume = newSession.volume;

      await audioEngine.startSession(config);
      setActiveSession(newSession);
    } catch (error) {
      console.error('Failed to start session:', error);
      throw error;
    }
  };

  const pauseSession = () => {
    if (activeSession && audioEngine) {
      audioEngine.stopSession();
      setActiveSession(prev => prev ? { ...prev, isPlaying: false } : null);
    }
  };

  const resumeSession = async () => {
    if (activeSession && audioEngine && !activeSession.isPlaying) {
      try {
        const config = AudioEngine.generateFocusLevelConfig(activeSession.focusLevel);
        const remainingTime = (activeSession.duration * 60) - activeSession.currentTime;
        config.duration = remainingTime * 1000;
        config.volume = activeSession.isMuted ? 0 : activeSession.volume;

        await audioEngine.startSession(config);
        setActiveSession(prev => prev ? { ...prev, isPlaying: true } : null);
      } catch (error) {
        console.error('Failed to resume session:', error);
      }
    }
  };

  const stopSession = () => {
    if (audioEngine) {
      audioEngine.stopSession();
    }
    setActiveSession(null);
  };

  const completeSession = async (rating?: number, notes?: string) => {
    if (!activeSession) return;

    try {
      const sessionRecord: Omit<SessionRecord, 'id' | 'completedAt'> = {
        focusLevel: activeSession.focusLevel,
        duration: activeSession.duration,
        frequency: activeSession.frequency,
        brainwave: activeSession.brainwave,
        category: activeSession.category,
        rating,
        notes,
      };

      await UserDataService.completeSession(sessionRecord);
      
      if (audioEngine) {
        audioEngine.stopSession();
      }
      
      setActiveSession(null);
    } catch (error) {
      console.error('Failed to complete session:', error);
      throw error;
    }
  };

  const updateCurrentTime = (time: number) => {
    setActiveSession(prev => prev ? { ...prev, currentTime: time } : null);
  };

  const setVolume = (volume: number) => {
    if (audioEngine) {
      audioEngine.setVolume(activeSession?.isMuted ? 0 : volume);
    }
    setActiveSession(prev => prev ? { ...prev, volume } : null);
  };

  const toggleMute = () => {
    if (!activeSession) return;

    const newMuted = !activeSession.isMuted;
    if (audioEngine) {
      audioEngine.setVolume(newMuted ? 0 : activeSession.volume);
    }
    setActiveSession(prev => prev ? { ...prev, isMuted: newMuted } : null);
  };

  const value: SessionContextType = {
    activeSession,
    isSessionActive: activeSession !== null,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    completeSession,
    updateCurrentTime,
    setVolume,
    toggleMute,
    audioEngine,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};