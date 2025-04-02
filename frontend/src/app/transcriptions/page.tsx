'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Transcription {
  id: number;
  guild_name: string;
  channel_name: string;
  start_time: string;
  end_time: string;
  transcription: string;
  created_at: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TranscriptionsPage() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const fetchTranscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranscriptions(data || []);
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // const addBotToServer = () => {
  //   window.location.href = 'https://discord.com/oauth2/authorize?client_id=1356570258143711303';
  // };
  const addBotToServer = () => {
    window.open('https://discord.com/oauth2/authorize?client_id=1356570258143711303', '_blank');
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Voice Transcriptions</h1>
          <button
            onClick={addBotToServer}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Add to Discord
          </button>
        </div>
        
        {transcriptions.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow text-center">
            <p className="text-black">No transcriptions found. Start recording in Discord to see them here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {transcriptions.map((transcription) => (
              <div key={transcription.id} className="bg-white rounded-lg p-6 shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-black">
                      {transcription.guild_name}
                    </h2>
                    <p className="text-black">Channel: {transcription.channel_name}</p>
                  </div>
                  <div className="text-sm text-black">
                    {formatDate(transcription.created_at)}
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-black">
                    {transcription.transcription}
                  </pre>
                </div>
                
                <div className="mt-4 text-sm text-black">
                  Duration: {new Date(transcription.end_time).getTime() - new Date(transcription.start_time).getTime()}ms
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 