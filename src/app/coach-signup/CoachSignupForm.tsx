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
      <div className="p-8 text-center bg-green-100 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Thank you for your submission!</h2>
        <p className="text-lg text-green-800">We appreciate your interest in joining WhozNexxSports. Our team will review your application and reach out if you are selected for the next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
      <h2 className="text-3xl font-brand font-bold text-center text-red-600 mb-2">Coach Application</h2>
      <p className="text-gray-700 text-center mb-4">Fill out the form below to be considered for a coaching position. This is not a guarantee of employment.</p>
      <div className="grid grid-cols-1 gap-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="input" />
        <input name="age" value={form.age} onChange={handleChange} required placeholder="Age" className="input" type="number" min="18" />
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" className="input" />
        <input name="bestTimes" value={form.bestTimes} onChange={handleChange} required placeholder="Best Times to Reach You" className="input" />
        <input name="availability" value={form.availability} onChange={handleChange} required placeholder="Availability" className="input" />
        <input name="background" value={form.background} onChange={handleChange} required placeholder="Coaching Background" className="input" />
        <input name="sport" value={form.sport} onChange={handleChange} required placeholder="Preferred Sport" className="input" />
        <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="input" type="email" />
        <textarea name="pitch" value={form.pitch} onChange={handleChange} required placeholder="Why would you be a good fit?" className="input h-24" />
        <textarea name="finalThoughts" value={form.finalThoughts} onChange={handleChange} placeholder="Final Thoughts" className="input h-20" />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" name="acknowledgement" checked={form.acknowledgement} onChange={handleChange} required />
          I acknowledge this is a consideration, not a guarantee. WhozNexxSports does not owe me a job, reimbursement, or liability until signed on. Terms will be agreed upon if selected.
        </label>
      </div>
      <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-lg shadow-lg transition-all duration-300 hover:scale-105">Submit Application</Button>
    </form>
  );
}
