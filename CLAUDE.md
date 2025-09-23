# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a web application for creating a submersive sandbox educational environment to teach ʻŌlelo Hawaiʻi (Hawaiian language) and Hawaiian knowledge systems. The platform emphasizes cultural storytelling (moʻolelo), place-based learning (ʻāina), and community-centered education (ʻohana).

## Tech Stack
- **Framework**: Next.js 15 with TypeScript and App Router
- **Styling**: Tailwind CSS with Hawaiian-inspired design tokens
- **3D Graphics**: React Three Fiber (@react-three/fiber, @react-three/drei)
- **Audio**: Web Audio API with custom recording/playback components
- **Cultural Protocol**: Custom permission system for sacred content

## Development Commands

### Getting Started
```bash
npm install           # Install dependencies
npm run dev          # Start development server (http://localhost:3001)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # Run TypeScript checks
```

### Supabase Setup
1. Create a Supabase project at https://supabase.com/dashboard
2. Copy your project URL and anon key
3. Update `.env.local` with your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Run the migration: `supabase/migrations/001_initial_schema.sql`

### Development Workflow
```bash
npm run dev          # Primary development command
```

## Architecture Overview

### Cultural-First Design Philosophy
- **Moʻolelo-Driven**: Story-based learning paths instead of traditional course modules
- **ʻĀina-Connected**: Place-based cultural knowledge tied to Hawaiian locations
- **ʻOhana-Centered**: Community learning vs individual progress tracking
- **Kūpuna-Guided**: Elder wisdom and cultural practitioner oversight

### Key Directories
```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── 3d/             # React Three Fiber components (Scene, Island)
│   ├── admin/          # Admin components (KumuVerification, ContentApproval)
│   ├── audio/          # Audio recording/playback (AudioRecorder, AudioPlayer)
│   ├── auth/           # Authentication (AuthProvider, AuthModal, UserProfile)
│   ├── cultural/       # Cultural content components (CulturalCard, MookeloViewer)
│   └── ui/             # Base UI components (Button)
├── hooks/              # React hooks (useCulturalPermissions, useCulturalRole)
├── lib/                # Utilities, Supabase client, and cultural protocols
├── types/              # TypeScript type definitions (cultural.ts, database.ts)
└── supabase/           # Database migrations and schema
```

### Cultural Content System
- **Moʻolelo**: Stories that connect language learning with cultural wisdom
- **Cultural Levels**: Beginner → Familiar → Practiced → Advanced → Kumu → Kāpuna
- **Permission System**: Role-based access to sacred and sensitive content
- **Audio Integration**: Pronunciation practice and elder storytelling

### 3D Environment
- **Scene Component**: Main 3D canvas with Hawaiian-themed lighting
- **Island Component**: Interactive 3D island with cultural elements
- **Cultural Spaces**: Virtual representations of ahupuaʻa and sacred places

### Hawaiian Language Features
- **Diacritical Support**: Proper ʻokina (ʻ) and kahakō handling
- **Bilingual Content**: English/Hawaiian language switching
- **Pronunciation Tools**: Audio recording with native speaker comparison
- **Cultural Context**: Language learning tied to cultural practices

### Authentication & User Management
- **Supabase Auth**: Email/password authentication with social providers support
- **Cultural Profiles**: Users have Hawaiian names, cultural levels, and roles
- **Permission System**: Database-driven access control for cultural content
- **Role Hierarchy**: Student → Teacher → Cultural Practitioner → Elder → Administrator

### Cultural Protocol System
- **Access Control**: Level and role-based content permissions via database
- **Sacred Content**: Special handling for spiritually significant material
- **Kumu Approval**: Cultural practitioner review workflow with admin interface
- **Content Review**: Multi-step approval process for cultural accuracy
- **Respectful Sharing**: Guidelines for cultural content distribution

### Admin Features
- **Kumu Verification**: Review and approve cultural practitioner requests
- **Content Approval**: Review moʻolelo and cultural content before publication
- **Permission Management**: Set access controls for sacred and sensitive content
- **Community Oversight**: Elder and administrator review workflows

## Color Palette (Hawaiian-Inspired)
```css
ocean: #1890ff    (Pacific blue)
coral: #ff4d1a    (Living coral)
forest: #38a138   (Hawaiian forest green)
sand: #f1b896     (Hawaiian beach sand)
sky: #0ea5e9      (Tropical sky)
lava: #f05252     (Volcanic red)
```

## Development Guidelines

### Cultural Sensitivity
- All Hawaiian language text should use proper diacritical marks
- Consult cultural practitioners for content involving sacred knowledge
- Implement cultural protocol permissions before adding sensitive content
- Test pronunciation features with native speakers

### Component Patterns
- Use cultural naming conventions (moʻolelo, kumu, haumāna)
- Implement permission checks in cultural content components
- Include audio features where appropriate for language learning
- Follow Hawaiian design aesthetics (natural colors, organic shapes)

### 3D Development
- Use React Three Fiber for all 3D content
- Implement proper lighting for Hawaiian environments
- Optimize for mobile devices (many Hawaiian communities are mobile-first)
- Include accessibility features for 3D navigation

### Audio Implementation
- Support WAV format for high-quality pronunciation examples
- Implement playback speed controls for language learning
- Include visual feedback for recording states
- Handle microphone permissions gracefully

## Content Structure
- **Moʻolelo** (Stories): Primary learning content with cultural context
- **ʻŌlelo** (Words): Vocabulary with pronunciation and cultural usage
- **ʻĀina** (Places): Location-based knowledge and cultural significance
- **Hālau** (Learning Groups): Community-based learning environments

## Performance Considerations
- Optimize 3D scenes for mobile devices
- Lazy load audio content
- Implement progressive image loading
- Cache cultural content appropriately

## Accessibility
- Screen reader support for Hawaiian language content
- Keyboard navigation for 3D environments
- Visual indicators for audio content
- Respectful handling of cultural sensitivities