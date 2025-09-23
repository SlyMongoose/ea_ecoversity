'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuth } from './AuthProvider'
import { CulturalLevel, CulturalRole } from '@/types/cultural'
import { formatHawaiianText } from '@/lib/utils'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'profile'>(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp, updateProfile } = useAuth()

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    hawaiianName: '',
    culturalLevel: 'Beginner' as CulturalLevel,
    culturalRole: 'Student' as CulturalRole,
    bio: '',
    specialties: [] as string[]
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password)
        onClose()
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        await signUp(formData.email, formData.password, {
          name: formData.name,
          hawaiian_name: formData.hawaiianName || undefined,
          cultural_level: formData.culturalLevel,
          cultural_role: formData.culturalRole,
          bio: formData.bio || undefined,
          specialties: formData.specialties.length > 0 ? formData.specialties : undefined
        })

        setMode('profile')
      } else if (mode === 'profile') {
        await updateProfile({
          hawaiian_name: formData.hawaiianName || undefined,
          bio: formData.bio || undefined,
          specialties: formData.specialties.length > 0 ? formData.specialties : undefined
        })
        onClose()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-forest-800">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Join Our ʻOhana'}
              {mode === 'profile' && 'Complete Your Profile'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
          {mode === 'signup' && (
            <p className="text-forest-600 mt-2">
              Become part of our learning community dedicated to Hawaiian culture and language.
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-coral-100 border border-coral-300 text-coral-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email (for signin/signup) */}
          {(mode === 'signin' || mode === 'signup') && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="your@email.com"
              />
            </div>
          )}

          {/* Password */}
          {(mode === 'signin' || mode === 'signup') && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="Enter your password"
                minLength={6}
              />
            </div>
          )}

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="Confirm your password"
                minLength={6}
              />
            </div>
          )}

          {/* Name (signup/profile) */}
          {(mode === 'signup' || mode === 'profile') && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Name
              </label>
              <input
                type="text"
                required={mode === 'signup'}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="Your full name"
              />
            </div>
          )}

          {/* Hawaiian Name (signup/profile) */}
          {(mode === 'signup' || mode === 'profile') && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Hawaiian Name (Optional)
              </label>
              <input
                type="text"
                value={formData.hawaiianName}
                onChange={(e) => handleInputChange('hawaiianName', formatHawaiianText(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="Your Hawaiian name with proper ʻokina"
              />
              <p className="text-xs text-forest-500 mt-1">
                ʻOkina and kahakō will be automatically formatted
              </p>
            </div>
          )}

          {/* Cultural Level (signup/profile) */}
          {(mode === 'signup' || mode === 'profile') && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Cultural Level
              </label>
              <select
                value={formData.culturalLevel}
                onChange={(e) => handleInputChange('culturalLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              >
                <option value="Beginner">Beginner - New to Hawaiian culture</option>
                <option value="Familiar">Familiar - Basic understanding</option>
                <option value="Practiced">Practiced - Regular practice/study</option>
                <option value="Advanced">Advanced - Deep knowledge</option>
                <option value="Kumu">Kumu - Teaching level</option>
                <option value="Kapuna">Kāpuna - Elder/expert level</option>
              </select>
            </div>
          )}

          {/* Cultural Role (signup/profile) */}
          {(mode === 'signup' || mode === 'profile') && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Role
              </label>
              <select
                value={formData.culturalRole}
                onChange={(e) => handleInputChange('culturalRole', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              >
                <option value="Student">Student - Learning Hawaiian culture</option>
                <option value="Teacher">Teacher - Sharing knowledge</option>
                <option value="CulturalPractitioner">Cultural Practitioner - Active in community</option>
                <option value="Elder">Elder - Community leader</option>
              </select>
            </div>
          )}

          {/* Bio (signup/profile) */}
          {(mode === 'signup' || mode === 'profile') && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="Tell us about your connection to Hawaiian culture..."
                rows={3}
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="cultural"
            size="lg"
            className="w-full"
            isLoading={loading}
            loadingText={
              mode === 'signin' ? 'Signing in...' :
              mode === 'signup' ? 'Creating account...' :
              'Updating profile...'
            }
          >
            {mode === 'signin' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'profile' && 'Complete Profile'}
          </Button>

          {/* Mode Switch */}
          {mode === 'signin' && (
            <div className="text-center">
              <p className="text-sm text-forest-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  Join our ʻohana
                </button>
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div className="text-center">
              <p className="text-sm text-forest-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}