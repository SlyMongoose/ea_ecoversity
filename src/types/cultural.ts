// Cultural content types for Hawaiian knowledge system

export interface Moolelo {
  id: string
  title: string
  titleHawaiian: string
  description: string
  descriptionHawaiian?: string
  content: string
  contentHawaiian?: string
  audioUrl?: string
  videoUrl?: string
  imageUrl?: string
  location?: AinaLocation
  culturalLevel: CulturalLevel
  tags: string[]
  relatedMoolelo: string[]
  kumu?: Kumu
  createdAt: Date
  updatedAt: Date
  status: ContentStatus
}

export interface AinaLocation {
  id: string
  name: string
  nameHawaiian: string
  coordinates?: {
    lat: number
    lng: number
  }
  island: HawaiianIsland
  ahupuaa?: string
  description: string
  culturalSignificance: string
  relatedMoolelo: string[]
}

export interface Kumu {
  id: string
  name: string
  credentials: string[]
  specialties: string[]
  bio: string
  avatarUrl?: string
  approvedContent: string[]
  culturalRole: CulturalRole
}

export interface Halau {
  id: string
  name: string
  description: string
  kumu: Kumu[]
  haumana: Haumana[]
  focus: LearningFocus[]
  isPublic: boolean
  inviteCode?: string
  createdAt: Date
}

export interface Haumana {
  id: string
  name: string
  email: string
  avatarUrl?: string
  joinedDate: Date
  completedMoolelo: string[]
  currentHalau: string[]
  culturalLevel: CulturalLevel
  preferredLanguage: Language
  learningPath: LearningPath
}

export interface OleloRecord {
  id: string
  word: string
  pronunciation: string
  audioUrl?: string
  definition: string
  definitionHawaiian?: string
  partOfSpeech: PartOfSpeech
  usage: string[]
  relatedWords: string[]
  culturalContext?: string
  difficulty: DifficultyLevel
}

export interface CulturalProtocol {
  id: string
  content: string
  requiredLevel: CulturalLevel
  requiredApproval: boolean
  restrictedAccess: boolean
  approvedUsers: string[]
  description: string
}

// Enums and types

export type HawaiianIsland =
  | 'Hawaii'
  | 'Maui'
  | 'Oahu'
  | 'Kauai'
  | 'Molokai'
  | 'Lanai'
  | 'Niihau'
  | 'Kahoolawe'

export type CulturalLevel =
  | 'Beginner'      // New to Hawaiian culture
  | 'Familiar'      // Basic understanding
  | 'Practiced'     // Regular practice/study
  | 'Advanced'      // Deep knowledge
  | 'Kumu'          // Teaching level
  | 'Kapuna'        // Elder/expert level

export type CulturalRole =
  | 'Student'
  | 'Teacher'
  | 'CulturalPractitioner'
  | 'Elder'
  | 'ContentReviewer'
  | 'Administrator'

export type Language = 'English' | 'Hawaiian' | 'Both'

export type LearningFocus =
  | 'Language'
  | 'History'
  | 'Traditions'
  | 'Arts'
  | 'Music'
  | 'Navigation'
  | 'Agriculture'
  | 'Spirituality'
  | 'Contemporary'

export type ContentStatus =
  | 'Draft'
  | 'UnderReview'
  | 'Approved'
  | 'Published'
  | 'Archived'

export type PartOfSpeech =
  | 'Noun'
  | 'Verb'
  | 'Adjective'
  | 'Adverb'
  | 'Preposition'
  | 'Conjunction'
  | 'Interjection'
  | 'Phrase'

export type DifficultyLevel =
  | 'Basic'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert'

export interface LearningPath {
  currentFocus: LearningFocus[]
  completedTopics: string[]
  preferredLearningStyle: LearningStyle
  goals: string[]
}

export type LearningStyle =
  | 'Visual'
  | 'Auditory'
  | 'Kinesthetic'
  | 'ReadingWriting'
  | 'Mixed'

// API response types
export interface MookeloResponse {
  data: Moolelo[]
  pagination?: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface SearchFilters {
  island?: HawaiianIsland
  culturalLevel?: CulturalLevel
  focus?: LearningFocus[]
  language?: Language
  tags?: string[]
  hasAudio?: boolean
  hasVideo?: boolean
}