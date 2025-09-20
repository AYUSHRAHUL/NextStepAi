"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { growthChat, createNewSession } from "@/actions/growth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RotateCcw, MessageSquare, Mic, MicOff, Volume2, VolumeX, Bot, User } from "lucide-react";
import VoiceChat from "./_components/voice-chat";

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
  const [chatMode, setChatMode] = useState("text"); // "text" or "voice"
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
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupportsSTT(true);
    }

    if ("speechSynthesis" in window) {
      setSupportsTTS(true);
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!supportsSTT) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      await handleSubmit(transcript);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [supportsSTT]);

  // Initialize speech synthesis
  useEffect(() => {
    if (!supportsTTS) return;

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    if (voices.length > 0) {
      const selectedVoice = voices.find(
        (voice) => voice.name === "Google US English"
      );
      selectedVoiceRef.current = selectedVoice || voices[0];
    }

    // Load voices when they become available
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        const selectedVoice = voices.find(
          (voice) => voice.name === "Google US English"
        );
        selectedVoiceRef.current = selectedVoice || voices[0];
      }
    };

    synth.addEventListener("voiceschanged", loadVoices);
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, [supportsTTS]);

  const speak = (text) => {
    if (!supportsTTS || !speakReplies) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoiceRef.current;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
    };

    synth.speak(utterance);
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async (message = input) => {
    if (!message.trim() || loading) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await growthChat(message, sessionId);
      const assistantMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);

      if (speakReplies && supportsTTS) {
        speak(response);
      }
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = async () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm your Growth Coach. What is your next career goal? (e.g., role, industry, skills to learn)",
      },
    ]);
    setInput("");
    setLoading(false);

    // Create new session
    const newSessionId = await createNewSession();
    setSessionId(newSessionId);
  };

  const toggleVoiceMode = () => {
    setSpeakReplies(!speakReplies);
    if (speakReplies && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Growth Coach
          </h1>
          <p className="text-gray-300 text-lg">
            Your personal career development assistant
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Chat</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={resetChat}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              {supportsTTS && (
                <Button
                  onClick={toggleVoiceMode}
                  variant={speakReplies ? "default" : "outline"}
                  size="sm"
                  className={
                    speakReplies
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "text-white border-white/20 hover:bg-white/10"
                  }
                >
                  {speakReplies ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div
            ref={listRef}
            className="space-y-4 max-h-96 overflow-y-auto mb-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.role === "user" ? "You" : "AI Coach"}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs font-medium">AI Coach</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-300"
              disabled={loading}
            />
            {supportsSTT && (
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                className={
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "text-white border-white/20 hover:bg-white/10"
                }
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              onClick={() => handleSubmit()}
              disabled={loading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Voice Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Speech Recognition</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      supportsSTT
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {supportsSTT ? "Available" : "Not Available"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Text-to-Speech</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      supportsTTS
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {supportsTTS ? "Available" : "Not Available"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Auto-Speak Replies</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      speakReplies
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {speakReplies ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Session Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Session ID</span>
                  <span className="text-white text-xs font-mono">
                    {sessionId ? sessionId.slice(0, 8) + "..." : "Loading..."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Messages</span>
                  <span className="text-white">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      loading
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {loading ? "Processing" : "Ready"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            💡 Tip: Use voice input for hands-free interaction, or type your
            questions for detailed responses.
          </p>
        </div>
      </div>
    </div>
  );
}