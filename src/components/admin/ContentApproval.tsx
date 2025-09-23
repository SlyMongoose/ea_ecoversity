'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { getCulturalLevelColor, formatRelativeTime } from '@/lib/utils'

interface PendingContent {
  id: string
  title: string
  title_hawaiian?: string
  description: string
  content: string
  cultural_level: string
  is_sacred: boolean
  requires_approval: boolean
  kumu: {
    name: string
    hawaiian_name?: string
    email: string
  }
  created_at: string
  updated_at: string
}

export default function ContentApproval() {
  const { profile } = useAuth()
  const [pendingContent, setPendingContent] = useState<PendingContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Check if user can access this component
  const canReview = profile?.cultural_role === 'Administrator' ||
                   profile?.cultural_role === 'ContentReviewer' ||
                   profile?.is_elder ||
                   profile?.is_kumu_verified

  useEffect(() => {
    if (!canReview) return

    fetchPendingContent()
  }, [canReview])

  const fetchPendingContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('moolelo')
        .select(`
          *,
          kumu:user_profiles!moolelo_kumu_id_fkey (
            name,
            hawaiian_name,
            email
          )
        `)
        .eq('status', 'UnderReview')
        .order('created_at', { ascending: false })

      if (error) throw error

      setPendingContent(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending content')
      console.error('Pending content error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleContentReview = async (
    contentId: string,
    status: 'Approved' | 'Archived',
    feedback?: string
  ) => {
    if (!profile) return

    try {
      setProcessingId(contentId)
      setError(null)

      const updates: Record<string, string | Date> = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'Approved') {
        updates.approved_by = profile.id
        updates.approved_at = new Date().toISOString()
        // Auto-publish approved content
        updates.status = 'Published'
      }

      const { error } = await supabase
        .from('moolelo')
        .update(updates)
        .eq('id', contentId)

      if (error) throw error

      // Remove from pending list
      setPendingContent(prev => prev.filter(content => content.id !== contentId))

      // TODO: Send notification to content creator

    } catch (err: any) {
      setError(err.message || 'Failed to process content review')
      console.error('Content review error:', err)
    } finally {
      setProcessingId(null)
    }
  }

  if (!canReview) {
    return (
      <div className="bg-coral-100 border border-coral-300 text-coral-700 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
        <p>You don&apos;t have permission to review content.</p>
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
          Content Approval Queue
        </h2>
        <p className="text-forest-600">
          Review moʻolelo and cultural content awaiting approval.
        </p>
      </div>

      {error && (
        <div className="p-6 bg-coral-100 border-coral-300 text-coral-700 border-l-4">
          {error}
        </div>
      )}

      {/* Content List */}
      <div className="p-6">
        {pendingContent.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-forest-600">No content pending approval.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingContent.map((content) => (
              <ContentReviewCard
                key={content.id}
                content={content}
                onApprove={() => handleContentReview(content.id, 'Approved')}
                onReject={(feedback) => handleContentReview(content.id, 'Archived', feedback)}
                isProcessing={processingId === content.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ContentReviewCardProps {
  content: PendingContent
  onApprove: () => void
  onReject: (feedback?: string) => void
  isProcessing: boolean
}

function ContentReviewCard({
  content,
  onApprove,
  onReject,
  isProcessing
}: ContentReviewCardProps) {
  const [showContent, setShowContent] = useState(false)
  const [reviewMode, setReviewMode] = useState<'approve' | 'reject' | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = () => {
    if (reviewMode === 'approve') {
      onApprove()
    } else if (reviewMode === 'reject') {
      onReject(feedback || undefined)
    }
    setReviewMode(null)
    setFeedback('')
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-soft transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-forest-800">
              {content.title}
            </h3>
            {content.is_sacred && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-semibold">
                Sacred Content
              </span>
            )}
          </div>

          {content.title_hawaiian && (
            <p className="text-lg text-ocean-600 font-medium italic mb-2">
              {content.title_hawaiian}
            </p>
          )}

          <p className="text-forest-600 leading-relaxed mb-3">
            {content.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-forest-500">
            <span>By: {content.kumu.hawaiian_name || content.kumu.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCulturalLevelColor(content.cultural_level)}`}>
              {content.cultural_level}
            </span>
            <span>{formatRelativeTime(new Date(content.created_at))}</span>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      {showContent && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-forest-700 mb-2">Content Preview:</h4>
          <div className="text-forest-600 leading-relaxed max-h-64 overflow-y-auto">
            {content.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Cultural Guidelines Check */}
      {content.is_sacred && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-800 mb-1">Sacred Content Review</h4>
          <p className="text-sm text-purple-700">
            This content has been marked as sacred. Ensure it follows cultural protocols and
            is appropriate for the specified cultural level access.
          </p>
        </div>
      )}

      {/* Review Actions */}
      {reviewMode ? (
        <div className="border-t border-gray-100 pt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-forest-700 mb-2">
              Review Feedback {reviewMode === 'reject' && '(Required for rejection)'}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              placeholder={
                reviewMode === 'approve'
                  ? 'Optional notes about the approval...'
                  : 'Please explain what needs to be changed or why this content is being rejected...'
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
                setFeedback('')
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
              disabled={reviewMode === 'reject' && !feedback.trim()}
            >
              {reviewMode === 'approve' ? 'Approve & Publish' : 'Reject Content'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? 'Hide' : 'Read'} Full Content
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
    </div>
  )
}