import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Award, Check } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { QUIZ_UI_STRINGS } from '../services/languageCurriculum';

export const QuizPlayerPage = ({ quizId, onBack }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [quiz, setQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedResult, setSubmittedResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const q = await api.getQuizById(quizId);
      setQuiz(q);
    };
    fetchQuiz();
  }, [quizId]);

  if (!quiz) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>{t('common.loading')}</p>
      </div>
    );
  }

  // Language mapping: Kannada or Hindi or Default
  const langKey = quiz.subjectCode === 'kannada' ? 'kannada' : (quiz.subjectCode === 'hindi' ? 'hindi' : 'default');
  const ui = QUIZ_UI_STRINGS[langKey] || QUIZ_UI_STRINGS.default;

  const questions = quiz.questions || [];
  const currentQ = questions[currentQIndex] || { question: '', options: [] };

  const handleSelectOption = (optIndex) => {
    if (submittedResult) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const result = await api.submitQuiz(quiz.id, currentUser.id, selectedAnswers);
      setSubmittedResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmittedResult(null);
    setCurrentQIndex(0);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Header back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          padding: '6px 14px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={14} />
        <span>{ui.backToUnitsBtn}</span>
      </button>

      {/* Quiz Card */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* Title bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-cyan">{quiz.className}</span>
              <span className="badge-pill badge-lime">{quiz.subjectName}</span>
              <span className="badge-pill badge-glass">{ui.unitLabel} #{quiz.quizNumber}</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF' }}>{quiz.title}</h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {questions.length} Questions • {ui.passingScoreBadge}
          </span>
        </div>

        {/* Result Screen if submitted */}
        {submittedResult ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
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
              <Award size={40} />
            </div>

            <h3 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
              {ui.scoreDisplay(submittedResult.percentage, submittedResult.correctCount, submittedResult.total)}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              {submittedResult.passed ? ui.passedMsg : ui.failedMsg}
            </p>

            {/* Detailed Questions Review */}
            <div style={{ textAlign: 'left', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                {ui.reviewTitle}
              </h4>
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div key={idx} className="glass-panel-nested" style={{ padding: '16px 20px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
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

            {/* Retry Button */}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-primary-glass" onClick={handleRetry} style={{ maxWidth: '240px' }}>
                <RotateCcw size={15} />
                <span>{ui.retakeBtn}</span>
              </button>
              <button className="btn-accent" onClick={onBack} style={{ padding: '10px 24px' }}>
                {ui.backToUnitsBtn}
              </button>
            </div>
          </div>
        ) : (
          /* Question View */
          <div>
            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentQIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '24px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((currentQIndex + 1) / questions.length) * 100}%`,
                  background: 'var(--accent-cyan)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Question Text */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16.5px', fontWeight: 500, color: '#FFFFFF', lineHeight: '1.5' }}>
                {ui.questionLabel(currentQIndex + 1)} {currentQ.question}
              </h3>
            </div>

            {/* 4 Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {currentQ.options?.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQIndex] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      background: isSelected ? 'rgba(43, 209, 199, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.2)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected ? 'var(--accent-cyan)' : 'transparent',
                        color: '#0D1117',
                      }}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: '14px', color: isSelected ? '#FFFFFF' : 'var(--text-secondary)', fontWeight: isSelected ? 500 : 400 }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Nav between questions and submit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                style={{
                  padding: '8px 18px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  color: currentQIndex === 0 ? 'var(--text-dim)' : 'var(--text-secondary)',
                  cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                }}
              >
                Previous
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  style={{
                    padding: '8px 22px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 24px',
                    background: 'var(--accent-lime)',
                    border: 'none',
                    borderRadius: '9999px',
                    color: '#0F141C',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? ui.submittingBtn : ui.submitQuizBtn}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
