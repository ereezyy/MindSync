export interface BinauralBeatConfig {
  leftFrequency: number;
  rightFrequency: number;
  duration: number;
  volume: number;
  waveType: 'sine' | 'square' | 'triangle' | 'sawtooth';
}

export interface SessionConfig {
  focusLevel: number;
  targetBrainwave: 'alpha' | 'beta' | 'theta' | 'delta';
  baseFrequency: number;
  beatFrequency: number;
  rampDuration: number;
  sustainDuration: number;
  fadeOutDuration: number;
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private isPlaying = false;
  private currentConfig: BinauralBeatConfig | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      // @ts-ignore - Web Audio API compatibility
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  public async startSession(config: BinauralBeatConfig): Promise<void> {
    if (!this.audioContext || !this.gainNode) {
      throw new Error('Audio context not initialized');
    }

    // Resume audio context if suspended (required by browsers)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.stopSession();
    
    this.currentConfig = config;
    
    // Create oscillators
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();

    // Create stereo panner nodes
    const leftPanner = this.audioContext.createStereoPanner();
    const rightPanner = this.audioContext.createStereoPanner();
    
    leftPanner.pan.value = -1; // Full left
    rightPanner.pan.value = 1;  // Full right

    // Configure oscillators
    this.leftOscillator.type = config.waveType;
    this.rightOscillator.type = config.waveType;
    
    this.leftOscillator.frequency.value = config.leftFrequency;
    this.rightOscillator.frequency.value = config.rightFrequency;

    // Connect audio nodes
    this.leftOscillator.connect(leftPanner);
    this.rightOscillator.connect(rightPanner);
    
    leftPanner.connect(this.gainNode);
    rightPanner.connect(this.gainNode);

    // Set initial volume
    this.gainNode.gain.value = config.volume;

    // Start oscillators
    this.leftOscillator.start();
    this.rightOscillator.start();

    // Auto-stop after duration
    setTimeout(() => {
      this.stopSession();
    }, config.duration);

    this.isPlaying = true;
  }

  public stopSession(): void {
    if (this.leftOscillator) {
      this.leftOscillator.stop();
      this.leftOscillator.disconnect();
      this.leftOscillator = null;
    }

    if (this.rightOscillator) {
      this.rightOscillator.stop();
      this.rightOscillator.disconnect();
      this.rightOscillator = null;
    }

    this.isPlaying = false;
    this.currentConfig = null;
  }

  public setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentConfig(): BinauralBeatConfig | null {
    return this.currentConfig;
  }

  // Pre-configured session generators
  public static generateFocusLevelConfig(level: number): BinauralBeatConfig {
    const configs: Record<number, BinauralBeatConfig> = {
      1: { // Beta - Normal waking consciousness
        leftFrequency: 220,
        rightFrequency: 235,
        duration: 15 * 60 * 1000, // 15 minutes
        volume: 0.3,
        waveType: 'sine',
      },
      3: { // Alpha - Mind awake, body asleep
        leftFrequency: 200,
        rightFrequency: 210,
        duration: 20 * 60 * 1000,
        volume: 0.25,
        waveType: 'sine',
      },
      10: { // Alpha/Theta border
        leftFrequency: 180,
        rightFrequency: 188,
        duration: 25 * 60 * 1000,
        volume: 0.2,
        waveType: 'sine',
      },
      12: { // Theta - Expanded awareness
        leftFrequency: 160,
        rightFrequency: 166,
        duration: 30 * 60 * 1000,
        volume: 0.2,
        waveType: 'sine',
      },
      15: { // Deep Theta
        leftFrequency: 140,
        rightFrequency: 145,
        duration: 35 * 60 * 1000,
        volume: 0.15,
        waveType: 'sine',
      },
      21: { // Theta/Delta border
        leftFrequency: 120,
        rightFrequency: 123,
        duration: 40 * 60 * 1000,
        volume: 0.15,
        waveType: 'sine',
      },
    };

    return configs[level] || configs[1];
  }

  public dispose(): void {
    this.stopSession();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Frequency mapping for different brainwave states
export const BrainwaveFrequencies = {
  DELTA: { min: 0.5, max: 4 },    // Deep sleep, healing
  THETA: { min: 4, max: 8 },      // Deep meditation, creativity
  ALPHA: { min: 8, max: 14 },     // Relaxed awareness
  BETA: { min: 14, max: 30 },     // Normal waking consciousness
  GAMMA: { min: 30, max: 100 },   // High-level cognitive function
};

// Gateway Process Focus Levels mapping
export const FocusLevelFrequencies = {
  1: { target: 'beta', frequency: 15 },      // Normal waking
  3: { target: 'alpha', frequency: 10 },     // Mind awake, body asleep
  10: { target: 'alpha-theta', frequency: 8 }, // Mind alert, body asleep
  12: { target: 'theta', frequency: 6 },     // Expanded awareness
  15: { target: 'deep-theta', frequency: 5 }, // State of no time
  21: { target: 'theta-delta', frequency: 3 }, // Other energy systems
};