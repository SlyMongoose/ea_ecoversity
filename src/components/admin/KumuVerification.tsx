'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { getCulturalLevelColor, formatRelativeTime } from '@/lib/utils'

interface VerificationRequest {
  id: string
  name: string
  hawaiian_name?: string
  email: string
  cultural_level: string
  cultural_role: string
  bio?: string
  credentials?: string[]
  specialties?: string[]
  created_at: string
  verification_notes?: string
}

export default function KumuVerification() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Check if user can access this component
  const canReview = profile?.cultural_role === 'Administrator' ||
                   profile?.cultural_role === 'ContentReviewer' ||
                   profile?.is_elder

  useEffect(() => {
    if (!canReview) return

    fetchVerificationRequests()
  }, [canReview])

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('cultural_role', 'CulturalPractitioner')
        .eq('is_kumu_verified', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRequests(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch verification requests')
      console.error('Verification requests error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (userId: string, approved: boolean, notes?: string) => {
    try {
      setProcessingId(userId)
      setError(null)

      const updates: Record<string, string | Date | boolean> = {
        is_kumu_verified: approved,
        updated_at: new Date().toISOString()
      }

      if (notes) {
        updates.verification_notes = notes
      }

      // If not approved, downgrade role to Teacher
      if (!approved) {
        updates.cultural_role = 'Teacher'
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)

      if (error) throw error

      // Remove from requests list
      setRequests(prev => prev.filter(req => req.id !== userId))

      // TODO: Send notification to user about verification result

    } catch (err: any) {
      setError(err.message || 'Failed to process verification')
      console.error('Verification error:', err)
    } finally {
      setProcessingId(null)
    }
  }

  if (!canReview) {
    return (
      <div className="bg-coral-100 border border-coral-300 text-coral-700 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
        <p>You don&apos;t have permission to review kumu verification requests.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-soft">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-forest-800 mb-2">
          Kumu Verification Requests
        </h2>
        <p className="text-forest-600">
          Review and approve cultural practitioners seeking kumu verification.
        </p>
      </div>

      {error && (
        <div className="p-6 bg-coral-100 border-coral-300 text-coral-700 border-l-4">
          {error}
        </div>
      )}

      {/* Requests List */}
      <div className="p-6">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-forest-600">No pending verification requests.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <VerificationRequestCard
                key={request.id}
                request={request}
                onApprove={(notes) => handleVerification(request.id, true, notes)}
                onReject={(notes) => handleVerification(request.id, false, notes)}
                isProcessing={processingId === request.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface VerificationRequestCardProps {
  request: VerificationRequest
  onApprove: (notes?: string) => void
  onReject: (notes?: string) => void
  isProcessing: boolean
}

function VerificationRequestCard({
  request,
  onApprove,
  onReject,
  isProcessing
}: VerificationRequestCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [notes, setNotes] = useState('')
  const [reviewMode, setReviewMode] = useState<'approve' | 'reject' | null>(null)

  const handleSubmit = () => {
    if (reviewMode === 'approve') {
      onApprove(notes || undefined)
    } else if (reviewMode === 'reject') {
      onReject(notes || undefined)
    }
    setReviewMode(null)
    setNotes('')
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-soft transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-cultural-gradient rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {request.hawaiian_name ? request.hawaiian_name.charAt(0) : request.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-forest-800">
              {request.hawaiian_name || request.name}
            </h3>
            {request.hawaiian_name && request.name && (
              <p className="text-forest-600">{request.name}</p>
            )}
            <p className="text-sm text-forest-500">{request.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCulturalLevelColor(request.cultural_level)}`}>
            {request.cultural_level}
          </span>
          <span className="text-xs text-forest-500">
            {formatRelativeTime(new Date(request.created_at))}
          </span>
        </div>
      </div>

      {/* Bio */}
      {request.bio && (
        <div className="mb-4">
          <p className="text-forest-600 leading-relaxed">{request.bio}</p>
        </div>
      )}

      {/* Credentials and Specialties */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {request.credentials && request.credentials.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-forest-700 mb-2">Credentials</h4>
            <ul className="text-sm text-forest-600 space-y-1">
              {request.credentials.map((credential, index) => (
                <li key={index}>• {credential}</li>
              ))}
            </ul>
          </div>
        )}

        {request.specialties && request.specialties.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-forest-700 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {request.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 bg-ocean-100 text-ocean-800 text-xs rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Actions */}
      {reviewMode ? (
        <div className="border-t border-gray-100 pt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-forest-700 mb-2">
              Review Notes {reviewMode === 'reject' && '(Required for rejection)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              placeholder={
                reviewMode === 'approve'
                  ? 'Optional notes about the approval...'
                  : 'Please explain why this request is being rejected...'
              }
              rows={3}
              required={reviewMode === 'reject'}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReviewMode(null)
                setNotes('')
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={reviewMode === 'approve' ? 'primary' : 'coral'}
              size="sm"
              onClick={handleSubmit}
              isLoading={isProcessing}
              disabled={reviewMode === 'reject' && !notes.trim()}
            >
              {reviewMode === 'approve' ? 'Approve Verification' : 'Reject Request'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>

          <div className="flex gap-3">
            <Button
              variant="coral"
              size="sm"
              onClick={() => setReviewMode('reject')}
              disabled={isProcessing}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setReviewMode('approve')}
              disabled={isProcessing}
            >
              Approve
            </Button>
          </div>
        </div>
      )}

      {/* Additional Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Role:</strong> {request.cultural_role}</p>
              <p><strong>Cultural Level:</strong> {request.cultural_level}</p>
            </div>
            <div>
              <p><strong>Joined:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
              <p><strong>Email:</strong> {request.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}