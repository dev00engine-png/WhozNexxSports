'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { User, LogIn, UserPlus } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [dialogMsg, setDialogMsg] = useState('')
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
        // Use window.location for full page reload to sync cookies
        setTimeout(() => window.location.href = '/sports', 1200)
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
            },
          },
        })
        if (error) throw error
        setDialogMsg('Sign up successful! Check your email for verification.')
        setOpen(true)
      }
    } catch (error: any) {
      setDialogMsg(error.message)
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-red-500 animate-fade-in">
      <Card className="relative max-w-md w-full bg-black/80 border-red-700 shadow-2xl rounded-xl overflow-hidden">
        <CardContent className="relative z-10 p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="bg-black/60 rounded-full p-3 mb-2 animate-bounce shadow-lg">
              {isLogin ? (
                <LogIn className="w-10 h-10 text-red-500 drop-shadow-lg" />
              ) : (
                <UserPlus className="w-10 h-10 text-red-500 drop-shadow-lg" />
              )}
            </span>
            <h1 className="text-3xl font-bold text-center text-white mb-2 animate-fade-in">
              {isLogin ? 'Login' : 'Sign Up'}
            </h1>
          </div>
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
          <Button
            variant="outline"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full border-red-600 text-red-600 hover:bg-red-900 hover:text-white font-bold py-2 px-4 rounded-lg text-md shadow-sm mt-2 animate-fade-in"
          >
            {isLogin
              ? 'Need an account? Sign Up'
              : 'Already have an account? Login'}
          </Button>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black/90 border-red-700 text-white">
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