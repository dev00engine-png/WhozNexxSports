'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { LogIn, UserPlus, KeyRound, User } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [dialogMsg, setDialogMsg] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.')
      }
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setDialogMsg('Login successful! Redirecting...')
        setOpen(true)
        setTimeout(() => (window.location.href = '/sports'), 1200)
      } else {
        const productionUrl = 'https://whoznexxsports.team'
        const redirectUrl =
          process.env.NODE_ENV === 'production'
            ? `${productionUrl}/auth/callback?next=/auth`
            : `${window.location.origin}/auth/callback?next=/auth`
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { name, phone },
          },
        })
        if (error) throw error
        setDialogMsg('Sign up successful! Check your email for verification. After confirming, you can login.')
        setOpen(true)
      }
    } catch (error: any) {
      setDialogMsg(error.message)
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    try {
      if (!supabase) throw new Error('Supabase client is not initialized.')
      const productionUrl = 'https://whoznexxsports.team'
      const redirectUrl =
        process.env.NODE_ENV === 'production'
          ? `${productionUrl}/auth/callback?next=/auth`
          : `${window.location.origin}/auth/callback?next=/auth`
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo: redirectUrl })
      if (error) throw error
      setDialogMsg('Password reset email sent! Check your inbox.')
      setOpen(true)
      setShowReset(false)
    } catch (error: any) {
      setDialogMsg(error.message)
      setOpen(true)
    } finally {
      setResetLoading(false)
    }
  }

  const inputClass = 'bg-black/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 rounded-lg'

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 z-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(200,0,0,0.3), transparent 60%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="glass-card rounded-2xl p-8 animate-border-glow">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src="/logo88.png"
              alt="WNS"
              className="h-16 w-auto"
              style={{ filter: 'drop-shadow(0 0 16px rgba(255,0,0,0.6))' }}
            />
            <h1 className="font-brand text-2xl md:text-3xl font-bold text-luxury">
              {showReset ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Join the Team'}
            </h1>
            <p className="text-gray-400 text-sm text-center">
              {showReset
                ? 'Enter your email to receive a reset link'
                : isLogin
                ? 'Sign in to access sports registration'
                : 'Create your account and register your athletes'}
            </p>
            <span className="badge-premium text-xs">Feb 25, 2026 Event</span>
          </div>

          {!showReset ? (
            <>
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-gray-300 text-sm font-semibold">Full Name *</Label>
                      <Input id="name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-300 text-sm font-semibold">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="email" className="text-gray-300 text-sm font-semibold">Email *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300 text-sm font-semibold">Password *</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-brand font-bold py-3 px-4 rounded-xl text-lg shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_40px_rgba(255,0,0,0.4)] transition-all duration-300"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : isLogin ? (
                    <span className="flex items-center justify-center gap-2"><LogIn className="w-5 h-5" /> Sign In</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><UserPlus className="w-5 h-5" /> Create Account</span>
                  )}
                </Button>
              </form>

              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full border-gray-700 text-gray-300 hover:bg-red-900/20 hover:text-white hover:border-red-600/50 font-semibold py-2 rounded-xl transition-all"
                >
                  {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </Button>
                <button
                  onClick={() => setShowReset(true)}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  type="button"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-email" className="text-gray-300 text-sm font-semibold">Email Address</Label>
                <Input id="reset-email" type="email" placeholder="you@example.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required className={inputClass} />
              </div>
              <Button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-brand font-bold py-3 rounded-xl text-lg shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all"
              >
                {resetLoading ? 'Sending...' : 'Send Reset Email'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReset(false)}
                className="w-full border-gray-700 text-gray-300 hover:bg-red-900/20 hover:text-white font-semibold py-2 rounded-xl"
                type="button"
              >
                ← Back to Login
              </Button>
            </form>
          )}
        </div>
      </motion.div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black/95 border-red-700/50 text-white backdrop-blur-xl">
          <DialogTitle className="sr-only">Authentication Status</DialogTitle>
          <div className="flex flex-col items-center gap-4 py-2">
            <User className="w-10 h-10 text-red-500" />
            <p className="text-lg text-center text-gray-200">{dialogMsg}</p>
            <Button onClick={() => setOpen(false)} className="bg-red-600 hover:bg-red-500 w-full font-brand rounded-xl">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
