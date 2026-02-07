'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const sports = [
  {
    name: 'football',
    label: 'American Football',
    tagline: 'Strategy in Motion',
    image: '/football1.jpg',
    image2: '/football2.jpg',
    color: 'red',
    gradient: 'from-red-600 via-red-800 to-red-950',
    accent: 'text-red-400',
    borderColor: 'border-red-600/40',
    glowColor: 'rgba(255,50,50,0.3)',
    badge: '🏈',
    intro: 'Football is a game of discipline, specialized roles, and brotherhood. We prioritize safety and technical fundamentals to build a "Smart Player" profile.',
    details: [
      { label: 'Coaching', text: '"Positional Mastery" sessions for unique mechanics at every position.' },
      { label: 'Training', text: 'Explosive Power, core stability, resistance bands, and sled-drills.' },
      { label: 'Guidance', text: 'Emotional Intelligence—staying calm under pressure and respecting all.' },
    ],
  },
  {
    name: 'baseball',
    label: 'Baseball / Softball',
    tagline: 'The Game of Inches',
    image: '/baseball1.jpg',
    image2: '/baseball2.jpg',
    color: 'yellow',
    gradient: 'from-yellow-600 via-yellow-800 to-yellow-950',
    accent: 'text-yellow-400',
    borderColor: 'border-yellow-600/40',
    glowColor: 'rgba(255,200,50,0.3)',
    badge: '⚾',
    intro: 'Baseball and Softball are sports of extreme focus and mental toughness. We keep the energy high through constant movement and precision.',
    details: [
      { label: 'Coaching', text: 'Video Analysis Feedback for swing/pitching mechanics.' },
      { label: 'Training', text: 'Rotational Strength, reaction time, vision-tracking drills.' },
      { label: 'Mentorship', text: 'Resilience Coaching—shake off a strikeout and stay ready for the next play.' },
    ],
  },
  {
    name: 'soccer',
    label: 'Soccer',
    tagline: 'The Global Pulse',
    image: '/soccer1.jpg',
    image2: '/soccer2.jpg',
    color: 'green',
    gradient: 'from-green-600 via-green-800 to-green-950',
    accent: 'text-green-400',
    borderColor: 'border-green-600/40',
    glowColor: 'rgba(50,200,100,0.3)',
    badge: '⚽',
    intro: 'Soccer is the ultimate teacher of endurance and "off-ball" intelligence. We focus on the "Beautiful Game" by ensuring every player feels the ball at their feet.',
    details: [
      { label: 'Coaching', text: 'The "Rondo" method for quick reflexes and passing accuracy.' },
      { label: 'Training', text: 'Agility, Plyometrics, and "soft feet" for ball control.' },
      { label: 'Mentorship', text: 'Tactical Patience—understanding off-ball movement and spacing.' },
    ],
  },
  {
    name: 'basketball',
    label: 'Basketball',
    tagline: 'The Art of the Flow',
    image: '/basketball1.jpg',
    image2: '/basketball2.jpg',
    color: 'orange',
    gradient: 'from-orange-600 via-orange-800 to-orange-950',
    accent: 'text-orange-400',
    borderColor: 'border-orange-600/40',
    glowColor: 'rgba(255,150,50,0.3)',
    badge: '🏀',
    intro: 'Basketball is more than shooting hoops; it\'s about rhythm, spatial awareness, and split-second decisions that define greatness.',
    details: [
      { label: 'Coaching', text: '"Skill-Station Rotation" for hand-eye coordination and high-intensity drills.' },
      { label: 'Training', text: 'Kinetic Chain movements for explosive power transfer.' },
      { label: 'Mentorship', text: 'Coaches as "Floor Generals"—reading the court and leading teammates.' },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function Sports() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        router.push('/auth');
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-brand">Loading your arena...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative py-12 sm:py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at center, rgba(200,0,0,0.4), transparent 70%)' }}
        />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <img
            src="/logo88.png"
            alt=""
            className="h-12 sm:h-14 w-auto mx-auto mb-3 sm:mb-4"
            style={{ filter: 'drop-shadow(0 0 12px rgba(255,0,0,0.6))' }}
          />
          <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-luxury mb-2 px-2">Select Your Sport</h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg px-2">Choose your arena. Begin your journey. Feb 25, 2026.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4 px-2">
            <span className="badge-premium text-xs sm:text-sm">🏟️ All Skill Levels</span>
            <span className="badge-premium text-xs sm:text-sm">⭐ Professional Coaching</span>
          </div>
        </motion.div>
      </div>

      {/* Sports Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {sports.map((sport, i) => (
            <motion.div
              key={sport.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              custom={i}
              className={`relative rounded-3xl overflow-hidden ${sport.borderColor} border-2 group card-3d`}
              style={{
                background: 'linear-gradient(135deg, rgba(10,0,0,0.95), rgba(20,0,0,0.85))',
              }}
            >
              {/* Sport Image — 3D Pop-out */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src={sport.image}
                  alt={sport.label}
                  className="w-full h-full object-cover sport-image-3d transition-all duration-700 group-hover:scale-110"
                  style={{
                    filter: 'brightness(0.8) saturate(1.3)',
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${sport.gradient} opacity-60`} />

                {/* Floating badge */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-4 z-10">
                  <span className="badge-sport text-xs sm:text-sm">{sport.badge} {sport.label}</span>
                </div>

                {/* 3D Pop-out Title */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 z-10">
                  <h2 className="font-brand text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                    style={{ textShadow: `0 0 30px ${sport.glowColor}` }}
                  >
                    {sport.tagline}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">{sport.intro}</p>

                {/* Detail pills */}
                <div className="space-y-2 sm:space-y-3">
                  {sport.details.map((d) => (
                    <div key={d.label} className="flex gap-2 sm:gap-3 items-start">
                      <span className={`${sport.accent} font-brand font-bold text-xs sm:text-sm whitespace-nowrap mt-0.5`}>
                        {d.label}:
                      </span>
                      <span className="text-gray-400 text-xs sm:text-sm leading-relaxed">{d.text}</span>
                    </div>
                  ))}
                </div>

                {/* Second image thumbnail */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 pt-2">
                  <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden sport-image-3d flex-shrink-0"
                    style={{ boxShadow: `0 8px 30px ${sport.glowColor}` }}
                  >
                    <img src={sport.image2} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/register?sport=${sport.name}`}>
                      <Button
                        className={`w-full bg-gradient-to-r ${sport.gradient} hover:brightness-125 text-white font-brand font-bold py-2 sm:py-3 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl whitespace-nowrap overflow-hidden text-ellipsis`}
                        style={{ boxShadow: `0 4px 25px ${sport.glowColor}` }}
                      >
                        Sign Up →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
