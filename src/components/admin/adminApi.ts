/**
 * Admin API Client
 * Communicates with the Supabase Edge Function admin routes
 */
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

async function getToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || '';
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      'X-User-Token': token,
      ...(options.headers || {}),
    },
  });

  const json = await res.json();

  if (!res.ok) {
    console.error(`Admin API error [${res.status}] ${path}:`, json);
    throw new Error(json.error || `API error ${res.status}`);
  }

  return json;
}

// ─── Admin Verify ───
export async function verifyAdmin() {
  return apiFetch('/admin/verify', { method: 'POST' });
}

// ─── Stats ───
export async function getStats() {
  return apiFetch('/admin/stats');
}

// ─── Users ───
export async function getUsers(page = 1, limit = 20, q = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q) params.set('q', q);
  return apiFetch(`/admin/users?${params}`);
}

export async function getUserDetail(id: string) {
  return apiFetch(`/admin/users/${id}`);
}

// ─── Activity ───
export async function getActivity(page = 1, limit = 50, type = '', from = '', to = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (type) params.set('type', type);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  return apiFetch(`/admin/activity?${params}`);
}

// ─── Invite ───
export async function createInvite() {
  return apiFetch('/admin/invite', { method: 'POST' });
}

export async function acceptInvite(code: string) {
  return apiFetch('/admin/invite/accept', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

// ─── System Health ───
export async function getSystemHealth() {
  return apiFetch('/admin/system-health');
}

// ─── Wallet Adjust ───
export async function adjustWallet(
  target_user_id: string,
  coins: number,
  direction: 'credit' | 'debit',
  reason: string
) {
  return apiFetch('/admin/wallet/adjust', {
    method: 'POST',
    body: JSON.stringify({ target_user_id, coins, direction, reason }),
  });
}

// ─── Full User Detail (enhanced) ───
export async function getUserFull(id: string) {
  return apiFetch(`/admin/users/${id}/full`);
}

// ─── Ban / Unban User ───
export async function banUser(id: string, action: 'ban' | 'unban', reason?: string, duration_hours?: number) {
  return apiFetch(`/admin/users/${id}/ban`, {
    method: 'POST',
    body: JSON.stringify({ action, reason, duration_hours }),
  });
}

// ─── Freeze / Unfreeze User ───
export async function freezeUser(id: string, action: 'freeze' | 'unfreeze', reason?: string, freeze_until?: string) {
  return apiFetch(`/admin/users/${id}/freeze`, {
    method: 'POST',
    body: JSON.stringify({ action, reason, freeze_until }),
  });
}

// ─── Update User Plan ───
export async function updateUserPlan(id: string, plan: string, expires_at?: string, reason?: string) {
  return apiFetch(`/admin/users/${id}/plan`, {
    method: 'POST',
    body: JSON.stringify({ plan, expires_at, reason }),
  });
}

// ─── Manage Workspace ───
export async function manageWorkspace(wsId: string, action: 'activate' | 'deactivate' | 'delete', reason?: string) {
  return apiFetch(`/admin/workspace/${wsId}/manage`, {
    method: 'POST',
    body: JSON.stringify({ action, reason }),
  });
}

// ─── Providers Management ───
export async function getProviders(page = 1, limit = 20, status = 'all', q = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), status });
  if (q) params.set('q', q);
  return apiFetch(`/admin/providers?${params}`);
}

export async function verifyProvider(id: string, action: 'verify' | 'reject', note?: string) {
  return apiFetch(`/admin/providers/${id}/verify`, {
    method: 'POST',
    body: JSON.stringify({ action, note }),
  });
}

// ─── Delete User (permanent) ───
export async function deleteUser(id: string) {
  return apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
}

// ─── Purge All Users Except Admin ───
export async function purgeAllUsers() {
  return apiFetch('/admin/users/purge-all', { method: 'POST' });
}

// ─── Workspace Deletion Requests ───
export async function getDeletionRequests(status: string = 'all') {
  return apiFetch(`/admin/workspace-deletion-requests?status=${status}`);
}

export async function actionDeletionRequest(requestId: string, action: 'approve' | 'reject', admin_note?: string) {
  return apiFetch(`/admin/workspace-deletion-requests/${requestId}/action`, {
    method: 'POST',
    body: JSON.stringify({ action, admin_note }),
  });
}