# EA Ecoversity - Hawaiian Cultural Learning Platform

> *ʻOno ka ʻike i ka hoʻonaʻauao* - Knowledge is delicious through education

A culturally-centered web application for teaching ʻŌlelo Hawaiʻi (Hawaiian language) and Hawaiian knowledge systems through immersive storytelling, place-based learning, and community connection.

## 🌺 Cultural Philosophy

This platform honors Hawaiian cultural values and learning traditions:

- **Moʻolelo-Driven**: Story-based learning paths that connect language with cultural wisdom
- **ʻĀina-Connected**: Place-based knowledge tied to Hawaiian locations and environments
- **ʻOhana-Centered**: Community learning rather than individual progress tracking
- **Kūpuna-Guided**: Elder wisdom and cultural practitioner oversight
- **Culturally Respectful**: Proper protocols for sacred and sensitive content

## 🎯 Features

### Cultural Learning System
- **Interactive Moʻolelo**: Cultural stories with embedded language lessons
- **3D Hawaiian Environments**: Immersive island experiences using React Three Fiber
- **Audio Pronunciation**: Native speaker recordings and practice tools
- **Cultural Levels**: Progressive access from Beginner to Kāpuna
- **Permission System**: Role-based access respecting cultural protocols

### Modern Learning Tools
- **Responsive Design**: Mobile-first Hawaiian-inspired UI
- **Real-time Audio**: Recording and playback for pronunciation practice
- **Progress Tracking**: Community-centered learning milestones
- **Admin Dashboard**: Content approval and kumu verification workflows

### Cultural Protection
- **Sacred Content Protocols**: Special handling for spiritually significant material
- **Elder Review System**: Cultural practitioner approval for sensitive content
- **Database Security**: Row Level Security (RLS) protecting cultural knowledge
- **Community Guidelines**: Respectful sharing and access controls

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript and App Router
- **Database**: Supabase with Row Level Security
- **Authentication**: Supabase Auth with cultural profile system
- **Styling**: Tailwind CSS with Hawaiian-inspired design tokens
- **3D Graphics**: React Three Fiber (@react-three/fiber, @react-three/drei)
- **Audio**: Web Audio API with custom recording components
- **Deployment**: Vercel (recommended) or any Node.js hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/yourusername/ea_ecoversity.git
   cd ea_ecoversity
   npm install
   ```

2. **Set up Supabase**
   - Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
   - Copy your project URL and anon key
   - Run the database migration: `supabase/migrations/001_initial_schema.sql`

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # Check TypeScript types
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── 3d/             # React Three Fiber components
│   ├── admin/          # Admin dashboard components
│   ├── audio/          # Audio recording/playback
│   ├── auth/           # Authentication system
│   ├── cultural/       # Cultural content components
│   └── ui/             # Base UI components
├── hooks/              # React hooks for cultural permissions
├── lib/                # Utilities and Supabase client
├── types/              # TypeScript definitions
└── supabase/           # Database migrations and schema
```

## 🎨 Design System

The platform uses a Hawaiian-inspired color palette:

```css
ocean: #1890ff    /* Pacific blue */
coral: #ff4d1a    /* Living coral */
forest: #38a138   /* Hawaiian forest green */
sand: #f1b896     /* Beach sand */
sky: #0ea5e9      /* Tropical sky */
lava: #f05252     /* Volcanic red */
```

## 🔐 Cultural Security

This platform handles sacred Hawaiian knowledge with special care:

- **Permission System**: Database-enforced cultural access levels
- **Sacred Content**: Special protocols for spiritually significant material
- **Elder Review**: Cultural practitioner approval workflows
- **Data Protection**: No sensitive cultural content in public repositories

See [SECURITY.md](SECURITY.md) for detailed security policies.

## 👥 User Roles & Permissions

### Cultural Levels
- **Beginner**: Basic Hawaiian words and phrases
- **Familiar**: Simple conversations and cultural basics
- **Practiced**: Intermediate language and cultural knowledge
- **Advanced**: Complex language and deeper cultural understanding
- **Kumu**: Qualified teachers and cultural practitioners
- **Kāpuna**: Elders with access to sacred knowledge

### Roles
- **Student**: General learners
- **Teacher**: Educators with content creation rights
- **Cultural Practitioner**: Verified kumu with review authority
- **Elder**: Community elders with highest access
- **Administrator**: Platform administrators

## 🤝 Contributing

We welcome culturally respectful contributions from the Hawaiian community and allies.

### Guidelines
- Follow Hawaiian cultural protocols and sensitivity
- Use proper diacritical marks in Hawaiian language text
- Test with multiple user roles and cultural levels
- Consult cultural practitioners for sensitive content
- Follow our code of conduct and security policies

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make changes with cultural sensitivity
4. Test thoroughly with different permission levels
5. Submit pull request with cultural context

## 📞 Community & Support

- **Cultural Guidance**: Consult with platform kumu and elders
- **Technical Support**: GitHub Issues for bugs and feature requests
- **Cultural Security**: See [SECURITY.md](SECURITY.md) for reporting guidelines
- **General Questions**: Community discussions and forums

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Hawaiian cultural practitioners and elders who guide this work
- EA Ecoversity for inspiring culturally-centered education
- The Hawaiian language preservation community
- Open source contributors and supporters

---

*E ola ka ʻōlelo Hawaiʻi* - Let the Hawaiian language live

Built with aloha for the Hawaiian community and all who wish to learn respectfully.