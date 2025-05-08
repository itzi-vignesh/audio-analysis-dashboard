
export interface TranscriptSegment {
  id: string;
  speaker: 'agent' | 'customer';
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
}

export interface CallAnalysis {
  id: string;
  filename: string;
  duration: number; // in seconds
  complianceScore: number; // 0-100
  sentimentScore: number; // -1 to 1
  toxicityScore: number; // 0-1
  emotionLevels: {
    happy: number;
    angry: number;
    sad: number;
    surprised: number;
    neutral: number;
  };
  complianceRules: {
    greeting: boolean;
    identity: boolean;
    disclosure: boolean;
    consent: boolean;
    clarity: boolean;
  };
  sentimentLabel: 'positive' | 'negative' | 'neutral';
  summary: string;
  transcript: TranscriptSegment[];
  createdAt: string;
}
