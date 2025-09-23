'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void
  maxDuration?: number // in seconds
  className?: string
}

export default function AudioRecorder({
  onRecordingComplete,
  maxDuration = 30,
  className = ""
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        if (onRecordingComplete) {
          onRecordingComplete(audioBlob)
        }

        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

    } catch (err) {
      setError('Unable to access microphone. Please check your permissions.')
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    setIsRecording(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setRecordingTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-soft ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-forest-800 mb-2">
          Practice Pronunciation
        </h3>
        <p className="text-sm text-forest-600">
          Record yourself and compare with native pronunciation
        </p>
      </div>

      {error && (
        <div className="bg-coral-100 border border-coral-300 text-coral-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        {/* Recording Timer */}
        <div className="text-2xl font-mono font-bold text-ocean-600">
          {formatTime(recordingTime)}
        </div>

        {/* Recording Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-ocean-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(recordingTime / maxDuration) * 100}%` }}
          ></div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span className="text-lg">🎤</span>
              <span>Record</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-lava-500 hover:bg-lava-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 animate-pulse"
            >
              <span className="text-lg">⏹️</span>
              <span>Stop</span>
            </button>
          )}

          {audioUrl && !isRecording && (
            <button
              onClick={clearRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Audio Playback */}
        {audioUrl && !isRecording && (
          <div className="w-full max-w-sm">
            <p className="text-sm text-forest-600 mb-2 text-center">Your Recording:</p>
            <audio
              controls
              src={audioUrl}
              className="w-full"
              style={{ height: '40px' }}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-forest-500 text-center max-w-xs">
          Click record and speak clearly. Your recording will be compared with native pronunciation for feedback.
        </div>
      </div>
    </div>
  )
}