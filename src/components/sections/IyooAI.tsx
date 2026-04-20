import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Music, Shirt, Gavel, BookOpen, Zap, PenTool, Hash, RefreshCcw, Trash2 } from 'lucide-react';
import { iyooAI } from '@/services/aiService';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
  id: string;
  toolUsed?: string;
}

const TOOLS = [
  { id: 'verse', icon: Music, label: 'Verse Gen', prompt: 'Write me a verse with my name: ' },
  { id: 'prophecy', icon: Sparkles, label: 'Prophecy', prompt: 'Tell my destiny, my name is: ' },
  { id: 'verdict', icon: Gavel, label: 'Street Verdict', prompt: 'Jeriq, judge this situation: ' },
  { id: 'decode', icon: BookOpen, label: 'Decode Bars', prompt: 'Explain these lyrics: ' },
  { id: 'outfit', icon: Shirt, label: 'Outfit Gen', prompt: 'What should I wear to: ' },
  { id: 'mood', icon: Zap, label: 'Beat Mood', prompt: 'I feel like this: ' },
  { id: 'flow', icon: Hash, label: 'Flow Analysis', prompt: 'Judge my lyrics: ' },
  { id: 'write', icon: PenTool, label: 'Write With Me', prompt: 'Start a song with me, here is my first bar: ' },
];

export default function IyooAI() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('iyoo_chat_history');
    return saved ? JSON.parse(saved) : [
      { 
        role: 'model', 
        content: "OGBE!!! IYOO!!! I'm the digital twin of Jeriq. The hussle never stops. What's the word on the street?", 
        id: 'welcome' 
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRequestTime = useRef<number>(0);

  useEffect(() => {
    // Audit fix: Limit local storage size to prevent browser crash/limit hit
    const historyToSave = messages.slice(-20); // Only keep last 20 messages
    localStorage.setItem('iyoo_chat_history', JSON.stringify(historyToSave));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    if (!input.trim() && !customPrompt) return;

    // Audit fix: Simple client-side rate limit (3 seconds between requests)
    const now = Date.now();
    if (now - lastRequestTime.current < 3000) {
      alert("IYOO!!! The hussle takes a second. Slow down.");
      return;
    }
    lastRequestTime.current = now;

    const userMessage = customPrompt ? customPrompt + input : input;
    const newMessage: Message = { role: 'user', content: userMessage, id: Date.now().toString() };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const id = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { role: 'model', content: '...', id }]);

    try {
      const resp = await iyooAI.chat(userMessage, history);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, content: resp.text || "IYOO!!! Signal lost in the hussle. Go again." } : m));
    } catch (err: any) {
      console.error("IYOO AI CHAT ERROR:", err);
      // Log more details if available
      if (err.message) console.error("Error Message:", err.message);
      
      setMessages(prev => prev.map(m => m.id === id ? { ...m, content: `IYOO!!! Signal lost: ${err.message || "Unknown error"}. Go again.` } : m));
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ 
      role: 'model', 
      content: "OGBE!!! IYOO!!! I'm back. Let's start the hussle fresh.", 
      id: Date.now().toString() 
    }]);
  };

  return (
    <section id="ai" className="min-h-screen bg-brand-black flex flex-col pt-32 pb-12 px-6">
      <div className="max-w-4xl w-full mx-auto flex flex-col h-[80vh] glass-card rounded-3xl overflow-hidden border-brand-blue/20">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-brand-black/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center font-display text-2xl text-white shadow-[0_0_20px_rgba(26,71,184,0.5)]">
                IC
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-brand-black" />
            </div>
            <div>
              <h3 className="text-xl font-display tracking-widest text-white">IYOO AI</h3>
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">The Digital Hussla • Online</p>
            </div>
          </div>
          <button onClick={clearChat} className="p-2 text-white/20 hover:text-red-500 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col max-w-[80%]",
                  msg.role === 'user' ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "px-6 py-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-brand-grey border border-white/5 text-white/90" 
                    : "bg-brand-blue/10 border border-brand-blue/30 text-white shadow-[0_0_15px_rgba(26,71,184,0.15)] glow-text"
                )}>
                  {msg.content}
                </div>
                <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] mt-2 px-2">
                  {msg.role === 'model' ? 'Iyoo AI' : 'Member'}
                </span>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-4 text-brand-blue-glow"
              >
                <RefreshCcw className="animate-spin" size={16} />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Jeriq is thinking...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Tools Hub */}
        <div className="p-4 bg-brand-black/30 border-t border-white/5 flex gap-3 overflow-x-auto hide-scrollbar">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleSend(tool.prompt)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-brand-blue/50 hover:bg-brand-blue/10 transition-all text-white/60 hover:text-brand-blue"
            >
              <tool.icon size={14} />
              <span className="text-[10px] font-bold tracking-widest uppercase">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-brand-black/50 border-t border-white/10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Talk to the Hussla..."
              maxLength={500}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-blue transition-all"
            />
            <button
              disabled={isLoading || !input.trim()}
              className="bg-brand-blue hover:bg-brand-blue-glow disabled:opacity-50 text-white p-4 rounded-xl transition-all shadow-[0_0_20px_rgba(26,71,184,0.3)]"
            >
              <Send size={24} />
            </button>
          </form>
        </div>

      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] tracking-[0.5em] text-white/20 uppercase italic">
          "The AI is Jeriq. The Jeriq is AI. OGBE!!!"
        </p>
      </div>
    </section>
  );
}
