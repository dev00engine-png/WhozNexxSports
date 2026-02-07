'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

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

export default function Footer() {
  const [showModal, setShowModal] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [kids, setKids] = useState<Kid[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user === 'knottjonesnexx' && pass === 'stlouis22forever') {
      setAuthenticated(true)
      setError('')
      setLoading(true)
      
      // Fetch admin data
      if (supabase) {
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
      }
      setLoading(false)
    } else {
      setError('Invalid credentials')
      setTimeout(() => setError(''), 2000)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setAuthenticated(false)
    setUser('')
    setPass('')
    setError('')
    setKids([])
    setFilter('all')
    setSearchQuery('')
  }

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
    <>
      <footer className="relative z-30 border-t border-red-900/30 bg-black/80 backdrop-blur-xl">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Brand Column */}
            <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src="/logo88.png"
                  alt="WNS"
                  className="h-8 sm:h-10 w-auto"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.6))' }}
                />
                <span className="font-brand text-sm sm:text-lg text-white tracking-wider">WhozNexxSports</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                Elevating young athletes to their next level. Where champions begin.
              </p>
            </div>

            {/* Links Column */}
            <div className="flex flex-col items-center sm:items-start gap-1 sm:gap-2">
              <h4 className="font-brand text-xs sm:text-sm text-red-500 uppercase tracking-widest mb-1 sm:mb-2">Quick Links</h4>
              <Link href="/" className="text-xs sm:text-sm text-gray-400 hover:text-red-400 transition-colors">Home</Link>
              <Link href="/auth" className="text-xs sm:text-sm text-gray-400 hover:text-red-400 transition-colors">Sign Up / Login</Link>
              <Link href="/sports" className="text-xs sm:text-sm text-gray-400 hover:text-red-400 transition-colors">Sports</Link>
            </div>

            {/* Info Column */}
            <div className="flex flex-col items-center sm:items-start md:items-end gap-1 sm:gap-2">
              <h4 className="font-brand text-xs sm:text-sm text-red-500 uppercase tracking-widest mb-1 sm:mb-2">Event Info</h4>
              <p className="text-xs sm:text-sm text-gray-400">📅 February 25, 2026</p>
              <p className="text-xs sm:text-sm text-gray-400">🏟️ All Skill Levels Welcome</p>
              <p className="text-xs sm:text-sm text-gray-400">⚡ Football · Baseball · Soccer · Basketball</p>
            </div>
          </div>

          {/* Bottom Bar with Gemini Icon */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-red-900/20 flex flex-col items-center gap-2 sm:gap-3">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Whoz Nexx Sports. All rights reserved.
            </p>

            {/* Gemini Admin Icon - Glowing */}
            <button
              onClick={() => setShowModal(true)}
              className="group relative p-2 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Admin Access"
              title="Admin Access"
            >
              <Sparkles 
                className="w-4 h-4 text-purple-500/40 group-hover:text-purple-400 transition-colors"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.4))',
                }}
              />
              <div className="absolute inset-0 rounded-full bg-purple-500/10 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4" onClick={handleClose}>
          <div 
            className="glass-card rounded-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-red-900/30 animate-border-glow"
            onClick={(e) => e.stopPropagation()}
          >
            {!authenticated ? (
              /* Login Form */
              <div className="p-4 sm:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500" style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.6))' }} />
                    <h2 className="font-brand text-lg sm:text-2xl font-bold text-luxury">Admin Access</h2>
                  </div>
                  <button onClick={handleClose} className="text-gray-500 hover:text-white text-xl sm:text-2xl">&times;</button>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-3 sm:space-y-4 max-w-sm mx-auto">
                  <div>
                    <label className="text-gray-300 text-xs sm:text-sm font-semibold block mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="Username"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      className="w-full bg-black/60 border border-gray-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500/50 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs sm:text-sm font-semibold block mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      className="w-full bg-black/60 border border-gray-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500/50 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-brand font-bold py-2 sm:py-3 rounded-xl text-sm transition-all duration-300"
                  >
                    Access Dashboard
                  </button>
                  {error && <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>}
                </form>
              </div>
            ) : (
              /* Admin Dashboard */
              <div className="flex flex-col h-full max-h-[95vh] sm:max-h-[85vh]">
                {/* Header */}
                <div className="border-b border-red-900/30 bg-black/60 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <img src="/logo88.png" alt="" className="h-6 sm:h-8 w-auto flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.5))' }} />
                    <div className="min-w-0">
                      <h2 className="font-brand text-sm sm:text-lg font-bold text-luxury truncate">Admin Dashboard</h2>
                      <p className="text-xs text-gray-500">WhozNexxSports Management</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="badge-premium text-xs">{kids.length}</span>
                    <button onClick={handleClose} className="text-gray-500 hover:text-white text-xl sm:text-2xl flex-shrink-0">&times;</button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-red-900/20 flex-shrink-0 overflow-x-auto">
                  <div className="grid grid-cols-5 gap-1 sm:gap-2 min-w-fit">
                    {[
                      { key: 'all', label: 'Total', emoji: '📊' },
                      { key: 'football', label: 'Football', emoji: '🏈' },
                      { key: 'baseball', label: 'Baseball', emoji: '⚾' },
                      { key: 'soccer', label: 'Soccer', emoji: '⚽' },
                      { key: 'basketball', label: 'Basketball', emoji: '🏀' },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setFilter(s.key)}
                        className={`glass rounded-lg p-1.5 sm:p-2 text-center transition-all text-xs flex-shrink-0 ${
                        className={`glass rounded-lg p-1.5 sm:p-2 text-center transition-all text-xs flex-shrink-0 ${
                          filter === s.key ? 'bg-red-900/30 border border-red-600/40' : 'hover:bg-red-900/10'
                        }`}
                      >
                        <div className="text-base sm:text-lg mb-0.5">{s.emoji}</div>
                        <div className="font-brand text-sm sm:text-lg font-bold text-white">
                          {sportCounts[s.key as keyof typeof sportCounts]}
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-gray-400">{s.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="px-4 sm:px-6 py-2 sm:py-3 border-b border-red-900/20 flex-shrink-0">
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/60 border border-gray-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500/50 focus:outline-none placeholder:text-gray-500"
                  />
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-4 sm:px-6 py-3 sm:py-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
                          <tr className="border-b border-gray-800">
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider">Sport</th>
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider text-xs">Athlete</th>
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider">Age</th>
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider text-xs">Parent</th>
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider">📞</th>
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider text-xs">Email</th>
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider text-xs">Level</th>
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider text-xs">School</th>
                            <th className="px-2 sm:px-3 py-2 text-left font-brand font-bold text-red-400 uppercase tracking-wider text-xs">Shirt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {filteredKids.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="px-3 py-12 text-center text-gray-500">
                                No registrations found.
                              </td>
                            </tr>
                          ) : (
                            filteredKids.map((kid) => {
                              const phone = kid.parent_phone || kid.profiles?.[0]?.phone || '—'
                              return (
                                <tr key={kid.id} className="hover:bg-red-900/10 transition-colors">
                                  <td className="px-2 sm:px-3 py-2">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white ${sportColors[kid.sport] || 'bg-gray-600'}`}>
                                      {kid.sport}
                                    </span>
                                  </td>
                                  <td className="px-2 sm:px-3 py-2 font-semibold text-white text-xs">{kid.name}</td>
                                  <td className="px-2 sm:px-3 py-2 text-gray-300">{kid.age}</td>
                                  <td className="px-2 sm:px-3 py-2 text-gray-300 text-xs truncate">{kid.profiles?.[0]?.name || '—'}</td>
                                  <td className="px-2 sm:px-3 py-2 text-yellow-400 font-semibold text-xs">{phone}</td>
                                  <td className="px-2 sm:px-3 py-2 text-gray-400 text-xs truncate">{kid.profiles?.[0]?.email || '—'}</td>
                                  <td className="px-2 sm:px-3 py-2 text-gray-300 capitalize text-xs">{kid.experience_level || '—'}</td>
                                  <td className="px-2 sm:px-3 py-2 text-gray-300 text-xs">{kid.school || '—'}</td>
                                  <td className="px-2 sm:px-3 py-2 text-gray-300 text-xs">{kid.shirt_size || '—'}</td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600">
                      Showing {filteredKids.length} of {kids.length} registrations
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
