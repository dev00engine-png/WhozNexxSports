'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Kid {
  id: string
  name: string
  age: number
  sport: string
  profiles: { name: string; email: string }[]
}

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [kids, setKids] = useState<Kid[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)

      // Check if admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        alert('Access denied')
        router.push('/')
        return
      }

      // Fetch all kids
      const { data: kidsData } = await supabase
        .from('kids')
        .select(`
          id,
          name,
          age,
          sport,
          profiles (
            name,
            email
          )
        `)
      setKids(kidsData || [])
      setLoading(false)
    }
    getUser()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kid's Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kids.map((kid) => (
                <tr key={kid.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{kid.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{kid.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{kid.sport}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{kid.profiles[0]?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{kid.profiles[0]?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}