/**
 * Workspace Types — بيت الريف CRM Engine
 * ═════════════════════════════════════════
 * Entity Engine: Project = Patient = Order = Case = Job
 * Same code, different Config (Template + Labels + Validation)
 */

// ─── Business Types ───
export type BusinessType =
  | 'construction'   // مقاولات/صيانة
  | 'shop'           // محل مواد/تجزئة
  | 'engineering'    // مكتب هندسي/استشاري
  | 'freelancer'     // مزود خدمة فردي
  | 'client'         // عميل (صاحب بيت)
  | 'clinic'         // عيادة
  | 'restaurant'     // مطعم
  | 'other';         // نشاط آخر

// ─── RBAC ───
export type WorkspaceRole = 'owner' | 'admin' | 'staff';

// ─── Module IDs ───
export type ModuleId =
  // Core
  | 'dashboard' | 'team' | 'settings' | 'public_profile'
  | 'notifications' | 'files' | 'quotes_contracts'
  // Specialized
  | 'projects' | 'jobs' | 'site_diary' | 'inventory'
  | 'catalog' | 'orders' | 'finance' | 'drawings'
  | 'appointments' | 'automation';

// ─── Subscription Plans ───
export type PlanId = 'starter' | 'business' | 'enterprise';

// ─── Workspace ───
export interface Workspace {
  id: string;
  name: string;
  business_type: BusinessType;
  owner_id: string;
  logo_url?: string;
  description?: string;
  license_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  plan: PlanId;
  max_members: number;
  max_projects: number;
  automation_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Workspace Member ───
export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string | null;       // null = not linked yet
  role: WorkspaceRole;
  job_title: string;
  full_name: string;
  phone?: string;
  residency_number?: string;
  salary?: number;
  start_date?: string;
  notes?: string;
  status: 'active' | 'invited' | 'pending' | 'suspended';
  invited_at?: string;
  joined_at?: string;
  created_at: string;
}

// ─── Invitation ───
export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  workspace_name: string;
  member_id: string;
  target_user_id: string;
  role: WorkspaceRole;
  job_title: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

// ─── Project (Entity Engine) ───
export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  start_date?: string;
  end_date?: string;
  budget?: number;
  spent?: number;
  location?: string;
  assigned_members: string[];
  created_at: string;
  updated_at: string;
}

// ─── Site Diary Entry ───
export interface SiteDiaryEntry {
  id: string;
  workspace_id: string;
  project_id: string;
  project_name?: string;
  author_id: string;
  author_name: string;
  date: string;
  weather?: string;
  workers_count: number;
  tasks_completed: string;
  notes?: string;
  created_at: string;
}

// ─── Finance Entry ───
export interface FinanceEntry {
  id: string;
  workspace_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  project_id?: string;
  date: string;
  created_at: string;
}

// ─── File Entry ───
export interface FileEntry {
  id: string;
  workspace_id: string;
  name: string;
  file_type: 'document' | 'image' | 'drawing' | 'contract' | 'other';
  size?: number;
  url?: string;
  project_id?: string;
  uploaded_by: string;
  created_at: string;
}

// ─── User Workspace Membership ───
export interface UserWorkspaceLink {
  workspace_id: string;
  member_id: string;
  role: WorkspaceRole;
  workspace_name: string;
  business_type: BusinessType;
}

// ─── Bottom Nav Tab ───
export type WsTab = 'dashboard' | 'projects' | 'team' | 'finance' | 'more';
