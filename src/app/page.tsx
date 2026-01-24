import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Faded, distant background image overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="Sports background"
          className="w-full h-full object-cover opacity-30 blur-sm"
        />
      </div>
      {/* Logo with glowing effect and glassmorphism */}
      <div className="relative z-20 flex flex-col items-center mb-6">
        <div className="backdrop-blur-lg bg-black/40 rounded-full p-4 shadow-2xl flex items-center justify-center animate-pulse">
          <img
            src="/logo88.png"
            alt="Whoz Nexx Sports Logo"
            className="h-24 w-auto drop-shadow-[0_0_16px_rgba(255,0,0,0.8)] animate-glow"
            style={{ filter: 'drop-shadow(0 0 32px #ff0000)' }}
          />
        </div>
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <Card className="bg-black/80 border-red-700 shadow-2xl max-w-3xl w-full p-8 rounded-xl">
          <CardContent className="flex flex-col items-center">
            <h1 className="text-5xl font-extrabold text-center mb-4 tracking-tight text-white drop-shadow-lg">
              Whoz Nexx Sports
            </h1>
            <p className="text-center mb-6 text-lg text-red-200 max-w-2xl">
              <span className="font-semibold text-red-400">Sign up your child for an unforgettable sports experience!</span> <br />
              <span className="text-white">Football, Baseball, Soccer, and Basketball rosters are open for the January 25 event. Don’t miss the deadline to get your child on the field, court, or diamond. All skill levels welcome. Fun, teamwork, and memories await!</span>
            </p>
            <ul className="mb-8 text-white/80 text-sm list-disc list-inside max-w-xl">
              <li>Easy parent sign-up and secure registration</li>
              <li>Choose your sport and enter your kid’s info</li>
              <li>All events take place on January 25</li>
              <li>See all registered kids in the admin dashboard</li>
            </ul>
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <Link href="/auth" className="w-full md:w-auto">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md">
                  Sign Up / Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <footer className="mt-12 text-center text-xs text-red-300 relative group">
          © Feb 25, 2026 Whoz Nexx Sports. All rights reserved.
          <span className="absolute left-1/2 -translate-x-1/2 bottom-[-1.5rem] opacity-0 hover:opacity-100 transition-opacity duration-300 group-hover:opacity-100">
            <Link href="/admin" tabIndex={-1} aria-label="Admin Access" className="text-[0.1px] select-none pointer-events-auto focus:opacity-100 focus:text-blue-400" style={{ position: 'absolute', left: '-9999px' }}>Admin</Link>
          </span>
          <span className="block text-[0.1px] select-none opacity-0 group-hover:opacity-100">
            <Link href="/admin" tabIndex={-1} aria-label="Admin Access" className="text-[0.1px] select-none pointer-events-auto focus:opacity-100 focus:text-blue-400">Admin</Link>
          </span>
        </footer>
      </div>
    </div>
  );
}
