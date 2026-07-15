import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Send, ArrowLeft, Bot, User, Sparkles, MessageSquare, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AiChatProps {
  onBack: () => void;
}

export function AiChat({ onBack }: AiChatProps) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = {
    title: {
      en: 'Sari — AI Herbalist',
      nl: 'Sari — AI Kruidendeskundige',
      id: 'Sari — Herbalis AI'
    },
    subtitle: {
      en: 'Ask me about herbal benefits & ingredients',
      nl: 'Vraag mij naar kruidenvoordelen & ingrediënten',
      id: 'Tanyakan manfaat herbal & tanaman obat'
    },
    placeholder: {
      en: 'Type a message...',
      nl: 'Typ een bericht...',
      id: 'Ketik pesan...'
    },
    suggestedTitle: {
      en: 'Suggested Questions:',
      nl: 'Voorgestelde Vragen:',
      id: 'Saran Pertanyaan:'
    },
    suggestions: {
      en: [
        'What are the benefits of Lemongrass?',
        'Tell me about the Royal Body Scrub.',
        'Why should I use a warm Javanese compress?',
        'Is there any warnings for massage oil?'
      ],
      nl: [
        'Wat zijn de voordelen van citroengras?',
        'Vertel me over de Royal Body Scrub.',
        'Waarom een warm Javaans kruidenstempel?',
        'Zijn er waarschuwingen voor massageolie?'
      ],
      id: [
        'Apa saja khasiat minyak atsiri Serai?',
        'Jelaskan tentang Lulur Cendana Melati.',
        'Kenapa harus menggunakan kompres hangat?',
        'Adakah peringatan untuk minyak pijat?'
      ]
    },
    welcome: {
      en: 'Greetings! I am Sari, your traditional Javanese Herbalist. Ask me any question about the benefits of our herbs, ingredients, traditional massages, or therapeutic compresses.',
      nl: 'Gegroet! Ik ben Sari, uw traditionele Javaanse kruidendeskundige. Vraag me alles over onze kruiden, ingrediënten, traditionele massages of therapeutische compressen.',
      id: 'Rahayu! Saya Sari, ahli herbal tradisional Jawa Anda. Silakan tanyakan apa saja tentang khasiat rempah, bahan lulur, pijat tradisional, atau kompres hangat kami.'
    },
    typing: {
      en: 'Sari is reading ancient scrolls...',
      nl: 'Sari raadpleegt oude geschriften...',
      id: 'Sari sedang membaca serat kuno...'
    },
    errorResponse: {
      en: 'My sincere apologies, but I am currently unable to access the herbal archives or generate a response. Please ask me again in a short moment, or consult our therapeutic remedies directly.',
      nl: 'Mijn oprechte excuses, maar ik kan momenteel geen verbinding maken met onze kruidenkennis om u te antwoorden. Probeer het over een ogenblik nogmaals of bekijk direct onze producten.',
      id: 'Mohon maaf yang sebesar-besarnya, saat ini saya tidak dapat mengakses catatan herbal kuno atau memberikan jawaban. Silakan coba tanyakan kembali beberapa saat lagi.'
    }
  };

  const getTranslation = (obj: any) => {
    return obj[language] || obj['en'];
  };

  useEffect(() => {
    setMessages([
      {
        role: 'model',
        text: getTranslation(t.welcome)
      }
    ]);
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend) {
      setInput('');
    }

    const newUserMessage: Message = { role: 'user', text: query };
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      // Map history to server's expected format
      const historyPayload = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setMessages(prev => [...prev, { role: 'model', text: data.text }]);
        } else {
          setMessages(prev => [...prev, { role: 'model', text: getTranslation(t.errorResponse) }]);
        }
      } else {
        try {
          const errData = await res.json();
          console.error('Gemini error response:', errData);
        } catch (_) {}
        setMessages(prev => [...prev, { role: 'model', text: getTranslation(t.errorResponse) }]);
      }
    } catch (err) {
      console.error('Network or chat error:', err);
      setMessages(prev => [...prev, { role: 'model', text: getTranslation(t.errorResponse) }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[380px] text-royal-green font-sans" id="ai-chat-window">
      {/* Header with Back button */}
      <div className="flex items-center space-x-2 pb-2 border-b border-gold/10">
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-gold/10 rounded-full transition-colors text-gold-dark cursor-pointer"
          id="ai-chat-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-grow">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-leaf-green"></span>
            </span>
            <h4 className="font-serif text-sm font-bold leading-none">
              {getTranslation(t.title)}
            </h4>
          </div>
          <p className="text-[9px] font-mono text-gold-dark tracking-wide uppercase mt-0.5">
            {getTranslation(t.subtitle)}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto py-3 space-y-3.5 pr-1 scrollbar-thin scrollbar-thumb-gold/20" id="ai-messages-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`p-1.5 rounded-full flex-shrink-0 ${
              msg.role === 'user' 
                ? 'bg-gold/20 text-gold-dark' 
                : 'bg-royal-green/10 text-royal-green'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-royal-green text-cream rounded-tr-none shadow-sm'
                : 'bg-stone-50 border border-gold/10 text-royal-green rounded-tl-none shadow-xs'
            }`}>
              {msg.text.split('\n').map((line, lIdx) => (
                <p key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="p-1.5 rounded-full bg-royal-green/10 text-royal-green flex-shrink-0 animate-spin">
              <Loader2 className="w-3.5 h-3.5" />
            </div>
            <div className="bg-stone-50 border border-gold/10 rounded-2xl rounded-tl-none p-3 text-xs text-royal-green/60 italic flex items-center space-x-1.5">
              <span>{getTranslation(t.typing)}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips (Only shown when messages contain only the welcome message) */}
      {messages.length === 1 && !isTyping && (
        <div className="py-2 border-t border-gold/5" id="ai-chat-suggestions">
          <p className="text-[10px] font-mono uppercase text-gold-dark font-bold mb-1.5">
            {getTranslation(t.suggestedTitle)}
          </p>
          <div className="flex flex-wrap gap-1.5 animate-fade-in">
            {getTranslation(t.suggestions).map((sug: string, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(sug)}
                className="text-[10px] text-left py-1.5 px-2.5 rounded-lg bg-stone-50 border border-gold/15 hover:border-gold/30 hover:bg-gold/5 transition-all text-royal-green cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 border-t border-gold/10 flex items-center space-x-2 animate-fade-in"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={getTranslation(t.placeholder)}
          className="flex-grow bg-stone-50 border border-gold/20 rounded-xl px-3 py-2 text-xs text-royal-green placeholder-royal-green/40 focus:outline-none focus:border-gold"
          id="ai-chat-input"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-2 bg-royal-green text-gold hover:bg-leaf-green hover:text-cream disabled:bg-stone-100 disabled:text-stone-300 rounded-xl transition-colors shadow-sm flex items-center justify-center cursor-pointer"
          id="ai-chat-send-btn"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
