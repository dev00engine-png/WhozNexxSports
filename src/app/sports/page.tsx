'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const sports = [
  {
    name: 'football',
    image: '/football1.jpg',
    intro: (
      <>
        <span className="text-gradient bg-gradient-to-r from-red-500 via-yellow-500 to-red-700 bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-lg">American Football: Strategy in Motion</span>
        <p className="mt-2 text-white/90 text-sm">
          Football is a game of discipline, specialized roles, and brotherhood. We prioritize safety and technical fundamentals to build a "Smart Player" profile.<br/>
          <span className="font-bold text-red-400">Coaching Technique:</span> "Positional Mastery" sessions for unique mechanics.<br/>
          <span className="font-bold text-red-400">Training:</span> Explosive Power, core stability, resistance bands, and sled-drills.<br/>
          <span className="font-bold text-red-400">Guidance:</span> Emotional Intelligence—staying calm under pressure and respecting all.
        </p>
      </>
    ),
    effect: 'backdrop-blur-md',
  },
  {
    name: 'baseball',
    image: '/baseball1.jpg',
    intro: (
      <>
        <span className="text-gradient bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-700 bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-lg">Baseball/Softball: The Game of Inches</span>
        <p className="mt-2 text-white/90 text-sm">
          Baseball and Softball are sports of extreme focus and mental toughness. We keep the energy high through constant movement.<br/>
          <span className="font-bold text-yellow-300">Coaching Technique:</span> Video Analysis Feedback for swing/pitching mechanics.<br/>
          <span className="font-bold text-yellow-300">Training:</span> Rotational Strength, reaction time, vision-tracking drills.<br/>
          <span className="font-bold text-yellow-300">Mentorship:</span> Resilience Coaching—shake off a strikeout and stay ready for the next play.
        </p>
      </>
    ),
    effect: 'backdrop-blur-lg',
  },
  {
    name: 'soccer',
    image: '/soccer1.jpg',
    intro: (
      <>
        <span className="text-gradient bg-gradient-to-r from-green-400 via-blue-500 to-green-700 bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-lg">Soccer: The Global Pulse</span>
        <p className="mt-2 text-white/90 text-sm">
          Soccer is the ultimate teacher of endurance and "off-ball" intelligence. We focus on the "Beautiful Game" by ensuring every student feels the ball at their feet.<br/>
          <span className="font-bold text-green-300">Coaching Technique:</span> The "Rondo" method for quick reflexes and passing accuracy.<br/>
          <span className="font-bold text-green-300">Training:</span> Agility, Plyometrics, and "soft feet" for ball control.<br/>
          <span className="font-bold text-green-300">Mentorship:</span> Tactical Patience—understanding off-ball movement.
        </p>
      </>
    ),
    effect: 'backdrop-blur-md',
  },
  {
    name: 'basketball',
    image: '/basketball1.jpg',
    intro: (
      <>
        <span className="text-gradient bg-gradient-to-r from-orange-400 via-red-500 to-orange-700 bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-lg">Basketball: The Art of the Flow</span>
        <p className="mt-2 text-white/90 text-sm">
          Basketball is more than just shooting hoops; it’s about rhythm, spatial awareness, and split-second decisions.<br/>
          <span className="font-bold text-orange-300">Coaching Technique:</span> "Skill-Station Rotation" for hand-eye coordination and high-intensity drills.<br/>
          <span className="font-bold text-orange-300">Training:</span> Kinetic Chain movements for power transfer.<br/>
          <span className="font-bold text-orange-300">Mentorship:</span> Coaches as "Floor Generals"—reading the court and leading teammates.
        </p>
      </>
    ),
    effect: 'backdrop-blur-lg',
  },
];

export default function Sports() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        router.push('/auth');
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-red-500 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gradient bg-gradient-to-r from-red-500 via-yellow-500 to-red-700 bg-clip-text text-transparent drop-shadow-lg">Select a Sport</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sports.map((sport) => (
            <Card key={sport.name} className={`relative overflow-hidden bg-black/80 border-2 border-red-700 shadow-xl ${sport.effect}`}>
              <div className="absolute inset-0 z-0">
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover opacity-40 blur-md scale-110"
                />
              </div>
              <CardContent className="relative z-10 flex flex-col h-full justify-between p-6">
                <div>
                  {sport.intro}
                </div>
                <Link href={`/register?sport=${sport.name}`} className="mt-6 block">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg text-lg shadow-md backdrop-blur-xl">
                    Sign Up for {sport.name.charAt(0).toUpperCase() + sport.name.slice(1)}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}