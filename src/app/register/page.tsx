'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react';
import React from "react";
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Goal, Medal, Trophy, Dribbble } from 'lucide-react';

export const dynamic = 'force-dynamic';

const sportDetails: Record<string, { icon: any; image: string; intro: React.ReactNode }> = {
  football: {
    icon: Goal,
    image: '/football2.jpg',
    intro: (
      <>
        <span className="text-gradient bg-gradient-to-r from-red-500 via-yellow-500 to-red-700 bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-lg animate-fade-in">American Football: Strategy in Motion</span>
        <p className="mt-2 text-white/90 text-sm animate-fade-in">
          Football is a game of discipline, specialized roles, and brotherhood. We prioritize safety and technical fundamentals to build a "Smart Player" profile.<br/>
          <span className="font-bold text-red-400">Coaching Technique:</span> "Positional Mastery" sessions for unique mechanics.<br/>
          <span className="font-bold text-red-400">Training:</span> Explosive Power, core stability, resistance bands, and sled-drills.<br/>
          <span className="font-bold text-red-400">Guidance:</span> Emotional Intelligence—staying calm under pressure and respecting all.
        </p>
      </>
    ),
  },
  baseball: {
    icon: Medal,
    image: '/baseball2.jpg',
    intro: (
      <>
        <span className="text-gradient bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-700 bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-lg animate-fade-in">Baseball/Softball: The Game of Inches</span>
        <p className="mt-2 text-white/90 text-sm animate-fade-in">
          Baseball and Softball are sports of extreme focus and mental toughness. We keep the energy high through constant movement.<br/>
          <span className="font-bold text-yellow-300">Coaching Technique:</span> Video Analysis Feedback for swing/pitching mechanics.<br/>
          <span className="font-bold text-yellow-300">Training:</span> Rotational Strength, reaction time, vision-tracking drills.<br/>
          <span className="font-bold text-yellow-300">Mentorship:</span> Resilience Coaching—shake off a strikeout and stay ready for the next play.
        </p>
      </>
    ),
  },
  soccer: {
    icon: Trophy,
    image: '/soccer1.jpg',
    intro: (
      <>
        <span className="text-gradient bg-gradient-to-r from-green-400 via-blue-500 to-green-700 bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-lg animate-fade-in">Soccer: The Global Pulse</span>
        <p className="mt-2 text-white/90 text-sm animate-fade-in">
          Soccer is the ultimate teacher of endurance and "off-ball" intelligence. We focus on the "Beautiful Game" by ensuring every student feels the ball at their feet.<br/>
          <span className="font-bold text-green-300">Coaching Technique:</span> The "Rondo" method for quick reflexes and passing accuracy.<br/>
          <span className="font-bold text-green-300">Training:</span> Agility, Plyometrics, and "soft feet" for ball control.<br/>
          <span className="font-bold text-green-300">Mentorship:</span> Tactical Patience—understanding off-ball movement.
        </p>
      </>
    ),
  },
  basketball: {
    icon: Dribbble,
    image: '/basketball2.jpg',
    intro: (
      <>
        <span className="text-gradient bg-gradient-to-r from-orange-400 via-red-500 to-orange-700 bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-lg animate-fade-in">Basketball: The Art of the Flow</span>
        <p className="mt-2 text-white/90 text-sm animate-fade-in">
          Basketball is more than just shooting hoops; it’s about rhythm, spatial awareness, and split-second decisions.<br/>
          <span className="font-bold text-orange-300">Coaching Technique:</span> "Skill-Station Rotation" for hand-eye coordination and high-intensity drills.<br/>
          <span className="font-bold text-orange-300">Training:</span> Kinetic Chain movements for power transfer.<br/>
          <span className="font-bold text-orange-300">Mentorship:</span> Coaches as "Floor Generals"—reading the court and leading teammates.
        </p>
      </>
    ),
  },
};

function RegisterContent() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sport = searchParams.get('sport') || 'football';
  const details = sportDetails[sport] || sportDetails.football;

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        router.push('/auth');
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setProfile(profileData);
    };
    getUser();
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !sport || !supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('kids')
        .insert({
          parent_id: profile.id,
          name,
          age: parseInt(age),
          sport,
        });
      if (error) throw error;
      setOpen(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) return <div>Loading...</div>;

  const Icon = details.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-red-500 py-12 animate-fade-in">
      <Card className="relative max-w-lg w-full bg-black/80 border-red-700 shadow-2xl rounded-xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={details.image}
            alt={sport}
            className="w-full h-full object-cover opacity-40 blur-lg scale-110"
          />
        </div>
        <CardContent className="relative z-10 p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="bg-black/60 rounded-full p-3 mb-2 animate-bounce shadow-lg">
              <Icon className="w-10 h-10 text-red-500 drop-shadow-lg" />
            </span>
            {details.intro}
          </div>
          <form onSubmit={handleRegister} className="space-y-4 mt-4 animate-fade-in">
            <div>
              <Label htmlFor="kid-name" className="text-white">Kid's Name</Label>
              <Input
                id="kid-name"
                type="text"
                placeholder="Enter your kid's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-black/60 border-red-700 text-white placeholder:text-red-300 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <Label htmlFor="kid-age" className="text-white">Age</Label>
              <Input
                id="kid-age"
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="bg-black/60 border-red-700 text-white placeholder:text-red-300 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-md transition-all duration-200"
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black/90 border-red-700 text-white">
          <div className="flex flex-col items-center gap-4">
            <span className="bg-black/60 rounded-full p-3 mb-2 animate-bounce shadow-lg">
              <Icon className="w-10 h-10 text-red-500 drop-shadow-lg" />
            </span>
            <h2 className="text-2xl font-bold">Registration Successful!</h2>
            <p>Your child has been registered for {sport.charAt(0).toUpperCase() + sport.slice(1)}.</p>
            <Button onClick={() => router.push('/sports')} className="bg-red-600 hover:bg-red-700 w-full">Back to Sports</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Register() {
  return <Suspense fallback={<div>Loading...</div>}><RegisterContent /></Suspense>;
}