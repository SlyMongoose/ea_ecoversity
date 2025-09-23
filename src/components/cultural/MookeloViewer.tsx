'use client'

import { useState } from 'react'
import { Moolelo, Language } from '@/types/cultural'
import { Button } from '@/components/ui/Button'
import AudioPlayer from '@/components/audio/AudioPlayer'
import { formatHawaiianText, getCulturalLevelColor } from '@/lib/utils'
import { useCulturalPermissions } from '@/hooks/useCulturalPermissions'

interface MookeloViewerProps {
  moolelo: Moolelo
  onClose?: () => void
  className?: string
}

export default function MookeloViewer({
  moolelo,
  onClose,
  className = ""
}: MookeloViewerProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('English')
  const [showTranslation, setShowTranslation] = useState(false)

  const { access, isLoading } = useCulturalPermissions({
    contentId: moolelo.id,
    isSacred: moolelo.culturalLevel === 'Kumu' || moolelo.culturalLevel === 'Kapuna'
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500"></div>
      </div>
    )
  }

  if (!access.canView) {
    return (
      <div className="bg-coral-100 border border-coral-300 text-coral-700 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
        <p className="mb-4">You don't have permission to view this content.</p>
        <div className="text-sm">
          <p className="font-medium mb-1">Restrictions:</p>
          <ul className="list-disc list-inside space-y-1">
            {access.restrictions.map((restriction, index) => (
              <li key={index}>{restriction}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const {
    title,
    titleHawaiian,
    content,
    contentHawaiian,
    description,
    audioUrl,
    videoUrl,
    imageUrl,
    location,
    culturalLevel,
    tags,
    kumu,
    createdAt
  } = moolelo

  const displayContent = currentLanguage === 'Hawaiian' && contentHawaiian
    ? formatHawaiianText(contentHawaiian)
    : content

  const displayTitle = currentLanguage === 'Hawaiian' && titleHawaiian
    ? formatHawaiianText(titleHawaiian)
    : title

  return (
    <div className={`bg-white rounded-2xl shadow-cultural max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="relative">
        {imageUrl && (
          <div className="h-64 bg-gradient-to-br from-ocean-100 to-forest-100 rounded-t-2xl overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Header Content */}
        <div className={`p-6 ${imageUrl ? 'absolute bottom-0 left-0 right-0 text-white' : 'border-b border-gray-100'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  imageUrl
                    ? 'bg-white/20 text-white backdrop-blur-sm'
                    : getCulturalLevelColor(culturalLevel)
                }`}>
                  {culturalLevel}
                </span>
                {location && (
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    imageUrl
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-sand-100 text-sand-800'
                  }`}>
                    🏝️ {location.island}
                  </span>
                )}
              </div>

              <h1 className={`text-3xl font-bold mb-2 ${imageUrl ? 'text-white text-shadow-cultural' : 'text-forest-800'}`}>
                {displayTitle}
              </h1>

              {(titleHawaiian || title) && currentLanguage !== 'Hawaiian' && titleHawaiian && (
                <p className={`text-lg italic ${imageUrl ? 'text-sand-100' : 'text-ocean-600'}`}>
                  {formatHawaiianText(titleHawaiian)}
                </p>
              )}
            </div>

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className={imageUrl ? 'text-white hover:bg-white/20' : ''}
              >
                ✕
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Language Toggle */}
        {contentHawaiian && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-forest-700">Language:</span>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setCurrentLanguage('English')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  currentLanguage === 'English'
                    ? 'bg-ocean-500 text-white'
                    : 'bg-white text-forest-600 hover:bg-gray-50'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setCurrentLanguage('Hawaiian')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  currentLanguage === 'Hawaiian'
                    ? 'bg-ocean-500 text-white'
                    : 'bg-white text-forest-600 hover:bg-gray-50'
                }`}
              >
                ʻŌlelo Hawaiʻi
              </button>
            </div>

            {currentLanguage === 'Hawaiian' && (
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-sm text-ocean-600 hover:text-ocean-700 underline"
              >
                {showTranslation ? 'Hide' : 'Show'} Translation
              </button>
            )}
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="mb-6">
            <AudioPlayer
              src={audioUrl}
              title="Listen to this moʻolelo"
              subtitle="Audio narration in ʻŌlelo Hawaiʻi"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-6">
          <div className="text-forest-700 leading-relaxed whitespace-pre-line">
            {displayContent}
          </div>

          {/* Translation overlay */}
          {showTranslation && currentLanguage === 'Hawaiian' && content && (
            <div className="mt-4 p-4 bg-sand-50 border-l-4 border-sand-300 rounded-r-lg">
              <h4 className="text-sm font-semibold text-sand-800 mb-2">English Translation:</h4>
              <div className="text-sand-700 leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* Video Player */}
        {videoUrl && (
          <div className="mb-6">
            <video
              controls
              className="w-full rounded-xl shadow-soft"
              poster={imageUrl}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-forest-700 mb-3">Related Topics:</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-sand-100 text-sand-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Kumu Information */}
        {kumu && (
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-forest-700 mb-3">Cultural Guide:</h4>
            <div className="flex items-start gap-4 p-4 bg-forest-50 rounded-xl">
              <div className="w-12 h-12 bg-forest-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-forest-700">
                  {kumu.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-forest-800">{kumu.name}</h5>
                <p className="text-sm text-forest-600 mb-2">{kumu.bio}</p>
                {kumu.specialties && kumu.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {kumu.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-forest-200 text-forest-700 text-xs rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cultural Guidelines */}
        {access.requiresApproval && (
          <div className="mt-6 p-4 bg-coral-50 border border-coral-200 rounded-xl">
            <h4 className="text-sm font-semibold text-coral-800 mb-2">Cultural Note:</h4>
            <p className="text-sm text-coral-700">
              This content has been reviewed by cultural practitioners and should be shared respectfully, maintaining its cultural integrity and context.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}