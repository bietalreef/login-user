/**
 * WorkspaceContext — State Management for Workspace
 * ═══════════════════════════════════════════════════
 * Manages: current workspace, members, role, modules
 * RBAC: Owner / Admin / Staff
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  Workspace, WorkspaceMember, WorkspaceInvitation,
  Project, SiteDiaryEntry, FinanceEntry, FileEntry,
  WorkspaceRole, UserWorkspaceLink, WsTab,
} from './types';
import { getEnabledModules, canAccess, type ModuleDef } from './config';
import * as api from './workspaceApi';

interface WorkspaceContextType {
  // Loading state
  loading: boolean;
  error: string | null;

  // Workspace data
  workspace: Workspace | null;
  members: WorkspaceMember[];
  myRole: WorkspaceRole;
  modules: ModuleDef[];

  // User's workspaces
  ownedWorkspaces: Workspace[];
  memberships: UserWorkspaceLink[];
  invitations: WorkspaceInvitation[];

  // Navigation
  activeTab: WsTab;
  setActiveTab: (tab: WsTab) => void;
  activeSubScreen: string | null;
  setActiveSubScreen: (screen: string | null) => void;

  // Projects
  projects: Project[];
  loadProjects: () => Promise<void>;

  // Site Diary
  diaryEntries: SiteDiaryEntry[];
  loadDiary: () => Promise<void>;

  // Finance
  financeEntries: FinanceEntry[];
  loadFinance: () => Promise<void>;

  // Files
  files: FileEntry[];
  loadFiles: () => Promise<void>;

  // Actions
  loadWorkspace: (wsId: string) => Promise<void>;
  loadMyWorkspaces: () => Promise<void>;
  selectWorkspace: (wsId: string) => Promise<void>;
  canAccessModule: (moduleId: string) => boolean;
  refresh: () => Promise<void>;
}

const WorkspaceCtx = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [myRole, setMyRole] = useState<WorkspaceRole>('staff');
  const [modules, setModules] = useState<ModuleDef[]>([]);

  const [ownedWorkspaces, setOwnedWorkspaces] = useState<Workspace[]>([]);
  const [memberships, setMemberships] = useState<UserWorkspaceLink[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);

  const [activeTab, setActiveTab] = useState<WsTab>('dashboard');
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<SiteDiaryEntry[]>([]);
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
  const [files, setFiles] = useState<FileEntry[]>([]);

  // Load user's workspaces
  const loadMyWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyWorkspaces();
      setOwnedWorkspaces(data.owned || []);
      setMemberships(data.memberships || []);
      setInvitations(data.invitations || []);

      // Auto-select first workspace if available
      if (data.owned.length > 0 && !workspace) {
        await loadWorkspaceData(data.owned[0].id);
      } else if (data.memberships.length > 0 && !workspace) {
        await loadWorkspaceData(data.memberships[0].workspace_id);
      }
    } catch (err: any) {
      console.error('loadMyWorkspaces error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load specific workspace
  const loadWorkspaceData = async (wsId: string) => {
    try {
      const data = await api.getWorkspace(wsId);
      setWorkspace(data.workspace);
      setMembers(data.members || []);
      setMyRole(data.my_role || 'staff');
      setModules(getEnabledModules(data.workspace.business_type));
    } catch (err: any) {
      console.error('loadWorkspace error:', err);
      setError(err.message);
    }
  };

  const loadWorkspace = useCallback(async (wsId: string) => {
    setLoading(true);
    await loadWorkspaceData(wsId);
    setLoading(false);
  }, []);

  const selectWorkspace = useCallback(async (wsId: string) => {
    setActiveTab('dashboard');
    setActiveSubScreen(null);
    // Empty ID = deselect (go back to workspace selector)
    if (!wsId) {
      setWorkspace(null);
      setMembers([]);
      setMyRole('staff');
      setModules([]);
      return;
    }
    await loadWorkspace(wsId);
  }, [loadWorkspace]);

  // Load projects
  const loadProjects = useCallback(async () => {
    if (!workspace) return;
    try {
      const data = await api.getProjects(workspace.id);
      setProjects(data.projects || []);
    } catch (err: any) {
      console.error('loadProjects error:', err);
    }
  }, [workspace?.id]);

  // Load diary
  const loadDiary = useCallback(async () => {
    if (!workspace) return;
    try {
      const data = await api.getDiaryEntries(workspace.id);
      setDiaryEntries(data.entries || []);
    } catch (err: any) {
      console.error('loadDiary error:', err);
    }
  }, [workspace?.id]);

  // Load finance
  const loadFinance = useCallback(async () => {
    if (!workspace) return;
    try {
      const data = await api.getFinanceEntries(workspace.id);
      setFinanceEntries(data.entries || []);
    } catch (err: any) {
      console.error('loadFinance error:', err);
    }
  }, [workspace?.id]);

  // Load files
  const loadFiles = useCallback(async () => {
    if (!workspace) return;
    try {
      const data = await api.getFiles(workspace.id);
      setFiles(data.files || []);
    } catch (err: any) {
      console.error('loadFiles error:', err);
    }
  }, [workspace?.id]);

  // RBAC check
  const canAccessModule = useCallback((moduleId: string) => {
    return canAccess(moduleId, myRole);
  }, [myRole]);

  // Refresh all data
  const refresh = useCallback(async () => {
    if (workspace) {
      await Promise.all([
        loadWorkspaceData(workspace.id),
        loadProjects(),
        loadFinance(),
      ]);
    }
  }, [workspace?.id, loadProjects, loadFinance]);

  // Initial load
  useEffect(() => {
    loadMyWorkspaces();
  }, []);

  return (
    <WorkspaceCtx.Provider
      value={{
        loading, error,
        workspace, members, myRole, modules,
        ownedWorkspaces, memberships, invitations,
        activeTab, setActiveTab,
        activeSubScreen, setActiveSubScreen,
        projects, loadProjects,
        diaryEntries, loadDiary,
        financeEntries, loadFinance,
        files, loadFiles,
        loadWorkspace, loadMyWorkspaces, selectWorkspace,
        canAccessModule, refresh,
      }}
    >
      {children}
    </WorkspaceCtx.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceCtx);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}