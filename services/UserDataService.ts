import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  currentFocusLevel: number;
  totalSessions: number;
  totalHours: number;
  streakDays: number;
  lastSessionDate?: string;
  achievements: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  backgroundAudio: boolean;
  biometricSync: boolean;
  defaultVolume: number;
  reminderTime?: string;
  preferredSessionDuration: number;
}

export interface SessionRecord {
  id: string;
  focusLevel: number;
  duration: number; // in minutes
  completedAt: string;
  rating?: number;
  notes?: string;
  frequency: string;
  brainwave: string;
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirements: {
    type: 'sessions' | 'hours' | 'streak' | 'level';
    target: number;
    category?: string;
  };
}

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  SESSION_HISTORY: 'session_history',
  ACHIEVEMENTS: 'achievements',
  DAILY_STATS: 'daily_stats',
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_session',
    title: 'Gateway Explorer',
    description: 'Completed your first binaural session',
    icon: '🚪',
    requirements: { type: 'sessions', target: 1 },
  },
  {
    id: 'alpha_master',
    title: 'Alpha Master',
    description: 'Achieved consistent Alpha state synchronization',
    icon: '🧠',
    requirements: { type: 'sessions', target: 10, category: 'focus' },
  },
  {
    id: 'theta_pioneer',
    title: 'Theta Pioneer',
    description: 'Successfully accessed Theta consciousness state',
    icon: '🌊',
    requirements: { type: 'level', target: 10 },
  },
  {
    id: 'consistent_practice',
    title: 'Consistent Practice',
    description: '7 consecutive days of meditation',
    icon: '🔥',
    requirements: { type: 'streak', target: 7 },
  },
  {
    id: 'deep_explorer',
    title: 'Deep Explorer',
    description: 'Reached Focus Level 12',
    icon: '⭐',
    requirements: { type: 'level', target: 12 },
  },
  {
    id: 'dedicated_practitioner',
    title: 'Dedicated Practitioner',
    description: 'Meditated for 25+ hours total',
    icon: '🎯',
    requirements: { type: 'hours', target: 25 },
  },
];

class UserDataService {
  private static instance: UserDataService;
  private userProfile: UserProfile | null = null;
  private sessionHistory: SessionRecord[] = [];

  static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  // Initialize user profile
  async initializeUser(name: string, email: string): Promise<UserProfile> {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name,
      email,
      joinDate: new Date().toISOString(),
      currentFocusLevel: 1,
      totalSessions: 0,
      totalHours: 0,
      streakDays: 0,
      achievements: [],
      preferences: {
        notifications: true,
        backgroundAudio: true,
        biometricSync: false,
        defaultVolume: 0.3,
        preferredSessionDuration: 20,
      },
    };

    await this.saveUserProfile(newProfile);
    await this.initializeAchievements();
    this.userProfile = newProfile;
    return newProfile;
  }

  // Load user profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profileData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (profileData) {
        this.userProfile = JSON.parse(profileData);
        return this.userProfile;
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
    return null;
  }

  // Save user profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      this.userProfile = profile;
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // Complete a session
  async completeSession(sessionData: Omit<SessionRecord, 'id' | 'completedAt'>): Promise<void> {
    const session: SessionRecord = {
      ...sessionData,
      id: Date.now().toString(),
      completedAt: new Date().toISOString(),
    };

    try {
      // Add to session history
      this.sessionHistory.push(session);
      await this.saveSessionHistory();

      // Update user profile
      if (this.userProfile) {
        const updatedProfile = { ...this.userProfile };
        updatedProfile.totalSessions += 1;
        updatedProfile.totalHours += sessionData.duration / 60;
        updatedProfile.lastSessionDate = session.completedAt;
        
        // Update focus level if this was a higher level
        if (sessionData.focusLevel > updatedProfile.currentFocusLevel) {
          updatedProfile.currentFocusLevel = sessionData.focusLevel;
        }

        // Calculate streak
        updatedProfile.streakDays = this.calculateStreak();

        await this.saveUserProfile(updatedProfile);
        
        // Check for new achievements
        await this.checkAndUnlockAchievements();
      }
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  }

  // Get session history
  async getSessionHistory(): Promise<SessionRecord[]> {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
      if (historyData) {
        this.sessionHistory = JSON.parse(historyData);
      }
      return this.sessionHistory;
    } catch (error) {
      console.error('Error loading session history:', error);
      return [];
    }
  }

  // Save session history
  private async saveSessionHistory(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(this.sessionHistory));
    } catch (error) {
      console.error('Error saving session history:', error);
      throw error;
    }
  }

  // Calculate current streak
  private calculateStreak(): number {
    if (this.sessionHistory.length === 0) return 0;

    const sortedSessions = this.sessionHistory
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.completedAt);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  }

  // Initialize achievements
  private async initializeAchievements(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
    } catch (error) {
      console.error('Error initializing achievements:', error);
    }
  }

  // Get achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const achievementsData = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return achievementsData ? JSON.parse(achievementsData) : DEFAULT_ACHIEVEMENTS;
    } catch (error) {
      console.error('Error loading achievements:', error);
      return DEFAULT_ACHIEVEMENTS;
    }
  }

  // Check and unlock achievements
  private async checkAndUnlockAchievements(): Promise<Achievement[]> {
    if (!this.userProfile) return [];

    const achievements = await this.getAchievements();
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievements) {
      if (achievement.unlockedAt) continue; // Already unlocked

      let shouldUnlock = false;

      switch (achievement.requirements.type) {
        case 'sessions':
          const sessionCount = achievement.requirements.category
            ? this.sessionHistory.filter(s => s.category === achievement.requirements.category).length
            : this.userProfile.totalSessions;
          shouldUnlock = sessionCount >= achievement.requirements.target;
          break;

        case 'hours':
          shouldUnlock = this.userProfile.totalHours >= achievement.requirements.target;
          break;

        case 'streak':
          shouldUnlock = this.userProfile.streakDays >= achievement.requirements.target;
          break;

        case 'level':
          shouldUnlock = this.userProfile.currentFocusLevel >= achievement.requirements.target;
          break;
      }

      if (shouldUnlock) {
        achievement.unlockedAt = new Date().toISOString();
        this.userProfile.achievements.push(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }

    if (newlyUnlocked.length > 0) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      await this.saveUserProfile(this.userProfile);
    }

    return newlyUnlocked;
  }

  // Get daily stats
  async getDailyStats(): Promise<{ sessions: number; duration: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = this.sessionHistory.filter(session => {
      const sessionDate = new Date(session.completedAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });

    return {
      sessions: todaySessions.length,
      duration: todaySessions.reduce((total, session) => total + session.duration, 0),
    };
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.userProfile) throw new Error('No user profile found');

    const updatedProfile = {
      ...this.userProfile,
      preferences: { ...this.userProfile.preferences, ...preferences },
    };

    await this.saveUserProfile(updatedProfile);
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      this.userProfile = null;
      this.sessionHistory = [];
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export default UserDataService.getInstance();