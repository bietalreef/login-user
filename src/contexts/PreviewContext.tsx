/**
 * PreviewContext.tsx
 * Preview pane is OPEN by default — always visible on /agents
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PreviewState, PreviewMode } from '../types/agent-runtime';

const DEFAULT_STATE: PreviewState = {
  isOpen: true,          // ← دائماً مفتوح عند الدخول
  mode: 'setup',
  title: 'مرحباً بك في وياك',
  taskId: null,
  agentId: null,
  status: 'idle',
  previewUrl: null,
  previewComponent: null,
  toolKey: null,
};

interface PreviewContextType {
  preview: PreviewState;
  openPreview: (payload: Partial<PreviewState> & { mode: PreviewMode; title: string }) => void;
  closePreview: () => void;
  setPreviewMode: (mode: PreviewMode) => void;
  updatePreview: (updates: Partial<PreviewState>) => void;
}

const PreviewContext = createContext<PreviewContextType | null>(null);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<PreviewState>(DEFAULT_STATE);

  const openPreview = useCallback(
    (payload: Partial<PreviewState> & { mode: PreviewMode; title: string }) => {
      setPreview(prev => ({ ...prev, ...payload, isOpen: true }));
    },
    [],
  );

  const closePreview = useCallback(() => {
    setPreview(prev => ({ ...prev, isOpen: false, status: 'idle', toolKey: null }));
  }, []);

  const setPreviewMode = useCallback((mode: PreviewMode) => {
    setPreview(prev => ({ ...prev, mode }));
  }, []);

  const updatePreview = useCallback((updates: Partial<PreviewState>) => {
    setPreview(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <PreviewContext.Provider value={{ preview, openPreview, closePreview, setPreviewMode, updatePreview }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const ctx = useContext(PreviewContext);
  if (!ctx) throw new Error('usePreview must be used inside PreviewProvider');
  return ctx;
}
