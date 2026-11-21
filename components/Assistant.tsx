import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChatMessage, StudyStep } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface AssistantProps {
  currentStep: StudyStep;
  passageContext: string;
}

const Assistant: React.FC<AssistantProps> = ({ currentStep, passageContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: `Welcome to the ${currentStep.toLowerCase()} phase. How can I help you dig deeper into the text?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when step changes to provide context-relevant welcome
  useEffect(() => {
    let welcomeMsg = "";
    switch(currentStep) {
        case StudyStep.OBSERVATION: welcomeMsg = "I'm ready for Observation. Remember: Ask Who, What, Where, When. Do NOT interpret yet!"; break;
        case StudyStep.INTERPRETATION: welcomeMsg = "Moving to Interpretation. Let's explore the historical background (BRI) and ask 'Why?'."; break;
        case StudyStep.APPLICATION: welcomeMsg = "Application time. Let's find Timeless Truths and apply them to the 7 spheres of society."; break;
        case StudyStep.CHARTING: welcomeMsg = "Let's structure the book. Need help with paragraph titles or identifying themes?"; break;
    }
    setMessages([{ id: Date.now().toString(), role: 'model', text: welcomeMsg }]);
  }, [currentStep]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(
          [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
          currentStep,
          passageContext
      );
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: error instanceof Error ? error.message : 'The AI request failed. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl w-full md:w-80 lg:w-96">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-100 p-1.5 rounded-full">
            <Sparkles size={16} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">IBS Assistant</h3>
            <p className="text-xs text-slate-500 capitalize">{currentStep.toLowerCase()} Mode</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this passage..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;