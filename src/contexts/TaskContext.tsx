/**
 * TaskContext.tsx — نظام المهام لوكلاء وياك
 * ═══════════════════════════════════════════
 * Provides task CRUD + business profile operations
 * Connected to server /tasks/* and /business-profile/*
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVER = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

// ─── Types ───
export interface Task {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  agent: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  cost_coins: number;
  coins_deducted: boolean;
  metadata: Record<string, any>;
  result: any;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface TaskStats {
  total: number;
  pending: number;
  running: number;
  done: number;
  failed: number;
  total_coins_spent: number;
  by_agent: Record<string, number>;
}

export interface BusinessProfile {
  user_id: string;
  business_name: string;
  business_name_en: string;
  business_type: string;
  city: string;
  emirate: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  description: string;
  description_en: string;
  services: string[];
  social_links: Record<string, string>;
  license_number: string;
  logo_url: string;
  cover_url: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface TaskContextValue {
  tasks: Task[];
  stats: TaskStats | null;
  businessProfile: BusinessProfile | null;
  isLoading: boolean;
  error: string | null;

  // Task operations
  fetchTasks: (agent?: string, status?: string) => Promise<void>;
  createTask: (data: {
    type: string;
    title: string;
    description?: string;
    agent?: string;
    metadata?: Record<string, any>;
    auto_execute?: boolean;
  }) => Promise<Task | null>;
  executeTask: (taskId: string) => Promise<Task | null>;
  updateTask: (taskId: string, data: Partial<Pick<Task, 'status' | 'result' | 'metadata'>>) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
  fetchStats: () => Promise<void>;

  // Business profile
  fetchBusinessProfile: () => Promise<void>;
  saveBusinessProfile: (data: Partial<BusinessProfile>) => Promise<BusinessProfile | null>;
}

const TaskContext = createContext<TaskContextValue | null>(null);

// ─── Auth headers helper ───
async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    'X-User-Token': token,
  };
}

// ─── Provider ───
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = useCallback(async (agent?: string, status?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const headers = await authHeaders();
      const params = new URLSearchParams();
      if (agent) params.set('agent', agent);
      if (status) params.set('status', status);
      const url = `${SERVER}/tasks${params.toString() ? '?' + params.toString() : ''}`;

      const res = await fetch(url, { headers });
      const data = await res.json();
      if (!res.ok) {
        console.error('fetchTasks error:', data.error);
        setError(data.error || 'Failed to fetch tasks');
        return;
      }
      setTasks(data.tasks || []);
    } catch (e: any) {
      console.error('fetchTasks exception:', e.message);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create task
  const createTask = useCallback(async (input: {
    type: string;
    title: string;
    description?: string;
    agent?: string;
    metadata?: Record<string, any>;
    auto_execute?: boolean;
  }): Promise<Task | null> => {
    try {
      setError(null);
      const headers = await authHeaders();
      const res = await fetch(`${SERVER}/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('createTask error:', data.error);
        setError(data.error || 'Failed to create task');
        return null;
      }
      const newTask = data.task;
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (e: any) {
      console.error('createTask exception:', e.message);
      setError(e.message);
      return null;
    }
  }, []);

  // Execute task
  const executeTask = useCallback(async (taskId: string): Promise<Task | null> => {
    try {
      setError(null);
      const headers = await authHeaders();
      const res = await fetch(`${SERVER}/tasks/${taskId}/execute`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('executeTask error:', data.error);
        setError(data.error || 'Failed to execute task');
        return null;
      }
      const updated = data.task;
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      return updated;
    } catch (e: any) {
      console.error('executeTask exception:', e.message);
      setError(e.message);
      return null;
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (
    taskId: string,
    body: Partial<Pick<Task, 'status' | 'result' | 'metadata'>>,
  ): Promise<Task | null> => {
    try {
      setError(null);
      const headers = await authHeaders();
      const res = await fetch(`${SERVER}/tasks/${taskId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('updateTask error:', data.error);
        setError(data.error || 'Failed to update task');
        return null;
      }
      const updated = data.task;
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      return updated;
    } catch (e: any) {
      console.error('updateTask exception:', e.message);
      setError(e.message);
      return null;
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      setError(null);
      const headers = await authHeaders();
      const res = await fetch(`${SERVER}/tasks/${taskId}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete task');
        return false;
      }
      setTasks(prev => prev.filter(t => t.id !== taskId));
      return true;
    } catch (e: any) {
      console.error('deleteTask exception:', e.message);
      setError(e.message);
      return false;
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${SERVER}/tasks/stats`, { headers });
      const data = await res.json();
      if (res.ok) setStats(data.stats);
    } catch (e: any) {
      console.error('fetchStats exception:', e.message);
    }
  }, []);

  // Fetch business profile
  const fetchBusinessProfile = useCallback(async () => {
    try {
      setError(null);
      const headers = await authHeaders();
      const res = await fetch(`${SERVER}/business-profile`, { headers });
      const data = await res.json();
      if (res.ok) {
        setBusinessProfile(data.profile || null);
      }
    } catch (e: any) {
      console.error('fetchBusinessProfile exception:', e.message);
    }
  }, []);

  // Save business profile
  const saveBusinessProfile = useCallback(async (
    body: Partial<BusinessProfile>,
  ): Promise<BusinessProfile | null> => {
    try {
      setError(null);
      const headers = await authHeaders();
      const res = await fetch(`${SERVER}/business-profile`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save business profile');
        return null;
      }
      setBusinessProfile(data.profile);
      return data.profile;
    } catch (e: any) {
      console.error('saveBusinessProfile exception:', e.message);
      setError(e.message);
      return null;
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token && !cancelled) {
        fetchTasks();
        fetchBusinessProfile();
        fetchStats();
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchTasks();
        fetchBusinessProfile();
        fetchStats();
      }
      if (event === 'SIGNED_OUT') {
        setTasks([]);
        setStats(null);
        setBusinessProfile(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [fetchTasks, fetchBusinessProfile, fetchStats]);

  return (
    <TaskContext.Provider value={{
      tasks, stats, businessProfile, isLoading, error,
      fetchTasks, createTask, executeTask, updateTask, deleteTask, fetchStats,
      fetchBusinessProfile, saveBusinessProfile,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
}

/** Safe version — returns null if not inside TaskProvider */
export function useOptionalTaskContext(): TaskContextValue | null {
  return useContext(TaskContext);
}