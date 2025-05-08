
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import { CallAnalysis } from '@/utils/mockData';
import { toast } from '@/components/ui/sonner';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = location.state?.analysis as CallAnalysis | undefined;
  const audioUrl = location.state?.audioUrl as string | undefined;

  useEffect(() => {
    // If no analysis data is passed, redirect back to the upload page
    if (!analysis || !audioUrl) {
      toast.error('No analysis data found. Please upload or record audio first.');
      navigate('/');
    }
  }, [analysis, audioUrl, navigate]);

  // If we're still in the process of redirecting or don't have data, don't render anything meaningful
  if (!analysis || !audioUrl) {
    return <div className="container max-w-screen-xl mx-auto py-8 px-4">Redirecting...</div>;
  }

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          Back to Upload
        </button>
      </div>
      
      <AnalysisDashboard analysis={analysis} audioUrl={audioUrl} />
    </div>
  );
};

export default Results;
