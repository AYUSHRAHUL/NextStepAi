"use client";

import React, { useState, useRef, useEffect } from "react";
import { growthChat } from "@/actions/growth";
import { createNewSession } from "@/actions/growth";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceChat({ sessionId, onNewSession }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [displayText, setDisplayText] = useState("Hello! I'm your Growth Coach. Click the mic to start talking!");
  const [recognition, setRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [ttsReady, setTtsReady] = useState(false);
  const voicesCacheRef = useRef([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const jarvisRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Enhanced recognition settings for better accuracy
      recognitionInstance.lang = 'en-US';
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true; // Enable interim results for better feedback
      recognitionInstance.maxAlternatives = 3; // Get multiple alternatives for better accuracy
      recognitionInstance.serviceURI = ''; // Use default service

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setDisplayText("🎤 Listening... Speak clearly and naturally.");
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = async (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        // Process both interim and final results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Show interim results for better user feedback
        if (interimTranscript) {
          setDisplayText(`🎤 Listening: "${interimTranscript}"`);
        }

        // Process final result
        if (finalTranscript) {
          const text = finalTranscript.trim();
          setDisplayText(`You said: "${text}"`);
          
          try {
            setDisplayText("🤔 Processing your request...");
            // Stop recognition before calling the model & speaking back
            if (recognition) {
              try { recognition.stop(); } catch {}
              setIsListening(false);
            }
            const response = await growthChat(text, sessionId);
            setDisplayText(response.reply);
            await speak(response.reply);
          } catch (error) {
            // Handle error silently
            setDisplayText("❌ Sorry, I couldn't process that. Please try again.");
            await speak("Sorry, I couldn't process that. Please try again.");
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        // Handle speech recognition error silently
        setIsListening(false);
        
        let errorMessage = "Sorry, I didn't catch that. Please try again.";
        switch (event.error) {
          case 'no-speech':
            errorMessage = "I didn't hear anything. Please try speaking again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone not found. Please check your microphone.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone access.";
            break;
          case 'network':
            errorMessage = "Network error. Please check your connection.";
            break;
          case 'aborted':
            errorMessage = "Speech recognition was interrupted.";
            break;
        }
        
        setDisplayText(errorMessage);
        speak(errorMessage);
      };

      recognitionInstance.onnomatch = () => {
        setDisplayText("I didn't understand that. Please try speaking more clearly.");
        speak("I didn't understand that. Please try speaking more clearly.");
      };

      setRecognition(recognitionInstance);
    } else {
      setIsVoiceEnabled(false);
      setDisplayText("❌ Sorry, your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.");
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      // Warm up voices list; some browsers populate asynchronously
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length) {
          voicesCacheRef.current = voices;
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // 3D Mouse interaction
    const handleMouseMove = (e) => {
      if (jarvisRef.current) {
        const rect = jarvisRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        jarvisRef.current.style.transform = `rotateY(${x / 18}deg) rotateX(${-y / 22}deg) scale(1.03)`;
      }
    };

    const handleMouseLeave = () => {
      if (jarvisRef.current) {
        jarvisRef.current.style.transform = "";
      }
    };

    const scene = document.querySelector('.voice-scene');
    if (scene) {
      scene.addEventListener('mousemove', handleMouseMove);
      scene.addEventListener('mouseleave', handleMouseLeave);
    }

    // Initialize particle system
    const initParticles = () => {
      const particlesContainer = document.getElementById('particles');
      if (particlesContainer) {
        particlesContainer.innerHTML = ''; // Clear existing particles
        
        for (let i = 0; i < 40; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * 100 + 'vw';
          particle.style.top = Math.random() * 85 + 'vh';
          particle.style.width = (2 + Math.random() * 2) + 'px';
          particle.style.height = particle.style.width;
          particle.style.background = Math.random() > 0.5 ? '#00fff7cc' : '#a3dfffdd';
          particle.style.animationDelay = (Math.random() * 20) + 's';
          particle.style.opacity = 0.4 + Math.random() * 0.4;
          particlesContainer.appendChild(particle);
        }
      }
    };

    // Initialize particles after a short delay
    setTimeout(initParticles, 100);

    return () => {
      if (scene) {
        scene.removeEventListener('mousemove', handleMouseMove);
        scene.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [sessionId]);

  const speak = async (text) => {
    if (speechSynthesis && text) {
      setIsSpeaking(true);
      
      // Stop any current speech
      speechSynthesis.cancel();
      // Also ensure recognition is not active while speaking to avoid conflicts
      if (recognition && isListening) {
        try { recognition.stop(); } catch {}
        setIsListening(false);
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced voice selection for better quality
      let voices = voicesCacheRef.current;
      if (!voices || voices.length === 0) {
        // Retry a few times in case voices haven't loaded yet
        for (let i = 0; i < 5 && (!voices || voices.length === 0); i++) {
          await new Promise(r => setTimeout(r, 150));
          voices = speechSynthesis.getVoices();
          if (voices && voices.length) voicesCacheRef.current = voices;
        }
      }
      let preferredVoice = null;
      
      // Priority order for voice selection
      const voicePreferences = [
        'Google US English',
        'Microsoft Zira Desktop',
        'Microsoft David Desktop',
        'Alex',
        'Samantha',
        'Victoria'
      ];
      
      for (const preference of voicePreferences) {
        preferredVoice = voices.find(voice => 
          voice.name.includes(preference) && voice.lang.startsWith('en')
        );
        if (preferredVoice) break;
      }
      
      // Fallback to any English voice
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.default !== false
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Optimized speech parameters
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 0.9; // Slightly lower volume for comfort
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        setDisplayText(`🔊 Speaking: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setDisplayText("✅ Ready to listen. Click the mic or core to start talking!");
      };

      utterance.onerror = (event) => {
        // Handle speech synthesis error silently
        setIsSpeaking(false);
        setDisplayText("❌ Speech synthesis failed. Please try again.");
      };

      // Small delay to ensure proper initialization
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 120);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      // Attempt to unlock/resume TTS on user gesture
      try {
        if (window?.speechSynthesis) {
          window.speechSynthesis.resume();
        }
      } catch {}

      recognition.start();

      // Warm-up TTS once so future responses can play without being blocked
      if (!ttsReady && window?.speechSynthesis) {
        const warmup = new SpeechSynthesisUtterance("I'm listening");
        try {
          window.speechSynthesis.speak(warmup);
          setTtsReady(true);
        } catch {}
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isVoiceEnabled) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Voice chat is not supported in your browser. Please use the text chat instead.
        </p>
      </div>
    );
  }

  return (
    <div className="voice-chat-container">
      <style jsx>{`
        .voice-chat-container {
          background: radial-gradient(ellipse at center, #101323 60%, #050712 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', Arial, sans-serif;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          box-sizing: border-box;
        }
        
        .voice-scene {
          perspective: 1200px;
          width: 100%;
          max-width: 600px;
          height: 70vh;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: 0 auto;
        }
        
        .jarvis-core {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          position: relative;
          transform-style: preserve-3d;
          animation: jarvis-float 7s ease-in-out infinite alternate, jarvis-rot 40s linear infinite;
          box-shadow:
              0 0 100px 8px #00fff7aa,
              0 0 300px 40px #192f58;
          transition: box-shadow 0.5s;
          z-index: 10;
          cursor: pointer;
          flex-shrink: 0;
        }
        
        .jarvis-core:hover {
          box-shadow:
              0 0 250px 16px #00e1c3cc,
              0 0 400px 60px #375ea0;
          transition: box-shadow 0.5s;
        }
        
        .jarvis-core.listening {
          box-shadow:
              0 0 300px 20px #ff6b6bcc,
              0 0 500px 80px #ff4757;
          animation: jarvis-pulse 1s ease-in-out infinite alternate;
        }
        
        .jarvis-core.speaking {
          box-shadow:
              0 0 300px 20px #2ed573cc,
              0 0 500px 80px #7bed9f;
          animation: jarvis-pulse 0.8s ease-in-out infinite alternate;
        }
        
        .jarvis-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          filter: brightness(1.2) contrast(1.25) drop-shadow(0 0 70px #00fff766);
          box-shadow: 0 0 80px #00fff7cc inset;
          background: linear-gradient(45deg, #00fff7, #0078fb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          color: white;
        }
        
        @keyframes jarvis-float {
          0% { transform: translateY(0) rotateX(8deg) rotateY(-12deg) scale(1); }
          100% { transform: translateY(-28px) rotateX(-8deg) rotateY(12deg) scale(1.04); }
        }
        
        @keyframes jarvis-rot {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        
        @keyframes jarvis-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        
        .rings {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
        }
        
        .ring {
          position: absolute;
          border: 2px solid #00fff7aa;
          border-radius: 50%;
          animation: ring-glow 5s linear infinite;
          filter: blur(1.5px);
          pointer-events: none;
        }
        
        .ring.r1 { width: 280px; height: 280px; border-color: #45faffcc; animation-delay: 0s;}
        .ring.r2 { width: 320px; height: 320px; border-color: #0078fbcc; animation-delay: 2s;}
        .ring.r3 { width: 370px; height: 370px; border-color: #a3dfffbb; animation-delay: 1.2s;}
        
        @keyframes ring-glow {
          0% { opacity: 0.8; filter: blur(2px);}
          50% { opacity: 1; filter: blur(3.5px);}
          100% { opacity: 0.8; filter: blur(2px);}
        }
        
        .particles {
          position: absolute;
          width: 100vw; height: 100vh;
          overflow: visible; pointer-events: none; z-index: 0;
        }
        
        .particle {
          position: absolute;
          width: 2px; height: 2px; border-radius: 50%;
          background: #91fcffcc;
          opacity: 0.55;
          animation: particleMove 18s linear infinite;
        }
        
        @keyframes particleMove {
          0% { transform: translateY(100vh) scale(1);}
          100% { transform: translateY(-20px) scale(1.5);}
        }
        
        .display {
          position: absolute;
          bottom: 2rem; left: 50%; transform: translateX(-50%);
          min-width: 280px;
          max-width: 90vw;
          width: 100%;
          font-size: 1.1rem;
          background: rgba(30, 34, 50, 0.9);
          color: #00fff7;
          text-shadow: 0 0 6px #00fff7bb;
          border-radius: 1em;
          padding: 1rem 1.2rem;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 32px #305d8840;
          word-break: break-word;
          text-align: center;
          z-index: 20;
          border: 1px solid #00fff749;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .voice-controls {
          position: absolute;
          bottom: 0.5rem; left: 50%; transform: translateX(-50%);
          display: flex;
          gap: 0.8rem;
          z-index: 20;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 90vw;
        }
        
        .voice-btn {
          background: linear-gradient(90deg, #0078fb 0%, #00fff7 100%);
          color: #142239;
          font-weight: bold;
          border: none;
          border-radius: 2em;
          padding: 0.6em 1.2em;
          box-shadow: 0 0 8px #00fff7a3, inset 0 0 10px #29edebcc;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          white-space: nowrap;
        }
        
        .voice-btn:hover {
          box-shadow: 0 0 24px #00fff799;
        }
        
        .voice-btn:active {
          background: linear-gradient(90deg, #00fff7 0%, #0078fb 100%);
        }
        
        .voice-btn.listening {
          background: linear-gradient(90deg, #ff6b6b 0%, #ff4757 100%);
          color: white;
        }
        
        .voice-btn.speaking {
          background: linear-gradient(90deg, #2ed573 0%, #7bed9f 100%);
          color: white;
        }
        
        @media (max-width: 768px) {
          .voice-chat-container { padding: 1rem; }
          .voice-scene { height: 60vh; min-height: 350px; }
          .jarvis-core { width: 200px; height: 200px; }
          .ring.r1 { width: 230px; height: 230px; }
          .ring.r2 { width: 260px; height: 260px; }
          .ring.r3 { width: 290px; height: 290px; }
          .display { font-size: 1rem; padding: 0.8rem 1rem; }
          .voice-controls { flex-direction: column; gap: 0.5rem; }
          .voice-btn { padding: 0.5em 1em; font-size: 0.8rem; }
        }
        
        @media (max-width: 480px) {
          .jarvis-core { width: 180px; height: 180px; }
          .ring.r1 { width: 210px; height: 210px; }
          .ring.r2 { width: 240px; height: 240px; }
          .ring.r3 { width: 270px; height: 270px; }
          .display { font-size: 0.9rem; padding: 0.7rem 0.9rem; }
        }
      `}</style>

      <div className="voice-scene">
        <div 
          ref={jarvisRef}
          className={`jarvis-core ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
          onClick={startListening}
        >
          <div className="jarvis-img">
            {isListening ? '🎤' : isSpeaking ? '🔊' : '🤖'}
          </div>
        </div>
        
        <div className="rings">
          <div className="ring r1"></div>
          <div className="ring r2"></div>
          <div className="ring r3"></div>
        </div>
        
        <div className="particles" id="particles"></div>
        
        <div className="display">
          {displayText}
        </div>
      </div>
      
      <div className="voice-controls">
        <button 
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          {isListening ? 'Stop Listening' : 'Start Voice Chat'}
        </button>
        
        <button 
          className="voice-btn"
          onClick={() => speak("Test voice. Your AI coach is ready to help.")}
          disabled={isSpeaking}
        >
          <Volume2 size={20} />
          Test Voice
        </button>

        {isSpeaking && (
          <button 
            className="voice-btn speaking"
            onClick={stopSpeaking}
          >
            <VolumeX size={20} />
            Stop Speaking
          </button>
        )}
        
        <button 
          className="voice-btn"
          onClick={onNewSession}
        >
          🔄 New Session
        </button>
      </div>
    </div>
  );
}
