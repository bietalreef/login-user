import { ReactNode } from 'react';
import { Home, FileText, User } from 'lucide-react';
import { useShopStore } from './ShopStore';
import { useTranslation } from '../../../contexts/LanguageContext';

interface ShopLayoutProps {
  children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  const { currentView, setCurrentView } = useShopStore();
  const { language } = useTranslation('shop');
  const isEn = language === 'en';
  const fontFamily = 'Cairo, sans-serif';

  const navItems = [
    { id: 'home', icon: Home, label: isEn ? 'Home' : 'الرئيسية' },
    { id: 'history', icon: FileText, label: isEn ? 'My Orders' : 'طلباتي' },
    { id: 'profile', icon: User, label: isEn ? 'Account' : 'حسابي' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white relative">
      {/* Scrollable content area — stops before fixed bottom nav */}
      <div className="flex-1 overflow-y-auto pb-[72px]">
        {children}
      </div>
      
      {/* Store Bottom Nav — FIXED, never moves */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-white/5 px-4 py-2 pb-5 z-30 backdrop-blur-md" style={{ fontFamily }}>
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.id || 
               (item.id === 'history' && (currentView === 'tracking' || currentView === 'rating'));
             
             return (
               <button
                 key={item.id}
                 onClick={() => {
                   if (item.id === 'home' || item.id === 'history') {
                     setCurrentView(item.id as any);
                   }
                 }}
                 className={`flex flex-col items-center gap-1.5 py-1.5 px-5 rounded-xl transition-all ${
                   isActive 
                     ? 'text-[#D4AF37]' 
                     : 'text-gray-500 hover:text-gray-300'
                 }`}
               >
                 <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center ${
                   isActive ? 'bg-[#D4AF37]/15' : 'bg-white/5'
                 }`}>
                   <Icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : ''}`} />
                   {isActive && (
                     <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                   )}
                 </div>
                 <span className="text-xs" style={{ fontFamily, fontWeight: isActive ? 700 : 600 }}>{item.label}</span>
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
}