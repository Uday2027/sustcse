-- Add notification preferences to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"notices": true, "events": true, "achievements": true}'::jsonb;
