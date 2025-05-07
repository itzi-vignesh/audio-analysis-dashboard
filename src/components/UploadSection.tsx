
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { simulateFileUpload, isValidAudioFile, getFileSizeString } from '@/utils/audioUtils';
import { Upload, File, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface UploadSectionProps {
  onUploadComplete: (file: File) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!isValidAudioFile(selectedFile)) {
      toast.error('Invalid file type. Please upload an MP3 or WAV file.');
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error('File is too large. Maximum size is 100MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeClick = () => {
    if (!file) return;
    
    setIsUploading(true);
    simulateFileUpload(
      file,
      (progress) => setUploadProgress(progress),
      () => {
        setIsUploading(false);
        toast.success('File uploaded successfully!');
        onUploadComplete(file);
      },
      (error) => {
        setIsUploading(false);
        toast.error(`Upload failed: ${error}`);
      }
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-all ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          } ${file ? 'bg-muted/30' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".mp3,.wav"
            onChange={handleInputChange}
          />
          
          {!file ? (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Audio File</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop an audio file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supported formats: MP3, WAV (Max 100MB)
              </p>
              <Button onClick={handleUploadClick} variant="outline" className="mt-2">
                Select File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{getFileSizeString(file.size)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              ) : (
                <Button 
                  onClick={handleAnalyzeClick} 
                  className="w-full"
                >
                  Analyze Audio
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
