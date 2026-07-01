import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase/client';
import { UserProfile, UserRole, UserTier } from './uiPolicy';
import { toast } from 'sonner@2.0.3';

import { projectId, publicAnonKey } from './supabase/info';

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

/** Returns true for transient network errors that are expected on cold-start */
function isNetworkError(err: unknown): boolean {
  return (
    (err instanceof TypeError && err.message === 'Failed to fetch') ||
    isAbortError(err)
  );
}

/** Fetch with a per-request timeout to avoid hanging on Edge Function cold-starts */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8_000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const SERVER_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

interface UserContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  assignRole: (role: UserRole, tier: UserTier) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status from server (user_roles table)
  const checkAdminStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) {
        setIsAdmin(false);
        return;
      }
      const res = await fetch(`${SERVER_BASE}/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
        },
      });
      if (!res.ok) {
        setIsAdmin(false);
        return;
      }
      const json = await res.json();
      setIsAdmin(json.is_admin === true);
      if (json.is_admin) {
        console.log('Admin status verified for user');
      }
    } catch (err) {
      // Network failures are non-fatal — default to non-admin
      if (!(err instanceof TypeError && (err as TypeError).message === 'Failed to fetch')) {
        console.warn('Admin check failed (non-fatal):', err);
      }
      setIsAdmin(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      // 1. Get Auth User Metadata (always available)
      const { data: { user } } = await supabase.auth.getUser();
      const metadata = user?.user_metadata || {};

      // 2. Get KV Profile from server (Source of Truth)
      let kvProfile: any = {};
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (token) {
          const res = await fetchWithTimeout(`${SERVER_BASE}/profile`, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'X-User-Token': token,
            },
          });
          if (res.ok) {
            const data = await res.json();
            // Server returns {} if no profile exists — that's fine
            if (data && !data.error) {
              kvProfile = data;
            }
          }
        }
      } catch (err) {
        // Cold-start network errors are expected — log at debug level only
        if (!isNetworkError(err)) {
          console.warn('KV profile fetch failed (non-fatal), using metadata only:', err);
        } else {
          console.debug('KV profile: server cold-start, using metadata only');
        }
      }

      // 3. Merge Data
      // Priority: KV Profile > User Metadata > Defaults
      const mergedProfile: UserProfile = {
        id: userId,
        email: user?.email || '',
        full_name: kvProfile.full_name || metadata.full_name || metadata.name || user?.email?.split('@')[0] || 'User',
        role: (kvProfile.role || metadata.role || 'client') as UserRole,
        tier: (kvProfile.tier || metadata.tier || kvProfile.subscription_plan || 'free') as UserTier,
        is_verified: kvProfile.is_verified === true || kvProfile.verification_status === 'approved' || metadata.is_verified === true || false,
        avatar_url: kvProfile.avatar_url || metadata.avatar_url || user?.user_metadata?.avatar_url || '',
        phone: kvProfile.phone || metadata.phone || '',
        user_metadata: metadata,
        created_at: user?.created_at || kvProfile.created_at || '',
        // Onboarding & Display
        display_id: kvProfile.display_id || metadata.display_id || '',
        onboarding_completed: kvProfile.onboarding_completed ?? metadata.onboarding_completed ?? false,
        // Personal
        whatsapp: kvProfile.whatsapp || '',
        bio: kvProfile.bio || '',
        emirate: kvProfile.emirate || '',
        city: kvProfile.city || '',
        district: kvProfile.district || '',
        // Provider-specific
        provider_type: kvProfile.provider_type || undefined,
        business_name: kvProfile.business_name || '',
        business_name_en: kvProfile.business_name_en || '',
        specialties: kvProfile.specialties || [],
        service_area: kvProfile.service_area || '',
        working_hours: kvProfile.working_hours || '',
        about: kvProfile.about || kvProfile.bio || '',
        about_en: kvProfile.about_en || '',
        social_links: kvProfile.social_links || {},
        gallery_images: kvProfile.gallery_images || [],
        response_time: kvProfile.response_time || '',
        completion_rate: kvProfile.completion_rate || 0,
        projects_count: kvProfile.projects_count || 0,
        // Professional
        years_experience: kvProfile.years_experience || 0,
        service_emirates: kvProfile.service_emirates || [],
        residence: kvProfile.residence || '',
        sponsor_company: kvProfile.sponsor_company || '',
        previous_works: kvProfile.previous_works || [],
        // Company
        trade_license_url: kvProfile.trade_license_url || '',
        num_workers: kvProfile.num_workers || 0,
        general_specialization: kvProfile.general_specialization || '',
        specific_specialization: kvProfile.specific_specialization || '',
        classification_cert_url: kvProfile.classification_cert_url || '',
        // NOC
        noc_status: kvProfile.noc_status || undefined,
        // Social
        followers_count: kvProfile.followers_count || 0,
        following_count: kvProfile.following_count || 0,
        // Subscription
        subscription_plan: kvProfile.subscription_plan || 'free',
        subscription_started: kvProfile.subscription_started || '',
        subscription_expires: kvProfile.subscription_expires || '',
        is_trial: kvProfile.is_trial || false,
        // Verification
        verification_status: kvProfile.verification_status || 'none',
        verification_method: kvProfile.verification_method || 'none',
        verification_submitted_at: kvProfile.verification_submitted_at || '',
        emirates_id_front_url: kvProfile.emirates_id_front_url || '',
        emirates_id_back_url: kvProfile.emirates_id_back_url || '',
        uae_pass_verified: kvProfile.uae_pass_verified || false,
        // Language
        preferred_language: kvProfile.preferred_language || 'ar',
      };
      
      setProfile(mergedProfile);
      
      // Check admin status in parallel (non-blocking)
      checkAdminStatus();
    } catch (err) {
      if (isAbortError(err)) return; // Component unmounted — ignore silently
      console.error('Profile load failed', err);
    }
  };

  useEffect(() => {
    let cancelled = false;

    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    }).catch((err) => {
      if (cancelled || isAbortError(err)) return;
      console.error('Session check failed:', err);
      setIsLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
        let { data: { user } } = await supabase.auth.getUser();
        
        // Fallback to session user if getUser fails (e.g. network latency after login)
        if (!user) {
             const { data: { session } } = await supabase.auth.getSession();
             user = session?.user || null;
        }

        if (!user) throw new Error("No user logged in");

        // 1. Update Auth Metadata for key fields
        const metadataUpdates: any = {};
        if (updates.tier) metadataUpdates.tier = updates.tier;
        if (updates.role) metadataUpdates.role = updates.role;
        if (updates.full_name) metadataUpdates.full_name = updates.full_name;
        if (updates.is_verified !== undefined) metadataUpdates.is_verified = updates.is_verified;
        if (updates.avatar_url) metadataUpdates.avatar_url = updates.avatar_url;

        if (Object.keys(metadataUpdates).length > 0) {
            const { error: metaError } = await supabase.auth.updateUser({
                data: metadataUpdates
            });
            if (metaError) console.warn('Metadata update warning:', metaError.message);
        }

        // 2. Save to KV Profile via server (Source of Truth)
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (token) {
          // Fetch existing KV profile first, then merge
          let existingKv: any = {};
          try {
            const getRes = await fetch(`${SERVER_BASE}/profile`, {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'X-User-Token': token,
              },
            });
            if (getRes.ok) {
              const getData = await getRes.json();
              if (getData && !getData.error) existingKv = getData;
            }
          } catch { /* ignore */ }

          const mergedKv = {
            ...existingKv,
            ...updates,
            updated_at: new Date().toISOString(),
          };

          const postRes = await fetch(`${SERVER_BASE}/profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
              'X-User-Token': token,
            },
            body: JSON.stringify(mergedKv),
          });

          if (!postRes.ok) {
            const errData = await postRes.json().catch(() => ({}));
            console.warn('KV profile save warning:', errData.error || postRes.status);
          }
        }

        // 3. Refresh Local State
        await fetchProfile(user.id);
        
    } catch (err: any) {
        console.error("Update Profile Failed:", err);
        toast.error("Failed to update profile");
    }
  };

  const assignRole = async (role: UserRole, tier: UserTier) => {
    setIsLoading(true);
    try {
      // Check if we are logged in anonymously or as a user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Attempt Anonymous Login First
        const { error: anonError } = await supabase.auth.signInAnonymously();
        
        if (anonError) {
             console.log("Anonymous login failed, trying static test user:", anonError.message);
             
             const testEmail = 'dev.test.user@bietalreef.com';
             const testPassword = 'Password123!';

             // Try Sign In First
             const { error: signInError } = await supabase.auth.signInWithPassword({
                email: testEmail,
                password: testPassword
             });

             if (signInError) {
                 console.warn("Test user sign in failed:", signInError.message);
                 
                 // Try to create user via SERVER (bypasses rate limit)
                 try {
                     const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/signup`, {
                         method: 'POST',
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': `Bearer ${publicAnonKey}`
                         },
                         body: JSON.stringify({
                             email: testEmail,
                             password: testPassword,
                             name: 'Test User'
                         })
                     });

                     // If successful or user already exists, try signing in again
                     // (The server returns 400 if user exists, but that's fine, we just retry login)
                     
                     const { error: finalSignInError } = await supabase.auth.signInWithPassword({
                        email: testEmail,
                        password: testPassword
                     });
                     
                     if (finalSignInError) throw finalSignInError;
                     
                 } catch (err) {
                     console.error("Test user fallback failed:", err);
                     throw signInError; // Throw original error if fallback fails
                 }
             }
        }
      }

      // Use the new updateProfile method which handles both DB and Metadata safely
      await updateProfile({ role, tier });

      toast.success(`Role Assigned: ${role.toUpperCase()} / ${tier.toUpperCase()}`);
      
    } catch (error: any) {
      console.error('Role assignment failed:', error);
      toast.error(`Failed to assign role: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await fetchProfile(user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsAdmin(false);
    toast.info('Logged out');
  };

  return (
    <UserContext.Provider value={{ profile, isLoading, isAdmin, assignRole, updateProfile, refreshProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}