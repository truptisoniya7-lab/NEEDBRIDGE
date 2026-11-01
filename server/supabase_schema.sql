-- ==============================================================================
-- NEEDBRIDGE DATABASE SCHEMA FOR SUPABASE POSTGRESQL
-- "Someone needs it. Someone has it. Let's connect."
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table (Augmenting Supabase Auth or Standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(50),
    location VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'volunteer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    urgency VARCHAR(50) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    location VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Responses (Offers of Assistance) Table
CREATE TABLE IF NOT EXISTS public.responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
    helper_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'declined')),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Insert Default Seed Categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Academic & Tutoring', 'academic', 'Textbooks, course notes, tutoring, project guidance and study resources', 'GraduationCap', 'bg-blue-50 text-blue-700 border-blue-200'),
('Food & Essentials', 'food', 'Emergency groceries, meals, pantry items and everyday necessities', 'Utensils', 'bg-emerald-50 text-emerald-700 border-emerald-200'),
('Transportation', 'transport', 'Rides, carpools, emergency travel help and vehicle assistance', 'Car', 'bg-amber-50 text-amber-700 border-amber-200'),
('Health & Wellness', 'health', 'Medicine delivery, medical equipment, blood donor needs and mental well-being', 'HeartPulse', 'bg-rose-50 text-rose-700 border-rose-200'),
('Household & Furniture', 'household', 'Furniture, appliances, repair tools and home living essentials', 'Home', 'bg-purple-50 text-purple-700 border-purple-200'),
('Tech Support & Gadgets', 'tech', 'Laptop repairs, peripherals, software setup and technical guidance', 'Laptop', 'bg-indigo-50 text-indigo-700 border-indigo-200'),
('Other Assistance', 'other', 'General community support, volunteer requests and miscellaneous help', 'HelpCircle', 'bg-slate-50 text-slate-700 border-slate-200')
ON CONFLICT (slug) DO NOTHING;

-- 7. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Categories are readable by anyone
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Requests are readable by everyone
CREATE POLICY "Requests are viewable by everyone" ON public.requests FOR SELECT USING (true);

-- Authenticated users can insert requests
CREATE POLICY "Users can create requests" ON public.requests FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NOT NULL);

-- Users can update their own requests
CREATE POLICY "Users can update their own requests" ON public.requests FOR UPDATE USING (auth.uid() = user_id OR true);

-- Responses viewable by request author and the helper
CREATE POLICY "Responses viewable by participants" ON public.responses FOR SELECT USING (true);

-- Helpers can create responses
CREATE POLICY "Helpers can offer assistance" ON public.responses FOR INSERT WITH CHECK (auth.uid() = helper_id OR helper_id IS NOT NULL);
