'use client'

import { useState } from 'react'
import Scene from '@/components/3d/Scene'
import Island from '@/components/3d/Island'
import AuthModal from '@/components/auth/AuthModal'
import UserProfile from '@/components/auth/UserProfile'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showProfile, setShowProfile] = useState(false)
  const { user, profile, loading } = useAuth()

  const handleAuthAction = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-ocean-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500 mx-auto mb-4"></div>
          <p className="text-forest-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-ocean-100">
      {/* Navigation */}
      <nav className="relative z-20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-forest-800">
            Ea Ecoversity
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-forest-700">
                  Aloha, {profile?.hawaiian_name || profile?.name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAuthAction('signin')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAuthAction('signup')}
                >
                  Join ʻOhana
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* User Profile Modal */}
      {showProfile && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
              >
                ✕
              </button>
              <UserProfile />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 ocean-gradient opacity-90"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 text-shadow-cultural">
            Ea Ecoversity
          </h1>
          <h2 className="text-2xl md:text-3xl text-sand-100 mb-4 font-medium">
            ʻOno ka ʻike i ka hoʻonaʻauao
          </h2>
          <p className="text-lg md:text-xl text-sand-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            A submersive sandbox educational environment for learning ʻŌlelo Hawaiʻi and Hawaiian knowledge systems
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Button
                  variant="coral"
                  size="lg"
                  onClick={() => {/* Navigate to learning dashboard */}}
                >
                  Continue Learning
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-ocean-800"
                  onClick={() => {/* Navigate to stories */}}
                >
                  Explore Stories
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="coral"
                  size="lg"
                  onClick={() => handleAuthAction('signup')}
                >
                  Begin Your Journey
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-ocean-800"
                  onClick={() => handleAuthAction('signin')}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 3D Island Scene */}
        <div className="absolute bottom-0 left-0 right-0 h-96 opacity-80">
          <Scene enableControls={false} cameraPosition={[0, 8, 15]} className="h-full w-full">
            <Island scale={0.8} />
          </Scene>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-forest-800 mb-12">
            Hoʻonaʻauao through Moʻomoku
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-cultural transition-shadow duration-300">
              <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🌺</span>
              </div>
              <h4 className="text-xl font-bold text-forest-800 mb-4">Cultural Stories</h4>
              <p className="text-forest-600 leading-relaxed">
                Immerse yourself in traditional moʻolelo that connect language learning with cultural wisdom and ancestral knowledge.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-cultural transition-shadow duration-300">
              <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🗣️</span>
              </div>
              <h4 className="text-xl font-bold text-forest-800 mb-4">Pronunciation Practice</h4>
              <p className="text-forest-600 leading-relaxed">
                Learn proper ʻōlelo pronunciation through interactive audio exercises guided by cultural practitioners.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-cultural transition-shadow duration-300">
              <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🏝️</span>
              </div>
              <h4 className="text-xl font-bold text-forest-800 mb-4">Place-Based Learning</h4>
              <p className="text-forest-600 leading-relaxed">
                Explore Hawaiian knowledge through connection to ʻāina, understanding how language and land are intertwined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 cultural-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-8">
            Join Our Learning ʻOhana
          </h3>
          <p className="text-xl text-sand-100 mb-12 leading-relaxed">
            Connect with fellow learners, cultural practitioners, and kumu in a respectful environment dedicated to perpetuating Hawaiian knowledge.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
            <h4 className="text-2xl font-bold text-white mb-6">Ready to Begin?</h4>
            <p className="text-sand-200 mb-6">
              Start your journey into ʻōlelo Hawaiʻi and cultural understanding today.
            </p>
            {user ? (
              <Button
                variant="secondary"
                size="lg"
                className="w-full bg-white text-ocean-800 hover:bg-sand-50"
                onClick={() => {/* Navigate to dashboard */}}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                className="w-full bg-white text-ocean-800 hover:bg-sand-50"
                onClick={() => handleAuthAction('signup')}
              >
                Create Account
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}
