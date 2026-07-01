import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InputCard } from './SimpleToolShell';

interface CollapsibleSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
}

export function CollapsibleSection({
  isOpen, onToggle, title, icon, children, badge,
}: CollapsibleSectionProps) {
  return (
    <InputCard>
      <button onClick={onToggle} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-bold text-sm font-cairo text-[#1A1A1A]">{title}</h3>
          {badge && (
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-cairo font-bold">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-gray-100 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </InputCard>
  );
}
