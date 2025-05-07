
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Volume1, VolumeX } from 'lucide-react';
import { formatTime } from '@/utils/audioUtils';

interface AudioPlayerProps {
  audioUrl: string;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl,
  currentTime,
  onTimeUpdate
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentProgress(audio.currentTime);
      if (onTimeUpdate) onTimeUpdate(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentProgress(0);
      if (onTimeUpdate) onTimeUpdate(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate]);

  useEffect(() => {
    if (currentTime !== undefined && audioRef.current) {
      audioRef.current.currentTime = currentTime;
      setCurrentProgress(currentTime);
    }
  }, [currentTime]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      if (onTimeUpdate) onTimeUpdate(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (volume === 0) {
        setVolume(0.75);
        audioRef.current.volume = 0.75;
      } else {
        setVolume(0);
        audioRef.current.volume = 0;
      }
    }
  };

  return (
    <div className="bg-card border rounded-md p-3">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={togglePlay}
          className="shrink-0"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs font-mono min-w-[40px]">
            {formatTime(currentProgress)}
          </span>
          
          <Slider
            value={[currentProgress]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="w-full"
          />
          
          <span className="text-xs font-mono min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleMute}
          >
            <VolumeIcon />
          </Button>
          
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
