'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

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
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check session-based admin auth
    const isAdmin = sessionStorage.getItem('wns_admin')
    if (isAdmin !== 'true') {
      router.push('/')
      return
    }

    const fetchData = async () => {
      setAuthorized(true)
      
      if (!supabase) { 
        console.error('Supabase client not initialized')
        setLoading(false)
        return 
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) { 
        console.error('User not authenticated:', userError)
        setLoading(false)
        return 
      }

      const { data: kidsData, error: kidsError } = await supabase
        .from('kids')
        .select(`
          id, name, age, sport, gender, school, grade,
          experience_level, parent_phone,
          emergency_contact_name, emergency_contact_phone,
          shirt_size, medical_notes, special_requests, created_at,
          profiles ( name, email, phone )
        `)
        .order('created_at', { ascending: false })

      if (kidsError) {
        console.error('Error fetching kids:', kidsError)
        alert(`Failed to load registrations: ${kidsError.message}`)
        setKids([])
      } else {
        console.log('Fetched kids data:', kidsData)
        setKids((kidsData as Kid[]) || [])
      }
      
      setLoading(false)
    }
    fetchData()
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('wns_admin')
    router.push('/')
  }

  const handleViewDetails = (kid: Kid) => {
    setSelectedKid(kid)
    setDetailsOpen(true)
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
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-brand font-bold text-red-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredKids.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
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
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {kid.created_at ? new Date(kid.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <Button 
                              onClick={() => handleViewDetails(kid)}
                              variant="outline" 
                              className="border-red-600/50 text-red-400 hover:bg-red-900/30 text-xs px-3 py-1 h-auto rounded-lg"
                            >
                              View Full
                            </Button>
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

        {/* Coach Submissions Panel */}
        <div className="mt-16">
          <div className="border-b border-red-900/30 mb-8 pb-4">
            <h2 className="font-brand text-2xl sm:text-3xl md:text-4xl font-bold text-luxury">Coach Submissions</h2>
            <p className="text-xs text-gray-400 mt-2">Prospective coaches who have applied to join WhozNexxSports.</p>
          </div>
          {/* Panel component */}
          <div className="glass-card rounded-2xl border border-gray-800">
            {/* @ts-ignore */}
            {typeof window !== 'undefined' && require('./CoachSubmissionsPanel').default()}
          </div>
        </div>
      </div>

      {/* Detailed View Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-black/95 border-red-700 text-white backdrop-blur-xl max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedKid && (
            <div className="space-y-6 py-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-bold text-white ${sportColors[selectedKid.sport] || 'bg-gray-600'}`}>
                      {selectedKid.sport.toUpperCase()}
                    </span>
                    <span className="badge-premium text-xs">
                      Registered {selectedKid.created_at ? new Date(selectedKid.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  <h2 className="font-brand text-3xl font-bold text-luxury">{selectedKid.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">Complete Registration Details</p>
                </div>
              </div>

              {/* Athlete Information */}
              <div>
                <h3 className="font-brand text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                  🏃 Athlete Information
                </h3>
                <div className="glass-card rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Full Name:</span>
                    <p className="text-white font-semibold">{selectedKid.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <p className="text-white font-semibold">{selectedKid.age} years old</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <p className="text-white font-semibold capitalize">{selectedKid.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Grade:</span>
                    <p className="text-white font-semibold">{selectedKid.grade || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">School:</span>
                    <p className="text-white font-semibold">{selectedKid.school || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience Level:</span>
                    <p className="text-white font-semibold capitalize">{selectedKid.experience_level || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Shirt Size:</span>
                    <p className="text-white font-semibold">{selectedKid.shirt_size || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div>
                <h3 className="font-brand text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                  👨‍👩‍👧 Parent/Guardian Contact
                </h3>
                <div className="glass-card rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Parent Name:</span>
                    <p className="text-white font-semibold">{selectedKid.profiles?.[0]?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Parent Email:</span>
                    <p className="text-white font-semibold">{selectedKid.profiles?.[0]?.email || 'Not provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Parent Phone:</span>
                    <p className="text-yellow-400 font-bold text-lg">{selectedKid.parent_phone || selectedKid.profiles?.[0]?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="font-brand text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                  🚨 Emergency Contact
                </h3>
                <div className="glass-card rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Contact Name:</span>
                    <p className="text-white font-semibold">{selectedKid.emergency_contact_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Contact Phone:</span>
                    <p className="text-yellow-400 font-bold">{selectedKid.emergency_contact_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Medical & Special Notes */}
              {(selectedKid.medical_notes || selectedKid.special_requests) && (
                <div>
                  <h3 className="font-brand text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                    📋 Additional Information
                  </h3>
                  <div className="glass-card rounded-xl p-4 space-y-4 text-sm">
                    {selectedKid.medical_notes && (
                      <div>
                        <span className="text-gray-500 font-semibold">Medical Notes / Allergies:</span>
                        <p className="text-white mt-1 whitespace-pre-wrap">{selectedKid.medical_notes}</p>
                      </div>
                    )}
                    {selectedKid.special_requests && (
                      <div>
                        <span className="text-gray-500 font-semibold">Special Requests:</span>
                        <p className="text-white mt-1 whitespace-pre-wrap">{selectedKid.special_requests}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setDetailsOpen(false)}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-brand rounded-xl"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    const phone = selectedKid.parent_phone || selectedKid.profiles?.[0]?.phone
                    if (phone) window.open(`tel:${phone}`)
                  }}
                  variant="outline"
                  className="flex-1 border-green-600/50 text-green-400 hover:bg-green-900/30 font-brand rounded-xl"
                >
                  📞 Call Parent
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
