'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { CulturalLevel, CulturalRole } from '@/types/cultural'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import {
  checkCulturalAccess,
  validateContentCreation,
  getCulturalGuidelines,
  requiresKumuApproval,
  CulturalAccess,
  ContentPermission
} from '@/lib/cultural-protocols'

interface UseCulturalPermissionsOptions {
  contentId?: string
  contentType?: string
  isSacred?: boolean
}

interface UseCulturalPermissionsReturn {
  access: CulturalAccess
  canCreateContent: boolean
  creationRestrictions: string[]
  guidelines: string[]
  needsApproval: boolean
  isLoading: boolean
  error: string | null
  checkAccess: (permission: ContentPermission) => CulturalAccess
  validateCreation: (type: string, sacred?: boolean) => { canCreate: boolean; restrictions: string[] }
}

export function useCulturalPermissions({
  contentId,
  contentType = 'general',
  isSacred = false
}: UseCulturalPermissionsOptions = {}): UseCulturalPermissionsReturn {
  const { user, profile } = useAuth()
  const [access, setAccess] = useState<CulturalAccess>({
    canView: false,
    canEdit: false,
    canShare: false,
    requiresApproval: false,
    restrictions: []
  })
  const [contentPermission, setContentPermission] = useState<ContentPermission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContentPermission = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!contentId) {
          // Default permission for general content
          const defaultPermission: ContentPermission = {
            contentId: 'default',
            requiredLevel: 'Beginner',
            isSacred: isSacred,
            requiresKumuApproval: isSacred,
            description: 'General educational content'
          }
          setContentPermission(defaultPermission)
          return
        }

        // Fetch permission from database
        const { data, error } = await supabase
          .from('cultural_permissions')
          .select('*')
          .eq('content_id', contentId)
          .eq('content_type', contentType)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error
        }

        if (data) {
          setContentPermission({
            contentId: (data as any).content_id,
            requiredLevel: (data as any).required_level,
            requiredRole: (data as any).required_role,
            isSacred: (data as any).is_sacred,
            requiresKumuApproval: (data as any).requires_kumu_approval,
            description: (data as any).access_notes || 'Cultural content with specific permissions'
          })
        } else {
          // No specific permission found, use defaults based on content type
          const defaultPermission: ContentPermission = {
            contentId,
            requiredLevel: isSacred ? 'Advanced' : 'Beginner',
            isSacred: isSacred,
            requiresKumuApproval: isSacred,
            description: 'Content with default permissions'
          }
          setContentPermission(defaultPermission)
        }

      } catch (err) {
        setError('Failed to fetch content permissions')
        console.error('Permission fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContentPermission()
  }, [contentId, contentType, isSacred])

  useEffect(() => {
    if (!profile || !contentPermission) return

    try {
      const accessResult = checkCulturalAccess(
        profile.cultural_level,
        profile.cultural_role,
        contentPermission
      )
      setAccess(accessResult)
    } catch (err) {
      setError('Failed to check cultural access')
      console.error('Access check error:', err)
    }
  }, [profile, contentPermission])

  const canCreateContent = useMemo(() => {
    if (!profile) return false
    const result = validateContentCreation(profile.cultural_level, profile.cultural_role, contentType, isSacred)
    return result.canCreate
  }, [profile, contentType, isSacred])

  const creationRestrictions = useMemo(() => {
    if (!profile) return ['Must be logged in to create content']
    const result = validateContentCreation(profile.cultural_level, profile.cultural_role, contentType, isSacred)
    return result.restrictions
  }, [profile, contentType, isSacred])

  const guidelines = useMemo(() => {
    return getCulturalGuidelines(contentType)
  }, [contentType])

  const needsApproval = useMemo(() => {
    if (!profile) return true
    return requiresKumuApproval(contentType, isSacred, profile.cultural_level)
  }, [contentType, isSacred, profile])

  const checkAccess = useCallback((permission: ContentPermission): CulturalAccess => {
    if (!profile) {
      return {
        canView: false,
        canEdit: false,
        canShare: false,
        requiresApproval: false,
        restrictions: ['Must be logged in']
      }
    }
    return checkCulturalAccess(profile.cultural_level, profile.cultural_role, permission)
  }, [profile])

  const validateCreation = useCallback((type: string, sacred: boolean = false) => {
    if (!profile) {
      return {
        canCreate: false,
        restrictions: ['Must be logged in to create content']
      }
    }
    return validateContentCreation(profile.cultural_level, profile.cultural_role, type, sacred)
  }, [profile])

  return {
    access,
    canCreateContent,
    creationRestrictions,
    guidelines,
    needsApproval,
    isLoading,
    error,
    checkAccess,
    validateCreation
  }
}

// Helper hook for checking specific content permissions
export function useContentPermission(contentId: string, contentType: string = 'moolelo') {
  const [permission, setPermission] = useState<ContentPermission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContentPermission = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('cultural_permissions')
          .select('*')
          .eq('content_id', contentId)
          .eq('content_type', contentType)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (data) {
          setPermission({
            contentId: (data as any).content_id,
            requiredLevel: (data as any).required_level,
            requiredRole: (data as any).required_role,
            isSacred: (data as any).is_sacred,
            requiresKumuApproval: (data as any).requires_kumu_approval,
            description: (data as any).access_notes || 'Cultural content with specific permissions'
          })
        } else {
          // No permission found, use smart defaults
          const isSacred = contentId.includes('sacred') || contentId.includes('pule')
          setPermission({
            contentId,
            requiredLevel: isSacred ? 'Advanced' : 'Familiar',
            isSacred,
            requiresKumuApproval: isSacred,
            description: `Permission for ${contentType} ${contentId}`
          })
        }
      } catch (err) {
        setError('Failed to fetch content permission')
        console.error('Content permission error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (contentId) {
      fetchContentPermission()
    }
  }, [contentId, contentType])

  return { permission, isLoading, error }
}

// Hook for cultural role-based UI elements
export function useCulturalRole() {
  const { profile } = useAuth()

  const isKumu = profile?.cultural_role === 'CulturalPractitioner' || profile?.cultural_role === 'Elder' || profile?.is_kumu_verified
  const isContentReviewer = profile?.cultural_role === 'ContentReviewer' || profile?.cultural_role === 'Administrator'
  const canReviewContent = isKumu || isContentReviewer
  const canAccessSacredContent = isKumu || profile?.cultural_level === 'Kapuna' || profile?.is_elder

  const levelDescription = useMemo(() => {
    if (!profile) return 'Not logged in'

    const descriptions: Record<CulturalLevel, string> = {
      'Beginner': 'New to Hawaiian culture and language',
      'Familiar': 'Basic understanding of Hawaiian culture',
      'Practiced': 'Regular practice and study of Hawaiian culture',
      'Advanced': 'Deep knowledge and understanding',
      'Kumu': 'Teaching level with cultural authority',
      'Kapuna': 'Elder with extensive cultural knowledge'
    }
    return descriptions[profile.cultural_level]
  }, [profile?.cultural_level])

  return {
    profile,
    isKumu: isKumu || false,
    isContentReviewer: isContentReviewer || false,
    canReviewContent: canReviewContent || false,
    canAccessSacredContent: canAccessSacredContent || false,
    levelDescription
  }
}