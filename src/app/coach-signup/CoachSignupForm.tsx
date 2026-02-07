"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function CoachSignupForm() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    phone: '',
    bestTimes: '',
    availability: '',
    background: '',
    sport: '',
    email: '',
    pitch: '',
    finalThoughts: '',
    acknowledgement: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : false;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validEmail = (v: string) => v.includes('@') && v.includes('.') && v.length > 5;
  const validPhone = (v: string) => {
    const digits = Array.from(v).filter((ch) => '0123456789'.includes(ch)).length;
    return digits >= 7 && digits <= 20;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validPhone(form.phone)) {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized. Submission will not be saved to DB.');
        setSubmitted(true);
        setLoading(false);
        return;
      }

      const payload = {
        name: form.name,
        age: form.age,
        phone: form.phone,
        best_times: form.bestTimes,
        availability: form.availability,
        background: form.background,
        sport: form.sport,
        email: form.email,
        pitch: form.pitch,
        final_thoughts: form.finalThoughts,
        acknowledgement: form.acknowledgement,
      };

      const { error: insertError } = await supabase.from('coach_submissions').insert([payload]);
      if (insertError) {
        console.error('Supabase insert error', insertError);
        setError(insertError.message || 'Failed to submit.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : 'Submission failed.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-10 text-center bg-emerald-900/10 rounded-2xl shadow-lg border border-emerald-700/10">
        <h2 className="text-3xl font-bold mb-4 text-emerald-400">Thank you for your submission!</h2>
        <p className="text-xl text-emerald-200">We appreciate your interest in joining WhozNexxSports. Our team will review your application and reach out if you are selected for the next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto bg-gradient-to-br from-black/70 via-black/60 to-black/50 rounded-3xl shadow-2xl p-12 sm:p-20 space-y-10 border border-red-900/20 backdrop-blur-md text-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl sm:text-5xl font-brand font-bold text-white mb-2">Coach Application</h2>
          <p className="text-gray-300 text-base">Fill this out to be considered for a coaching position. Submission is consideration only.</p>
        </div>
        <div className="hidden sm:block">
          <img src="/coach-illustration.png" alt="Coaching" className="h-24 w-auto opacity-90" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-red-600 outline-none transition" />
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Age</label>
          <input name="age" value={form.age} onChange={handleChange} required placeholder="Age" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-red-600 outline-none transition" type="number" min="18" />
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-2 block">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-red-600 outline-none transition" />
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Email</label>
          <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-red-600 outline-none transition" type="email" />
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-2 block">Best Times to Reach</label>
          <textarea name="bestTimes" value={form.bestTimes} onChange={handleChange} required placeholder="e.g., Weekdays after 5pm" rows={3} className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 h-28 resize-y focus:ring-4 focus:ring-red-600 outline-none transition text-lg" />
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Availability</label>
          <textarea name="availability" value={form.availability} onChange={handleChange} required placeholder="Days / times available" rows={3} className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 h-28 resize-y focus:ring-4 focus:ring-red-600 outline-none transition text-lg" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-gray-300 mb-2 block">Coaching Background</label>
          <textarea name="background" value={form.background} onChange={handleChange} required placeholder="Brief coaching history, certifications" rows={4} className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 h-36 resize-y focus:ring-4 focus:ring-red-600 outline-none transition text-lg" />
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-2 block">Preferred Sport</label>
          <input name="sport" value={form.sport} onChange={handleChange} required placeholder="Football, Soccer, etc." className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-red-600 outline-none transition" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-gray-300 mb-2 block">Why would you be a good fit?</label>
          <textarea name="pitch" value={form.pitch} onChange={handleChange} required placeholder="Tell us what you'd bring to WhozNexxSports" rows={5} className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 h-44 resize-y focus:ring-4 focus:ring-red-600 outline-none transition text-lg" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-gray-300 mb-2 block">Final Thoughts (optional)</label>
          <textarea name="finalThoughts" value={form.finalThoughts} onChange={handleChange} placeholder="Anything else to add" rows={4} className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-2xl px-6 py-4 h-36 resize-y focus:ring-4 focus:ring-red-600 outline-none transition text-lg" />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-base text-gray-300 cursor-pointer">
            <input type="checkbox" name="acknowledgement" checked={form.acknowledgement} onChange={handleChange} required className="mt-1 w-5 h-5 accent-red-500" />
            <span>I acknowledge this is a consideration, not a guarantee. WhozNexxSports does not owe me a job, reimbursement, or liability until signed on. Terms will be agreed upon if selected.</span>
          </label>
        </div>
      </div>

      {error && <div className="text-base text-red-400 bg-black/40 p-4 rounded-lg">{error}</div>}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-bold py-4 rounded-2xl text-xl shadow-xl transition-all duration-300 hover:scale-[1.02]">
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
        <button type="button" onClick={() => setForm({name:'',age:'',phone:'',bestTimes:'',availability:'',background:'',sport:'',email:'',pitch:'',finalThoughts:'',acknowledgement:false})} className="px-6 py-4 rounded-2xl border border-gray-800 text-gray-300 hover:bg-white/5 text-lg">Reset</button>
      </div>
    </form>
  );
}
