"use client";
import { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to Supabase
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center bg-emerald-900/10 rounded-xl shadow-lg border border-emerald-700/10">
        <h2 className="text-2xl font-bold mb-4 text-emerald-400">Thank you for your submission!</h2>
        <p className="text-lg text-emerald-200">We appreciate your interest in joining WhozNexxSports. Our team will review your application and reach out if you are selected for the next steps.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Floating mosaic collage background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-10 w-[1400px] max-w-none -translate-x-1/2 opacity-40 grid grid-cols-6 gap-4 pointer-events-none">
          <img src="/coach1.jpg" alt="" className="w-40 h-40 object-cover rounded-xl shadow-2xl transform rotate-3 translate-y-2 animate-float" />
          <img src="/coach2.jpg" alt="" className="w-36 h-36 object-cover rounded-lg shadow-xl transform -rotate-6 -translate-y-2 animate-float delay-1000" />
          <img src="/coach3.jpg" alt="" className="w-44 h-44 object-cover rounded-2xl shadow-2xl transform rotate-6 translate-y-1 animate-float delay-2000" />
          <img src="/coach4.jpg" alt="" className="w-36 h-36 object-cover rounded-lg shadow-xl transform -rotate-3 translate-y-3 animate-float delay-500" />
          <img src="/coach5.jpg" alt="" className="w-40 h-40 object-cover rounded-xl shadow-2xl transform rotate-2 -translate-y-1 animate-float delay-1500" />
          <img src="/coach6.jpg" alt="" className="w-36 h-36 object-cover rounded-lg shadow-xl transform -rotate-8 translate-y-4 animate-float delay-700" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/90 to-black/95" />
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gradient-to-br from-black/70 via-black/60 to-black/50 rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 border border-red-900/20 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-brand font-bold text-white mb-1">Coach Application</h2>
          <p className="text-gray-300 text-sm">Fill this out to be considered for a coaching position. Submission is consideration only.</p>
        </div>
        <div className="hidden sm:block">
          <img src="/coach-illustration.png" alt="Coaching" className="h-20 w-auto opacity-90" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none transition" />
        </div>
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Age</label>
          <input name="age" value={form.age} onChange={handleChange} required placeholder="Age" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none transition" type="number" min="18" />
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs text-gray-300 mb-1 block">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none transition" />
        </div>
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Email</label>
          <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none transition" type="email" />
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs text-gray-300 mb-1 block">Best Times to Reach</label>
          <input name="bestTimes" value={form.bestTimes} onChange={handleChange} required placeholder="e.g., Weekdays after 5pm" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none transition" />
        </div>
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Availability</label>
          <input name="availability" value={form.availability} onChange={handleChange} required placeholder="Days / times available" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none transition" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-gray-300 mb-1 block">Coaching Background</label>
          <input name="background" value={form.background} onChange={handleChange} required placeholder="Brief coaching history, certifications" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none transition" />
        </div>

        <div>
          <label className="text-xs text-gray-300 mb-1 block">Preferred Sport</label>
          <input name="sport" value={form.sport} onChange={handleChange} required placeholder="Football, Soccer, etc." className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none transition" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-gray-300 mb-1 block">Why would you be a good fit?</label>
          <textarea name="pitch" value={form.pitch} onChange={handleChange} required placeholder="Tell us what you'd bring to WhozNexxSports" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 h-28 resize-y focus:ring-2 focus:ring-red-600 outline-none transition" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-gray-300 mb-1 block">Final Thoughts (optional)</label>
          <textarea name="finalThoughts" value={form.finalThoughts} onChange={handleChange} placeholder="Anything else to add" className="w-full bg-black/60 text-white placeholder-gray-400 border border-gray-800 rounded-lg px-4 py-3 h-20 resize-y focus:ring-2 focus:ring-red-600 outline-none transition" />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-gray-300">
            <input type="checkbox" name="acknowledgement" checked={form.acknowledgement} onChange={handleChange} required className="mt-1 w-4 h-4 accent-red-500" />
            <span>I acknowledge this is a consideration, not a guarantee. WhozNexxSports does not owe me a job, reimbursement, or liability until signed on. Terms will be agreed upon if selected.</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 rounded-2xl text-lg shadow-lg transition-all duration-300 hover:scale-[1.02]">Submit Application</Button>
        <button type="button" onClick={() => setForm({name:'',age:'',phone:'',bestTimes:'',availability:'',background:'',sport:'',email:'',pitch:'',finalThoughts:'',acknowledgement:false})} className="px-4 py-3 rounded-lg border border-gray-800 text-gray-300 hover:bg-white/5">Reset</button>
      </div>
    </form>
  );
}
