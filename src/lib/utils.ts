import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Hawaiian language utilities
export function addOkina(text: string): string {
  // Add proper ʻokina (ʻ) and kahakō diacriticals
  // This is a simplified version - in production, you'd want a more comprehensive system
  return text
    .replace(/'/g, 'ʻ')
    .replace(/`/g, 'ʻ')
    .replace(/aa/g, 'ā')
    .replace(/ee/g, 'ē')
    .replace(/ii/g, 'ī')
    .replace(/oo/g, 'ō')
    .replace(/uu/g, 'ū')
}

export function formatHawaiianText(text: string): string {
  return addOkina(text)
}

// Cultural level utilities
export function getCulturalLevelColor(level: string): string {
  const colors: Record<string, string> = {
    'Beginner': 'text-coral-600 bg-coral-100',
    'Familiar': 'text-ocean-600 bg-ocean-100',
    'Practiced': 'text-forest-600 bg-forest-100',
    'Advanced': 'text-sky-600 bg-sky-100',
    'Kumu': 'text-purple-600 bg-purple-100',
    'Kapuna': 'text-amber-600 bg-amber-100'
  }
  return colors[level] || 'text-gray-600 bg-gray-100'
}

// Time formatting
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }

  return date.toLocaleDateString()
}

// Audio utilities
export function formatAudioDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// URL utilities
export function createAudioUrl(filename: string, folder: string = 'audio'): string {
  return `/api/media/${folder}/${filename}`
}

export function createImageUrl(filename: string, folder: string = 'images'): string {
  return `/api/media/${folder}/${filename}`
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidHawaiianWord(word: string): boolean {
  // Hawaiian words contain only: a, e, i, o, u, h, k, l, m, n, p, w, ʻ (okina)
  const hawaiianRegex = /^[aeiouḡhklmnpwʻ\s]+$/i
  return hawaiianRegex.test(word)
}

// Content filtering utilities
export function sanitizeContent(content: string): string {
  // Basic content sanitization - in production use a proper library like DOMPurify
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim()
}

// Cultural content utilities
export function getCulturalTopicIcon(topic: string): string {
  const icons: Record<string, string> = {
    'language': '🗣️',
    'history': '📚',
    'traditions': '🌺',
    'arts': '🎨',
    'music': '🎵',
    'navigation': '⭐',
    'agriculture': '🌱',
    'spirituality': '🙏',
    'contemporary': '🌊',
    'place': '🏝️',
    'story': '📖',
    'song': '🎶',
    'dance': '💃',
    'craft': '🎭'
  }
  return icons[topic.toLowerCase()] || '📝'
}

// Search utilities
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark class="bg-coral-200 text-coral-800 rounded px-1">$1</mark>')
}

// Local storage utilities
export function setLocalStorage(key: string, value: unknown): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  }
  return defaultValue
}