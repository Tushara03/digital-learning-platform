import React, { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle2, Clock, AlertCircle, Paperclip, Send, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const HomeworkPage = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [homeworkList, setHomeworkList] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedHw, setSelectedHw] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const studentClassId = currentUser?.classId;
  const studentClassName = currentUser?.className || 'Class';

  const loadData = async () => {
    if (!studentClassId) return;
    const list = await api.getHomework(studentClassId);
    setHomeworkList(list);

    const subs = await api.getSubmissions(null, currentUser?.id);
    setSubmissions(subs);
  };

  useEffect(() => {
    loadData();
  }, [studentClassId, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionText.trim() && !fileName) return;

    setIsSubmitting(true);
    try {
      await api.submitHomework({
        homeworkId: selectedHw.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        classId: studentClassId,
        submissionText,
        fileName: fileName || 'homework_solution.pdf',
      });
      setSuccessMsg('Homework task submitted successfully to your school teacher!');
      setSubmissionText('');
      setFileName('');
      await loadData();
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!studentClassId) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
        <AlertCircle size={36} color="var(--accent-orange)" style={{ margin: '0 auto 12px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
          Select Your Class First
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
          Tasks and homework are assigned class-wise. Please select your grade from the Class Selection page to view your assignments.
        </p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-pill badge-lime">{studentClassName}</span>
          <span className="badge-pill badge-glass">Assigned to Your Class</span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF' }}>{studentClassName} Homework & Tasks</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Complete class assignments, upload your solutions, and review teacher grading with marks and personalized feedback.
        </p>
      </div>

      {successMsg && (
        <div
          style={{
            background: 'rgba(43, 209, 199, 0.15)',
            border: '1px solid var(--accent-cyan)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
          }}
        >
          <CheckCircle2 size={18} color="var(--accent-cyan)" />
          <span>{successMsg}</span>
        </div>
      )}

      {homeworkList.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
          <Clock size={36} color="var(--text-dim)" style={{ margin: '0 auto 10px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
            No Pending Homework for {studentClassName}
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            Your teachers have not published any class tasks today. Check back later or review your 25 units!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedHw ? '1.2fr 1.8fr' : '1fr', gap: '20px' }}>
          {/* Homework list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {homeworkList.map((hw) => {
              const sub = submissions.find(s => s.homeworkId === hw.id);
              const isSelected = selectedHw?.id === hw.id;
              const isOverdue = !sub && hw.deadline && hw.deadline < todayStr;

              let statusBadge = (
                <span className="badge-pill badge-orange" style={{ fontSize: '10px' }}>
                  <Clock size={11} /> {t('homework.assigned')}
                </span>
              );

              if (isOverdue) {
                statusBadge = (
                  <span className="badge-pill" style={{ fontSize: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <AlertCircle size={11} /> Overdue
                  </span>
                );
              }

              if (sub) {
                if (sub.status === 'Reviewed') {
                  statusBadge = (
                    <span className="badge-pill badge-lime" style={{ fontSize: '10px' }}>
                      <CheckCircle2 size={11} /> {t('homework.reviewed')} ({sub.marks}/{hw.maxMarks})
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="badge-pill badge-cyan" style={{ fontSize: '10px' }}>
                      <CheckCircle2 size={11} /> {t('homework.submitted')}
                    </span>
                  );
                }
              }

              return (
                <div
                  key={hw.id}
                  className="glass-panel"
                  onClick={() => setSelectedHw(hw)}
                  style={{
                    padding: '20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                    background: isSelected ? 'rgba(25, 30, 42, 0.85)' : 'var(--bg-card)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge-pill badge-glass" style={{ fontSize: '10.5px' }}>
                      {hw.subjectName}
                    </span>
                    {statusBadge}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
                    {hw.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Deadline: {hw.deadline}</span>
                    <span>Max Marks: {hw.maxMarks}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Homework Detail & Submission Form */}
          {selectedHw && (
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className="badge-pill badge-glass" style={{ fontSize: '11px', marginBottom: '6px' }}>
                    {selectedHw.subjectName} • Deadline: {selectedHw.deadline}
                  </span>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginTop: '4px' }}>
                    {selectedHw.title}
                  </h2>
                </div>
              </div>

              {/* Instructions */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Instructions
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {selectedHw.instructions}
                </p>
                {selectedHw.attachments?.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    {selectedHw.attachments.map((att, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          background: 'rgba(255, 255, 255, 0.07)',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          color: 'var(--accent-cyan)',
                        }}
                      >
                        <Paperclip size={12} /> {att.name} ({att.size || 'Attachment'})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* If submission exists, show status, feedback and marks */}
              {(() => {
                const sub = submissions.find(s => s.homeworkId === selectedHw.id);
                if (sub) {
                  return (
                    <div className="glass-panel-nested" style={{ padding: '20px', borderRadius: '16px' }}>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '10px' }}>
                        {t('homework.yourSubmission')}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#FFFFFF', marginBottom: '10px' }}>
                        {sub.submissionText}
                      </p>
                      {sub.fileName && (
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                          <Paperclip size={12} /> Attached: {sub.fileName} (Submitted at {sub.submittedAt})
                        </div>
                      )}

                      {sub.status === 'Reviewed' ? (
                        <div style={{ background: 'rgba(200, 245, 53, 0.1)', border: '1px solid rgba(200, 245, 53, 0.25)', borderRadius: '12px', padding: '14px', marginTop: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-lime)' }}>
                              {t('homework.marks')}: {sub.marks} / {selectedHw.maxMarks}
                            </span>
                            <span className="badge-pill badge-lime" style={{ fontSize: '10px' }}>Reviewed</span>
                          </div>
                          <p style={{ fontSize: '12.5px', color: '#FFFFFF' }}>
                            <strong>{t('homework.feedback')}:</strong> {sub.feedback}
                          </p>
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Submitted and waiting for teacher review and grading.
                        </div>
                      )}
                    </div>
                  );
                }

                // Otherwise render submission form
                return (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {t('homework.typeAnswer')}
                      </label>
                      <textarea
                        rows={4}
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Write your explanation, steps, or answers..."
                        required
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '14px',
                          padding: '12px 14px',
                          color: '#FFFFFF',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {t('homework.uploadFile')} (Image / Document / PDF)
                      </label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="file"
                          id="hw-upload-input"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setFileName(e.target.files[0].name);
                            }
                          }}
                        />
                        <label
                          htmlFor="hw-upload-input"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                          }}
                        >
                          <Upload size={13} />
                          <span>Choose File</span>
                        </label>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {fileName || 'No file chosen'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-accent"
                      style={{ width: '100%', padding: '12px' }}
                    >
                      {isSubmitting ? 'Uploading...' : t('homework.submitAssignment')}
                    </button>
                  </form>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
