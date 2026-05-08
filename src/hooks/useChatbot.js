import { useState, useCallback, useRef } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';
import { CHAT_MAX_MESSAGES } from '../utils/constants';

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const MODEL = 'Qwen/Qwen3-1.7B:featherless-ai';
const API_URL = 'https://router.huggingface.co/v1/chat/completions';
const STORAGE_KEY = 'mission_ai_chat_history';

export function useChatbot() {
  const [messages, setMessages] = useState(() => getItem(STORAGE_KEY, []));
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const saveMessages = useCallback((msgs) => {
    const trimmed = msgs.slice(-CHAT_MAX_MESSAGES);
    setItem(STORAGE_KEY, trimmed);
  }, []);

  const sendMessage = useCallback(async (userMessage, dashboardContext) => {
    const userMsg = { role: 'user', content: userMessage, timestamp: Date.now() };
    setMessages((prev) => {
      const next = [...prev, userMsg];
      saveMessages(next);
      return next;
    });
    setIsTyping(true);
    setError(null);

    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // 30s timeout
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const systemPrompt = `You are Mission AI, an assistant for the ISS & News dashboard.
Answer ONLY using the data below. If asked about anything else, respond:
"I can only answer questions about the ISS tracking data or news on this dashboard."
Be concise, friendly, and use the data accurately.

DASHBOARD DATA:
${dashboardContext}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 400,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`HF API ${response.status}: ${err}`);
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      const aiMsg = { role: 'assistant', content: aiContent, timestamp: Date.now() };
      setMessages((prev) => {
        const next = [...prev, aiMsg];
        saveMessages(next);
        return next;
      });
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message);
      }
      const errMsg = {
        role: 'assistant',
        content: err.name === 'AbortError'
          ? 'Request timed out. Please try again.'
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => {
        const next = [...prev, errMsg];
        saveMessages(next);
        return next;
      });
    } finally {
      clearTimeout(timeout);
      setIsTyping(false);
    }
  }, [saveMessages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    removeItem(STORAGE_KEY);
  }, []);

  return { messages, isTyping, error, sendMessage, clearHistory };
}

export function buildContext(iss, news) {
  return `
ISS LIVE DATA:
  Latitude: ${iss.position?.lat?.toFixed(4) ?? 'N/A'}°
  Longitude: ${iss.position?.lng?.toFixed(4) ?? 'N/A'}°
  Speed: ${iss.speed?.toFixed(1) ?? 'N/A'} km/h
  Altitude: 408 km
  Nearest Location: ${iss.nearestPlace || 'N/A'}
  Tracked Points: ${iss.positions?.length ?? 0}
  Crew Onboard: ${iss.astronauts?.number ?? 'N/A'}
  Crew Names: ${iss.astronauts?.people?.map((p) => `${p.name} (${p.craft})`).join(', ') || 'N/A'}

NEWS HEADLINES (top 10):
${(news || []).slice(0, 10).map((a, i) => `${i + 1}. [${a.source?.name}] ${a.title}`).join('\n')}
`;
}

export default useChatbot;
