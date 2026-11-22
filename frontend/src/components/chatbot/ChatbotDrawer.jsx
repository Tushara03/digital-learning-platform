import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, X, Send, RefreshCw, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const ChatbotDrawer = ({ onExpandToFull }) => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'tutor',
      text: 'Hello! I am Guru, your Free AI Tutor. Ask me any question about your lessons or homework!',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      const res = await api.askAITutor({
        message: text,
        history,
        studentContext: {
          classId: currentUser?.classId || 'c5',
          className: currentUser?.className || 'Class 5',
          classStd: currentUser?.classStd || '5th STD',
          subjectCode: 'generalKnowledge',
          subjectName: 'General Learning',
          preferredLanguage: language
        }
      });

      const tutorMsg = {
        id: `t_${Date.now()}`,
        sender: 'tutor',
        text: res.reply || 'I am ready to help you with your lessons!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, tutorMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'tutor',
          text: 'Unable to connect to AI tutor. Please check your connection and try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Entry Point Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: 'rgba(20, 24, 34, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(43, 209, 199, 0.4)',
            borderRadius: '9999px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.6), 0 0 15px rgba(43, 209, 199, 0.25)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#072422',
            }}
          >
            <Bot size={14} />
          </div>
          <span>AI Tutor</span>
          <span className="badge-pill badge-glass" style={{ fontSize: '9px', padding: '2px 6px' }}>GPT OSS</span>
        </button>
      </div>

      {/* Interactive Floating Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '520px',
            maxHeight: '80vh',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            className="glass-panel"
            style={{
              height: '100%',
              borderRadius: '24px',
              border: '1px solid rgba(43, 209, 199, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            {/* Window Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={18} color="var(--accent-cyan)" />
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    GPT OSS Tutor (Free)
                  </h3>
                  <span style={{ fontSize: '10.5px', color: 'var(--accent-lime)' }}>
                    Active • {currentUser?.className || 'Class 5'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setMessages([{ id: 'welcome', sender: 'tutor', text: 'Chat reset. How can I help you learn today?', time: 'Just now' }])}
                  title="Clear chat"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        background: isUser
                          ? 'rgba(43, 209, 199, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isUser
                          ? '1px solid rgba(43, 209, 199, 0.4)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        padding: '10px 14px',
                        fontSize: '12.5px',
                        color: '#FFFFFF',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '12px' }}>
                  <RefreshCw size={12} className="spin" />
                  <span>Grok is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Row */}
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 18, 26, 0.8)',
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Ask Grok a question..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '9999px',
                  padding: '8px 14px',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="btn-accent"
                style={{
                  borderRadius: '9999px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                }}
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
