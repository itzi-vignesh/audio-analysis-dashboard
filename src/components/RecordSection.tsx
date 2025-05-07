
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Pause, Stop } from 'lucide-react';
import { formatTime, createDownloadLink, isBrowserSupported } from '@/utils/audioUtils';
import { toast } from '@/components/ui/sonner';

interface RecordSectionProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
}

const RecordSection: React.FC<RecordSectionProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(isBrowserSupported());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = createDownloadLink(blob, 'recording.webm');
        
        setAudioBlob(blob);
        setAudioUrl(url);
        setAudioChunks(chunks);
        setIsRecording(false);
        setIsPaused(false);
      };
      
      setMediaRecorder(recorder);
      setAudioChunks([]);
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      mediaRecorder.stop();
      
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const handleAnalyzeClick = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob, recordingTime);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioChunks([]);
    setRecordingTime(0);
  };

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center p-4">
            <MicOff className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Recording Not Supported</h3>
            <p className="text-muted-foreground">
              Your browser does not support audio recording. 
              Please try using a modern browser like Chrome, Firefox, or Edge.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="text-center">
          {!isRecording && !audioBlob ? (
            <>
              <Mic className={`mx-auto h-12 w-12 mb-4 ${isRecording ? 'text-destructive animate-pulse-opacity' : 'text-muted-foreground'}`} />
              <h3 className="text-lg font-medium mb-2">Record Audio</h3>
              <p className="text-muted-foreground mb-4">
                Record your customer support call directly from your browser
              </p>
              <Button 
                onClick={startRecording} 
                className="mt-2"
                variant="outline"
              >
                Start Recording
              </Button>
            </>
          ) : isRecording ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <Mic className="h-12 w-12 text-destructive animate-pulse-opacity mb-3" />
                <div className="text-2xl font-mono font-medium">
                  {formatTime(recordingTime)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isPaused ? 'Recording Paused' : 'Recording in Progress'}
                </p>
              </div>
              
              <div className="flex justify-center space-x-3">
                {isPaused ? (
                  <Button onClick={resumeRecording} variant="outline" size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={pauseRecording} variant="outline" size="icon">
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                <Button onClick={stopRecording} variant="destructive" size="icon">
                  <Stop className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : audioBlob ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <Mic className="h-12 w-12 text-primary mb-3" />
                <p className="font-medium">Recording Complete</p>
                <p className="text-sm text-muted-foreground">
                  Duration: {formatTime(recordingTime)}
                </p>
              </div>
              
              {audioUrl && (
                <audio controls className="w-full mt-3" src={audioUrl}></audio>
              )}
              
              <div className="flex justify-center space-x-3">
                <Button onClick={resetRecording} variant="outline">
                  Record Again
                </Button>
                <Button onClick={handleAnalyzeClick}>
                  Analyze Recording
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordSection;
