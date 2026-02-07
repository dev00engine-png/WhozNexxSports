'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const sportsImages = [
  '/football1.jpg', '/baseball1.jpg', '/soccer1.jpg', '/basketball1.jpg',
  '/football2.jpg', '/baseball2.jpg', '/soccer2.jpg', '/basketball2.jpg',
];

const features = [
  { icon: '🏆', title: 'Elite Coaching', desc: 'Professional-level mentorship for every skill level. Our coaches bring the fire and the fundamentals.' },
  { icon: '⚡', title: 'All Sports, One Hub', desc: 'Football, Baseball, Soccer & Basketball — four powerhouse programs under one electrifying roof.' },
  { icon: '🛡️', title: 'Safety First', desc: 'Age-appropriate training, certified staff, and a family-first environment where kids thrive.' },
  { icon: '🌟', title: 'Character Building', desc: 'We grow leaders, not just athletes. Discipline, teamwork, and sportsmanship at the core.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background image with motion blur */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20 scale-110"
            style={{ filter: 'blur(3px) saturate(1.4)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
        </div>

        {/* Animated red gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(200,0,0,0.4) 0%, transparent 70%)' }}
        />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10 mb-6"
        >
          <div className="animate-glow-pulse rounded-full p-1">
            <img
              src="/logo88.png"
              alt="Whoz Nexx Sports Logo"
              className="h-28 w-auto animate-float"
              style={{ filter: 'drop-shadow(0 0 24px rgba(255,0,0,0.7))' }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="relative z-10 font-brand text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center text-luxury leading-tight px-2"
        >
          WhozNexxSports
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-10 mt-3 sm:mt-4 text-sm sm:text-base md:text-xl lg:text-2xl text-gray-300 text-center max-w-2xl mx-auto px-3 font-light tracking-wide"
        >
          Where the Next Generation of Champions Begins
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative z-10 flex flex-wrap justify-center gap-3 mt-6"
        >
          <span className="badge-premium">⭐ Feb 25, 2026</span>
          <span className="badge-sport">🏈 Football</span>
          <span className="badge-sport">⚾ Baseball</span>
          <span className="badge-sport">⚽ Soccer</span>
          <span className="badge-sport">🏀 Basketball</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 px-4 max-w-lg mx-auto w-full sm:max-w-fit"
        >
          <Link href="/auth" className="flex-1 sm:flex-none">
            <Button className="w-full bg-red-600 hover:bg-red-500 text-white font-brand font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-xl text-sm sm:text-base md:text-lg shadow-[0_0_30px_rgba(255,0,0,0.3)] hover:shadow-[0_0_50px_rgba(255,0,0,0.5)] transition-all duration-300 hover:scale-105">
              🚀 Register Now
            </Button>
          </Link>
          <a href="#mission" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full border-red-600/50 text-red-400 hover:bg-red-900/30 hover:text-white font-brand py-3 sm:py-4 px-6 sm:px-10 rounded-xl text-sm sm:text-base md:text-lg transition-all duration-300">
              Learn More ↓
            </Button>
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 z-10"
        >
          <div className="w-6 h-10 border-2 border-red-500/40 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-red-500 rounded-full mt-1.5"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══ ROLLING IMAGE MARQUEE ═══ */}
      <section className="relative py-6 sm:py-8 overflow-hidden bg-black/50 border-y border-red-900/20">
        <div className="animate-slide-left marquee-strip">
          {[...sportsImages, ...sportsImages, ...sportsImages].map((img, i) => (
            <img key={i} src={img} alt="" className="h-20 sm:h-28 md:h-36 w-32 sm:w-48 md:w-64 rounded-xl object-cover opacity-70 hover:opacity-100 transition-opacity flex-shrink-0" />
          ))}
        </div>
      </section>

      {/* ═══ MISSION SECTION ═══ */}
      <section id="mission" className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <span className="badge-premium mb-4 inline-block">Our Mission</span>
            <h2 className="font-brand text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-luxury mt-2">
              More Than Just Sports
            </h2>
            <div className="flex justify-center my-4">
              <img
                src="/logo88.png"
                alt=""
                className="h-12 w-auto opacity-40"
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,0,0,0.5))' }}
              />
            </div>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed px-2">
              At <span className="text-red-400 font-semibold font-brand">WhozNexxSports</span>, we believe every child carries the spirit of a champion.
              Our programs forge not just athletic skills but character, confidence, and community.
              We provide a world-class stage for young athletes to discover their greatness — through discipline, mentorship, and the sheer joy of competition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-brand text-2xl sm:text-3xl md:text-4xl font-bold text-center text-luxury mb-10 sm:mb-14 px-2"
          >
            The WhozNexx Advantage
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="glass-card rounded-2xl p-6 text-center card-3d group"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">{feat.icon}</div>
                <h3 className="font-brand text-base sm:text-lg md:text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REVERSE MARQUEE ═══ */}
      <section className="relative py-6 sm:py-8 overflow-hidden bg-black/50 border-y border-red-900/20">
        <div className="animate-slide-right marquee-strip">
          {[...sportsImages, ...sportsImages, ...sportsImages].map((img, i) => (
            <img key={i} src={img} alt="" className="h-20 sm:h-28 md:h-36 w-32 sm:w-48 md:w-64 rounded-xl object-cover opacity-70 hover:opacity-100 transition-opacity flex-shrink-0" />
          ))}
        </div>
      </section>

      {/* ═══ SPORTS SHOWCASE ═══ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-brand text-2xl sm:text-3xl md:text-4xl font-bold text-luxury mb-3 sm:mb-4 px-2"
          >
            Choose Your Arena
          </motion.h2>
          <p className="text-gray-400 mb-8 sm:mb-12 text-sm sm:text-base md:text-lg px-2">Four epic sports. Unlimited potential.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { name: 'Football', img: '/football1.jpg', color: 'from-red-600' },
              { name: 'Baseball', img: '/baseball1.jpg', color: 'from-yellow-600' },
              { name: 'Soccer', img: '/soccer1.jpg', color: 'from-green-600' },
              { name: 'Basketball', img: '/basketball1.jpg', color: 'from-orange-600' },
            ].map((s, i) => (
              <motion.div
                key={s.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="relative rounded-lg sm:rounded-2xl overflow-hidden group card-3d aspect-[3/4]"
              >
                <img
                  src={s.img}
                  alt={s.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${s.color}/60 via-transparent to-black/80 group-hover:opacity-90 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-4 pb-4 sm:pb-6">
                  <span className="font-brand text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">{s.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ JOIN OUR TEAM: COACHES INVITE SECTION ═══ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-red-900/60 via-black/80 to-black/90">
        <div className="max-w-4xl mx-auto text-center rounded-3xl shadow-2xl p-8 sm:p-12 bg-black/60 border border-red-900/30 animate-fade-in">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <img
              src="/coach-invite.png"
              alt="Coach Invitation"
              className="h-20 sm:h-28 w-auto mx-auto mb-6 animate-float"
              style={{ filter: 'drop-shadow(0 0 24px rgba(255,0,0,0.7))' }}
            />
            <h2 className="font-brand text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-luxury mb-3 sm:mb-4 px-2">
              Join Our Team: Prospective Coaches
            </h2>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-2">
              Are you passionate about sports, mentorship, and making a difference? <span className="text-red-400 font-semibold">WhozNexxSports</span> is looking for inspiring coaches to help shape the next generation of champions. If you bring energy, expertise, and heart, we want to hear your story!
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex justify-center mt-6"
            >
              <Link href="/coach-signup">
                <Button className="bg-gradient-to-r from-red-600 via-red-400 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-brand font-bold py-4 px-10 rounded-2xl text-lg shadow-[0_0_40px_rgba(255,0,0,0.3)] hover:shadow-[0_0_60px_rgba(255,0,0,0.5)] transition-all duration-300 hover:scale-105 animate-glow-pulse">
                  Become a Coach →
                </Button>
              </Link>
            </motion.div>
            <div className="mt-8 text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto bg-black/30 rounded-xl p-4 border border-red-900/20">
              <strong className="text-red-400">Note:</strong> Submitting your application is a consideration, not a guarantee. WhozNexxSports does not owe you a job, reimbursement, or liability until signed on. Terms will be agreed upon if selected.
            </div>
          </motion.div>
        </div>
      </section>
      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <img
              src="/logo88.png"
              alt=""
              className="h-12 sm:h-16 w-auto mx-auto mb-4 sm:mb-6 opacity-60"
              style={{ filter: 'drop-shadow(0 0 16px rgba(255,0,0,0.5))' }}
            />
            <h2 className="font-brand text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-luxury mb-3 sm:mb-4 px-2">
              Ready to Play?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-2">
              Registration for the <span className="text-red-400 font-semibold">February 25, 2026</span> event is open now.
              Secure your child&apos;s spot and let their journey begin.
            </p>
            <Link href="/auth" className="inline-block">
              <Button className="bg-red-600 hover:bg-red-500 text-white font-brand font-bold py-3 sm:py-4 px-8 sm:px-14 rounded-xl text-sm sm:text-base md:text-lg lg:text-xl shadow-[0_0_40px_rgba(255,0,0,0.3)] hover:shadow-[0_0_60px_rgba(255,0,0,0.5)] transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Sign Up Now →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
