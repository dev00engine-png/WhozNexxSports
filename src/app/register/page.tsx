'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const sportMeta: Record<string, {
  label: string; badge: string; image: string;
  gradient: string; accent: string; glowColor: string;
}> = {
  football: {
    label: 'American Football', badge: '🏈', image: '/football2.jpg',
    gradient: 'from-red-600 via-red-800 to-red-950', accent: 'text-red-400', glowColor: 'rgba(255,50,50,0.4)',
  },
  baseball: {
    label: 'Baseball / Softball', badge: '⚾', image: '/baseball2.jpg',
    gradient: 'from-yellow-600 via-yellow-800 to-yellow-950', accent: 'text-yellow-400', glowColor: 'rgba(255,200,50,0.4)',
  },
  soccer: {
    label: 'Soccer', badge: '⚽', image: '/soccer2.jpg',
    gradient: 'from-green-600 via-green-800 to-green-950', accent: 'text-green-400', glowColor: 'rgba(50,200,100,0.4)',
  },
  basketball: {
    label: 'Basketball', badge: '🏀', image: '/basketball2.jpg',
    gradient: 'from-orange-600 via-orange-800 to-orange-950', accent: 'text-orange-400', glowColor: 'rgba(255,150,50,0.4)',
  },
};

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  role: string;
  created_at: string;
}

interface User {
  id: string;
  email?: string;
  [key: string]: unknown;
}

function RegisterContent() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sport = searchParams.get('sport') || 'football';
  const meta = sportMeta[sport] || sportMeta.football;

  // Form fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [shirtSize, setShirtSize] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) { 
        console.error('Supabase client not initialized');
        router.push('/auth'); 
        return; 
      }
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) { 
        console.error('User not authenticated:', userError);
        router.push('/auth'); 
        return; 
      }
      setUser(user);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileError) {
        console.error('Failed to fetch profile:', profileError);
        alert('Failed to load your profile. Please try logging out and back in.');
        return;
      }
      
      if (!profileData) {
        console.error('No profile found for user');
        alert('Profile not found. Please contact support.');
        return;
      }
      
      setProfile(profileData as Profile);
      if (profileData?.phone) setParentPhone(profileData.phone);
      if (profileData?.name) setParentName(profileData.name);
    };
    getUser();
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !sport || !supabase) {
      alert('Missing required information. Please try logging in again.');
      return;
    }
    setLoading(true);
    try {
      // Insert the kid registration
      const { data: insertedKid, error: insertError } = await supabase
        .from('kids')
        .insert({
          parent_id: profile.id,
          name,
          age: parseInt(age),
          sport,
          gender: gender || null,
          school: school || null,
          grade: grade || null,
          experience_level: experienceLevel || null,
          parent_phone: parentPhone || null,
          emergency_contact_name: emergencyName || null,
          emergency_contact_phone: emergencyPhone || null,
          shirt_size: shirtSize || null,
          medical_notes: medicalNotes || null,
          special_requests: specialRequests || null,
        })
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Registration failed: ${insertError.message}`);
      }

      if (!insertedKid || insertedKid.length === 0) {
        throw new Error('Registration failed: No data returned');
      }

      // Update parent phone and name in profile if provided
      if ((parentPhone || parentName) && supabase) {
        const updateData: { phone?: string; name?: string } = {};
        if (parentPhone) updateData.phone = parentPhone;
        if (parentName) updateData.name = parentName;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', profile.id);
        
        if (updateError) {
          console.warn('Failed to update parent info:', updateError);
        }
      }

      console.log('Registration successful:', insertedKid);
      setOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Registration error:', error);
      alert(`Registration failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-brand">Preparing registration...</p>
        </div>
      </div>
    );
  }

  const inputClass = 'bg-black/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 rounded-lg';
  const selectClass = 'bg-black/60 border border-gray-700 text-white rounded-lg px-3 py-2 w-full focus:border-red-500 focus:ring-1 focus:ring-red-500/50 focus:outline-none';

  return (
    <div className="min-h-screen bg-black text-white pb-16 sm:pb-20">
      {/* Sport Header with 3D image */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <img
          src={meta.image}
          alt={meta.label}
          className="w-full h-full object-cover sport-image-3d"
          style={{ filter: 'brightness(0.6) saturate(1.4)' }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${meta.gradient} opacity-70`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <img src="/logo88.png" alt="" className="h-7 sm:h-8 w-auto" style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.5))' }} />
              <span className="badge-sport text-xs sm:text-sm">{meta.badge} {meta.label}</span>
            </div>
            <h1 className="font-brand text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white"
              style={{ textShadow: `0 0 30px ${meta.glowColor}` }}
            >
              Register for {meta.label}
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">February 25, 2026 · All Skill Levels Welcome</p>
          </motion.div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 -mt-6 sm:-mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card rounded-2xl p-4 sm:p-6 md:p-8 animate-border-glow"
        >
          <h2 className="font-brand text-lg sm:text-xl font-bold text-white mb-1">Athlete Registration</h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Complete all fields below to secure your spot.</p>

          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
            {/* Row: Name + Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="kid-name" className="text-gray-300 text-xs sm:text-sm font-semibold">Child&apos;s Full Name *</Label>
                <Input id="kid-name" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
              </div>
              <div>
                <Label htmlFor="kid-age" className="text-gray-300 text-xs sm:text-sm font-semibold">Age *</Label>
                <Input id="kid-age" type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required min="3" max="18" className={inputClass} />
              </div>
            </div>

            {/* Row: Gender + Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="gender" className="text-gray-300 text-xs sm:text-sm font-semibold">Gender</Label>
                <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="grade" className="text-gray-300 text-xs sm:text-sm font-semibold">Grade</Label>
                <Input id="grade" type="text" placeholder="e.g. 5th" value={grade} onChange={(e) => setGrade(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Row: School + Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="school" className="text-gray-300 text-xs sm:text-sm font-semibold">School</Label>
                <Input id="school" type="text" placeholder="School name" value={school} onChange={(e) => setSchool(e.target.value)} className={inputClass} />
              </div>
              <div>
                <Label htmlFor="experience" className="text-gray-300 text-xs sm:text-sm font-semibold">Experience Level</Label>
                <select id="experience" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className={selectClass}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Shirt Size */}
            <div>
              <Label htmlFor="shirt" className="text-gray-300 text-xs sm:text-sm font-semibold">Shirt Size</Label>
              <select id="shirt" value={shirtSize} onChange={(e) => setShirtSize(e.target.value)} className={selectClass}>
                <option value="">Select...</option>
                <option value="YS">Youth Small</option>
                <option value="YM">Youth Medium</option>
                <option value="YL">Youth Large</option>
                <option value="AS">Adult Small</option>
                <option value="AM">Adult Medium</option>
                <option value="AL">Adult Large</option>
                <option value="AXL">Adult XL</option>
              </select>
            </div>

            {/* Separator */}
            <div className="border-t border-red-900/30 pt-3 sm:pt-4">
              <h3 className="font-brand text-base sm:text-lg font-bold text-red-400 mb-2 sm:mb-3">📞 Contact Information</h3>
            </div>

            {/* Parent Name */}
            <div>
              <Label htmlFor="parent-name" className="text-gray-300 text-xs sm:text-sm font-semibold">Parent/Guardian Full Name *</Label>
              <Input id="parent-name" type="text" placeholder="Full name" value={parentName} onChange={(e) => setParentName(e.target.value)} required className={inputClass} />
            </div>

            {/* Parent Phone */}
            <div>
              <Label htmlFor="parent-phone" className="text-gray-300 text-xs sm:text-sm font-semibold">Parent/Guardian Phone *</Label>
              <Input id="parent-phone" type="tel" placeholder="(555) 123-4567" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} required className={inputClass} />
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="emergency-name" className="text-gray-300 text-xs sm:text-sm font-semibold">Emergency Contact Name</Label>
                <Input id="emergency-name" type="text" placeholder="Contact name" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <Label htmlFor="emergency-phone" className="text-gray-300 text-xs sm:text-sm font-semibold">Emergency Contact Phone</Label>
                <Input id="emergency-phone" type="tel" placeholder="(555) 987-6543" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-red-900/30 pt-3 sm:pt-4">
              <h3 className="font-brand text-base sm:text-lg font-bold text-red-400 mb-2 sm:mb-3">📋 Additional Information</h3>
            </div>

            {/* Medical Notes */}
            <div>
              <Label htmlFor="medical" className="text-gray-300 text-xs sm:text-sm font-semibold">Medical Notes / Allergies</Label>
              <textarea
                id="medical"
                placeholder="Any medical conditions, allergies, or medications..."
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className={`${selectClass} min-h-[70px] sm:min-h-[80px] resize-y`}
              />
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="requests" className="text-gray-300 text-xs sm:text-sm font-semibold">Special Requests</Label>
              <textarea
                id="requests"
                placeholder="Any special requests or notes for coaches..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className={`${selectClass} min-h-[70px] sm:min-h-[80px] resize-y`}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${meta.gradient} hover:brightness-125 text-white font-brand font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base md:text-lg shadow-lg transition-all duration-300 hover:scale-[1.02] whitespace-nowrap overflow-hidden text-ellipsis`}
              style={{ boxShadow: `0 4px 30px ${meta.glowColor}` }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </span>
              ) : (
                `Register →`
              )}
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Success Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black/95 border-red-700 text-white backdrop-blur-xl max-w-sm mx-auto">
          <div className="flex flex-col items-center gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="text-4xl sm:text-5xl">{meta.badge}</div>
            <h2 className="font-brand text-lg sm:text-2xl font-bold text-luxury text-center">Registration Complete!</h2>
            <p className="text-gray-300 text-center text-xs sm:text-sm">
              <strong>{name}</strong> has been registered for <strong>{meta.label}</strong> on February 25, 2026.
            </p>
            <p className="text-gray-500 text-xs text-center">You&apos;ll receive a confirmation email with event details.</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              <Button onClick={() => router.push('/sports')} variant="outline" className="flex-1 border-red-600/50 text-red-400 hover:bg-red-900/30 font-brand rounded-xl text-xs sm:text-sm py-2 sm:py-3">
                ← Back to Sports
              </Button>
              <Button onClick={() => { setOpen(false); setName(''); setAge(''); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-brand rounded-xl text-xs sm:text-sm py-2 sm:py-3">
                Register Another
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Register() {
  return <Suspense fallback={
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  }><RegisterContent /></Suspense>;
}
