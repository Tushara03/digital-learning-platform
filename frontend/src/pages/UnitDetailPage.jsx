import React, { useState, useEffect } from 'react';
import { ArrowLeft, Video, Award, CheckCircle2, XCircle, RotateCcw, Check, Sparkles, Trophy, BookOpen, ExternalLink, Play, Bot, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { extractYoutubeId, getYoutubeEmbedUrl } from '../utils/youtube';
import { QUIZ_UI_STRINGS } from '../services/languageCurriculum';

export const UnitDetailPage = ({ unitId, onBack, onOpenTutor }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [unit, setUnit] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedResult, setSubmittedResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    const fetchUnit = async () => {
      const u = await api.getUnitById(unitId);
      setUnit(u);
    };
    fetchUnit();
  }, [unitId]);

  if (!unit) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading unit module...
      </div>
    );
  }

  // Get subject-specific localized strings (Kannada, Hindi, or Default)
  const langKey = unit.subjectCode === 'kannada' ? 'kannada' : (unit.subjectCode === 'hindi' ? 'hindi' : 'default');
  const ui = QUIZ_UI_STRINGS[langKey] || QUIZ_UI_STRINGS.default;

  const questions = unit.questions || [];
  const embedUrl = getYoutubeEmbedUrl(unit.videoUrl);
  const videoId = extractYoutubeId(unit.videoUrl);
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : (unit.videoUrl || '#');

  const handleSelectAnswer = (qIndex, optIndex) => {
    if (submittedResult) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: optIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const beforeBadges = await api.getStudentBadges(currentUser.id, unit.classId, unit.subjectCode);
      const res = await api.submitUnitQuiz(unit.unitId, currentUser.id, selectedAnswers);
      const afterBadges = await api.getStudentBadges(currentUser.id, unit.classId, unit.subjectCode);

      // Find any newly awarded badges
      const fresh = afterBadges.filter(ab => !beforeBadges.some(bb => bb.badgeId === ab.badgeId));
      setNewBadges(fresh);
      setSubmittedResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setSubmittedResult(null);
    setNewBadges([]);
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Navigation Bar: Back & AI Tutor Shortcut */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            padding: '7px 16px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          <span>{ui.backBtn}</span>
        </button>

        {onOpenTutor && (
          <button
            onClick={() => onOpenTutor({
              unitTitle: unit.unitTitle,
              subjectCode: unit.subjectCode,
              subjectName: unit.subjectName
            })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(43, 209, 199, 0.12)',
              border: '1px solid rgba(43, 209, 199, 0.3)',
              borderRadius: '9999px',
              padding: '7px 16px',
              color: 'var(--accent-cyan)',
              fontSize: '12.5px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <Bot size={15} />
            <span>{ui.askTutorBtn}</span>
          </button>
        )}
      </div>

      {/* Main Lesson Container */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        {/* Header Tags & Title */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span className="badge-pill badge-lime">{unit.className} ({unit.classStd})</span>
            <span className="badge-pill badge-cyan">{unit.subjectName}</span>
            <span className="badge-pill badge-glass">{ui.unitLabel} {unit.unitNumberStr}</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', lineHeight: '1.3' }}>
            {unit.unitTitle}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {unit.description}
          </p>
        </div>

        {/* Learning Objectives Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px 20px',
            marginBottom: '26px',
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-lime)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {ui.objectivesTitle}
          </h4>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {unit.learningObjectives?.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Educational YouTube Video Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Video size={18} color="#EF4444" />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>
                {unit.videoTitle || ui.videoTitle}
              </h3>
            </div>
            {watchUrl && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '11.5px',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(43, 209, 199, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(43, 209, 199, 0.25)',
                }}
              >
                <span>{ui.watchOnYoutube}</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>

          {/* Embedded Responsive YouTube Player */}
          {embedUrl ? (
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%', // 16:9 ratio
                height: 0,
                overflow: 'hidden',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.65)',
                background: '#0B0D12',
              }}
            >
              <iframe
                src={embedUrl}
                title={unit.videoTitle || 'Educational Video Lesson'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                color: 'var(--text-muted)',
              }}
            >
              <Video size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p style={{ fontSize: '13px' }}>Video lesson will be linked by your teacher shortly.</p>
            </div>
          )}
        </div>

        {/* Structured Lesson Content Guide */}
        <div style={{ marginBottom: '36px' }}>
          <h3 style={{ fontSize: '16.5px', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
            {ui.lessonGuideTitle}
          </h3>
          <div
            className="glass-panel-nested"
            style={{
              padding: '22px',
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              lineHeight: '1.65',
              borderRadius: '18px',
            }}
          >
            <p style={{ marginBottom: '12px' }}>
              {unit.lessonContent}
            </p>
            <div style={{ background: 'rgba(43, 209, 199, 0.08)', borderLeft: '3px solid var(--accent-cyan)', padding: '12px 16px', borderRadius: '0 12px 12px 0' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)', display: 'block', marginBottom: '4px' }}>
                {ui.ruralTipTitle}
              </span>
              <span style={{ fontSize: '12.5px', color: '#E2E8F0' }}>
                {ui.ruralTipText}
              </span>
            </div>
          </div>
        </div>

        {/* Independent Unit Quiz Section */}
        <div id="unit-quiz-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                {ui.unitLabel} {unit.unitNumberStr} {ui.quizSectionTitle}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {ui.quizSectionSub}
              </p>
            </div>
            <span className="badge-pill badge-lime">{ui.passingScoreBadge}</span>
          </div>

          {/* Results Screen if submitted */}
          {submittedResult ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: submittedResult.passed ? 'rgba(43, 209, 199, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  border: `2px solid ${submittedResult.passed ? 'var(--accent-cyan)' : 'var(--accent-orange)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: submittedResult.passed ? 'var(--accent-cyan)' : 'var(--accent-orange)',
                }}
              >
                <Award size={42} />
              </div>

              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                {ui.scoreDisplay(submittedResult.percentage, submittedResult.correctCount, submittedResult.total)}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {submittedResult.passed ? ui.passedMsg : ui.failedMsg}
              </p>

              {/* Newly Earned Badges Alert */}
              {newBadges.length > 0 && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(200, 245, 53, 0.15), rgba(43, 209, 199, 0.15))',
                    border: '1px solid var(--accent-lime)',
                    borderRadius: '20px',
                    padding: '18px 24px',
                    marginBottom: '26px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={18} color="var(--accent-lime)" />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{ui.unlockedBadges}</span>
                  </div>
                  {newBadges.map((b) => (
                    <div key={b.badgeId} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                      <Award size={16} color={b.color || 'var(--accent-lime)'} />
                      <span style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 500 }}>{b.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Detailed Review of Each Question */}
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  {ui.reviewTitle}
                </h4>
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={idx} className="glass-panel-nested" style={{ padding: '16px 20px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        ) : (
                          <XCircle size={18} color="#EF4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                        )}
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                            {ui.questionLabel(idx + 1)} {q.question}
                          </p>
                        </div>
                      </div>

                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: '28px' }}>
                        <p>
                          {ui.yourAnswer} <strong style={{ color: isCorrect ? 'var(--accent-cyan)' : '#EF4444' }}>{q.options[userAns] || ui.notAnswered}</strong>
                        </p>
                        {!isCorrect && (
                          <p style={{ color: 'var(--accent-lime)', marginTop: '3px' }}>
                            {ui.correctAnswer} <strong>{q.options[q.correctAnswer]}</strong>
                          </p>
                        )}
                        <p style={{ background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '8px', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <strong>{ui.explanation}</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Retake and Continue Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '30px', flexWrap: 'wrap' }}>
                <button className="btn-primary-glass" onClick={handleRetryQuiz} style={{ width: 'auto', padding: '10px 24px', gap: '8px' }}>
                  <RotateCcw size={14} />
                  <span>{ui.retakeBtn}</span>
                </button>
                <button className="btn-accent" onClick={onBack} style={{ padding: '10px 28px' }}>
                  {ui.backToUnitsBtn}
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Questions Form */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {questions.map((q, qIdx) => (
                <div key={q.id || qIdx} className="glass-panel-nested" style={{ padding: '20px', borderRadius: '18px' }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 500, color: '#FFFFFF', marginBottom: '14px' }}>
                    {ui.questionLabel(qIdx + 1)} {q.question}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            background: isSelected ? 'rgba(43, 209, 199, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                            border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                            borderRadius: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.2)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isSelected ? 'var(--accent-cyan)' : 'transparent',
                              color: '#0F141C',
                            }}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span style={{ fontSize: '13.5px', color: isSelected ? '#FFFFFF' : 'var(--text-secondary)' }}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting || Object.keys(selectedAnswers).length < questions.length}
                  className="btn-accent"
                  style={{
                    padding: '12px 32px',
                    fontSize: '14px',
                    opacity: Object.keys(selectedAnswers).length < questions.length ? 0.6 : 1,
                    cursor: Object.keys(selectedAnswers).length < questions.length ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? ui.submittingBtn : ui.submitQuizBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
