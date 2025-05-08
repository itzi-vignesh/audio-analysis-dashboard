
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, 
  Tooltip, Legend, CartesianGrid 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmotionData {
  happy: number;
  angry: number;
  sad: number;
  surprised: number;
  neutral: number;
}

interface ComplianceRules {
  greeting: boolean;
  identity: boolean;
  disclosure: boolean;
  consent: boolean;
  clarity: boolean;
}

interface AnalysisChartsProps {
  complianceScore: number;
  sentimentScore: number;
  toxicityScore: number;
  emotionLevels: EmotionData;
  complianceRules: ComplianceRules;
  sentimentLabel: 'positive' | 'negative' | 'neutral';
}

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({
  complianceScore,
  sentimentScore,
  toxicityScore,
  emotionLevels,
  complianceRules,
  sentimentLabel,
}) => {
  // Format emotion data for charts
  const emotionData = [
    { name: 'Happy', value: emotionLevels.happy * 100 },
    { name: 'Angry', value: emotionLevels.angry * 100 },
    { name: 'Sad', value: emotionLevels.sad * 100 },
    { name: 'Surprised', value: emotionLevels.surprised * 100 },
    { name: 'Neutral', value: emotionLevels.neutral * 100 },
  ];

  const emotionColors = {
    'Happy': '#4ade80',
    'Angry': '#ef4444',
    'Sad': '#60a5fa',
    'Surprised': '#facc15',
    'Neutral': '#a3a3a3',
  };

  // Format scores for charts
  const scoreData = [
    { name: 'Compliance', value: complianceScore },
    { name: 'Sentiment', value: (sentimentScore + 1) * 50 }, // Convert -1 to 1 range to 0 to 100
    { name: 'Toxicity', value: toxicityScore * 100 },
  ];

  const scoreColors = {
    'Compliance': '#10b981',
    'Sentiment': '#3b82f6',
    'Toxicity': '#f87171',
  };

  // Prepare compliance rules data
  const complianceRulesData = Object.entries(complianceRules).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    passed: value,
  }));

  // Get sentiment color
  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'bg-callAnalysis-positive text-white';
      case 'negative':
        return 'bg-callAnalysis-negative text-white';
      default:
        return 'bg-callAnalysis-neutral text-white';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Compliance Score Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            Compliance Score
            <Badge className={cn(
              complianceScore >= 80 
                ? 'bg-callAnalysis-compliance' 
                : complianceScore >= 60 
                  ? 'bg-callAnalysis-warning' 
                  : 'bg-callAnalysis-error',
              'text-white'
            )}>
              {complianceScore}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceRulesData.map((rule) => (
              <div 
                key={rule.name} 
                className="flex items-center justify-between p-2 rounded-md bg-muted/30"
              >
                <span className="text-sm">{rule.name}</span>
                {rule.passed ? (
                  <CheckCircle className="h-5 w-5 text-callAnalysis-compliance" />
                ) : (
                  <XCircle className="h-5 w-5 text-callAnalysis-error" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call Sentiment Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            Call Sentiment
            <Badge className={getSentimentColor(sentimentLabel)}>
              {sentimentLabel.charAt(0).toUpperCase() + sentimentLabel.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={100} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip 
                formatter={(value) => {
                  return typeof value === 'number' 
                    ? `${value.toFixed(0)}%` 
                    : `${value}%`;
                }} 
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {scoreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={scoreColors[entry.name as keyof typeof scoreColors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Emotion Analysis Card */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Emotion Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {emotionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={emotionColors[entry.name as keyof typeof emotionColors]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => {
                  return typeof value === 'number' 
                    ? `${value.toFixed(0)}%` 
                    : `${value}%`;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisCharts;
