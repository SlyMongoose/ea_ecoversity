import { CulturalLevel, CulturalRole, ContentStatus } from '@/types/cultural'

export interface CulturalAccess {
  canView: boolean
  canEdit: boolean
  canShare: boolean
  requiresApproval: boolean
  restrictions: string[]
}

export interface ContentPermission {
  contentId: string
  requiredLevel: CulturalLevel
  requiredRole?: CulturalRole
  isSacred: boolean
  requiresKumuApproval: boolean
  geographicRestriction?: string
  seasonalRestriction?: string
  description: string
}

// Cultural protocol levels and their requirements
export const CULTURAL_LEVELS_HIERARCHY: Record<CulturalLevel, number> = {
  'Beginner': 1,
  'Familiar': 2,
  'Practiced': 3,
  'Advanced': 4,
  'Kumu': 5,
  'Kapuna': 6
}

// Sacred content that requires special protocols
export const SACRED_CONTENT_PROTOCOLS = {
  PULE: {
    description: 'Traditional prayers and spiritual practices',
    requiredLevel: 'Advanced' as CulturalLevel,
    requiresKumuApproval: true,
    restrictions: ['Not for commercial use', 'Respectful context only']
  },
  GENEALOGY: {
    description: 'Family genealogies and ancestral connections',
    requiredLevel: 'Practiced' as CulturalLevel,
    requiresKumuApproval: true,
    restrictions: ['Family permission required', 'No public sharing']
  },
  SACRED_PLACES: {
    description: 'Information about sacred locations and their protocols',
    requiredLevel: 'Advanced' as CulturalLevel,
    requiresKumuApproval: true,
    restrictions: ['No specific location details', 'Cultural sensitivity required']
  },
  TRADITIONAL_MEDICINE: {
    description: 'Traditional healing practices and plant medicine',
    requiredLevel: 'Kumu' as CulturalLevel,
    requiresKumuApproval: true,
    restrictions: ['Educational purposes only', 'No medical advice', 'Cultural practitioner guidance required']
  }
}

// Permission checking functions
export function checkCulturalAccess(
  userLevel: CulturalLevel,
  userRole: CulturalRole,
  contentPermission: ContentPermission
): CulturalAccess {
  const userLevelValue = CULTURAL_LEVELS_HIERARCHY[userLevel]
  const requiredLevelValue = CULTURAL_LEVELS_HIERARCHY[contentPermission.requiredLevel]

  const baseAccess = {
    canView: false,
    canEdit: false,
    canShare: false,
    requiresApproval: contentPermission.requiresKumuApproval,
    restrictions: []
  }

  // Check level requirements
  if (userLevelValue < requiredLevelValue) {
    return {
      ...baseAccess,
      restrictions: [`Requires ${contentPermission.requiredLevel} level or higher`]
    }
  }

  // Check role requirements
  if (contentPermission.requiredRole && userRole !== contentPermission.requiredRole) {
    const allowedRoles = ['CulturalPractitioner', 'Elder', 'ContentReviewer', 'Administrator']
    if (!allowedRoles.includes(userRole)) {
      return {
        ...baseAccess,
        restrictions: [`Requires ${contentPermission.requiredRole} role`]
      }
    }
  }

  // Sacred content additional restrictions
  if (contentPermission.isSacred) {
    return {
      canView: true,
      canEdit: userRole === 'CulturalPractitioner' || userRole === 'Elder',
      canShare: false, // Sacred content cannot be freely shared
      requiresApproval: true,
      restrictions: [
        'Sacred content - view only',
        'No sharing without Kumu approval',
        'Cultural protocols must be observed'
      ]
    }
  }

  // Standard access based on level
  return {
    canView: true,
    canEdit: userLevelValue >= CULTURAL_LEVELS_HIERARCHY['Practiced'],
    canShare: userLevelValue >= CULTURAL_LEVELS_HIERARCHY['Advanced'],
    requiresApproval: contentPermission.requiresKumuApproval,
    restrictions: []
  }
}

export function validateContentCreation(
  userLevel: CulturalLevel,
  userRole: CulturalRole,
  contentType: string,
  isSacred: boolean = false
): { canCreate: boolean; restrictions: string[] } {
  const userLevelValue = CULTURAL_LEVELS_HIERARCHY[userLevel]

  // Basic content creation requirements
  if (userLevelValue < CULTURAL_LEVELS_HIERARCHY['Familiar']) {
    return {
      canCreate: false,
      restrictions: ['Must be at least Familiar level to create content']
    }
  }

  // Sacred content creation restrictions
  if (isSacred) {
    const allowedRoles = ['CulturalPractitioner', 'Elder', 'Administrator']
    if (!allowedRoles.includes(userRole)) {
      return {
        canCreate: false,
        restrictions: ['Sacred content can only be created by Cultural Practitioners or Elders']
      }
    }
  }

  // Advanced content requirements
  if (userLevelValue >= CULTURAL_LEVELS_HIERARCHY['Advanced']) {
    return {
      canCreate: true,
      restrictions: isSacred ? ['Content will require Kumu approval before publication'] : []
    }
  }

  return {
    canCreate: true,
    restrictions: ['Content will require review before publication']
  }
}

export function getCulturalGuidelines(contentType: string): string[] {
  const baseGuidelines = [
    'Respect the cultural significance of all content',
    'Use proper Hawaiian language diacritical marks',
    'Provide cultural context when appropriate',
    'Credit sources and cultural practitioners',
    'Ensure accuracy of cultural information'
  ]

  const specificGuidelines: Record<string, string[]> = {
    'moolelo': [
      'Verify story origins and permissions',
      'Include cultural context and significance',
      'Respect family and community ownership of stories'
    ],
    'olelo': [
      'Provide accurate pronunciation guides',
      'Include cultural usage examples',
      'Reference authoritative Hawaiian language sources'
    ],
    'place': [
      'Respect sacred and sensitive locations',
      'Do not share specific coordinates of sacred sites',
      'Include cultural protocols for visiting'
    ],
    'tradition': [
      'Ensure cultural authenticity',
      'Consult with cultural practitioners',
      'Avoid commercialization of sacred practices'
    ]
  }

  return [
    ...baseGuidelines,
    ...(specificGuidelines[contentType] || [])
  ]
}

export function requiresKumuApproval(
  contentType: string,
  isSacred: boolean,
  culturalLevel: CulturalLevel
): boolean {
  // Always require approval for sacred content
  if (isSacred) return true

  // Require approval for sensitive content types
  const sensitiveTypes = ['pule', 'genealogy', 'sacred-places', 'traditional-medicine']
  if (sensitiveTypes.includes(contentType)) return true

  // Require approval for content from lower-level users
  if (CULTURAL_LEVELS_HIERARCHY[culturalLevel] < CULTURAL_LEVELS_HIERARCHY['Advanced']) {
    return true
  }

  return false
}

// Helper function to get appropriate content status based on permissions
export function getInitialContentStatus(
  userLevel: CulturalLevel,
  userRole: CulturalRole,
  isSacred: boolean
): ContentStatus {
  const allowedToPublish = [
    'CulturalPractitioner',
    'Elder',
    'ContentReviewer',
    'Administrator'
  ]

  if (isSacred || !allowedToPublish.includes(userRole)) {
    return 'UnderReview'
  }

  if (CULTURAL_LEVELS_HIERARCHY[userLevel] >= CULTURAL_LEVELS_HIERARCHY['Advanced']) {
    return 'Approved'
  }

  return 'UnderReview'
}