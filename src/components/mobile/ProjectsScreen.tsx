import { toast } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle, Clock, Plus, Lock, FolderOpen } from 'lucide-react';
// CheckCircle2 not available — using CheckCircle as alias
const CheckCircle2 = CheckCircle;
import { useTranslation } from '../../contexts/LanguageContext';
import { useUser } from '../../utils/UserContext';
import { checkPolicy } from '../../utils/uiPolicy';
import { supabase } from '../../utils/supabase/client';

interface ProjectsScreenProps {
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
}

export function ProjectsScreen({ onNavigate }: ProjectsScreenProps) {
  const { t, dir, language } = useTranslation('projects');
  const { profile } = useUser();
  
  // Real Data State
  const [realProjects, setRealProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Projects from DB
  const fetchProjects = async () => {
    if (!profile) return;
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('owner_id', profile.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        setRealProjects(data || []);
    } catch (err) {
        console.error("Error fetching projects", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [profile]);


  const tCommon = (key: string) => {
    const { t: tC } = useTranslation('common');
    return tC(key);
  };
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  const handleCreateProject = async () => {
    const policy = checkPolicy(profile, 'create_project');
    
    if (!policy.allowed) {
        toast.error(policy.reason || 'غير مسموح', {
            description: policy.actionRequired === 'verify' ? 'يرجى توثيق هويتك لإنشاء المشاريع' : undefined,
            icon: <Lock className="w-4 h-4" />
        });
        return;
    }

    // Attempt to insert a real project row
    try {
        toast.loading('جاري إنشاء المشروع...');
        const { error } = await supabase.from('projects').insert({
            owner_id: profile?.id,
            title: `مشروع جديد ${new Date().toLocaleTimeString()}`,
            status: 'pending'
        });
        
        if (error) throw error;
        
        toast.dismiss();
        toast.success('تم إنشاء المشروع بنجاح');
        fetchProjects(); // Refresh list

    } catch (err: any) {
        toast.dismiss();
        toast.error('فشل الإنشاء: ' + err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-[#4A90E2] to-[#56CCF2]';
      case 'pending': return 'from-[#F2994A] to-[#F2C94C]';
      case 'completed': return 'from-[#27AE60] to-[#6FCF97]';
      default: return 'from-[#6B7280] to-[#9CA3AF]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('statusActive');
      case 'pending': return t('statusPending');
      case 'completed': return t('statusCompleted');
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#F5EEE1] to-white relative" dir={dir}>
      {/* Header */}
      <div className="bg-white shadow-sm p-5">
        <div className="text-center mb-2">
          <h1 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
            {t('title')} (Real DB)
          </h1>
          <p className="text-[#6B7280] text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 py-4 bg-white border-b border-[#F5EEE1]">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[20px] p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                {t('completionRate')}
              </span>
            </div>
            <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
              0%
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#27AE60] to-[#6FCF97] rounded-[20px] p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                {t('remainingBudget')}
              </span>
            </div>
            <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '20px' }}>
              0 {tCommon('aed')}
            </p>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24">
        {loading ? (
             <div className="space-y-4">
                 {[1,2].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[24px] animate-pulse" />)}
             </div>
        ) : realProjects.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                 <FolderOpen className="w-16 h-16 text-slate-300 mb-4" />
                 <h3 className="text-lg font-bold text-slate-500" style={{ fontFamily: 'Cairo, sans-serif' }}>لا توجد مشاريع</h3>
                 <p className="text-sm text-slate-400" style={{ fontFamily: 'Cairo, sans-serif' }}>اضغط زر (+) لإنشاء أول مشروع</p>
             </div>
        ) : (
            <div className="space-y-4">
            {realProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-[24px] overflow-hidden shadow-md">
                <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                        {project.title}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-[#F5EEE1] rounded-full" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        {project.id.slice(0, 8)}...
                        </span>
                    </div>
                    <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(project.status)} text-white rounded-full text-xs`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        {getStatusText(project.status)}
                    </div>
                    </div>

                    {/* Simple Date Display */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(project.created_at).toLocaleString()}</span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Floating Create Button */}
      <button 
        onClick={handleCreateProject}
        className="absolute bottom-24 left-6 w-14 h-14 bg-[#5B7FE8] rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform z-10"
      >
        <Plus className="w-8 h-8" />
      </button>

    </div>
  );
}