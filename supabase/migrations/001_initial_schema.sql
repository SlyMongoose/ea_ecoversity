-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE cultural_level AS ENUM ('Beginner', 'Familiar', 'Practiced', 'Advanced', 'Kumu', 'Kapuna');
CREATE TYPE cultural_role AS ENUM ('Student', 'Teacher', 'CulturalPractitioner', 'Elder', 'ContentReviewer', 'Administrator');
CREATE TYPE content_status AS ENUM ('Draft', 'UnderReview', 'Approved', 'Published', 'Archived');
CREATE TYPE hawaiian_island AS ENUM ('Hawaii', 'Maui', 'Oahu', 'Kauai', 'Molokai', 'Lanai', 'Niihau', 'Kahoolawe');
CREATE TYPE learning_focus AS ENUM ('Language', 'History', 'Traditions', 'Arts', 'Music', 'Navigation', 'Agriculture', 'Spirituality', 'Contemporary');
CREATE TYPE part_of_speech AS ENUM ('Noun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Phrase');
CREATE TYPE difficulty_level AS ENUM ('Basic', 'Intermediate', 'Advanced', 'Expert');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    hawaiian_name TEXT,
    cultural_level cultural_level DEFAULT 'Beginner',
    cultural_role cultural_role DEFAULT 'Student',
    avatar_url TEXT,
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    credentials TEXT[] DEFAULT '{}',
    is_kumu_verified BOOLEAN DEFAULT FALSE,
    is_elder BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table for aina-based learning
CREATE TABLE locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    name_hawaiian TEXT NOT NULL,
    island hawaiian_island NOT NULL,
    ahupuaa TEXT,
    coordinates JSONB, -- {lat: number, lng: number}
    description TEXT NOT NULL,
    cultural_significance TEXT NOT NULL,
    is_sacred BOOLEAN DEFAULT FALSE,
    access_restrictions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moolelo (stories) table
CREATE TABLE moolelo (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    title_hawaiian TEXT,
    description TEXT NOT NULL,
    description_hawaiian TEXT,
    content TEXT NOT NULL,
    content_hawaiian TEXT,
    audio_url TEXT,
    video_url TEXT,
    image_url TEXT,
    location_id UUID REFERENCES locations(id),
    cultural_level cultural_level DEFAULT 'Beginner',
    tags TEXT[] DEFAULT '{}',
    kumu_id UUID REFERENCES user_profiles(id),
    status content_status DEFAULT 'Draft',
    is_sacred BOOLEAN DEFAULT FALSE,
    requires_approval BOOLEAN DEFAULT TRUE,
    approved_by UUID REFERENCES user_profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0
);

-- Halau (learning groups) table
CREATE TABLE halau (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    focus learning_focus[] DEFAULT '{}',
    kumu_id UUID REFERENCES user_profiles(id) NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    invite_code TEXT UNIQUE,
    max_members INTEGER,
    cultural_level_required cultural_level DEFAULT 'Beginner',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Halau members table
CREATE TABLE halau_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    halau_id UUID REFERENCES halau(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'assistant_kumu', 'kumu')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    completed_activities TEXT[] DEFAULT '{}',
    progress_notes TEXT,
    UNIQUE(halau_id, user_id)
);

-- Audio recordings table for pronunciation practice
CREATE TABLE audio_recordings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) NOT NULL,
    moolelo_id UUID REFERENCES moolelo(id),
    word_id UUID, -- References olelo_words when created
    file_url TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    transcription TEXT,
    accuracy_score DECIMAL(3,2), -- 0.00 to 1.00
    feedback TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Olelo words dictionary table
CREATE TABLE olelo_words (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    word TEXT NOT NULL UNIQUE,
    pronunciation TEXT NOT NULL,
    audio_url TEXT,
    definition TEXT NOT NULL,
    definition_hawaiian TEXT,
    part_of_speech part_of_speech NOT NULL,
    usage_examples TEXT[] DEFAULT '{}',
    related_words TEXT[] DEFAULT '{}',
    cultural_context TEXT,
    difficulty_level difficulty_level DEFAULT 'Basic',
    added_by UUID REFERENCES user_profiles(id) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cultural permissions table for fine-grained access control
CREATE TABLE cultural_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('moolelo', 'location', 'word', 'audio')),
    required_level cultural_level DEFAULT 'Beginner',
    required_role cultural_role,
    is_sacred BOOLEAN DEFAULT FALSE,
    requires_kumu_approval BOOLEAN DEFAULT FALSE,
    geographic_restriction TEXT, -- e.g., specific island
    seasonal_restriction TEXT, -- e.g., specific cultural seasons
    access_notes TEXT,
    created_by UUID REFERENCES user_profiles(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id, content_type)
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_cultural_level ON user_profiles(cultural_level);
CREATE INDEX idx_user_profiles_cultural_role ON user_profiles(cultural_role);
CREATE INDEX idx_moolelo_status ON moolelo(status);
CREATE INDEX idx_moolelo_cultural_level ON moolelo(cultural_level);
CREATE INDEX idx_moolelo_location ON moolelo(location_id);
CREATE INDEX idx_moolelo_kumu ON moolelo(kumu_id);
CREATE INDEX idx_moolelo_tags ON moolelo USING GIN(tags);
CREATE INDEX idx_locations_island ON locations(island);
CREATE INDEX idx_halau_kumu ON halau(kumu_id);
CREATE INDEX idx_halau_members_user ON halau_members(user_id);
CREATE INDEX idx_halau_members_halau ON halau_members(halau_id);
CREATE INDEX idx_audio_recordings_user ON audio_recordings(user_id);
CREATE INDEX idx_olelo_words_word ON olelo_words(word);
CREATE INDEX idx_cultural_permissions_content ON cultural_permissions(content_id, content_type);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE moolelo ENABLE ROW LEVEL SECURITY;
ALTER TABLE halau ENABLE ROW LEVEL SECURITY;
ALTER TABLE halau_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE olelo_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_permissions ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Locations policies
CREATE POLICY "Anyone can view non-sacred locations" ON locations FOR SELECT USING (NOT is_sacred);
CREATE POLICY "Kumu and elders can view sacred locations" ON locations FOR SELECT USING (
    is_sacred AND EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND (cultural_role IN ('CulturalPractitioner', 'Elder', 'Administrator') OR cultural_level IN ('Kumu', 'Kapuna'))
    )
);

-- Moolelo policies
CREATE POLICY "Anyone can view published non-sacred moolelo" ON moolelo FOR SELECT USING (
    status = 'Published' AND NOT is_sacred
);
CREATE POLICY "Cultural practitioners can view sacred moolelo" ON moolelo FOR SELECT USING (
    status = 'Published' AND is_sacred AND EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND (cultural_role IN ('CulturalPractitioner', 'Elder', 'Administrator') OR cultural_level IN ('Kumu', 'Kapuna'))
    )
);
CREATE POLICY "Users can view own drafts" ON moolelo FOR SELECT USING (
    kumu_id = auth.uid()
);
CREATE POLICY "Kumu can create moolelo" ON moolelo FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND (cultural_role IN ('CulturalPractitioner', 'Teacher', 'Elder', 'Administrator') OR cultural_level IN ('Advanced', 'Kumu', 'Kapuna'))
    )
);
CREATE POLICY "Users can update own moolelo" ON moolelo FOR UPDATE USING (kumu_id = auth.uid());

-- Functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_moolelo_updated_at BEFORE UPDATE ON moolelo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_halau_updated_at BEFORE UPDATE ON halau FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_olelo_words_updated_at BEFORE UPDATE ON olelo_words FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cultural_permissions_updated_at BEFORE UPDATE ON cultural_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();