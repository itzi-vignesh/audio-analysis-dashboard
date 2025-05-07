export interface AudioRecorderState {
  recording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  duration: number;
  error: string | null;
}

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const createDownloadLink = (blob: Blob, filename: string): string => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  return url;
};

export const generatePDF = async (analysisId: string): Promise<void> => {
  // This is a placeholder for PDF generation functionality
  // In a real app, you would use a library like jsPDF or integrate with a server-side PDF generator
  alert(`Report for analysis ${analysisId} would be downloaded as PDF.`);
};

// Check if browser supports MediaRecorder API
export const isBrowserSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// Function to check file type validity
export const isValidAudioFile = (file: File): boolean => {
  const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/webm'];
  return validTypes.includes(file.type) || file.name.endsWith('.mp3') || file.name.endsWith('.wav');
};

// Function to get file extension
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Get file size in human-readable format
export const getFileSizeString = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} bytes`;
  else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  else return `${(bytes / 1048576).toFixed(1)} MB`;
};

// Simulate file upload with progress
export const simulateFileUpload = (
  file: File,
  onProgress: (progress: number) => void,
  onComplete: () => void,
  onError: (error: string) => void
): void => {
  let progress = 0;
  const totalSteps = 10;
  const interval = setInterval(() => {
    progress += 100 / totalSteps;
    onProgress(Math.min(progress, 100));
    
    if (progress >= 100) {
      clearInterval(interval);
      onComplete();
    }
  }, 300);
};
