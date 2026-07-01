/**
 * ══════════════════════════════════════════════════════════════
 *  SQL Setup Reference for Admin Dashboard
 *  Updated to match ACTUAL Supabase schema (Feb 2026)
 * ══════════════════════════════════════════════════════════════
 *
 *  The tables below have already been created.
 *  This file documents the actual schema for reference.
 *
 * ══════════════════════════════════════════════════════════════
 */

// ─── Actual Table Schemas (READ ONLY REFERENCE) ───
export const ACTUAL_SCHEMA_REFERENCE = `
-- ═══ roles ═══  (id is INTEGER / serial, NOT uuid)
-- CREATE TABLE public.roles (
--   id integer NOT NULL DEFAULT nextval('roles_id_seq'),
--   key text NOT NULL UNIQUE,
--   PRIMARY KEY (id)
-- );
-- NOTE: No 'name' column exists. Only 'key'.

-- ═══ user_roles ═══  (role_id is INTEGER to match roles.id)
-- CREATE TABLE public.user_roles (
--   user_id uuid NOT NULL REFERENCES auth.users(id),
--   role_id integer NOT NULL REFERENCES public.roles(id),
--   PRIMARY KEY (user_id, role_id)
-- );
-- NOTE: No 'created_at' column.

-- ═══ profiles ═══  (has BOTH 'id' and 'user_id' as uuid refs to auth.users)
-- CREATE TABLE public.profiles (
--   id uuid NOT NULL REFERENCES auth.users(id),       -- PK
--   user_id uuid NOT NULL REFERENCES auth.users(id),  -- also references auth.users
--   role text NOT NULL,
--   account_type text NOT NULL DEFAULT 'user',
--   emirates_id_verified boolean NOT NULL DEFAULT false,
--   gender text,
--   birth_year integer,
--   primary_emirate text,
--   primary_city text,
--   provider_license_status text NOT NULL DEFAULT 'unlicensed',
--   provider_type text,
--   license_status text DEFAULT 'pending',
--   license_number text,
--   license_authority text,
--   license_expiry date,
--   is_verified boolean DEFAULT false,
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz NOT NULL DEFAULT now()
-- );
-- NOTE: NO display_name, NO phone, NO avatar_url columns.
--       Use auth.users.user_metadata for name/avatar.

-- ═══ wallets ═══
-- CREATE TABLE public.wallets (
--   user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
--   balance_coins integer NOT NULL DEFAULT 0,
--   updated_at timestamptz DEFAULT now()
-- );
-- NOTE: No 'currency' or 'created_at' columns. balance_coins is integer, not bigint.

-- ═══ wallet_ledger ═══
-- CREATE TABLE public.wallet_ledger (
--   id uuid NOT NULL DEFAULT gen_random_uuid(),
--   user_id uuid REFERENCES auth.users(id),  -- nullable!
--   direction text CHECK (direction IN ('credit','debit')),
--   coins integer NOT NULL,
--   reason text,  -- nullable!
--   created_at timestamptz DEFAULT now()
-- );
-- NOTE: NO ref_type, NO ref_id columns.

-- ═══ activity_log ═══
-- CREATE TABLE public.activity_log (
--   id uuid NOT NULL DEFAULT gen_random_uuid(),
--   actor_user_id uuid REFERENCES auth.users(id),
--   action text NOT NULL,
--   meta jsonb DEFAULT '{}',
--   created_at timestamptz DEFAULT now()
-- );
-- NOTE: NO entity_type, NO entity_id, NO ip, NO user_agent columns.
--       Store entity_type/entity_id inside 'meta' jsonb instead.

-- ═══ admin_invites ═══
-- CREATE TABLE public.admin_invites (
--   code uuid NOT NULL DEFAULT gen_random_uuid(),
--   created_by uuid REFERENCES auth.users(id),
--   used_by uuid REFERENCES auth.users(id),
--   used boolean NOT NULL DEFAULT false,
--   used_at timestamptz,
--   expires_at timestamptz NOT NULL DEFAULT (now() + '24:00:00'),
--   created_at timestamptz NOT NULL DEFAULT now()
-- );

-- ═══ services ═══
-- CREATE TABLE public.services (
--   id uuid NOT NULL DEFAULT uuid_generate_v4(),
--   name text NOT NULL,
--   category text NOT NULL,
--   is_active boolean DEFAULT true,
--   created_at timestamptz DEFAULT now(),
--   parent_id uuid REFERENCES public.services(id),
--   name_ar text,
--   name_en text,
--   sort_order integer NOT NULL DEFAULT 0
-- );

-- ═══ provider_services ═══
-- CREATE TABLE public.provider_services (
--   provider_id uuid NOT NULL REFERENCES public.profiles(id),
--   main_service_id uuid NOT NULL REFERENCES public.services(id),
--   sub_service_id uuid REFERENCES public.services(id),
--   created_at timestamptz NOT NULL DEFAULT now()
-- );

-- ═══ user_files ═══
-- CREATE TABLE public.user_files (
--   id uuid NOT NULL DEFAULT gen_random_uuid(),
--   user_id uuid NOT NULL REFERENCES auth.users(id),
--   bucket text NOT NULL DEFAULT 'user_uploads',
--   path text NOT NULL,
--   file_name text,
--   file_type text,
--   file_size bigint,
--   is_avatar boolean NOT NULL DEFAULT false,
--   created_at timestamptz NOT NULL DEFAULT now()
-- );

-- ═══ user_media ═══
-- CREATE TABLE public.user_media (
--   id uuid NOT NULL DEFAULT gen_random_uuid(),
--   user_id uuid NOT NULL REFERENCES auth.users(id),
--   kind text NOT NULL CHECK (kind IN ('avatar','project','product','other')),
--   storage_bucket text NOT NULL DEFAULT 'public',
--   storage_path text NOT NULL,
--   mime_type text,
--   size_bytes bigint,
--   meta jsonb NOT NULL DEFAULT '{}',
--   created_at timestamptz NOT NULL DEFAULT now()
-- );
`;

// ─── If you need to populate roles (run in SQL Editor) ───
export const SEED_ROLES_SQL = `
-- Insert roles if they don't exist
INSERT INTO public.roles (key) 
VALUES ('admin'), ('user')
ON CONFLICT (key) DO NOTHING;
`;

// ─── Set a user as admin (run in SQL Editor) ───
export const SET_ADMIN_SQL = (userId: string) => `
-- Set user as admin
INSERT INTO public.user_roles (user_id, role_id)
SELECT '${userId}'::uuid, r.id
FROM public.roles r
WHERE r.key = 'admin'
ON CONFLICT DO NOTHING;

-- Verify
SELECT ur.user_id, r.key as role_key
FROM public.user_roles ur
JOIN public.roles r ON r.id = ur.role_id
WHERE ur.user_id = '${userId}';
`;

// ─── RLS Policies + is_admin() function ───
export const RLS_POLICIES_SQL = `
-- is_admin() helper (matches integer role_id)
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = uid AND r.key = 'admin'
  );
$$ LANGUAGE sql STABLE;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY IF NOT EXISTS "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "profiles_select_admin" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY IF NOT EXISTS "wallet_select_own" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "wallet_select_admin" ON public.wallets FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY IF NOT EXISTS "ledger_select_own" ON public.wallet_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "ledger_select_admin" ON public.wallet_ledger FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY IF NOT EXISTS "activity_select_admin" ON public.activity_log FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY IF NOT EXISTS "activity_select_own" ON public.activity_log FOR SELECT USING (auth.uid() = actor_user_id);
CREATE POLICY IF NOT EXISTS "invites_admin_all" ON public.admin_invites FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY IF NOT EXISTS "user_roles_select_admin" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY IF NOT EXISTS "roles_select_all" ON public.roles FOR SELECT USING (true);
`;
