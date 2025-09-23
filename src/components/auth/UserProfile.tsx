'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/Button'
import { getCulturalLevelColor, formatHawaiianText } from '@/lib/utils'
import { CulturalLevel, CulturalRole } from '@/types/cultural'

export default function UserProfile() {
  const { profile, updateProfile, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    hawaiianName: profile?.hawaiian_name || '',
    bio: profile?.bio || '',
    specialties: profile?.specialties || [],
    culturalLevel: profile?.cultural_level || 'Beginner' as CulturalLevel,
    culturalRole: profile?.cultural_role || 'Student' as CulturalRole
  })

  if (!profile) return null

  const handleSave = async () => {
    setError(null)
    setLoading(true)

    try {
      await updateProfile({
        name: formData.name,
        hawaiian_name: formData.hawaiianName || undefined,
        bio: formData.bio || undefined,
        specialties: formData.specialties,
        cultural_level: formData.culturalLevel,
        cultural_role: formData.culturalRole
      })
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      hawaiianName: profile?.hawaiian_name || '',
      bio: profile?.bio || '',
      specialties: profile?.specialties || [],
      culturalLevel: profile?.cultural_level || 'Beginner',
      culturalRole: profile?.cultural_role || 'Student'
    })
    setIsEditing(false)
    setError(null)
  }

  const addSpecialty = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }))
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-cultural-gradient rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {profile.hawaiian_name ? profile.hawaiian_name.charAt(0) : profile.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-forest-800">
              {profile.hawaiian_name || profile.name}
            </h2>
            {profile.hawaiian_name && profile.name && (
              <p className="text-forest-600">{profile.name}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCulturalLevelColor(profile.cultural_level)}`}>
                {profile.cultural_level}
              </span>
              <span className="text-sm text-forest-600">{profile.cultural_role}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={loading}
                loadingText="Saving..."
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-coral-100 border border-coral-300 text-coral-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-forest-800 mb-4">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                />
              ) : (
                <p className="text-forest-600">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Hawaiian Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.hawaiianName}
                  onChange={(e) => setFormData(prev => ({ ...prev, hawaiianName: formatHawaiianText(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  placeholder="Your Hawaiian name"
                />
              ) : (
                <p className="text-forest-600">
                  {profile.hawaiian_name || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Cultural Level
              </label>
              {isEditing ? (
                <select
                  value={formData.culturalLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, culturalLevel: e.target.value as CulturalLevel }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Familiar">Familiar</option>
                  <option value="Practiced">Practiced</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Kumu">Kumu</option>
                  <option value="Kapuna">Kāpuna</option>
                </select>
              ) : (
                <p className="text-forest-600">{profile.cultural_level}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Role
              </label>
              {isEditing ? (
                <select
                  value={formData.culturalRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, culturalRole: e.target.value as CulturalRole }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="CulturalPractitioner">Cultural Practitioner</option>
                  <option value="Elder">Elder</option>
                </select>
              ) : (
                <p className="text-forest-600">{profile.cultural_role}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-forest-700 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              placeholder="Tell us about your connection to Hawaiian culture..."
              rows={4}
            />
          ) : (
            <p className="text-forest-600">
              {profile.bio || 'No bio provided yet.'}
            </p>
          )}
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-forest-700 mb-2">
            Specialties & Interests
          </label>
          {isEditing ? (
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-ocean-100 text-ocean-800 text-sm rounded-full"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="text-ocean-600 hover:text-ocean-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a specialty..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      addSpecialty(input.value.trim())
                      input.value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement
                    addSpecialty(input.value.trim())
                    input.value = ''
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.specialties && profile.specialties.length > 0 ? (
                profile.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-ocean-100 text-ocean-800 text-sm rounded-full"
                  >
                    {specialty}
                  </span>
                ))
              ) : (
                <p className="text-forest-500 text-sm">No specialties added yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Status Indicators */}
        {!isEditing && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-4 text-sm">
              {profile.is_kumu_verified && (
                <span className="flex items-center gap-1 text-green-600">
                  ✓ Verified Kumu
                </span>
              )}
              {profile.is_elder && (
                <span className="flex items-center gap-1 text-purple-600">
                  ✓ Community Elder
                </span>
              )}
              <span className="text-forest-500">
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}