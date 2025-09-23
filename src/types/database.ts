export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string
          hawaiian_name?: string
          cultural_level: CulturalLevel
          cultural_role: CulturalRole
          avatar_url?: string
          bio?: string
          specialties?: string[]
          credentials?: string[]
          is_kumu_verified: boolean
          is_elder: boolean
          created_at: string
          updated_at: string
          last_active: string
        }
        Insert: {
          id: string
          email: string
          name: string
          hawaiian_name?: string
          cultural_level?: CulturalLevel
          cultural_role?: CulturalRole
          avatar_url?: string
          bio?: string
          specialties?: string[]
          credentials?: string[]
          is_kumu_verified?: boolean
          is_elder?: boolean
          created_at?: string
          updated_at?: string
          last_active?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          hawaiian_name?: string
          cultural_level?: CulturalLevel
          cultural_role?: CulturalRole
          avatar_url?: string
          bio?: string
          specialties?: string[]
          credentials?: string[]
          is_kumu_verified?: boolean
          is_elder?: boolean
          created_at?: string
          updated_at?: string
          last_active?: string
        }
      }
      moolelo: {
        Row: {
          id: string
          title: string
          title_hawaiian?: string
          description: string
          description_hawaiian?: string
          content: string
          content_hawaiian?: string
          audio_url?: string
          video_url?: string
          image_url?: string
          location_id?: string
          cultural_level: CulturalLevel
          tags: string[]
          kumu_id?: string
          status: ContentStatus
          is_sacred: boolean
          requires_approval: boolean
          approved_by?: string
          approved_at?: string
          created_at: string
          updated_at: string
          view_count: number
          like_count: number
        }
        Insert: {
          id?: string
          title: string
          title_hawaiian?: string
          description: string
          description_hawaiian?: string
          content: string
          content_hawaiian?: string
          audio_url?: string
          video_url?: string
          image_url?: string
          location_id?: string
          cultural_level: CulturalLevel
          tags?: string[]
          kumu_id?: string
          status?: ContentStatus
          is_sacred?: boolean
          requires_approval?: boolean
          approved_by?: string
          approved_at?: string
          created_at?: string
          updated_at?: string
          view_count?: number
          like_count?: number
        }
        Update: {
          id?: string
          title?: string
          title_hawaiian?: string
          description?: string
          description_hawaiian?: string
          content?: string
          content_hawaiian?: string
          audio_url?: string
          video_url?: string
          image_url?: string
          location_id?: string
          cultural_level?: CulturalLevel
          tags?: string[]
          kumu_id?: string
          status?: ContentStatus
          is_sacred?: boolean
          requires_approval?: boolean
          approved_by?: string
          approved_at?: string
          created_at?: string
          updated_at?: string
          view_count?: number
          like_count?: number
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          name_hawaiian: string
          island: HawaiianIsland
          ahupuaa?: string
          coordinates?: { lat: number; lng: number }
          description: string
          cultural_significance: string
          is_sacred: boolean
          access_restrictions?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_hawaiian: string
          island: HawaiianIsland
          ahupuaa?: string
          coordinates?: { lat: number; lng: number }
          description: string
          cultural_significance: string
          is_sacred?: boolean
          access_restrictions?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_hawaiian?: string
          island?: HawaiianIsland
          ahupuaa?: string
          coordinates?: { lat: number; lng: number }
          description?: string
          cultural_significance?: string
          is_sacred?: boolean
          access_restrictions?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      halau: {
        Row: {
          id: string
          name: string
          description: string
          focus: LearningFocus[]
          kumu_id: string
          is_public: boolean
          invite_code?: string
          max_members?: number
          cultural_level_required: CulturalLevel
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          focus: LearningFocus[]
          kumu_id: string
          is_public?: boolean
          invite_code?: string
          max_members?: number
          cultural_level_required?: CulturalLevel
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          focus?: LearningFocus[]
          kumu_id?: string
          is_public?: boolean
          invite_code?: string
          max_members?: number
          cultural_level_required?: CulturalLevel
          created_at?: string
          updated_at?: string
        }
      }
      halau_members: {
        Row: {
          id: string
          halau_id: string
          user_id: string
          role: 'member' | 'assistant_kumu' | 'kumu'
          status: 'pending' | 'active' | 'inactive'
          joined_at: string
          completed_activities: string[]
          progress_notes?: string
        }
        Insert: {
          id?: string
          halau_id: string
          user_id: string
          role?: 'member' | 'assistant_kumu' | 'kumu'
          status?: 'pending' | 'active' | 'inactive'
          joined_at?: string
          completed_activities?: string[]
          progress_notes?: string
        }
        Update: {
          id?: string
          halau_id?: string
          user_id?: string
          role?: 'member' | 'assistant_kumu' | 'kumu'
          status?: 'pending' | 'active' | 'inactive'
          joined_at?: string
          completed_activities?: string[]
          progress_notes?: string
        }
      }
      audio_recordings: {
        Row: {
          id: string
          user_id: string
          moolelo_id?: string
          word_id?: string
          file_url: string
          duration: number
          transcription?: string
          accuracy_score?: number
          feedback?: string
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          moolelo_id?: string
          word_id?: string
          file_url: string
          duration: number
          transcription?: string
          accuracy_score?: number
          feedback?: string
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          moolelo_id?: string
          word_id?: string
          file_url?: string
          duration?: number
          transcription?: string
          accuracy_score?: number
          feedback?: string
          is_public?: boolean
          created_at?: string
        }
      }
      olelo_words: {
        Row: {
          id: string
          word: string
          pronunciation: string
          audio_url?: string
          definition: string
          definition_hawaiian?: string
          part_of_speech: PartOfSpeech
          usage_examples: string[]
          related_words: string[]
          cultural_context?: string
          difficulty_level: DifficultyLevel
          added_by: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word: string
          pronunciation: string
          audio_url?: string
          definition: string
          definition_hawaiian?: string
          part_of_speech: PartOfSpeech
          usage_examples?: string[]
          related_words?: string[]
          cultural_context?: string
          difficulty_level: DifficultyLevel
          added_by: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word?: string
          pronunciation?: string
          audio_url?: string
          definition?: string
          definition_hawaiian?: string
          part_of_speech?: PartOfSpeech
          usage_examples?: string[]
          related_words?: string[]
          cultural_context?: string
          difficulty_level?: DifficultyLevel
          added_by?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cultural_permissions: {
        Row: {
          id: string
          content_id: string
          content_type: 'moolelo' | 'location' | 'word' | 'audio'
          required_level: CulturalLevel
          required_role?: CulturalRole
          is_sacred: boolean
          requires_kumu_approval: boolean
          geographic_restriction?: string
          seasonal_restriction?: string
          access_notes?: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_id: string
          content_type: 'moolelo' | 'location' | 'word' | 'audio'
          required_level: CulturalLevel
          required_role?: CulturalRole
          is_sacred?: boolean
          requires_kumu_approval?: boolean
          geographic_restriction?: string
          seasonal_restriction?: string
          access_notes?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          content_type?: 'moolelo' | 'location' | 'word' | 'audio'
          required_level?: CulturalLevel
          required_role?: CulturalRole
          is_sacred?: boolean
          requires_kumu_approval?: boolean
          geographic_restriction?: string
          seasonal_restriction?: string
          access_notes?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cultural_level: CulturalLevel
      cultural_role: CulturalRole
      content_status: ContentStatus
      hawaiian_island: HawaiianIsland
      learning_focus: LearningFocus
      part_of_speech: PartOfSpeech
      difficulty_level: DifficultyLevel
    }
  }
}

// Import types from cultural.ts
import {
  CulturalLevel,
  CulturalRole,
  ContentStatus,
  HawaiianIsland,
  LearningFocus,
  PartOfSpeech,
  DifficultyLevel
} from './cultural'