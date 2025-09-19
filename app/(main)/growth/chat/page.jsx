"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { growthChat, createNewSession } from "@/actions/growth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RotateCcw, MessageSquare, Mic, MicOff } from "lucide-react";
import VoiceChat from "./_components/voice-chat";

export default function GrowthChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Growth Coach. What is your next career goal? (e.g., role, industry, skills to learn)",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [chatMode, setChatMode] = useState("text"); // "text" or "voice"
  const listRef = useRef(null);

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      const newSessionId = await createNewSession();
      setSessionId(newSessionId);
    };
    initializeSession();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || !sessionId) return;
    
    const userMessage = { role: "user", content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      const res = await growthChat(trimmed, sessionId);
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
        content:
          "Hi! I'm your Growth Coach. What is your next career goal? (e.g., role, industry, skills to learn)",
      },
    ]);
  };

  const toggleChatMode = () => {
    setChatMode(prev => prev === "text" ? "voice" : "text");
  };

  // Render voice chat mode
  if (chatMode === "voice") {
    return (
      <div className="min-h-screen">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleChatMode}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm"
          >
            <MessageSquare className="h-4 w-4" />
            Text Chat
          </Button>
        </div>
        <VoiceChat 
          sessionId={sessionId} 
          onNewSession={startNewSession}
        />
      </div>
    );
  }

  // Render text chat mode
  return (
    <div className="container mx-auto px-4 pb-24 pt-28 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Growth Coach</h1>
          <p className="text-muted-foreground">
            Get tailored guidance to align your skills, goals, and learning path with your career.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleChatMode}
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            Voice Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={startNewSession}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      <Card className="p-4 h-[60vh] overflow-y-auto" ref={listRef}>
        <div className="space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  "inline-block rounded-lg px-3 py-2 max-w-[85%] whitespace-pre-wrap " +
                  (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block rounded-lg px-3 py-2 bg-muted flex items-center gap-2">
                <MessageSquare className="h-4 w-4 animate-pulse" />
                Thinking…
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Ask about roles, skills, roadmap, certifications, job search…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
        />
        <Button onClick={onSend} disabled={loading || !input.trim()}>
          {loading ? "Sending…" : "Send"}
        </Button>
      </div>
    </div>
  );
}


