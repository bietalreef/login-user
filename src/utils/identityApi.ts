/**
 * identityApi.ts — Identity Separation API Layer
 * ═══════════════════════════════════════════════
 * Marketplace Profile + Workspace Identity + Presence
 * All calls use dual-header pattern: publicAnonKey + X-User-Token
 */

import { projectId, publicAnonKey } from './supabase/info';
import { supabase } from './supabase/client';

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

// ─── Auth Headers ───
async function headers(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    'X-User-Token': token,
  };
}

// ─── Types ───

export interface MarketplaceProfile {
  user_id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  role: 'client' | 'provider' | 'admin';
  is_verified: boolean;
  city: string;
  region: string;
  provider_type: string | null;
  business_name: string;
  specialties: string[];
  public_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceProfileResponse {
  profile: MarketplaceProfile;
  counts: { followers: number; following: number };
  relationship: { type: string; status: string } | null;
  is_self: boolean;
}

export interface WorkspaceIdentity {
  id: string;
  workspace_id: string;
  user_id: string | null;
  role: string;
  full_name: string;
  job_title: string;
  workspace_display_name: string;
  workspace_avatar_url: string;
  last_active_at: string | null;
  status: string;
  joined_at: string | null;
  created_at: string;
}

export interface WorkspaceMemberWithPresence extends WorkspaceIdentity {
  presence: PresenceData;
}

export interface PresenceData {
  user_id: string;
  status: 'online' | 'away' | 'offline';
  last_seen_at: string | null;
  last_active_at: string | null;
  last_workspace_id: string | null;
}

// ═══════════════════════════════════════════
// Marketplace Profile API
// ═══════════════════════════════════════════

export async function getMarketplaceProfile(userId: string): Promise<MarketplaceProfileResponse> {
  const h = await headers();
  const res = await fetch(`${BASE}/marketplace-profile/${userId}`, { headers: h });
  const json = await res.json();
  if (!res.ok) {
    console.error('getMarketplaceProfile error:', json);
    throw new Error(json.error || 'Failed to load profile');
  }
  return json;
}

export async function updateMarketplaceProfile(
  updates: Partial<Pick<MarketplaceProfile, 'full_name' | 'avatar_url' | 'bio' | 'city' | 'region' | 'business_name' | 'specialties' | 'public_settings'>>
): Promise<{ profile: MarketplaceProfile }> {
  const h = await headers();
  const res = await fetch(`${BASE}/marketplace-profile`, {
    method: 'PUT',
    headers: h,
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error('updateMarketplaceProfile error:', json);
    throw new Error(json.error || 'Failed to update profile');
  }
  return json;
}

// ═══════════════════════════════════════════
// Workspace Identity API
// ═══════════════════════════════════════════

export async function getMyWorkspaceIdentity(wsId: string): Promise<{ identity: WorkspaceIdentity }> {
  const h = await headers();
  const res = await fetch(`${BASE}/ws-identity/${wsId}/me`, { headers: h });
  const json = await res.json();
  if (!res.ok) {
    console.error('getMyWorkspaceIdentity error:', json);
    throw new Error(json.error || 'Failed to load workspace identity');
  }
  return json;
}

export async function updateMyWorkspaceIdentity(
  wsId: string,
  updates: { workspace_display_name?: string; workspace_avatar_url?: string }
): Promise<{ identity: WorkspaceIdentity }> {
  const h = await headers();
  const res = await fetch(`${BASE}/ws-identity/${wsId}/me`, {
    method: 'PUT',
    headers: h,
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error('updateMyWorkspaceIdentity error:', json);
    throw new Error(json.error || 'Failed to update workspace identity');
  }
  return json;
}

export async function getWorkspaceUserIdentity(
  wsId: string,
  targetUserId: string
): Promise<{ identity: WorkspaceIdentity }> {
  const h = await headers();
  const res = await fetch(`${BASE}/ws-identity/${wsId}/user/${targetUserId}`, { headers: h });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load user identity');
  return json;
}

export async function getWorkspaceMembers(
  wsId: string,
  page = 0
): Promise<{
  members: WorkspaceMemberWithPresence[];
  total: number;
  page: number;
  hasMore: boolean;
}> {
  const h = await headers();
  const res = await fetch(`${BASE}/ws-identity/${wsId}/members?page=${page}`, { headers: h });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load members');
  return json;
}

// ═══════════════════════════════════════════
// Presence API
// ═══════════════════════════════════════════

export async function updatePresence(
  status: 'online' | 'away' | 'offline',
  lastWorkspaceId?: string | null
): Promise<void> {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data?.session?.access_token) return; // No session — skip silently
    const h = await headers();
    await fetch(`${BASE}/presence/update`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ status, last_workspace_id: lastWorkspaceId }),
    });
  } catch (err) {
    // Presence updates are best-effort — suppress network errors silently
    if (err instanceof TypeError && (err as TypeError).message === 'Failed to fetch') return;
    console.warn('Presence update failed:', err);
  }
}

export async function batchGetPresence(
  userIds: string[]
): Promise<Record<string, PresenceData>> {
  if (!userIds.length) return {};
  try {
    const h = await headers();
    const res = await fetch(`${BASE}/presence/batch`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ userIds }),
    });
    const json = await res.json();
    return json.presences || {};
  } catch (err) {
    console.warn('Presence batch read failed:', err);
    return {};
  }
}