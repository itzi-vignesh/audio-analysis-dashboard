
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

export const mockAnalysisData: CallAnalysis = {
  id: "mock-analysis-1",
  filename: "customer_support_call_1.mp3",
  duration: 187, // 3:07 minutes
  complianceScore: 85,
  sentimentScore: 0.42,
  toxicityScore: 0.08,
  emotionLevels: {
    happy: 0.35,
    angry: 0.05,
    sad: 0.15,
    surprised: 0.10,
    neutral: 0.35,
  },
  complianceRules: {
    greeting: true,
    identity: true,
    disclosure: true,
    consent: false,
    clarity: true,
  },
  sentimentLabel: "positive",
  summary: "The customer called regarding a billing issue on their account. The agent successfully identified the error and issued a refund. The customer was satisfied with the resolution. The agent failed to get explicit consent for recording the call.",
  transcript: [
    {
      id: "segment-1",
      speaker: "agent",
      text: "Thank you for calling customer support. My name is Sarah. How can I help you today?",
      startTime: 0,
      endTime: 5.2,
    },
    {
      id: "segment-2",
      speaker: "customer",
      text: "Hi Sarah, I'm calling because I noticed an extra charge on my bill this month and I'm not sure what it's for.",
      startTime: 5.5,
      endTime: 10.7,
    },
    {
      id: "segment-3",
      speaker: "agent",
      text: "I understand your concern about the unexpected charge. May I please have your account number or the phone number associated with the account so I can look into this for you?",
      startTime: 11.0,
      endTime: 16.8,
    },
    {
      id: "segment-4",
      speaker: "customer",
      text: "Sure, my account number is 87654321.",
      startTime: 17.1,
      endTime: 19.5,
    },
    {
      id: "segment-5",
      speaker: "agent",
      text: "Thank you. Let me pull up your account and take a look at the recent charges. Just a moment please.",
      startTime: 19.8,
      endTime: 24.3,
    },
    {
      id: "segment-6",
      speaker: "agent",
      text: "I can see the charge you're referring to. It looks like there was a system error that resulted in a duplicate charge for your monthly subscription. I apologize for this mistake.",
      startTime: 30.5,
      endTime: 38.2,
    },
    {
      id: "segment-7",
      speaker: "customer",
      text: "Oh I see. That's what I thought might have happened.",
      startTime: 38.5,
      endTime: 41.0,
    },
    {
      id: "segment-8",
      speaker: "agent",
      text: "I'll process a refund for the duplicate charge right away. The refund should appear on your account within 3-5 business days.",
      startTime: 41.3,
      endTime: 47.8,
    },
    {
      id: "segment-9",
      speaker: "customer",
      text: "Great, thank you for fixing this so quickly. I appreciate it.",
      startTime: 48.1,
      endTime: 51.6,
    },
    {
      id: "segment-10",
      speaker: "agent",
      text: "You're welcome. I'm happy I could resolve this issue for you. Is there anything else I can assist you with today?",
      startTime: 52.0,
      endTime: 56.5,
    },
    {
      id: "segment-11",
      speaker: "customer",
      text: "No, that's everything. Thanks again for your help.",
      startTime: 56.8,
      endTime: 59.3,
    },
    {
      id: "segment-12",
      speaker: "agent",
      text: "Thank you for calling customer support. Have a wonderful day!",
      startTime: 59.6,
      endTime: 63.1,
    }
  ],
  createdAt: "2025-05-07T10:30:00Z",
};

// Helper function to simulate a loading delay and return mock data
export const fetchMockAnalysis = (): Promise<CallAnalysis> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalysisData);
    }, 2000); // 2 second delay to simulate loading
  });
};
