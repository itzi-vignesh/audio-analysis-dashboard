
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadSection from '@/components/UploadSection';
import RecordSection from '@/components/RecordSection';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import { CallAnalysis, fetchMockAnalysis } from '@/utils/mockData';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleUploadComplete = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Create a temporary URL for the file
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      // Fetch mock analysis data (in a real app, this would be an API call)
      const result = await fetchMockAnalysis();
      setAnalysis(result);
    } catch (error) {
      toast.error('Failed to analyze the audio. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRecordingComplete = async (blob: Blob, duration: number) => {
    setIsAnalyzing(true);
    try {
      // Create a URL for the recorded blob
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      // Fetch mock analysis data (in a real app, this would be an API call)
      const result = await fetchMockAnalysis();
      setAnalysis(result);
    } catch (error) {
      toast.error('Failed to analyze the recording. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      {!analysis ? (
        <>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">Call Analysis Tool</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload or record a customer support call to analyze compliance, sentiment, and key insights
            </p>
          </div>

          {isAnalyzing ? (
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
        </>
      ) : (
        audioUrl && <AnalysisDashboard analysis={analysis} audioUrl={audioUrl} />
      )}
    </div>
  );
};

export default Index;
