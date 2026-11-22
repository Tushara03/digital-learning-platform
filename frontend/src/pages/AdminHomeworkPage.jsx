import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Clock, FileText, Paperclip, Award, Send, Filter, Users, Upload, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const AdminHomeworkPage = () => {
  const { t } = useLanguage();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' or 'submissions'
  const [filterClass, setFilterClass] = useState('all');

  // Assign Task Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formClassId, setFormClassId] = useState('c1');
  const [formSubjectCode, setFormSubjectCode] = useState('mathematics');
  const [formTitle, setFormTitle] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formDeadline, setFormDeadline] = useState('2026-12-10');
  const [formMaxMarks, setFormMaxMarks] = useState(20);
  const [attachmentName, setAttachmentName] = useState('');

  // Review & Grading Modal state
  const [gradingSub, setGradingSub] = useState(null);
  const [inputMarks, setInputMarks] = useState(18);
  const [inputFeedback, setInputFeedback] = useState('Good effort, clean solution steps!');
  const [bannerMsg, setBannerMsg] = useState('');

  const loadData = async () => {
    const cls = await api.getClasses();
    setClasses(cls);
    const subjs = await api.getSubjects();
    setSubjects(subjs);
    const hw = await api.getHomework();
    setHomeworkList(hw);
    const subs = await api.getSubmissions();
    setSubmissions(subs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    const classObj = classes.find(c => c.id === formClassId);
    const subjObj = subjects.find(s => s.code === formSubjectCode);

    const attachments = attachmentName ? [{ name: attachmentName, size: '250 KB', url: '#' }] : [];

    await api.createHomework({
      classId: formClassId,
      className: classObj?.name || 'Class 1',
      subjectCode: formSubjectCode,
      subjectName: subjObj?.name || 'Mathematics',
      title: formTitle,
      instructions: formInstructions,
      deadline: formDeadline,
      maxMarks: parseInt(formMaxMarks, 10),
      attachments,
      targetScope: 'whole_class' // Explicitly assigned to entire class!
    });

    setShowCreateModal(false);
    setFormTitle('');
    setFormInstructions('');
    setAttachmentName('');
    setBannerMsg(`Task successfully assigned to all students in ${classObj?.name} (${classObj?.std})!`);
    setTimeout(() => setBannerMsg(''), 4500);
    loadData();
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!gradingSub) return;

    await api.gradeSubmission(gradingSub.id, parseInt(inputMarks, 10), inputFeedback);
    setGradingSub(null);
    setBannerMsg(`Submission evaluated for ${gradingSub.studentName} with ${inputMarks} marks!`);
    setTimeout(() => setBannerMsg(''), 4000);
    loadData();
  };

  const filteredHomework = filterClass === 'all'
    ? homeworkList
    : homeworkList.filter(h => h.classId === filterClass);

  const filteredSubmissions = filterClass === 'all'
    ? submissions
    : submissions.filter(s => {
        const hw = homeworkList.find(h => h.id === s.homeworkId);
        return hw && hw.classId === filterClass;
      });

  return (
    <div>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px 30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">Class-Wide Homework System</span>
              <span className="badge-pill badge-glass">{homeworkList.length} Active Tasks</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF' }}>Homework & Task Management</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Assign tasks directly to entire classes (Grades 1 to 7). All registered students in that class receive the task automatically.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-accent"
              onClick={() => setShowCreateModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <Plus size={15} /> Assign Task
            </button>
          </div>
        </div>

        {/* Tab & Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('assignments')}
              style={{
                padding: '7px 18px',
                borderRadius: '9999px',
                background: activeTab === 'assignments' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: activeTab === 'assignments' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: activeTab === 'assignments' ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              Class Tasks ({homeworkList.length})
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              style={{
                padding: '7px 18px',
                borderRadius: '9999px',
                background: activeTab === 'submissions' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: activeTab === 'submissions' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: activeTab === 'submissions' ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              Student Submissions ({submissions.length})
            </button>
          </div>

          {/* Filter by Class */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Filter Class:</span>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(15, 18, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '12px' }}
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.std})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {bannerMsg && (
        <div style={{ background: 'rgba(43, 209, 199, 0.15)', border: '1px solid var(--accent-cyan)', color: '#FFFFFF', padding: '12px 18px', borderRadius: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="var(--accent-cyan)" />
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* Tab 1: Class Tasks List */}
      {activeTab === 'assignments' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredHomework.map((hw) => {
            const classObj = classes.find(c => c.id === hw.classId);
            const taskSubs = submissions.filter(s => s.homeworkId === hw.id);
            return (
              <div key={hw.id} className="glass-panel" style={{ padding: '22px', borderRadius: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className="badge-pill badge-lime">{classObj?.name || hw.className}</span>
                    <span className="badge-pill badge-glass">{hw.subjectName}</span>
                  </div>
                  <span className="badge-pill badge-cyan" style={{ fontSize: '10px' }}>
                    <Users size={11} /> Whole Class
                  </span>
                </div>

                <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>{hw.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
                  {hw.instructions}
                </p>

                {hw.attachments?.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
                    <Paperclip size={12} /> Attachment: {hw.attachments[0].name}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>Deadline: {hw.deadline}</span>
                  <span style={{ color: taskSubs.length > 0 ? 'var(--accent-lime)' : 'var(--text-dim)' }}>
                    {taskSubs.length} Submissions
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Tab 2: Submissions Table & Review */
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          {filteredSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
              No submissions found for the selected class.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '12px 14px' }}>STUDENT</th>
                  <th style={{ padding: '12px 14px' }}>TASK & SUBMISSION</th>
                  <th style={{ padding: '12px 14px' }}>SUBMITTED AT</th>
                  <th style={{ padding: '12px 14px' }}>STATUS & MARKS</th>
                  <th style={{ padding: '12px 14px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => {
                  const hw = homeworkList.find(h => h.id === sub.homeworkId);
                  const isReviewed = sub.status === 'Reviewed';
                  return (
                    <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '13px' }}>
                      <td style={{ padding: '14px', fontWeight: 500, color: '#FFFFFF' }}>{sub.studentName}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', display: 'block' }}>{hw?.title || 'Class Task'}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>"{sub.submissionText}"</span>
                        {sub.fileName && (
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                            <Paperclip size={11} /> {sub.fileName}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '12px' }}>{sub.submittedAt}</td>
                      <td style={{ padding: '14px' }}>
                        {isReviewed ? (
                          <span className="badge-pill badge-lime" style={{ fontSize: '11px' }}>
                            Graded: {sub.marks} / {hw?.maxMarks || 20}
                          </span>
                        ) : (
                          <span className="badge-pill badge-orange" style={{ fontSize: '11px' }}>Pending Review</span>
                        )}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <button
                          onClick={() => {
                            setGradingSub(sub);
                            setInputMarks(sub.marks || 18);
                            setInputFeedback(sub.feedback || 'Good work!');
                          }}
                          style={{
                            padding: '6px 14px',
                            background: isReviewed ? 'rgba(255,255,255,0.08)' : 'var(--accent-lime)',
                            border: 'none',
                            borderRadius: '9999px',
                            color: isReviewed ? '#FFFFFF' : '#0F141C',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isReviewed ? 'Update Grade' : 'Grade & Feedback'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Assign Task Modal (Class-Wise Only, No Individual Selection) */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '30px', borderRadius: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Users size={18} color="var(--accent-lime)" />
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>
                  Assign Task to an Entire Class
                </h2>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Select any grade from Class 1 to 7. All students in this class will receive this task automatically.
              </p>
            </div>

            <form onSubmit={handleAssignTask}>
              {/* Class and Subject Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Select Class (Grade 1 - 7)
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(15, 18, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '13px' }}
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.std})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Select Subject
                  </label>
                  <select
                    value={formSubjectCode}
                    onChange={(e) => setFormSubjectCode(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(15, 18, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '13px' }}
                  >
                    {subjects.map(s => (
                      <option key={s.code} value={s.code}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Task Title */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Task Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Fractions Worksheet or Plant Leaf Observation"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                />
              </div>

              {/* Instructions */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Task Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="Explain the questions, problems, or steps students should complete..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '13px' }}
                />
              </div>

              {/* Optional Attachment */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Optional Attachment (File Name or Document)
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    placeholder="e.g. Unit_Worksheet_Class.pdf"
                    style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '12.5px' }}
                  />
                  <label
                    style={{
                      padding: '9px 14px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#E2E8F0',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Upload size={13} /> Upload
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) setAttachmentName(e.target.files[0].name);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Deadline & Max Marks */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Submission Deadline</label>
                  <input
                    type="date"
                    required
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(15, 18, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Max Marks</label>
                  <input
                    type="number"
                    value={formMaxMarks}
                    onChange={(e) => setFormMaxMarks(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent"
                  style={{ padding: '9px 26px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Grade Modal */}
      {gradingSub && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '30px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              Evaluate Submission: {gradingSub.studentName}
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '12px' }}>
              Student Answer: "{gradingSub.submissionText}"
            </p>

            <form onSubmit={handleGradeSubmission}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Awarded Marks</label>
                <input
                  type="number"
                  required
                  value={inputMarks}
                  onChange={(e) => setInputMarks(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Personalized Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={inputFeedback}
                  onChange={(e) => setInputFeedback(e.target.value)}
                  placeholder="Give encouragement, corrections, or praise..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent"
                  style={{ padding: '8px 24px' }}
                >
                  Save & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
