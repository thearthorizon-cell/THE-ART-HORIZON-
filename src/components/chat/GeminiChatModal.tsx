import React, { useState, useRef, useEffect } from 'react';
import { buildApiUrl } from '../../context/StudioContext';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  Zap,
  Cpu,
  Brain,
  MessageSquare,
  ChevronDown,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModelKey = 'gemini-4-hydrogen' | 'gemini-3.1-flash-lite';
type RoleKey = 'general' | 'placement' | 'critique';

const MODEL_OPTIONS: Array<{
  id: ModelKey;
  name: string;
  tag: string;
  icon: typeof Sparkles;
  description: string;
}> = [
  {
    id: 'gemini-4-hydrogen',
    name: 'Gemini 4 Flash',
    tag: 'Balanced (Default)',
    icon: Sparkles,
    description: 'Fast, balanced & intelligent for admissions, syllabus & art queries',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tag: 'Fast Responses',
    icon: Zap,
    description: 'Lightweight & instant answers for quick questions',
  },
];

const ROLE_OPTIONS: Array<{
  id: RoleKey;
  label: string;
  description: string;
}> = [
  {
    id: 'general',
    label: 'Studio Advisor',
    description: 'General questions, commissions, location & admissions',
  },
  {
    id: 'placement',
    label: 'Course & Batch Guide',
    description: 'Ages 6–15, 3 levels, Max 4–5 Students & 1-on-1 options',
  },
  {
    id: 'critique',
    label: 'Art Technique Mentor',
    description: 'Loomis anatomy, shading values, charcoal & oil painting',
  },
];

const STARTER_PROMPTS = [
  'Which level is right for my 7-year-old child (Beginner, Intermediate, or Advanced)?',
  'How do 1-on-1 private Zoom classes work and what is the fee difference?',
  'What mediums are available for custom portraits (acrylic, oil, watercolor)?',
  'What supplies do we need for international Zoom classes in the US / UK / UAE?',
];

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Namaste! Welcome to The Art Horizon. I am your Gemini AI Art Advisor, here to guide you through Vikas Gothi’s fine art academy, our live Zoom online classes for ages 6–15 (Max 4–5 Students per batch with 3 levels), 1-on-1 private classes, and custom portrait commissions in all mediums.\n\nHow can I help you today?',
      timestamp: 'Just now',
      modelUsed: 'gemini-4-hydrogen',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelKey>('gemini-4-hydrogen');
  const [selectedRole, setSelectedRole] = useState<RoleKey>('general');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build history for the multi-turn API
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch(buildApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          model: selectedModel,
          role: selectedRole,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const modelMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Thank you for your enquiry. We would love to discuss this with you!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Failed to send chat message:', error);
      const fallbackMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'Thank you for reaching out to The Art Horizon! If you need immediate assistance or would like to discuss admissions and commissions right away, please connect with master artist Vikas Gothi directly on WhatsApp at +91 99818 83598.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: 'Chat restarted. How can I assist you with The Art Horizon courses, international online batches, or portrait commissions?',
        timestamp: 'Just now',
        modelUsed: selectedModel,
      },
    ]);
  };

  const activeModelObj = MODEL_OPTIONS.find((m) => m.id === selectedModel) || MODEL_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-stone-200 w-full max-w-2xl h-[90vh] sm:h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-stone-900 via-[#1E1B18] to-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D82828] to-amber-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                  The Art Horizon AI Advisor
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Gemini Powered
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Online Classes (Ages 6-15) • Commissions (All Mediums) • Atelier Guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              title="Reset Conversation"
              className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Control Bar: Role & Model Selector */}
        <div className="bg-white border-b border-stone-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Role Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider mr-1">
              Role:
            </span>
            {ROLE_OPTIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedRole === r.id
                    ? 'bg-[#D82828] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
                title={r.description}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1 rounded-lg text-xs font-medium border border-stone-200 transition-colors"
            >
              <activeModelObj.icon className="w-3.5 h-3.5 text-[#D82828]" />
              <span>{activeModelObj.name}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5 z-20 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Select Gemini Model
                </div>
                {MODEL_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                      selectedModel === m.id ? 'bg-[#D82828]/10 text-[#D82828]' : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <m.icon className="w-4 h-4 mt-0.5 shrink-0 text-[#D82828]" />
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span>{m.name}</span>
                        <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded-full font-normal">
                          {m.tag}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{m.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs ${
                    isUser
                      ? 'bg-stone-900 text-white'
                      : 'bg-gradient-to-tr from-[#D82828] to-amber-500 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-stone-900 text-white rounded-tr-none shadow-xs'
                        : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div
                    className={`flex items-center gap-2 text-[10px] text-stone-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && !isUser && (
                      <span className="font-mono text-[9px] text-[#D82828] bg-rose-50 px-1.5 py-0.2 rounded">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D82828] to-amber-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl rounded-tl-none text-xs text-stone-500 flex items-center gap-2 shadow-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-[#D82828] animate-bounce" />
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium text-stone-600">Generating reply via {selectedModel}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-stone-200/60 bg-white/60">
            <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">
              Suggested questions:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] bg-white border border-stone-200 hover:border-[#D82828] hover:text-[#D82828] text-stone-700 px-3 py-1 rounded-full transition-all text-left shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about online classes, batch placement, 1-on-1 sessions, or commissions..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-2xl focus:outline-none focus:border-[#D82828] focus:bg-white transition-all"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-[#D82828] to-amber-600 hover:opacity-95 disabled:opacity-40 text-white p-3 rounded-2xl transition-all shadow-md active:scale-95 shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-2 px-1">
            <span>The Art Horizon • Indore & Worldwide Zoom Atelier</span>
            <span>WhatsApp: +91 99818 83598</span>
          </div>
        </div>
      </div>
    </div>
  );
};
