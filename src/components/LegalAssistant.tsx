import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  Trash2, 
  Info,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '../utils';
import { legalChat } from '../services/groqService';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const LegalAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your LexisManage Legal Assistant. How can I help you with your contracts or legal queries today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await legalChat(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "An error occurred. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: "Hello! I'm your LexisManage Legal Assistant. How can I help you with your contracts or legal queries today?" }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] flex flex-col space-y-4 px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
            Legal AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Ask questions about contracts, legal terms, or best practices.</p>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex space-x-3 sm:space-x-4 max-w-[90%] sm:max-w-[85%]",
                  message.role === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] sm:text-xs font-bold",
                  message.role === 'model' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                )}>
                  {message.role === 'model' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm",
                  message.role === 'model' 
                    ? "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none prose prose-slate prose-sm max-w-none" 
                    : "bg-blue-600 text-white rounded-tr-none"
                )}>
                  {message.role === 'model' ? (
                    <Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex space-x-3 sm:space-x-4 max-w-[90%] sm:max-w-[85%]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-700">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a legal question..." 
                className="w-full pl-4 pr-12 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:space-x-4">
            <p className="text-[9px] sm:text-[10px] text-slate-400 flex items-center text-center">
              <Info className="w-3 h-3 mr-1 shrink-0" />
              AI-generated content should be reviewed by legal counsel.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grounded with</span>
              <div className="flex items-center text-[9px] sm:text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                <Search className="w-2.5 h-2.5 mr-1" />
                Web Search
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Queries */}
      <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap gap-2 no-scrollbar">
        {[
          "What is an Indemnity clause under Ghana law?",
          "Review standard NDA terms for Ghana",
          "Explain Force Majeure in Ghanaian contracts",
          "Best practices for SaaS MSAs in West Africa"
        ].map((query, i) => (
          <button 
            key={i}
            onClick={() => setInput(query)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-700 transition-all shadow-sm"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};
