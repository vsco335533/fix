/*
  # Research & Media Publishing Platform - Complete Database Schema

  ## Overview
  This migration sets up the complete database structure for a research and media publishing platform
  with role-based access control, content management, and media handling capabilities.

  ## Tables Created

  ### 1. profiles
  - Extends Supabase auth.users with additional profile information
  - Fields: id (links to auth.users), full_name, role, bio, avatar_url, created_at, updated_at
  - Roles: 'super_admin', 'researcher'

  ### 2. categories
  - Content categorization system
  - Fields: id, name, slug, description, created_at

  ### 3. tags
  - Tagging system for content
  - Fields: id, name, slug, created_at

  ### 4. posts
  - Main content table for research, field studies, and opinions
  - Fields: id, title, slug, content, excerpt, type, status, author_id, category_id, 
    featured_image_url, document_url, view_count, published_at, created_at, updated_at
  - Types: 'research', 'field_study', 'opinion'
  - Status: 'draft', 'submitted', 'under_review', 'published', 'rejected'

  ### 5. post_tags
  - Many-to-many relationship between posts and tags
  - Fields: post_id, tag_id, created_at

  ### 6. media
  - Media library for videos, images, and galleries
  - Fields: id, title, description, type, url, thumbnail_url, file_size, duration, 
    uploaded_by, post_id, created_at
  - Types: 'video', 'image', 'document'

  ### 7. moderation_log
  - Tracks content moderation actions and feedback
  - Fields: id, post_id, moderator_id, action, feedback, created_at
  - Actions: 'submitted', 'approved', 'rejected', 'revision_requested'

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies for authenticated users based on roles
  - Public read access for published content
  - Restricted write access based on user roles

  ## Indexes
  - Optimized indexes for common queries (slug lookups, author searches, status filters)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'researcher');
CREATE TYPE post_type AS ENUM ('research', 'field_study', 'opinion');
CREATE TYPE post_status AS ENUM ('draft', 'submitted', 'under_review', 'published', 'rejected');
CREATE TYPE media_type AS ENUM ('video', 'image', 'document');
CREATE TYPE moderation_action AS ENUM ('submitted', 'approved', 'rejected', 'revision_requested');

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'researcher',
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- TAGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- POSTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  type post_type NOT NULL,
  status post_status NOT NULL DEFAULT 'draft',
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  featured_image_url text,
  document_url text,
  view_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- POST_TAGS TABLE (Many-to-Many)
-- =============================================
CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

-- =============================================
-- MEDIA TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type media_type NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  file_size bigint,
  duration integer,
  uploaded_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- MODERATION_LOG TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS moderation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  moderator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action moderation_action NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_media_post ON media(post_id);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_moderation_post ON moderation_log(post_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Profiles Table Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Categories Table Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only super admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Tags Table Policies
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only super admins can update tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can delete tags"
  ON tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Posts Table Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  TO authenticated, anon
  USING (status = 'published' OR auth.uid() = author_id OR 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Researchers can create their own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Authors and admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Post_Tags Table Policies
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post tags are viewable by everyone"
  ON post_tags FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Post authors can manage their post tags"
  ON post_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_tags.post_id AND posts.author_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_tags.post_id AND posts.author_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Media Table Policies
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published media is viewable by everyone"
  ON media FOR SELECT
  TO authenticated, anon
  USING (
    post_id IS NULL OR
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = media.post_id AND posts.status = 'published'
    ) OR
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Authenticated users can upload media"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Uploaders can update their media"
  ON media FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Uploaders can delete their media"
  ON media FOR DELETE
  TO authenticated
  USING (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Moderation_Log Table Policies
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Moderation logs viewable by post authors and admins"
  ON moderation_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = moderation_log.post_id AND posts.author_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Only admins can create moderation logs"
  ON moderation_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for posts
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'researcher')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Climate Research', 'climate-research', 'Research articles on climate change and environmental science'),
  ('Field Studies', 'field-studies', 'On-ground research and field observations'),
  ('Policy Analysis', 'policy-analysis', 'Analysis of policies and their impacts'),
  ('Technology & Innovation', 'technology-innovation', 'Research on technological advancements'),
  ('Social Science', 'social-science', 'Social and behavioral research')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug) VALUES
  ('Environment', 'environment'),
  ('Data Science', 'data-science'),
  ('Public Health', 'public-health'),
  ('Agriculture', 'agriculture'),
  ('Education', 'education'),
  ('Economics', 'economics'),
  ('Wildlife', 'wildlife'),
  ('Sustainability', 'sustainability')
ON CONFLICT (slug) DO NOTHING;