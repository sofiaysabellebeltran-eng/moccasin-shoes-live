import { useState, useRef, useEffect } from "react";

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Uy, hi! 👋 Kai here. Questions about the shoes, the apps, or the bundle? Ask away!' }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory })
      });
      
      const data = await res.json();
      
      if (res.ok && data.reply) {
        setMessages([...newHistory, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newHistory, { role: 'assistant', content: `System Error: ${data.error || 'Backend is awake, but AI failed.'}` }]);
      }
    } catch (err: any) {
      setMessages([...newHistory, { role: 'assistant', content: "Network Error: The backend server is asleep or unreachable. (It takes 50 seconds to wake up on the free tier). Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white border border-black/10 shadow-2xl rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs">Moccasin AI Concierge</h3>
              <p className="text-[10px] text-green-400 mt-1">● Kai is online</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[85%] ${m.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white border border-gray-200 rounded-tl-none shadow-sm'}`}>
                  {m.content.replace(/\*/g, '')}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs animate-pulse">Kai is typing...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
              />
              <button type="submit" disabled={loading} className="bg-black text-white px-4 py-2 rounded text-sm font-bold disabled:opacity-50">Send</button>
            </form>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      </button>
    </div>
  );
}
