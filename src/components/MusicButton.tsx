import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music, VolumeX } from "lucide-react";

export default function MusicButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for background music
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    // Add a simple gaming ambient sound (you can replace with actual music file)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // For demo, we'll just toggle the state
      // In a real app, you'd load and play actual music files
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log("Audio autoplay was prevented");
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Button
      onClick={toggleMusic}
      size="icon"
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card shadow-gaming gaming-pulse z-40"
    >
      {isPlaying ? (
        <Music className="h-6 w-6" />
      ) : (
        <VolumeX className="h-6 w-6" />
      )}
    </Button>
  );
}