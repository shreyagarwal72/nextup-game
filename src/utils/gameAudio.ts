class GameAudio {
  private backgroundMusic: HTMLAudioElement | null = null;
  private soundEffects: { [key: string]: HTMLAudioElement } = {};
  private masterVolume: number = 0.7;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;
  private isMuted: boolean = false;

  constructor() {
    this.loadSettings();
    this.initializeAudio();
  }

  private loadSettings() {
    const settings = localStorage.getItem('gameSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.masterVolume = (parsed.masterVolume?.[0] || 70) / 100;
      this.musicVolume = (parsed.musicVolume?.[0] || 50) / 100;
      this.sfxVolume = (parsed.soundEffects?.[0] || 80) / 100;
      this.isMuted = parsed.muteAll || false;
    }
  }

  private initializeAudio() {
    // Create background music for games
    this.createBackgroundMusic();
    this.createSoundEffects();
  }

  private createBackgroundMusic() {
    // Create a simple background music using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    
    // Create audio element for easier control
    const audio = new Audio();
    audio.loop = true;
    audio.volume = this.getEffectiveVolume('music');
    
    this.backgroundMusic = audio;
  }

  private createSoundEffects() {
    const effects = ['click', 'score', 'gameOver', 'move', 'rotate', 'line'];
    
    effects.forEach(effect => {
      const audio = new Audio();
      audio.volume = this.getEffectiveVolume('sfx');
      this.soundEffects[effect] = audio;
    });
  }

  private getEffectiveVolume(type: 'music' | 'sfx'): number {
    if (this.isMuted) return 0;
    const baseVolume = type === 'music' ? this.musicVolume : this.sfxVolume;
    return baseVolume * this.masterVolume;
  }

  // Generate sounds using Web Audio API for better compatibility
  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      const volume = this.getEffectiveVolume('sfx');
      gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio generation failed:', error);
    }
  }

  public playBackgroundMusic() {
    if (this.backgroundMusic && !this.isMuted) {
      this.backgroundMusic.volume = this.getEffectiveVolume('music');
      this.backgroundMusic.play().catch(e => console.warn('Background music play failed:', e));
    }
  }

  public stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  public playSound(effect: string) {
    if (this.isMuted) return;

    // Generate different tones for different effects
    switch (effect) {
      case 'click':
        this.generateTone(800, 0.1);
        break;
      case 'score':
        this.generateTone(523, 0.2); // C5
        setTimeout(() => this.generateTone(659, 0.2), 100); // E5
        break;
      case 'gameOver':
        this.generateTone(220, 0.5, 'sawtooth');
        setTimeout(() => this.generateTone(196, 0.8, 'sawtooth'), 200);
        break;
      case 'move':
        this.generateTone(440, 0.05);
        break;
      case 'rotate':
        this.generateTone(660, 0.08);
        break;
      case 'line':
        this.generateTone(880, 0.3);
        setTimeout(() => this.generateTone(1108, 0.3), 150);
        break;
      case 'win':
        // Victory fanfare
        const notes = [523, 659, 784, 1047]; // C, E, G, C
        notes.forEach((note, index) => {
          setTimeout(() => this.generateTone(note, 0.3), index * 150);
        });
        break;
      default:
        this.generateTone(440, 0.1);
    }
  }

  public updateSettings(settings: any) {
    this.masterVolume = (settings.masterVolume?.[0] || 70) / 100;
    this.musicVolume = (settings.musicVolume?.[0] || 50) / 100;
    this.sfxVolume = (settings.soundEffects?.[0] || 80) / 100;
    this.isMuted = settings.muteAll || false;

    // Update all audio volumes
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.getEffectiveVolume('music');
    }

    Object.values(this.soundEffects).forEach(audio => {
      audio.volume = this.getEffectiveVolume('sfx');
    });
  }
}

export const gameAudio = new GameAudio();