import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CoachSubmission {
  id: string;
  name: string;
  age: string;
  phone: string;
  best_times: string;
  availability: string;
  background: string;
  sport: string;
  email: string;
  pitch: string;
  final_thoughts: string;
  acknowledgement: boolean;
  created_at: string;
}

export default function CoachSubmissionsPanel() {
  const [coaches, setCoaches] = useState<CoachSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      const { data, error } = await supabase
        .from('coach_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setCoaches([]);
      } else {
        setCoaches(data as CoachSubmission[]);
      }
      setLoading(false);
    };
    fetchCoaches();
    // Subscribe to realtime inserts so admin panel updates live
    let subscription: any = null;
    try {
      if (supabase) {
        subscription = supabase
          .channel('public:coach_submissions')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'coach_submissions' }, (payload) => {
            setCoaches((prev) => [payload.new as CoachSubmission, ...(prev || [])]);
          })
          .subscribe();
      }
    } catch (err) {
      console.warn('Realtime subscription failed', err);
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-8">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-3 gap-1">
            <img src="/coach1.jpg" alt="" className="w-full h-24 object-cover" />
            <img src="/coach2.jpg" alt="" className="w-full h-24 object-cover" />
            <img src="/coach3.jpg" alt="" className="w-full h-24 object-cover" />
          </div>
          <div className="p-4 bg-black/60">
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-brand text-2xl sm:text-3xl md:text-4xl font-bold text-luxury">
              Coach Submissions
            </motion.h2>
            <p className="text-sm text-gray-400 mt-1">Prospective coaches who applied to join WhozNexxSports.</p>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coaches.length === 0 ? (
        <div className="text-center text-gray-400">No coach submissions found.</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-black/40">
                <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Sport</th>
                <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {coaches.map((coach) => (
                <tr key={coach.id} className="hover:bg-red-900/10 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{coach.name}</td>
                  <td className="px-4 py-3 text-gray-300">{coach.sport}</td>
                  <td className="px-4 py-3 text-yellow-400 font-semibold">{coach.phone}</td>
                  <td className="px-4 py-3 text-gray-400">{coach.email}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{coach.created_at ? new Date(coach.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
