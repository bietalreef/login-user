/**
 * DocumentsToolsSection.tsx — قسم النماذج والأدوات في الداشبورد
 * ═══════════════════════════════════════════════════════════
 * يعرض النماذج والأدوات المتاحة حسب باقة المستخدم
 */

import { useState } from 'react';
import { 
  FileText, Lock, Award, Sparkles, ChevronRight, X,
  Zap, TrendingUp
} from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import {
  DOCUMENT_TEMPLATES,
  TOOL_FEATURES,
  canAccessDocument,
  canAccessTool,
  getTierDetails,
  type SubscriptionTier,
  type DocumentTemplate,
  type ToolFeature
} from './subscriptionTiers';

interface DocumentsToolsSectionProps {
  documentIds?: string[];
  toolIds?: string[];
  userTier?: SubscriptionTier;
  onUpgrade?: () => void;
}

export function DocumentsToolsSection({ 
  documentIds = [], 
  toolIds = [],
  userTier = 'free',
  onUpgrade 
}: DocumentsToolsSectionProps) {
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<'documents' | 'tools'>('documents');
  const [selectedItem, setSelectedItem] = useState<DocumentTemplate | ToolFeature | null>(null);

  // فلترة النماذج والأدوات
  const documents = DOCUMENT_TEMPLATES.filter(doc => documentIds.includes(doc.id));
  const tools = TOOL_FEATURES.filter(tool => toolIds.includes(tool.id));

  if (documents.length === 0 && tools.length === 0) {
    return null;
  }

  const getTierBadge = (tier: SubscriptionTier) => {
    if (tier === 'free') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2AA676] bg-[#2AA676]/10 px-2 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3" />
          {isEn ? 'FREE' : 'مجاني'}
        </span>
      );
    } else if (tier === 'pro') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3B5BFE] bg-[#3B5BFE]/10 px-2 py-0.5 rounded-full">
          <Crown className="w-3 h-3" />
          {isEn ? 'PRO' : 'برو'}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C8A86A] bg-[#C8A86A]/10 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {isEn ? 'ENTERPRISE' : 'مؤسسات'}
        </span>
      );
    }
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#1F3D2B]">
          {isEn ? 'Quick Tools & Documents' : 'أدوات ونماذج سريعة'}
        </h3>
        <span className="text-xs text-gray-400">
          {isEn ? `Your plan: ` : 'باقتك: '}
          {getTierBadge(userTier)}
        </span>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-3">
        <div className="bg-[#F5EEE1]/50 rounded-2xl p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'documents'
                ? 'bg-white text-[#1F3D2B] shadow-sm'
                : 'text-gray-400'
            }`}
          >
            <FileText className="w-4 h-4 inline-block mb-0.5 mr-1" />
            {isEn ? `Documents (${documents.length})` : `النماذج (${documents.length})`}
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tools'
                ? 'bg-white text-[#1F3D2B] shadow-sm'
                : 'text-gray-400'
            }`}
          >
            <Zap className="w-4 h-4 inline-block mb-0.5 mr-1" />
            {isEn ? `Tools (${tools.length})` : `الأدوات (${tools.length})`}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        {activeTab === 'documents' && (
          <div className="grid grid-cols-2 gap-2">
            {documents.map((doc) => {
              const hasAccess = canAccessDocument(doc.id, userTier);
              const Icon = doc.icon;

              return (
                <motion.button
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => hasAccess ? setSelectedItem(doc) : onUpgrade?.()}
                  className={`bg-white rounded-2xl p-3 text-right shadow-sm border transition-all ${
                    hasAccess
                      ? 'border-gray-100 hover:border-[#2AA676] hover:shadow-md'
                      : 'border-gray-100 opacity-60'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${doc.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: doc.color }} />
                    </div>
                    {!hasAccess && (
                      <Lock className="w-3 h-3 text-gray-400" />
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-[11px] font-bold text-[#1F3D2B] mb-1 line-clamp-2">
                    {isEn ? doc.name_en : doc.name_ar}
                  </h4>

                  {/* Tier Badge */}
                  <div className="flex justify-end">
                    {getTierBadge(doc.requiredTier)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-2 gap-2">
            {tools.map((tool) => {
              const hasAccess = canAccessTool(tool.id, userTier);
              const Icon = tool.icon;

              return (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => hasAccess ? setSelectedItem(tool) : onUpgrade?.()}
                  className={`bg-white rounded-2xl p-3 text-right shadow-sm border transition-all ${
                    hasAccess
                      ? 'border-gray-100 hover:border-[#3B5BFE] hover:shadow-md'
                      : 'border-gray-100 opacity-60'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${tool.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: tool.color }} />
                    </div>
                    {!hasAccess && (
                      <Lock className="w-3 h-3 text-gray-400" />
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-[11px] font-bold text-[#1F3D2B] mb-1 line-clamp-2">
                    {isEn ? tool.name_en : tool.name_ar}
                  </h4>

                  {/* Tier Badge */}
                  <div className="flex justify-end">
                    {getTierBadge(tool.requiredTier)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Upgrade CTA */}
        {(activeTab === 'documents' ? documents : tools).some(item => !canAccessDocument(item.id, userTier) && !canAccessTool(item.id, userTier)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-gradient-to-l from-[#3B5BFE]/10 to-[#2AA676]/10 rounded-2xl p-3 border border-[#3B5BFE]/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3B5BFE] to-[#2AA676] rounded-xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#1F3D2B] mb-0.5">
                  {isEn ? 'Unlock Premium Features' : 'افتح المميزات المتقدمة'}
                </h4>
                <p className="text-[10px] text-gray-500">
                  {isEn ? 'Upgrade to access all tools' : 'ترقية للوصول لجميع الأدوات'}
                </p>
              </div>
              <button
                onClick={onUpgrade}
                className="bg-gradient-to-l from-[#3B5BFE] to-[#2AA676] text-white px-3 py-1.5 rounded-xl text-[10px] font-bold hover:shadow-lg transition-all flex items-center gap-1"
              >
                {isEn ? 'Upgrade' : 'ترقية'}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1F3D2B]">
                  {isEn 
                    ? ('name_en' in selectedItem ? selectedItem.name_en : '')
                    : ('name_ar' in selectedItem ? selectedItem.name_ar : '')
                  }
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Icon & Tier */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedItem.color}15` }}
                  >
                    <selectedItem.icon className="w-7 h-7" style={{ color: selectedItem.color }} />
                  </div>
                  <div>
                    {getTierBadge(selectedItem.requiredTier)}
                    <p className="text-xs text-gray-400 mt-1">
                      {'category' in selectedItem 
                        ? (isEn 
                            ? selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)
                            : selectedItem.category === 'financial' ? 'مالي'
                            : selectedItem.category === 'legal' ? 'قانوني'
                            : selectedItem.category === 'operational' ? 'تشغيلي'
                            : selectedItem.category === 'marketing' ? 'تسويقي'
                            : selectedItem.category
                          )
                        : ''
                      }
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {isEn
                    ? ('description_en' in selectedItem ? selectedItem.description_en : '')
                    : ('description_ar' in selectedItem ? selectedItem.description_ar : '')
                  }
                </p>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-3 rounded-2xl font-bold text-sm hover:shadow-xl transition-all">
                  {isEn ? 'Use Template' : 'استخدم النموذج'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
