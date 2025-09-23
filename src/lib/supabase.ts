import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a basic client for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for common database operations
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

export async function updateUserProfile(userId: string, updates: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export async function getMoolelo(filters?: {
  culturalLevel?: string
  island?: string
  limit?: number
  offset?: number
}) {
  try {
    let query = supabase
      .from('moolelo')
      .select(`
        *,
        location:locations(*),
        kumu:user_profiles(*)
      `)
      .eq('status', 'Published')
      .order('created_at', { ascending: false })

    if (filters?.culturalLevel) {
      query = query.eq('cultural_level', filters.culturalLevel)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching moolelo:', error)
    throw error
  }
}

export async function createMoolelo(moolelo: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('moolelo')
      .insert(moolelo)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating moolelo:', error)
    throw error
  }
}

export async function updateMoolelo(id: string, updates: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('moolelo')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating moolelo:', error)
    throw error
  }
}

export async function getHalau(userId: string) {
  try {
    // Simplified query for now
    const { data, error } = await supabase
      .from('halau_members')
      .select('*, halau(*)')
      .eq('user_id', userId)
      .eq('status', 'active')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching halau:', error)
    return []
  }
}

export async function createHalau(halau: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('halau')
      .insert(halau)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating halau:', error)
    throw error
  }
}

export async function joinHalau(halauId: string, userId: string) {
  try {
    const memberData = {
      halau_id: halauId,
      user_id: userId,
      status: 'active' as const,
      joined_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('halau_members')
      .insert(memberData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error joining halau:', error)
    throw error
  }
}