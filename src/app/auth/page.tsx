'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { User, LogIn, UserPlus, KeyRound } from 'lucide-react'

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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setDialogMsg('Login successful! Redirecting...')
        setOpen(true)
        setTimeout(() => window.location.href = '/sports', 1200)
      } else {
        const productionUrl = 'https://whoznexxsports.team'
        const redirectUrl = process.env.NODE_ENV === 'production' 
          ? `${productionUrl}/auth/callback?next=/auth`
          : `${window.location.origin}/auth/callback?next=/auth`
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name,
              phone,
            },
          },
        })
        if (error) throw error
        setDialogMsg('Sign up successful! Check your email for verification. After confirming, you will be redirected to login.')
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
      const redirectUrl = process.env.NODE_ENV === 'production'
        ? `${productionUrl}/auth/callback?next=/auth`
        : `${window.location.origin}/auth/callback?next=/auth`
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      })
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-red-500 animate-fade-in">
      <Card className="relative max-w-md w-full bg-black/80 border-red-700 shadow-2xl rounded-xl overflow-hidden">
        <CardContent className="relative z-10 p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="bg-black/60 rounded-full p-3 mb-2 animate-bounce shadow-lg">
              {showReset ? (
                <KeyRound className="w-10 h-10 text-red-500 drop-shadow-lg" />
              ) : isLogin ? (
                <LogIn className="w-10 h-10 text-red-500 drop-shadow-lg" />
              ) : (
                <UserPlus className="w-10 h-10 text-red-500 drop-shadow-lg" />
              )}
            </span>
            <h1 className="text-3xl font-bold text-center text-white mb-2 animate-fade-in">
              {showReset ? 'Reset Password' : isLogin ? 'Login' : 'Sign Up'}
            </h1>
          </div>
          {!showReset ? (
            <>
              <form onSubmit={handleAuth} className="space-y-4 animate-fade-in">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-black/60 border-red-700 text-white placeholder:text-red-300 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-black/60 border-red-700 text-white placeholder:text-red-300 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/60 border-red-700 text-white placeholder:text-red-300 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-black/60 border-red-700 text-white placeholder:text-red-300 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-md transition-all duration-200"
                >
                  {loading
                    ? isLogin
                      ? 'Logging in...'
                      : 'Signing up...'
                    : isLogin
                    ? 'Login'
                    : 'Sign Up'}
                </Button>
              </form>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full border-red-600 text-red-600 hover:bg-red-900 hover:text-white font-bold py-2 px-4 rounded-lg text-md shadow-sm animate-fade-in"
                >
                  {isLogin
                    ? 'Need an account? Sign Up'
                    : 'Already have an account? Login'}
                </Button>
                <Button
                  variant="link"
                  onClick={() => setShowReset(true)}
                  className="w-full text-xs text-red-400 hover:text-red-200"
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="reset-email" className="text-white">
                  Enter your email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="bg-black/60 border-red-700 text-white placeholder:text-red-300 focus:ring-2 focus:ring-red-500"
                />
              </div>
              <Button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-md transition-all duration-200"
              >
                {resetLoading ? 'Sending...' : 'Send Reset Email'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReset(false)}
                className="w-full border-red-600 text-red-600 hover:bg-red-900 hover:text-white font-bold py-2 px-4 rounded-lg text-md shadow-sm animate-fade-in"
                type="button"
              >
                Back to Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black/90 border-red-700 text-white">
          <DialogTitle className="sr-only">Authentication Status</DialogTitle>
          <div className="flex flex-col items-center gap-4">
            <span className="bg-black/60 rounded-full p-3 mb-2 animate-bounce shadow-lg">
              <User className="w-10 h-10 text-red-500 drop-shadow-lg" />
            </span>
            <p className="text-lg text-center">{dialogMsg}</p>
            <Button
              onClick={() => setOpen(false)}
              className="bg-red-600 hover:bg-red-700 w-full"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}