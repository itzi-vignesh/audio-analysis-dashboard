
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadSection from '@/components/UploadSection';
import RecordSection from '@/components/RecordSection';
import { toast } from '@/components/ui/sonner';
import { useAnalyzeAudio, useAnalyzeRecording } from '@/services/apiService';

const Index = () => {
  const navigate = useNavigate();
  const analyzeAudio = useAnalyzeAudio();
  const analyzeRecording = useAnalyzeRecording();

  const handleUploadComplete = async (file: File) => {
    try {
      // Create a temporary URL for the file
      const url = URL.createObjectURL(file);
      
      // Call the API to analyze the file
      const result = await analyzeAudio.mutateAsync(file);
      
      // Navigate to results page with analysis data
      navigate('/results', { 
        state: { 
          analysis: result,
          audioUrl: url
        }
      });
    } catch (error) {
      toast.error('Failed to analyze the audio. Please try again.');
      console.error('Analysis error:', error);
    }
  };

  const handleRecordingComplete = async (blob: Blob, duration: number) => {
    try {
      // Create a URL for the recorded blob
      const url = URL.createObjectURL(blob);
      
      // Call the API to analyze the recording
      const result = await analyzeRecording.mutateAsync({ blob, duration });
      
      // Navigate to results page with analysis data
      navigate('/results', { 
        state: { 
          analysis: result,
          audioUrl: url
        }
      });
    } catch (error) {
      toast.error('Failed to analyze the recording. Please try again.');
      console.error('Analysis error:', error);
    }
  };

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Call Analysis Tool</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload or record a customer support call to analyze compliance, sentiment, and key insights
        </p>
      </div>

      {analyzeAudio.isPending || analyzeRecording.isPending ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Analyzing Audio</h2>
          <p className="text-muted-foreground">
            This might take a few moments...
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Audio</TabsTrigger>
              <TabsTrigger value="record">Record Audio</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="upload" className="mt-0">
                <UploadSection onUploadComplete={handleUploadComplete} />
              </TabsContent>
              <TabsContent value="record" className="mt-0">
                <RecordSection onRecordingComplete={handleRecordingComplete} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Index;
