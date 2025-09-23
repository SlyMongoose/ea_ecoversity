import { formatRelativeTime, getCulturalTopicIcon, getCulturalLevelColor } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Moolelo, CulturalLevel } from '@/types/cultural'

interface CulturalCardProps {
  content: Moolelo
  onRead?: () => void
  onListen?: () => void
  showLevel?: boolean
  className?: string
}

export default function CulturalCard({
  content,
  onRead,
  onListen,
  showLevel = true,
  className = ""
}: CulturalCardProps) {
  const {
    title,
    titleHawaiian,
    description,
    audioUrl,
    imageUrl,
    location,
    culturalLevel,
    tags,
    kumu,
    createdAt
  } = content

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-cultural transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      {/* Image Header */}
      {imageUrl && (
        <div className="h-48 bg-gradient-to-br from-ocean-100 to-forest-100 relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Cultural Level Badge */}
          {showLevel && (
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCulturalLevelColor(culturalLevel)}`}>
                {culturalLevel}
              </span>
            </div>
          )}

          {/* Location Badge */}
          {location && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-xs font-medium text-forest-700 flex items-center">
                🏝️ {location.island}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title Section */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-forest-800 mb-1 line-clamp-2">
            {title}
          </h3>
          {titleHawaiian && (
            <p className="text-lg text-ocean-600 font-medium italic">
              {titleHawaiian}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-forest-600 leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-sand-100 text-sand-800 text-xs rounded-full"
              >
                {getCulturalTopicIcon(tag)}
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-forest-500 py-1">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Kumu Information */}
        {kumu && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-forest-50 rounded-lg">
            <div className="w-8 h-8 bg-forest-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-forest-700">
                {kumu.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-forest-800">{kumu.name}</p>
              <p className="text-xs text-forest-600">Cultural Practitioner</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={onRead}
            className="flex-1"
          >
            <span className="mr-2">📖</span>
            Read Story
          </Button>

          {audioUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={onListen}
              className="flex items-center"
            >
              <span className="mr-1">🎧</span>
              Listen
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-forest-500">
          <span>{formatRelativeTime(new Date(createdAt))}</span>
          {audioUrl && (
            <span className="flex items-center gap-1">
              🎵 Audio available
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Skeleton loading component
export function CulturalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200" />

      {/* Content placeholder */}
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />

        {/* Tags placeholder */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-14" />
        </div>

        {/* Buttons placeholder */}
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded-lg flex-1" />
          <div className="h-10 bg-gray-200 rounded-lg w-20" />
        </div>
      </div>
    </div>
  )
}