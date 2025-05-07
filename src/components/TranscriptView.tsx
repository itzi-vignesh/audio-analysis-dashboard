
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TranscriptSegment } from '@/utils/mockData';
import { formatTime } from '@/utils/audioUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TranscriptViewProps {
  transcript: TranscriptSegment[];
  currentTime?: number;
  onSegmentClick?: (startTime: number) => void;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcript,
  currentTime = 0,
  onSegmentClick,
}) => {
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const segmentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Find the active segment based on current playback time
  useEffect(() => {
    const activeSegment = transcript.find(
      (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
    );
    
    if (activeSegment) {
      setActiveSegmentId(activeSegment.id);
      // Scroll to the active segment
      if (segmentRefs.current[activeSegment.id]) {
        segmentRefs.current[activeSegment.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [currentTime, transcript]);

  const handleSegmentClick = (segment: TranscriptSegment) => {
    if (onSegmentClick) {
      onSegmentClick(segment.startTime);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Call Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {transcript.map((segment) => (
              <div
                key={segment.id}
                ref={(el) => (segmentRefs.current[segment.id] = el)}
                className={cn(
                  "p-3 rounded-lg transition-all cursor-pointer",
                  segment.id === activeSegmentId
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50",
                  segment.speaker === "agent" 
                    ? "border-l-4 border-l-callAnalysis-agent" 
                    : "border-l-4 border-l-callAnalysis-customer"
                )}
                onClick={() => handleSegmentClick(segment)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className={cn(
                      "text-sm font-medium px-2 py-0.5 rounded-full",
                      segment.speaker === "agent" 
                        ? "bg-callAnalysis-agent/10 text-callAnalysis-agent" 
                        : "bg-callAnalysis-customer/10 text-callAnalysis-customer"
                    )}
                  >
                    {segment.speaker === "agent" ? "Agent" : "Customer"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{segment.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TranscriptView;
