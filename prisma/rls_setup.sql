
-- ==========================================
-- EchoLingo Row Level Security (RLS) Setup
-- ==========================================
-- This script enables RLS and sets up policies using the 'app.current_user_id' 
-- session variable provided by the Prisma RLS Extension.
-- 
-- IMPORTANT: Run this script as a SUPERUSER or the TABLE OWNER 
-- in your database console (e.g., Supabase SQL Editor, Neon Console).
-- ==========================================

-- 1. Enable RLS on all relevant tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SpeakerProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConversationTurn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;

-- 2. Define Policies

-- USERS: Users can only see/edit their own user record
DROP POLICY IF EXISTS user_isolation_policy ON "User";
CREATE POLICY user_isolation_policy ON "User"
USING (id = current_setting('app.current_user_id', true));

-- CONVERSATIONS: Owners can see/manage their own conversations
DROP POLICY IF EXISTS conversation_isolation_policy ON "Conversation";
CREATE POLICY conversation_isolation_policy ON "Conversation"
USING ("ownerId" = current_setting('app.current_user_id', true));

-- CONVERSATION TURNS: Accessed via their parent conversation
-- This policy checks if the user owns the conversation the turn belongs to.
DROP POLICY IF EXISTS conversation_turn_isolation_policy ON "ConversationTurn";
CREATE POLICY conversation_turn_isolation_policy ON "ConversationTurn"
USING (
  EXISTS (
    SELECT 1 FROM "Conversation" c 
    WHERE c.id = "conversationId" 
    AND c."ownerId" = current_setting('app.current_user_id', true)
  )
);

-- SPEAKER PROFILES: Users can only see/manage their own profiles
DROP POLICY IF EXISTS speaker_profile_isolation_policy ON "SpeakerProfile";
CREATE POLICY speaker_profile_isolation_policy ON "SpeakerProfile"
USING ("userId" = current_setting('app.current_user_id', true));

-- ACCOUNTS: Users can only see their own linked accounts
DROP POLICY IF EXISTS account_isolation_policy ON "Account";
CREATE POLICY account_isolation_policy ON "Account"
USING ("userId" = current_setting('app.current_user_id', true));

-- SESSIONS: Users can only see their own sessions
DROP POLICY IF EXISTS session_isolation_policy ON "Session";
CREATE POLICY session_isolation_policy ON "Session"
USING ("userId" = current_setting('app.current_user_id', true));

-- 3. Permissions for Application User
-- Ensure the 'prisma_application' user has permissions to see these tables 
-- but is still bound by RLS (only Superusers/Owners bypass RLS).
-- (Skipped GRANT because current user is a restricted superuser)
