'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface VoiceSession {
  id: number;
  guild_id: string;
  channel_id: string;
  transcript: string;
  tasks: string[];
  summary: string;
  created_at: string;
}

export default function VoiceSessions() {
  const [sessions, setSessions] = useState<VoiceSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      const { data, error } = await supabase
        .from('voice_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Sessions</h1>
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">Session {session.id}</h2>
              <span className="text-sm text-gray-500">
                {new Date(session.created_at).toLocaleString()}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-1">Summary</h3>
              <p className="text-gray-700">{session.summary}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Tasks</h3>
              <ul className="list-disc list-inside">
                {session.tasks.map((task, index) => (
                  <li key={index} className="text-gray-700">{task}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-1">Transcript</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{session.transcript}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 