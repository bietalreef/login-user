/**
 * ChatScreen.tsx — نظام الرسائل المباشرة
 * ═══════════════════════════════════════
 * قائمة المحادثات + شاشة الدردشة + زر ترجمة ذكية
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Send, MessageCircle, Search, Loader2, Globe,
  Phone, MoreVertical, CheckCheck, Clock, UserPlus, ArrowLeft
} from 'lucide-react';
import { useUser } from '../../utils/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Icon3D } from '../ui/Icon3D';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

const API = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

interface Conversation {
  conversation_id: string;
  other_user: {
    id: string;
    full_name: string;
    avatar_url: string;
    display_id: string;
    role: string;
  };
  last_message: string;
  updated_at: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string;
  text: string;
  translated_text: string | null;
  read: boolean;
  created_at: string;
}

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function apiGet(path: string): Promise<any> {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(`${API}${path}`, {
    headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'X-User-Token': token },
  });
  return res.json();
}

async function apiPost(path: string, body: any): Promise<any> {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}`, 'X-User-Token': token },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function ChatScreen({ onBack }: { onBack: () => void }) {
  const { profile } = useUser();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const isEn = language === 'en';
  const font = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';

  const [view, setView] = useState<'list' | 'chat'>('list');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await apiGet('/conversations');
      if (data?.conversations) setConversations(data.conversations);
    } catch (e) {
      console.error('Load conversations error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const openChat = async (convo: Conversation) => {
    setActiveConvo(convo);
    setView('chat');
    setIsLoading(true);
    try {
      const data = await apiGet(`/messages/${convo.conversation_id}`);
      if (data?.messages) setMessages(data.messages);
    } catch (e) {
      console.error('Load messages error:', e);
    } finally {
      setIsLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConvo || isSending) return;
    setIsSending(true);
    const text = newMsg.trim();
    setNewMsg('');

    // Optimistic update
    const optimistic: Message = {
      id: `temp_${Date.now()}`,
      sender_id: profile?.id || '',
      text,
      translated_text: null,
      read: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const data = await apiPost(`/messages/${activeConvo.conversation_id}`, { text });
      if (data?.message) {
        setMessages(prev => prev.map(m => m.id === optimistic.id ? data.message : m));
      }
    } catch (e) {
      console.error('Send message error:', e);
      toast.error(isEn ? 'Failed to send' : 'فشل في الإرسال');
    } finally {
      setIsSending(false);
    }
  };

  const toggleTranslation = (msgId: string) => {
    setShowTranslation(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return isEn ? 'now' : 'الآن';
    if (diffMins < 60) return `${diffMins}${isEn ? 'm' : 'د'}`;
    if (diffHours < 24) return `${diffHours}${isEn ? 'h' : 'س'}`;
    if (diffDays < 7) return `${diffDays}${isEn ? 'd' : 'ي'}`;
    return d.toLocaleDateString(isEn ? 'en' : 'ar', { month: 'short', day: 'numeric' });
  };

  // ─── Chat View ───
  if (view === 'chat' && activeConvo) {
    const other = activeConvo.other_user;

    return (
      <div className={`flex flex-col h-screen ${isDark ? 'bg-[#0B1120]' : 'bg-[#F5EEE1]'}`} dir="rtl">
        {/* Chat Header */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${
          isDark ? 'bg-[#111827] border-white/10' : 'bg-white border-[#E6DCC8]'
        }`}>
          <button
            onClick={() => { setView('list'); setActiveConvo(null); loadConversations(); }}
            className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className={`w-5 h-5 rotate-180 ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`} />
          </button>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B5BFE] to-[#D4AF37] flex items-center justify-center overflow-hidden flex-shrink-0">
            {other.avatar_url ? (
              <ImageWithFallback src={other.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-sm">{(other.full_name?.[0] || 'U').toUpperCase()}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`} style={{ fontFamily: font }}>
              {other.full_name}
            </h3>
            <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`} style={{ fontFamily: font }}>
              {other.display_id} · {other.role === 'provider' ? (isEn ? 'Provider' : 'مزود') : (isEn ? 'Client' : 'عميل')}
            </p>
          </div>

          <button className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
            <Phone className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/50'}`} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10">
              <Icon3D icon={MessageCircle} theme="blue" size="lg" hoverable={false} />
              <p className={`mt-4 text-sm ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`} style={{ fontFamily: font }}>
                {isEn ? 'Start the conversation!' : 'ابدأ المحادثة!'}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === profile?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="relative group max-w-[80%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMine
                          ? isDark
                            ? 'bg-[#3B5BFE] text-white rounded-br-md'
                            : 'bg-[#3B5BFE] text-white rounded-br-md'
                          : isDark
                            ? 'bg-white/10 text-white rounded-bl-md'
                            : 'bg-white text-[#1F3D2B] rounded-bl-md shadow-sm'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {msg.text}

                      {/* Translation indicator */}
                      {showTranslation[msg.id] && msg.translated_text && (
                        <div className={`mt-2 pt-2 border-t text-xs italic ${
                          isMine ? 'border-white/20 text-white/70' : isDark ? 'border-white/10 text-white/50' : 'border-gray-200 text-gray-500'
                        }`}>
                          {msg.translated_text}
                        </div>
                      )}
                    </div>

                    {/* Time + Translation button */}
                    <div className={`flex items-center gap-1.5 mt-1 ${isMine ? 'justify-start' : 'justify-end'}`}>
                      <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-[#1F3D2B]/30'}`}>
                        {formatTime(msg.created_at)}
                      </span>
                      {isMine && (
                        <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-[#3B5BFE]' : isDark ? 'text-white/20' : 'text-gray-300'}`} />
                      )}
                      {/* Translate button */}
                      <button
                        onClick={() => toggleTranslation(msg.id)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                          showTranslation[msg.id]
                            ? 'bg-[#D4AF37] text-white'
                            : isDark ? 'bg-white/10 text-white/40 hover:bg-white/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={isEn ? 'Translate' : 'ترجم'}
                      >
                        <Globe className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`px-4 py-3 border-t ${isDark ? 'bg-[#111827] border-white/10' : 'bg-white border-[#E6DCC8]'}`}>
          <div className="flex items-center gap-2">
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={isEn ? 'Type a message...' : 'اكتب رسالة...'}
              className={`flex-1 px-4 py-3 rounded-2xl border-[3px] text-sm ${
                isDark
                  ? 'bg-white/8 border-white/10 text-white placeholder:text-white/30'
                  : 'bg-[#F5EEE1] border-gray-200/60 text-[#1F3D2B] placeholder:text-[#1F3D2B]/30'
              }`}
              style={{ fontFamily: font }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={!newMsg.trim() || isSending}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B5BFE] to-[#2845C7] text-white flex items-center justify-center disabled:opacity-40 shadow-lg"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 -rotate-45" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Conversations List ───
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0B1120]' : 'bg-[#F5EEE1]'}`} dir="rtl">
      {/* Header */}
      <div className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 border-b ${
        isDark ? 'bg-[#0B1120]/90 backdrop-blur-xl border-white/10' : 'bg-[#F5EEE1]/90 backdrop-blur-xl border-[#E6DCC8]'
      }`}>
        <button onClick={onBack} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-white'}`}>
          <ChevronLeft className={`w-5 h-5 rotate-180 ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`} />
        </button>
        <div className="flex-1">
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`} style={{ fontFamily: font }}>
            {isEn ? 'Messages' : 'الرسائل'}
          </h2>
        </div>
        <Icon3D icon={MessageCircle} theme="blue" size="sm" hoverable={false} />
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mx-auto mb-4">
              <Icon3D icon={MessageCircle} theme="blue" size="xl" hoverable={false} />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`} style={{ fontFamily: font }}>
              {isEn ? 'No conversations yet' : 'لا توجد محادثات بعد'}
            </h3>
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`} style={{ fontFamily: font }}>
              {isEn
                ? 'Start chatting with providers from the services page'
                : 'ابدأ بالتواصل مع المزودين من صفحة الخدمات'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {conversations.map((convo, idx) => (
              <motion.button
                key={convo.conversation_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => openChat(convo)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border-[4px] ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-white border-gray-200/60 hover:border-gray-300'
                }`}
                style={{ backdropFilter: isDark ? 'blur(20px) saturate(180%)' : undefined }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B5BFE] to-[#D4AF37] flex items-center justify-center overflow-hidden">
                    {convo.other_user.avatar_url ? (
                      <ImageWithFallback src={convo.other_user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">{(convo.other_user.full_name?.[0] || 'U').toUpperCase()}</span>
                    )}
                  </div>
                  {convo.unread > 0 && (
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-[#3B5BFE] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{convo.unread}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`} style={{ fontFamily: font }}>
                      {convo.other_user.full_name}
                    </h4>
                    <span className={`text-[10px] flex-shrink-0 ${isDark ? 'text-white/30' : 'text-[#1F3D2B]/30'}`}>
                      {convo.updated_at ? formatTime(convo.updated_at) : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${
                    convo.unread > 0
                      ? isDark ? 'text-white font-semibold' : 'text-[#1F3D2B] font-semibold'
                      : isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'
                  }`} style={{ fontFamily: font }}>
                    {convo.last_message || (isEn ? 'No messages' : 'لا رسائل')}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}