
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import TranscriptView from './TranscriptView';
import AnalysisCharts from './AnalysisCharts';
import { CallAnalysis } from '@/utils/mockData';
import { generatePDF } from '@/utils/audioUtils';

interface AnalysisDashboardProps {
  analysis: CallAnalysis;
  audioUrl: string;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, audioUrl }) => {
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSegmentClick = (startTime: number) => {
    setCurrentTime(startTime);
  };

  const handleDownloadReport = () => {
    generatePDF(analysis.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Call Analysis Results</h1>
          <p className="text-muted-foreground">
            File: {analysis.filename} • {formatDate(analysis.createdAt)}
          </p>
        </div>
        <Button onClick={handleDownloadReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <AudioPlayer 
        audioUrl={audioUrl} 
        currentTime={currentTime}
        onTimeUpdate={handleTimeUpdate}
      />

      <Tabs defaultValue="transcript">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcript" className="mt-4">
          <TranscriptView 
            transcript={analysis.transcript} 
            currentTime={currentTime}
            onSegmentClick={handleSegmentClick}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Call Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{analysis.summary}</p>
            </CardContent>
          </Card>
          
          <AnalysisCharts 
            complianceScore={analysis.complianceScore}
            sentimentScore={analysis.sentimentScore}
            toxicityScore={analysis.toxicityScore}
            emotionLevels={analysis.emotionLevels}
            complianceRules={analysis.complianceRules}
            sentimentLabel={analysis.sentimentLabel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisDashboard;
