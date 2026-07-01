import { toast } from 'sonner@2.0.3';
import { Mic, Lock, Users } from 'lucide-react';
import { useUser } from '../utils/UserContext';
import { checkPolicy } from '../utils/uiPolicy';

export function VoiceRoomsPanel() {
  const { profile } = useUser();
  
  const supportAccess = checkPolicy(profile, 'voice_support');
  const projectAccess = checkPolicy(profile, 'voice_projects');

  const handleJoinSupport = () => {
    if (supportAccess.allowed) {
        toast.success('جاري الاتصال بغرفة خدمة العملاء...');
        // Here we would trigger the actual voice SDK
    } else {
        toast.error(supportAccess.reason);
    }
  };

  return (
    <div className="p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm">
      <h3 className="text-lg font-bold text-amber-900 mb-4 px-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
        الغرف الصوتية المباشرة
      </h3>

      <div className="space-y-3">
        {/* Support Room - Available */}
        <div 
            onClick={handleJoinSupport}
            className="flex items-center justify-between p-3 bg-white rounded-xl border border-green-100 hover:border-green-300 cursor-pointer transition-all group shadow-sm"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Mic className="w-5 h-5 text-green-700" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        خدمة العملاء
                    </h4>
                    <p className="text-xs text-green-600 flex items-center gap-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        متاح الآن
                    </p>
                </div>
            </div>
        </div>

        {/* Project Rooms - Locked */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-70">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        غرف المشاريع
                    </h4>
                    <p className="text-xs text-gray-400" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        تتطلب باقة مدفوعة
                    </p>
                </div>
            </div>
            <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded-md" style={{ fontFamily: 'Cairo, sans-serif' }}>
                قريباً
            </span>
        </div>
      </div>
    </div>
  );
}