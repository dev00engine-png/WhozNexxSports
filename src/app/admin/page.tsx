'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Kid {
  id: string
  name: string
  age: number
  sport: string
  gender: string | null
  school: string | null
  grade: string | null
  experience_level: string | null
  parent_phone: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  shirt_size: string | null
  medical_notes: string | null
  special_requests: string | null
  created_at: string
  profiles: { name: string; email: string; phone: string | null }[]
}

export default function Admin() {
  const [authorized, setAuthorized] = useState(false)
  const [kids, setKids] = useState<Kid[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check session-based admin auth
    const isAdmin = sessionStorage.getItem('wns_admin')
    if (isAdmin !== 'true') {
      router.push('/')
      return
    }
    setAuthorized(true)

    const fetchData = async () => {
      if (!supabase) { setLoading(false); return }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: kidsData } = await supabase
        .from('kids')
        .select(`
          id, name, age, sport, gender, school, grade,
          experience_level, parent_phone,
          emergency_contact_name, emergency_contact_phone,
          shirt_size, medical_notes, special_requests, created_at,
          profiles ( name, email, phone )
        `)
        .order('created_at', { ascending: false })

      setKids((kidsData as any) || [])
      setLoading(false)
    }
    fetchData()
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('wns_admin')
    router.push('/')
  }

  if (!authorized) return null

  const filteredKids = kids
    .filter(k => filter === 'all' || k.sport === filter)
    .filter(k => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        k.name.toLowerCase().includes(q) ||
        (k.profiles?.[0]?.name || '').toLowerCase().includes(q) ||
        (k.profiles?.[0]?.email || '').toLowerCase().includes(q) ||
        (k.parent_phone || '').includes(q) ||
        (k.profiles?.[0]?.phone || '').includes(q)
      )
    })

  const sportCounts = {
    all: kids.length,
    football: kids.filter(k => k.sport === 'football').length,
    baseball: kids.filter(k => k.sport === 'baseball').length,
    soccer: kids.filter(k => k.sport === 'soccer').length,
    basketball: kids.filter(k => k.sport === 'basketball').length,
  }

  const sportColors: Record<string, string> = {
    football: 'bg-red-600',
    baseball: 'bg-yellow-600',
    soccer: 'bg-green-600',
    basketball: 'bg-orange-600',
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <div className="border-b border-red-900/30 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo88.png"
              alt=""
              className="h-8 w-auto"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.5))' }}
            />
            <div>
              <h1 className="font-brand text-lg font-bold text-luxury">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">WhozNexxSports Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-premium">{kids.length} Registrations</span>
            <Button onClick={handleLogout} variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-red-600/50 text-sm rounded-lg">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { key: 'all', label: 'Total', emoji: '📊', color: 'border-red-600/40' },
            { key: 'football', label: 'Football', emoji: '🏈', color: 'border-red-600/40' },
            { key: 'baseball', label: 'Baseball', emoji: '⚾', color: 'border-yellow-600/40' },
            { key: 'soccer', label: 'Soccer', emoji: '⚽', color: 'border-green-600/40' },
            { key: 'basketball', label: 'Basketball', emoji: '🏀', color: 'border-orange-600/40' },
          ].map((s) => (
            <motion.button
              key={s.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(s.key)}
              className={`glass-card rounded-xl p-4 text-center border transition-all ${
                filter === s.key ? `${s.color} border-2 bg-red-900/20` : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="font-brand text-2xl font-bold text-white">
                {sportCounts[s.key as keyof typeof sportCounts]}
              </div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </motion.button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-gray-700 text-white text-sm px-4 py-3 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500/50 focus:outline-none placeholder:text-gray-500"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-black/40">
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Sport</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Athlete</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Age</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Parent</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">📞 Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">School</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Shirt</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Emergency</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredKids.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-12 text-center text-gray-500">
                        No registrations found.
                      </td>
                    </tr>
                  ) : (
                    filteredKids.map((kid) => {
                      const phone = kid.parent_phone || kid.profiles?.[0]?.phone || '—'
                      return (
                        <tr key={kid.id} className="hover:bg-red-900/10 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold text-white ${sportColors[kid.sport] || 'bg-gray-600'}`}>
                              {kid.sport}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-white">{kid.name}</td>
                          <td className="px-4 py-3 text-gray-300">{kid.age}</td>
                          <td className="px-4 py-3 text-gray-300">{kid.profiles?.[0]?.name || '—'}</td>
                          <td className="px-4 py-3 text-yellow-400 font-semibold">{phone}</td>
                          <td className="px-4 py-3 text-gray-400">{kid.profiles?.[0]?.email || '—'}</td>
                          <td className="px-4 py-3 text-gray-300 capitalize">{kid.experience_level || '—'}</td>
                          <td className="px-4 py-3 text-gray-300">{kid.school || '—'}</td>
                          <td className="px-4 py-3 text-gray-300">{kid.shirt_size || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {kid.emergency_contact_name ? (
                              <span>{kid.emergency_contact_name}<br/>{kid.emergency_contact_phone}</span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {kid.created_at ? new Date(kid.created_at).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Export hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Showing {filteredKids.length} of {kids.length} registrations
          </p>
        </div>
      </div>
    </div>
  )
}
