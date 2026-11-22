import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  RefreshCw,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Calculator,
  Compass,
  ArrowRight,
  Languages,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SUBJECT_LIST } from '../services/curriculumData';

export const AITutorPage = ({ initialSubjectCode, initialUnitTitle }) => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [selectedSubject, setSelectedSubject] = useState(initialSubjectCode || 'mathematics');
  const [activeUnit, setActiveUnit] = useState(initialUnitTitle || '');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const currentClass = currentUser?.className || 'Class 5';
  const currentStd = currentUser?.classStd || '5th STD';
  const activeSubjectObj = SUBJECT_LIST.find(s => s.code === selectedSubject) || SUBJECT_LIST[3];

  // Grade- and subject-specific suggested questions
  const getSuggestedQuestions = () => {
    switch (selectedSubject) {
      case 'kannada':
        return [
          'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಸ್ವರ ಮತ್ತು ವ್ಯಂಜನಗಳ ವ್ಯತ್ಯಾಸವೇನು?',
          'ನಾಮಪದ ಎಂದರೇನು? ಸರಳ ಉದಾಹರಣೆಗಳೊಂದಿಗೆ ತಿಳಿಸಿ.',
          'ಬಸವಣ್ಣನವರ "ಕಾಯಕವೇ ಕೈಲಾಸ" ಸಂದೇಶದ ಅರ್ಥವೇನು?',
          'ನನಗೆ ಅಭ್ಯಾಸಕ್ಕಾಗಿ ಒಂದು ಸಣ್ಣ ಕನ್ನಡ ರಸಪ್ರಶ್ನೆ ನೀಡಿ!'
        ];
      case 'hindi':
        return [
          'संज्ञा और सर्वनाम में क्या मुख्य अंतर होता है?',
          'कबीरदास जी के दोहे का सरल अर्थ समझाइए।',
          'विलोम शब्द और पर्यायवाची शब्द के दो-दो उदाहरण दीजिए।',
          'मुझे हल करने के लिए एक सरल हिन्दी व्याकरण अभ्यास दें!'
        ];
      case 'mathematics':
        return [
          'Can you explain fractions step-by-step using a village market example?',
          'How do I calculate perimeter and area of a rectangle?',
          'I am stuck on my division homework, can you give me a hint?',
          'Give me a fun math puzzle suitable for my grade!'
        ];
      case 'environmentalStudies':
      case 'biology':
        return [
          'How do plants make their food using sunlight and chlorophyll?',
          'Why is rainwater harvesting crucial for rural farming?',
          'Explain the difference between herbivores and carnivores simply.',
          'Give me a practice science question to test my understanding!'
        ];
      case 'computerScience':
        return [
          'What is the difference between computer hardware and software?',
          'How does the internet reach our village school?',
          'What is an algorithm? Explain with a daily routine example.',
          'What are safe internet practices for students?'
        ];
      case 'english':
        return [
          'What is the difference between a common noun and a proper noun?',
          'How do I use past tense verbs correctly in a story?',
          'Explain the use of articles (A, An, The) with simple rules.',
          'Give me a short vocabulary challenge!'
        ];
      default:
        return [
          'Can you explain the core concepts of this subject simply?',
          'How does this topic apply to everyday life in our village?',
          'Give me a helpful hint for my unit quiz.',
          'Test my knowledge with an educational question!'
        ];
    }
  };

  // Initial welcome message tailored to language and subject
  useEffect(() => {
    let welcomeText = '';
    if (selectedSubject === 'kannada') {
      welcomeText = `ನಮಸ್ಕಾರ ${currentUser?.name || 'ವಿದ್ಯಾರ್ಥಿ'}! ನಾನು ನಿಮ್ಮ ಉಚಿತ AI ಶಿಕ್ಷಕ (Guru AI Tutor). ನೀವು ${currentClass} (${currentStd}) ಕನ್ನಡ ವಿಷಯದ ಯಾವುದೇ ಪಾಠ, ಕಾವ್ಯ, ವ್ಯಾಕರಣ ಅಥವಾ ರಸಪ್ರಶ್ನೆಗಳ ಕುರಿತು ಸಂದೇಹವಿದ್ದರೆ ಕೇಳಿ. ನಾನು ನಿಮಗೆ ಸರಳವಾಗಿ ವಿವರಿಸುತ್ತೇನೆ!`;
    } else if (selectedSubject === 'hindi') {
      welcomeText = `नमस्ते ${currentUser?.name || 'विद्यार्थी'}! मैं आपका निःशुल्क AI शिक्षक (Guru AI Tutor) हूँ। ${currentClass} (${currentStd}) हिन्दी के किसी भी पाठ, व्याकरण, दोहे या प्रश्नोत्तरी से संबंधित अपनी समस्या पूछें। मैं आपको सरल और रोचक उदाहरणों से समझाऊँगा!`;
    } else {
      welcomeText = `Hello ${currentUser?.name || 'Student'}! I am Guru, your Free AI Tutor for ${currentClass} (${currentStd}). Ask me any questions about ${activeSubjectObj.name}, request step-by-step math hints, or ask for fun practice questions!`;
    }

    setMessages([
      {
        id: 'welcome_1',
        sender: 'tutor',
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'Free AI Tutor'
      }
    ]);
  }, [selectedSubject, currentClass, currentStd]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageToSend) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for multi-turn dialogue
      const history = messages
        .filter(m => m.id !== 'welcome_1')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      const res = await api.askAITutor({
        message: text,
        history,
        studentContext: {
          classId: currentUser?.classId || 'c5',
          className: currentClass,
          classStd: currentStd,
          subjectCode: selectedSubject,
          subjectName: activeSubjectObj.name,
          unitTitle: activeUnit,
          preferredLanguage: language
        }
      });

      const tutorMsg = {
        id: `t_${Date.now()}`,
        sender: 'tutor',
        text: res.reply || 'I am ready to help you learn! Please ask your question.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: res.model || 'Grok 4.7'
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'tutor',
          text: 'I encountered a temporary connection issue. Please try asking your question again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    let welcomeText = '';
    if (selectedSubject === 'kannada') {
      welcomeText = `ಸಂಭಾಷಣೆಯನ್ನು ತೆರವುಗೊಳಿಸಲಾಗಿದೆ. ${currentClass} (${currentStd}) ಕನ್ನಡ ವಿಷಯದ ಕುರಿತು ನಿಮ್ಮ ಹೊಸ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ!`;
    } else if (selectedSubject === 'hindi') {
      welcomeText = `बातचीत साफ़ कर दी गई है। ${currentClass} (${currentStd}) हिन्दी विषय के बारे में अपना नया प्रश्न पूछें!`;
    } else {
      welcomeText = `Chat cleared. Ask me any question about ${currentClass} (${currentStd}) ${activeSubjectObj.name}!`;
    }
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'tutor',
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'Grok 4.7'
      }
    ]);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '30px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Bot size={13} /> GPT OSS (Open-Source AI)
              </span>
              <span className="badge-pill badge-lime">{currentClass} ({currentStd})</span>
              <span className="badge-pill badge-glass">100% Free • Zero Cost</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.2px' }}>
              GPT OSS Interactive AI Tutor — Rural Learning Guide
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Get friendly, step-by-step explanations, daily life examples, unit quiz hints, and practice questions in pure Kannada, Hindi, and English.
            </p>
          </div>

          <button
            onClick={handleClearChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={13} /> Clear Chat
          </button>
        </div>

        {/* Subject Selection Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
          {SUBJECT_LIST.map((subj) => {
            const isSelected = selectedSubject === subj.code;
            return (
              <button
                key={subj.code}
                onClick={() => setSelectedSubject(subj.code)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  background: isSelected ? 'rgba(43, 209, 199, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <span>{subj.name}</span>
                {subj.code === 'kannada' && <span style={{ fontSize: '11px', opacity: 0.8 }}>(ಕನ್ನಡ)</span>}
                {subj.code === 'hindi' && <span style={{ fontSize: '11px', opacity: 0.8 }}>(हिन्दी)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          maxHeight: '75vh',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Chat Messages Scroll Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
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
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(43, 209, 199, 0.15)',
                      border: '1px solid var(--accent-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Bot size={18} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '82%',
                    background: isUser
                      ? 'linear-gradient(135deg, rgba(200, 245, 53, 0.2), rgba(43, 209, 199, 0.15))'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isUser
                      ? '1px solid rgba(200, 245, 53, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    padding: '14px 18px',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isUser ? 'flex-end' : 'space-between',
                      gap: '8px',
                      marginTop: '6px',
                      fontSize: '10.5px',
                      color: 'var(--text-dim)',
                    }}
                  >
                    {!isUser && (
                      <span className="badge-pill badge-glass" style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                        {m.model || 'Grok 4.7'}
                      </span>
                    )}
                    <span>{m.time}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(43, 209, 199, 0.15)',
                  border: '1px solid var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--accent-cyan)',
                  fontSize: '13px',
                }}
              >
                <RefreshCw size={14} className="spin" />
                <span>AI Tutor is preparing your explanation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Section */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lightbulb size={12} color="var(--accent-lime)" /> Suggestions:
          </span>
          {getSuggestedQuestions().map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              disabled={loading}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '9999px',
                padding: '4px 12px',
                color: 'var(--text-secondary)',
                fontSize: '11.5px',
                whiteSpace: 'nowrap',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 18, 26, 0.65)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              selectedSubject === 'kannada'
                ? 'ಕನ್ನಡದಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅಥವಾ ಸಂದೇಹವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...'
                : selectedSubject === 'hindi'
                ? 'हिन्दी में अपना प्रश्न या संदेह यहाँ लिखें...'
                : `Ask Guru about ${activeSubjectObj.name} for ${currentClass}...`
            }
            disabled={loading}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              padding: '12px 20px',
              color: '#FFFFFF',
              fontSize: '13.5px',
              outline: 'none',
            }}
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || loading}
            className="btn-accent"
            style={{
              padding: '12px 22px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              opacity: !inputMessage.trim() || loading ? 0.6 : 1,
              cursor: !inputMessage.trim() || loading ? 'not-allowed' : 'pointer',
            }}
          >
            <span>Send</span>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
