/**
 * Workspace API — Frontend ↔ Backend CRUD
 * ═════════════════════════════════════════
 * All calls go through Hono server routes
 * Dual-header pattern: publicAnonKey + X-User-Token
 */

import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import type {
  Workspace, WorkspaceMember, WorkspaceInvitation,
  Project, SiteDiaryEntry, FinanceEntry, FileEntry,
  BusinessType, PlanId, WorkspaceRole, UserWorkspaceLink,
} from './types';

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

// ─── Auth Headers (Dual-Header Pattern) ───
async function headers(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    'X-User-Token': token,
    'X-Platform': 'web_workspace',
  };
}

async function apiGet<T>(path: string): Promise<T> {
  const h = await headers();
  const res = await fetch(`${BASE}${path}`, { headers: h });
  const json = await res.json();
  if (!res.ok) {
    console.error(`API GET ${path} error:`, json);
    throw new Error(json.error || 'Request failed');
  }
  return json;
}

async function apiPost<T>(path: string, body?: any): Promise<T> {
  const h = await headers();
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`API POST ${path} error:`, json);
    throw new Error(json.error || 'Request failed');
  }
  return json;
}

async function apiPut<T>(path: string, body: any): Promise<T> {
  const h = await headers();
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: h,
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`API PUT ${path} error:`, json);
    throw new Error(json.error || 'Request failed');
  }
  return json;
}

async function apiDelete<T>(path: string): Promise<T> {
  const h = await headers();
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: h,
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`API DELETE ${path} error:`, json);
    throw new Error(json.error || 'Request failed');
  }
  return json;
}

// ═══════════════════════════════════════════
// Workspace CRUD
// ═══════════════════════════════════════════

export async function createWorkspace(data: {
  name: string;
  business_type: BusinessType;
  plan: PlanId;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  license_number?: string;
}): Promise<{ workspace: Workspace }> {
  return apiPost('/ws/create', data);
}

export async function getMyWorkspaces(): Promise<{
  owned: Workspace[];
  memberships: UserWorkspaceLink[];
  invitations: WorkspaceInvitation[];
}> {
  return apiGet('/ws/mine');
}

export async function getWorkspace(wsId: string): Promise<{
  workspace: Workspace;
  members: WorkspaceMember[];
  my_role: WorkspaceRole;
}> {
  return apiGet(`/ws/${wsId}`);
}

export async function updateWorkspace(wsId: string, data: Partial<Workspace>): Promise<{ workspace: Workspace }> {
  return apiPut(`/ws/${wsId}`, data);
}

// ═══════════════════════════════════════════
// Members CRUD
// ═══════════════════════════════════════════

export async function addMember(wsId: string, data: {
  full_name: string;
  role: WorkspaceRole;
  job_title: string;
  phone?: string;
  residency_number?: string;
  salary?: number;
  start_date?: string;
  notes?: string;
}): Promise<{ member: WorkspaceMember }> {
  return apiPost(`/ws/${wsId}/members`, data);
}

export async function updateMember(wsId: string, memberId: string, data: Partial<WorkspaceMember>): Promise<{ member: WorkspaceMember }> {
  return apiPut(`/ws/${wsId}/members/${memberId}`, data);
}

export async function removeMember(wsId: string, memberId: string): Promise<{ success: boolean }> {
  return apiDelete(`/ws/${wsId}/members/${memberId}`);
}

export async function linkAndInvite(wsId: string, memberId: string, targetUserId: string): Promise<{ invitation: WorkspaceInvitation }> {
  return apiPost(`/ws/${wsId}/members/${memberId}/link`, { target_user_id: targetUserId });
}

// ═══════════════════════════════════════════
// Invitations
// ═══════════════════════════════════════════

export async function respondToInvitation(inviteId: string, accept: boolean): Promise<{ success: boolean }> {
  return apiPost(`/ws/invitations/${inviteId}/respond`, { accept });
}

// ═══════════════════════════════════════════
// Projects CRUD
// ═══════════════════════════════════════════

export async function getProjects(wsId: string): Promise<{ projects: Project[] }> {
  return apiGet(`/ws/${wsId}/projects`);
}

export async function createProject(wsId: string, data: {
  name: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  location?: string;
}): Promise<{ project: Project }> {
  return apiPost(`/ws/${wsId}/projects`, data);
}

export async function updateProject(wsId: string, projectId: string, data: Partial<Project>): Promise<{ project: Project }> {
  return apiPut(`/ws/${wsId}/projects/${projectId}`, data);
}

export async function deleteProject(wsId: string, projectId: string): Promise<{ success: boolean }> {
  return apiDelete(`/ws/${wsId}/projects/${projectId}`);
}

// ═══════════════════════════════════════════
// Site Diary
// ═══════════════════════════════════════════

export async function getDiaryEntries(wsId: string): Promise<{ entries: SiteDiaryEntry[] }> {
  return apiGet(`/ws/${wsId}/diary`);
}

export async function createDiaryEntry(wsId: string, data: {
  project_id: string;
  project_name?: string;
  date: string;
  weather?: string;
  workers_count: number;
  tasks_completed: string;
  notes?: string;
}): Promise<{ entry: SiteDiaryEntry }> {
  return apiPost(`/ws/${wsId}/diary`, data);
}

// ═══════════════════════════════════════════
// Finance
// ═══════════════════════════════════════════

export async function getFinanceEntries(wsId: string): Promise<{ entries: FinanceEntry[] }> {
  return apiGet(`/ws/${wsId}/finance`);
}

export async function createFinanceEntry(wsId: string, data: {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  project_id?: string;
  date: string;
}): Promise<{ entry: FinanceEntry }> {
  return apiPost(`/ws/${wsId}/finance`, data);
}

// ═══════════════════════════════════════════
// Files
// ═══════════════════════════════════════════

export async function getFiles(wsId: string): Promise<{ files: FileEntry[] }> {
  return apiGet(`/ws/${wsId}/files`);
}

export async function createFile(wsId: string, data: {
  name: string;
  file_type: string;
  url?: string;
  project_id?: string;
}): Promise<{ file: FileEntry }> {
  return apiPost(`/ws/${wsId}/files`, data);
}

// ═══════════════════════════════════════════
// Workspace Deletion Requests
// ═══════════════════════════════════════════

export async function requestWorkspaceDeletion(
  workspaceId: string,
  reason?: string
): Promise<{ success: boolean; request: any }> {
  return apiPost('/workspace/deletion-request', { workspaceId, reason });
}

export async function getDeletionRequestStatus(
  workspaceId: string
): Promise<{ request: any | null }> {
  return apiGet(`/workspace/deletion-request/status?workspaceId=${workspaceId}`);
}