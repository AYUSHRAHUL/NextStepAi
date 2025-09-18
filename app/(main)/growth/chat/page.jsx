// "use client";

// import React from "react";
// import { useState, useRef, useEffect } from "react";
// import { growthChat, createNewSession } from "@/actions/growth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { RotateCcw, MessageSquare, Mic, Square, Volume2, Bot, User } from "lucide-react";

// export default function GrowthChatPage() {
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content:
//         "Hi! I'm your Growth Coach. What is your next career goal? (e.g., role, industry, skills to learn)",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const listRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [supportsSTT, setSupportsSTT] = useState(false);
//   const [supportsTTS, setSupportsTTS] = useState(false);
//   const [speakReplies, setSpeakReplies] = useState(true);
//   const isSpeakingRef = useRef(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const selectedVoiceRef = useRef(null);
//   const coreRef = useRef(null);
//   const sceneRef = useRef(null);
//   const [particles, setParticles] = useState([]);

//   // Initialize session on component mount
//   useEffect(() => {
//     const initializeSession = async () => {
//       const newSessionId = await createNewSession();
//       setSessionId(newSessionId);
//     };
//     initializeSession();
//   }, []);

//   // Feature detection for Speech Recognition and Speech Synthesis
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       setSupportsSTT(true);
//       const recognition = new SpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = navigator.language || "en-US";
//       recognitionRef.current = recognition;
//     }

//     if ("speechSynthesis" in window) {
//       setSupportsTTS(true);
//       // Attempt early voice load; some browsers load asynchronously
//       const loadVoices = () => {
//         const voices = window.speechSynthesis.getVoices?.() || [];
//         if (voices.length) {
//           // Prefer a natural voice for current locale if available
//           const lang = (navigator.language || "en-US").slice(0, 2);
//           const preferredOrder = [
//             /neural/i,
//             /natural/i,
//             /(Microsoft|Google)/i,
//           ];
//           const byLocale = voices.filter(v => v.lang?.startsWith(lang));
//           let chosen = byLocale[0] || voices[0] || null;
//           for (const pattern of preferredOrder) {
//             const match = byLocale.find(v => pattern.test(v.name));
//             if (match) { chosen = match; break; }
//           }
//           selectedVoiceRef.current = chosen;
//         }
//       };
//       loadVoices();
//       window.speechSynthesis.onvoiceschanged = loadVoices;
//     }

//     return () => {
//       try {
//         recognitionRef.current?.stop?.();
//       } catch (_) {}
//       if (typeof window !== "undefined" && window.speechSynthesis) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
//   }, [messages]);

//   // Create animated particles like JARVIS background
//   useEffect(() => {
//     const total = 48;
//     const created = Array.from({ length: total }).map(() => {
//       return {
//         leftVw: Math.random() * 100,
//         topVh: Math.random() * 85,
//         sizePx: 2 + Math.random() * 2,
//         delaySec: Math.random() * 16,
//         color: Math.random() > 0.5 ? "#00fff7cc" : "#a3dfffdd",
//         opacity: 0.5 + Math.random() * 0.4,
//       };
//     });
//     setParticles(created);
//   }, []);

//   // 3D tilt interaction for the core visualizer
//   useEffect(() => {
//     const scene = sceneRef.current;
//     const core = coreRef.current;
//     if (!scene || !core) return;
//     const onMove = (e) => {
//       const rect = core.getBoundingClientRect();
//       const x = e.clientX - rect.left - rect.width / 2;
//       const y = e.clientY - rect.top - rect.height / 2;
//       core.style.transform = `rotateY(${x / 18}deg) rotateX(${-y / 22}deg) scale(1.03)`;
//     };
//     const onLeave = () => {
//       core.style.transform = "";
//     };
//     scene.addEventListener("mousemove", onMove);
//     scene.addEventListener("mouseleave", onLeave);
//     return () => {
//       scene.removeEventListener("mousemove", onMove);
//       scene.removeEventListener("mouseleave", onLeave);
//     };
//   }, []);

//   // TTS helpers for more natural speech and turn-taking
//   const stopSpeaking = () => {
//     if (typeof window === "undefined" || !window.speechSynthesis) return;
//     try {
//       window.speechSynthesis.cancel();
//     } catch (_) {}
//     isSpeakingRef.current = false;
//     setIsSpeaking(false);
//   };

//   const speakText = async (text) => {
//     if (!supportsTTS) return;
//     if (!text) return;
//     stopSpeaking();
//     isSpeakingRef.current = true;
//     setIsSpeaking(true);
//     const chunks = text
//       .split(/([.!?]\s+)/)
//       .reduce((acc, part, i, arr) => {
//         if (i % 2 === 0) {
//           const sentence = part + (arr[i + 1] || "");
//           const trimmed = sentence.trim();
//           if (trimmed) acc.push(trimmed);
//         }
//         return acc;
//       }, []);

//     for (const chunk of chunks) {
//       if (!isSpeakingRef.current) break;
//       await new Promise((resolve) => {
//         const utterance = new SpeechSynthesisUtterance(chunk);
//         utterance.rate = 1.0;
//         utterance.pitch = 1.0;
//         utterance.lang = navigator.language || "en-US";
//         if (selectedVoiceRef.current) utterance.voice = selectedVoiceRef.current;
//         utterance.onend = () => setTimeout(resolve, 120); // small natural pause
//         utterance.onerror = () => setTimeout(resolve, 120);
//         try { window.speechSynthesis.speak(utterance); } catch (_) { resolve(); }
//       });
//     }
//     isSpeakingRef.current = false;
//     setIsSpeaking(false);
//     // After assistant finishes speaking, auto-start listening for user's reply (hands-free)
//     if (speakReplies && supportsSTT && !isRecording) {
//       startRecording();
//     }
//   };

//   // Auto-speak assistant replies when enabled, with natural pacing
//   useEffect(() => {
//     if (!supportsTTS || !speakReplies || messages.length === 0) return;
//     const last = messages[messages.length - 1];
//     if (last.role !== "assistant") return;
//     if (typeof window === "undefined" || !window.speechSynthesis) return;
//     speakText(last.content);
//   }, [messages, speakReplies, supportsTTS]);

//   const onSend = async () => {
//     const trimmed = input.trim();
//     if (!trimmed || loading || !sessionId) return;
    
//     const userMessage = { role: "user", content: trimmed };
//     setMessages(prev => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);
    
//     try {
//       const res = await growthChat(trimmed, sessionId);
//       setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
//     } catch (e) {
//       console.error("Chat error:", e);
//       setMessages(prev => [
//         ...prev,
//         { role: "assistant", content: "Sorry, I couldn't generate a response. Please try again." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       onSend();
//     }
//   };

//   const startNewSession = async () => {
//     const newSessionId = await createNewSession();
//     setSessionId(newSessionId);
//     setMessages([
//       {
//         role: "assistant",
//         content:
//           "Hi! I'm your Growth Coach. What is your next career goal? (e.g., role, industry, skills to learn)",
//       },
//     ]);
//   };

//   const startRecording = () => {
//     if (!supportsSTT || !recognitionRef.current || isRecording) return;
//     try {
//       // Barge-in: if TTS is speaking, stop it so user can talk
//       if (isSpeakingRef.current) {
//         stopSpeaking();
//       }
//       const recognition = recognitionRef.current;
//       let finalTranscript = "";
//       recognition.onresult = (event) => {
//         // With interimResults=false, we get final results directly
//         const transcript = event.results[0][0].transcript || "";
//         finalTranscript = (finalTranscript + " " + transcript).trim();
//         setInput(finalTranscript);
//       };
//       recognition.onspeechend = () => {
//         // Stop now to fire onend and trigger auto-send
//         try { recognition.stop(); } catch (_) {}
//       };
//       recognition.onerror = () => {
//         setIsRecording(false);
//       };
//       recognition.onend = () => {
//         setIsRecording(false);
//         // Auto-send when user stops speaking and we have content
//         const trimmed = (finalTranscript || "").trim();
//         if (trimmed && !loading) {
//           setInput(trimmed);
//           setTimeout(() => onSend(), 0);
//         } else {
//           // Keep mic always on: resume listening unless currently speaking
//           if (!isSpeakingRef.current) {
//             setTimeout(() => startRecording(), 250);
//           }
//         }
//       };
//       recognition.start();
//       setIsRecording(true);
//     } catch (e) {
//       setIsRecording(false);
//     }
//   };

//   const stopRecording = () => {
//     if (!isRecording) return;
//     try {
//       recognitionRef.current?.stop?.();
//     } catch (_) {}
//     setIsRecording(false);
//   };

//   const toggleRecording = () => {
//     if (isRecording) stopRecording();
//     else startRecording();
//   };

//   // Ensure hands-free: auto-start listening when STT is available and not speaking
//   useEffect(() => {
//     if (supportsSTT && recognitionRef.current && !isRecording && !isSpeakingRef.current) {
//       startRecording();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [supportsSTT]);

//   return (
//     <div className="container mx-auto px-4 pb-24 pt-28 max-w-3xl relative">
//       <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
//       <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(#0ea5e980_1px,transparent_1px),linear-gradient(90deg,#0ea5e980_1px,transparent_1px)] [background-size:32px_32px]" />
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <h1 className="text-2xl font-semibold tracking-wider">Growth Coach</h1>
//             <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-200">
//               <Bot className="h-3.5 w-3.5" /> ROBOTIC MODE
//             </span>
//           </div>
//           <p className="text-cyan-200/70">
//             Adaptive guidance with voice. Hands-free, human-like conversation.
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border border-cyan-400/30 bg-cyan-500/10 text-cyan-100">
//             {isSpeaking ? (
//               <span className="inline-flex items-center gap-2">
//                 <span className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
//                 </span>
//                 Speaking
//               </span>
//             ) : isRecording ? (
//               <span className="inline-flex items-center gap-2">
//                 <span className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//                 </span>
//                 Listening
//               </span>
//             ) : (
//               <span className="inline-flex items-center gap-2">
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-200/40"></span>
//                 Idle
//               </span>
//             )}
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={startNewSession}
//             className="flex items-center gap-2 border-cyan-300/30 bg-cyan-500/5 text-cyan-100 hover:bg-cyan-500/10"
//           >
//             <RotateCcw className="h-4 w-4" />
//             New Chat
//           </Button>
//         </div>
//       </div>

//       {/* Jarvis-like visualizer */}
//       <div ref={sceneRef} className="relative flex items-center justify-center h-56 mb-6">
//         <div
//           ref={coreRef}
//           className={
//             "relative rounded-full w-40 h-40 shadow-[0_0_60px_8px_rgba(0,255,247,0.35)] " +
//             (isSpeaking
//               ? "bg-gradient-to-br from-cyan-300/70 to-blue-400/60"
//               : isRecording
//               ? "bg-gradient-to-br from-emerald-300/60 to-cyan-300/50"
//               : "bg-gradient-to-br from-slate-300/30 to-slate-500/20")
//           }
//           aria-label={isSpeaking ? "Speaking" : isRecording ? "Listening" : "Idle"}
//         >
//           <div className="absolute inset-0 rounded-full ring-1 ring-cyan-300/40" />
//           <div className="absolute inset-2 rounded-full ring-1 ring-cyan-400/40" />
//           <div className="absolute inset-4 rounded-full ring-1 ring-blue-400/30" />
//           <div className="absolute inset-0 rounded-full mix-blend-screen blur-xl " />
//         </div>
//         {/* Animated outer rings */}
//         <div className="pointer-events-none absolute">
//           <div className="absolute -inset-2 rounded-full border border-cyan-300/40 animate-pulse" />
//           <div className="absolute -inset-6 rounded-full border border-blue-400/30 animate-[pulse_2.8s_ease-in-out_infinite]" />
//           <div className="absolute -inset-10 rounded-full border border-cyan-200/20 animate-[pulse_3.6s_ease-in-out_infinite]" />
//         </div>
//         {/* Particles */}
//         <div className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
//           {particles.map((p, i) => (
//             <span
//               key={i}
//               className="absolute rounded-full animate-[particleMove_18s_linear_infinite]"
//               style={{
//                 left: `${p.leftVw}vw`,
//                 top: `${p.topVh}vh`,
//                 width: `${p.sizePx}px`,
//                 height: `${p.sizePx}px`,
//                 background: p.color,
//                 opacity: p.opacity,
//                 animationDelay: `${p.delaySec}s`,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       <Card className="p-4 h-[60vh] overflow-y-auto border border-cyan-400/20 bg-slate-900/40 backdrop-blur" ref={listRef}>
//         <div className="space-y-4">
//           {messages.map((m, idx) => (
//             <div key={idx} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
//               <div className={"flex items-start gap-2 max-w-[85%] " + (m.role === "user" ? "flex-row-reverse" : "")}>
//                 <div className={"mt-1 shrink-0 rounded-full p-1 " + (m.role === "user" ? "bg-indigo-500/20 text-indigo-200" : "bg-cyan-500/20 text-cyan-200")}>
//                   {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//                 </div>
//                 <div
//                   className={
//                     "rounded-xl px-3 py-2 border whitespace-pre-wrap " +
//                     (m.role === "user"
//                       ? "bg-indigo-600 text-white border-indigo-300/40"
//                       : "bg-cyan-900/40 text-cyan-100 border-cyan-300/30 font-mono tracking-wide text-[0.95rem]")
//                   }
//                 >
//                   {m.content}
//                 </div>
//               </div>
//             </div>
//           ))}
//           {loading && (
//             <div className="text-left">
//               <div className="inline-block rounded-lg px-3 py-2 border border-cyan-300/30 bg-cyan-900/30 text-cyan-100 flex items-center gap-2">
//                 <MessageSquare className="h-4 w-4 animate-pulse" />
//                 Thinking…
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>

//       <div className="mt-4 flex gap-2 items-center">
//         <Input
//           placeholder="Ask about roles, skills, roadmap, certifications, job search…"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={onKeyDown}
//           disabled={loading}
//           className="border-cyan-400/30 bg-slate-900/50 text-cyan-100 placeholder:text-cyan-200/40"
//         />
//         {supportsSTT && (
//           <Button
//             type="button"
//             variant={isRecording ? "default" : "secondary"}
//             onClick={() => {}}
//             disabled
//             className="px-3 border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
//             aria-pressed={isRecording}
//             title={"Mic always on"}
//           >
//             <Mic className="h-4 w-4" />
//           </Button>
//         )}
//         <Button onClick={onSend} disabled={loading || !input.trim()} className="border-cyan-400/30 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30">
//           {loading ? "Sending…" : "Send"}
//         </Button>
//         {supportsTTS && (
//           <Button
//             type="button"
//             variant="default"
//             onClick={() => {}}
//             disabled
//             className="px-3 border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
//             title="Speaker always on"
//           >
//             <Volume2 className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

 





"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { growthChat, createNewSession } from "@/actions/growth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RotateCcw, MessageSquare, Mic, MicOff, Volume2, VolumeX, Bot, User } from "lucide-react";

export default function GrowthChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Growth Coach. What is your next career goal? (e.g., role, industry, skills to learn)",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const listRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [supportsSTT, setSupportsSTT] = useState(false);
  const [supportsTTS, setSupportsTTS] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const isSpeakingRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const selectedVoiceRef = useRef(null);
  const coreRef = useRef(null);
  const sceneRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isListening, setIsListening] = useState(true);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef("");

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      const newSessionId = await createNewSession();
      setSessionId(newSessionId);
    };
    initializeSession();
  }, []);

  // Feature detection for Speech Recognition and Speech Synthesis
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupportsSTT(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || "en-US";
      recognitionRef.current = recognition;
    }

    if ("speechSynthesis" in window) {
      setSupportsTTS(true);
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices?.() || [];
        if (voices.length) {
          const lang = (navigator.language || "en-US").slice(0, 2);
          const preferredOrder = [/neural/i, /natural/i, /(Microsoft|Google)/i];
          const byLocale = voices.filter(v => v.lang?.startsWith(lang));
          let chosen = byLocale[0] || voices[0] || null;
          for (const pattern of preferredOrder) {
            const match = byLocale.find(v => pattern.test(v.name));
            if (match) { chosen = match; break; }
          }
          selectedVoiceRef.current = chosen;
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch (_) {}
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Create animated particles
  useEffect(() => {
    const total = 48;
    const created = Array.from({ length: total }).map(() => {
      return {
        leftVw: Math.random() * 100,
        topVh: Math.random() * 85,
        sizePx: 2 + Math.random() * 2,
        delaySec: Math.random() * 16,
        color: Math.random() > 0.5 ? "#00fff7cc" : "#a3dfffdd",
        opacity: 0.5 + Math.random() * 0.4,
      };
    });
    setParticles(created);
  }, []);

  // 3D tilt interaction for the core visualizer
  useEffect(() => {
    const scene = sceneRef.current;
    const core = coreRef.current;
    if (!scene || !core) return;
    const onMove = (e) => {
      const rect = core.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      core.style.transform = `rotateY(${x / 18}deg) rotateX(${-y / 22}deg) scale(1.03)`;
    };
    const onLeave = () => {
      core.style.transform = "";
    };
    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    return () => {
      scene.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // TTS helpers
  const stopSpeaking = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
    isSpeakingRef.current = false;
    setIsSpeaking(false);
  };

  const speakText = async (text) => {
    if (!supportsTTS || !speakReplies || !text) return;
    stopSpeaking();
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    
    const chunks = text
      .split(/([.!?]\s+)/)
      .reduce((acc, part, i, arr) => {
        if (i % 2 === 0) {
          const sentence = part + (arr[i + 1] || "");
          const trimmed = sentence.trim();
          if (trimmed) acc.push(trimmed);
        }
        return acc;
      }, []);

    for (const chunk of chunks) {
      if (!isSpeakingRef.current) break;
      await new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = navigator.language || "en-US";
        if (selectedVoiceRef.current) utterance.voice = selectedVoiceRef.current;
        utterance.onend = () => setTimeout(resolve, 120);
        utterance.onerror = () => setTimeout(resolve, 120);
        try { window.speechSynthesis.speak(utterance); } catch (_) { resolve(); }
      });
    }
    
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    
    // Resume listening after speaking
    if (supportsSTT && isListening && !isRecording) {
      setTimeout(() => startListening(), 500);
    }
  };

  // Auto-speak assistant replies
  useEffect(() => {
    if (!supportsTTS || !speakReplies || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role !== "assistant") return;
    speakText(last.content);
  }, [messages, speakReplies, supportsTTS]);

  // Process and send message automatically
  const processAndSend = async (transcript) => {
    if (!transcript || loading || !sessionId) return;
    
    const userMessage = { role: "user", content: transcript };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      const res = await growthChat(transcript, sessionId);
      setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
    } catch (e) {
      console.error("Chat error:", e);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't generate a response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Speech recognition with auto-send functionality
  const startListening = () => {
    if (!supportsSTT || !recognitionRef.current || isRecording || !isListening) return;
    
    try {
      // Stop TTS if speaking
      if (isSpeakingRef.current) {
        stopSpeaking();
      }

      const recognition = recognitionRef.current;
      finalTranscriptRef.current = "";
      
      recognition.onstart = () => {
        setIsRecording(true);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update display with interim results
        const currentTranscript = finalTranscriptRef.current + finalTranscript + interimTranscript;
        setInput(currentTranscript);
        
        // Store final results
        if (finalTranscript) {
          finalTranscriptRef.current += finalTranscript;
        }
        
        // Reset silence timer on speech
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        
        // Set silence detection timer (2 seconds of silence)
        silenceTimerRef.current = setTimeout(() => {
          if (finalTranscriptRef.current.trim()) {
            try {
              recognition.stop();
            } catch (_) {}
          }
        }, 2000);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        // Restart listening after error
        if (isListening && !isSpeakingRef.current) {
          setTimeout(() => startListening(), 1000);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        
        // Process the final transcript
        const finalText = finalTranscriptRef.current.trim();
        if (finalText && !loading) {
          processAndSend(finalText);
        } else {
          // Restart listening if no text was captured and we're still listening
          if (isListening && !isSpeakingRef.current && !loading) {
            setTimeout(() => startListening(), 500);
          }
        }
      };

      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    if (!isRecording) return;
    try {
      recognitionRef.current?.stop?.();
    } catch (_) {}
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setIsRecording(false);
  };

  // Auto-start listening when conditions are met
  useEffect(() => {
    if (supportsSTT && isListening && !isRecording && !isSpeakingRef.current && !loading && sessionId) {
      const timer = setTimeout(() => {
        startListening();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [supportsSTT, isListening, isRecording, isSpeaking, loading, sessionId]);

  // Manual send for typed messages
  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || !sessionId) return;
    await processAndSend(trimmed);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const startNewSession = async () => {
    const newSessionId = await createNewSession();
    setSessionId(newSessionId);
    setMessages([
      {
        role: "assistant",
        content: "Hi! I'm your Growth Coach. What is your next career goal? (e.g., role, industry, skills to learn)",
      },
    ]);
    finalTranscriptRef.current = "";
    setInput("");
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      stopListening();
    } else {
      setIsListening(true);
    }
  };

  const toggleSpeaking = () => {
    if (speakReplies) {
      setSpeakReplies(false);
      stopSpeaking();
    } else {
      setSpeakReplies(true);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-24 pt-28 max-w-3xl relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(#0ea5e980_1px,transparent_1px),linear-gradient(90deg,#0ea5e980_1px,transparent_1px)] [background-size:32px_32px]" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-wider">Growth Coach</h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-200">
              <Bot className="h-3.5 w-3.5" /> HANDS-FREE MODE
            </span>
          </div>
          <p className="text-cyan-200/70">
            Speak naturally - I listen, understand, and respond automatically.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border border-cyan-400/30 bg-cyan-500/10 text-cyan-100">
            {isSpeaking ? (
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Speaking
              </span>
            ) : isRecording ? (
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Listening
              </span>
            ) : loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                Processing
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-200/40"></span>
                Ready
              </span>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={startNewSession}
            className="flex items-center gap-2 border-cyan-300/30 bg-cyan-500/5 text-cyan-100 hover:bg-cyan-500/10"
          >
            <RotateCcw className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Jarvis-like visualizer */}
      <div ref={sceneRef} className="relative flex items-center justify-center h-56 mb-6">
        <div
          ref={coreRef}
          className={
            "relative rounded-full w-40 h-40 shadow-[0_0_60px_8px_rgba(0,255,247,0.35)] transition-all duration-300 " +
            (isSpeaking
              ? "bg-gradient-to-br from-cyan-300/70 to-blue-400/60 scale-110"
              : isRecording
              ? "bg-gradient-to-br from-emerald-300/60 to-cyan-300/50 scale-105"
              : loading
              ? "bg-gradient-to-br from-yellow-300/60 to-orange-300/50 scale-105"
              : "bg-gradient-to-br from-slate-300/30 to-slate-500/20")
          }
          aria-label={isSpeaking ? "Speaking" : isRecording ? "Listening" : loading ? "Processing" : "Ready"}
        >
          <div className="absolute inset-0 rounded-full ring-1 ring-cyan-300/40" />
          <div className="absolute inset-2 rounded-full ring-1 ring-cyan-400/40" />
          <div className="absolute inset-4 rounded-full ring-1 ring-blue-400/30" />
          <div className="absolute inset-0 rounded-full mix-blend-screen blur-xl" />
        </div>
        
        {/* Animated outer rings */}
        <div className="pointer-events-none absolute">
          <div className="absolute -inset-2 rounded-full border border-cyan-300/40 animate-pulse" />
          <div className="absolute -inset-6 rounded-full border border-blue-400/30 animate-[pulse_2.8s_ease-in-out_infinite]" />
          <div className="absolute -inset-10 rounded-full border border-cyan-200/20 animate-[pulse_3.6s_ease-in-out_infinite]" />
        </div>
        
        {/* Particles */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full animate-[particleMove_18s_linear_infinite]"
              style={{
                left: `${p.leftVw}vw`,
                top: `${p.topVh}vh`,
                width: `${p.sizePx}px`,
                height: `${p.sizePx}px`,
                background: p.color,
                opacity: p.opacity,
                animationDelay: `${p.delaySec}s`,
              }}
            />
          ))}
        </div>
      </div>

      <Card className="p-4 h-[60vh] overflow-y-auto border border-cyan-400/20 bg-slate-900/40 backdrop-blur" ref={listRef}>
        <div className="space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={"flex items-start gap-2 max-w-[85%] " + (m.role === "user" ? "flex-row-reverse" : "")}>
                <div className={"mt-1 shrink-0 rounded-full p-1 " + (m.role === "user" ? "bg-indigo-500/20 text-indigo-200" : "bg-cyan-500/20 text-cyan-200")}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={
                    "rounded-xl px-3 py-2 border whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-indigo-600 text-white border-indigo-300/40"
                      : "bg-cyan-900/40 text-cyan-100 border-cyan-300/30 font-mono tracking-wide text-[0.95rem]")
                  }
                >
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block rounded-lg px-3 py-2 border border-cyan-300/30 bg-cyan-900/30 text-cyan-100 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 animate-pulse" />
                Processing your request...
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-4 flex gap-2 items-center">
        <Input
          placeholder="Speak naturally or type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
          className="border-cyan-400/30 bg-slate-900/50 text-cyan-100 placeholder:text-cyan-200/40"
        />
        
        {supportsSTT && (
          <Button
            type="button"
            variant={isListening ? "default" : "secondary"}
            onClick={toggleListening}
            className={
              "px-3 border-cyan-400/30 " +
              (isListening 
                ? "bg-green-500/20 text-green-100 hover:bg-green-500/30" 
                : "bg-red-500/20 text-red-100 hover:bg-red-500/30")
            }
            title={isListening ? "Voice listening ON" : "Voice listening OFF"}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
        )}
        
        <Button 
          onClick={onSend} 
          disabled={loading || !input.trim()} 
          className="border-cyan-400/30 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
        >
          {loading ? "Sending..." : "Send"}
        </Button>
        
        {supportsTTS && (
          <Button
            type="button"
            variant={speakReplies ? "default" : "secondary"}
            onClick={toggleSpeaking}
            className={
              "px-3 border-cyan-400/30 " +
              (speakReplies 
                ? "bg-blue-500/20 text-blue-100 hover:bg-blue-500/30" 
                : "bg-gray-500/20 text-gray-100 hover:bg-gray-500/30")
            }
            title={speakReplies ? "Voice responses ON" : "Voice responses OFF"}
          >
            {speakReplies ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        )}
      </div>
      
      <div className="mt-2 text-xs text-cyan-200/50 text-center">
        {supportsSTT && isListening ? "🎤 Voice mode active - speak naturally, I'll respond automatically" : "Type your message or enable voice mode"}
      </div>
    </div>
  );
}
