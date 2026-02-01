"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.output }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mt-10">Fyndmate AI</h1>
      <p className="text-gray-500 mb-8">Your Indian Shopping & Style Buddy</p>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg flex-1 overflow-y-auto p-4 mb-4 space-y-4 border border-gray-200">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm italic">Fyndmate is thinking...</div>}
      </div>

      <div className="w-full max-w-2xl flex gap-2">
        <input 
          className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Fyndmate to find products or design a dress..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
          Send
        </button>
      </div>
    </main>
  );
}
