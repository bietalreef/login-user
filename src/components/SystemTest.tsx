import { toast } from 'sonner@2.0.3';
import { useUser } from '../utils/UserContext';
import { supabase } from '../utils/supabase/client';
import { checkEntitlement } from '../utils/uiPolicy';
import { ShieldAlert, ShieldCheck, Database, Lock, Unlock } from 'lucide-react';

export default function SystemTest() {
  const { profile, logout } = useUser();
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // The Acid Test: Attempt to break RLS
  const runRlsTest = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      if (!profile) throw new Error("Not authenticated");

      // Attempt to insert a project directly
      const { data, error } = await supabase
        .from('projects')
        .insert({
          owner_id: profile.id,
          title: `Test Project by ${profile.role} at ${new Date().toISOString()}`,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        // RLS Blocked it!
        setTestResult({
          success: false,
          message: `RLS BLOCKED: ${error.message} (Code: ${error.code})`
        });
      } else {
        // RLS Allowed it!
        setTestResult({
          success: true,
          message: `SUCCESS: Row inserted. ID: ${data.id}`
        });
      }

    } catch (err: any) {
        setTestResult({ success: false, message: err.message });
    } finally {
        setLoading(false);
    }
  };

  if (!profile) return <div className="p-10 text-center">Please Login via Dev Launcher First</div>;

  const canCreate = checkEntitlement(profile, 'create_project');

  return (
    <div className="min-h-screen bg-slate-50 p-8" dir="ltr">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="text-blue-400" />
            System Integrity Test
          </h1>
          <button onClick={() => logout()} className="text-red-400 hover:text-red-300 text-sm font-bold">
            LOGOUT
          </button>
        </div>

        <div className="p-8">
          
          {/* 1. Identity Verification */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-3">1. Current Identity (From DB)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 p-4 rounded-lg">
                <span className="block text-xs text-slate-500">Role</span>
                <span className="text-lg font-mono font-bold text-slate-800">{profile.role.toUpperCase()}</span>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <span className="block text-xs text-slate-500">Tier</span>
                <span className="text-lg font-mono font-bold text-slate-800">{profile.tier.toUpperCase()}</span>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <span className="block text-xs text-slate-500">Verified?</span>
                <span className={`text-lg font-mono font-bold ${profile.is_verified ? 'text-green-600' : 'text-red-500'}`}>
                  {profile.is_verified ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                 <span className="block text-xs text-slate-500">UI Entitlement Check</span>
                 <div className="flex items-center gap-2">
                    {canCreate.allowed ? <Unlock className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-red-500" />}
                    <span className="font-bold">{canCreate.allowed ? 'Allowed' : 'Denied'}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* 2. RLS Proof Test */}
          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-3">2. Row Level Security (RLS) Proof</h2>
            <p className="text-slate-600 mb-4 text-sm">
                We will attempt to perform a <strong>Database INSERT</strong> into the 'projects' table. 
                Supabase RLS should allow this ONLY if you are a verified Client/Pro.
            </p>

            <button 
                onClick={runRlsTest}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md w-full flex items-center justify-center gap-2"
            >
                {loading ? 'Testing Database...' : 'ATTEMPT INSERT OPERATION'}
            </button>

            {testResult && (
                <div className={`mt-6 p-4 rounded-lg border-l-4 ${testResult.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                    <div className="flex items-center gap-3">
                        {testResult.success ? <ShieldCheck className="text-green-600 w-8 h-8" /> : <ShieldAlert className="text-red-600 w-8 h-8" />}
                        <div>
                            <h3 className={`font-bold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                                {testResult.success ? 'Operation Allowed' : 'Operation Denied'}
                            </h3>
                            <p className="text-sm font-mono mt-1 text-slate-700">{testResult.message}</p>
                        </div>
                    </div>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}