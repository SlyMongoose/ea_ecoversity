'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  src: string
  title?: string
  subtitle?: string
  autoPlay?: boolean
  showWaveform?: boolean
  className?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

export default function AudioPlayer({
  src,
  title,
  subtitle,
  autoPlay = false,
  showWaveform = false,
  className = "",
  onPlay,
  onPause,
  onEnded
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onEnded?.()
    }

    const handleError = () => {
      setError('Unable to load audio file')
      setIsLoading(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [onPlay, onPause, onEnded])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const seekTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.playbackRate = rate
    setPlaybackRate(rate)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (error) {
    return (
      <div className={`bg-coral-100 border border-coral-300 text-coral-700 px-4 py-3 rounded-xl ${className}`}>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-soft ${className}`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        autoPlay={autoPlay}
      />

      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-forest-800 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-forest-600">{subtitle}</p>
          )}
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="bg-ocean-500 hover:bg-ocean-600 disabled:bg-gray-300 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : isPlaying ? (
            <span className="text-lg">⏸️</span>
          ) : (
            <span className="text-lg ml-1">▶️</span>
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center space-x-3">
          <span className="text-sm font-mono text-forest-600 min-w-[40px]">
            {formatTime(currentTime)}
          </span>

          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              disabled={isLoading}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ocean-500
                         [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                         [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:bg-ocean-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
            <div
              className="absolute top-0 left-0 h-2 bg-ocean-500 rounded-full pointer-events-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-sm font-mono text-forest-600 min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Playback Speed Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-forest-600">
          Playback Speed:
        </div>

        <div className="flex space-x-2">
          {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => changePlaybackRate(rate)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                playbackRate === rate
                  ? 'bg-ocean-500 text-white'
                  : 'bg-gray-100 text-forest-600 hover:bg-gray-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Waveform Visualization (placeholder for future implementation) */}
      {showWaveform && (
        <div className="mt-4 h-16 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-xs text-gray-500">Waveform visualization (coming soon)</p>
        </div>
      )}
    </div>
  )
}