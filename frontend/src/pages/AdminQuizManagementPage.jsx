import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Check, BookOpen, Layers, CheckCircle2, Video, ExternalLink, Trash2, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { extractYoutubeId, getYoutubeEmbedUrl, getYoutubeThumbnail } from '../utils/youtube';

export const AdminQuizManagementPage = () => {
  const { t } = useLanguage();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [units, setUnits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [msg, setMsg] = useState('');

  const [formUnit, setFormUnit] = useState({
    unitTitle: '',
    description: '',
    lessonContent: '',
    videoTitle: '',
    videoUrl: '',
    questions: []
  });

  const loadData = async () => {
    const cls = await api.getClasses();
    setClasses(cls);
    const subjs = await api.getSubjects();
    setSubjects(subjs);
    const uList = await api.getUnits(selectedClass, selectedSubject);
    setUnits(uList);
  };

  useEffect(() => {
    loadData();
  }, [selectedClass, selectedSubject]);

  const handleOpenEdit = (unit) => {
    setEditingUnit(unit);
    setFormUnit({
      unitTitle: unit.unitTitle,
      description: unit.description,
      lessonContent: unit.lessonContent,
      videoTitle: unit.videoTitle || `${unit.unitTitle} Video Lesson`,
      videoUrl: unit.videoUrl || '',
      questions: unit.questions ? JSON.parse(JSON.stringify(unit.questions)) : []
    });
    setShowModal(true);
  };

  const handleVideoUrlChange = (newUrl) => {
    setFormUnit(prev => ({
      ...prev,
      videoUrl: newUrl
    }));
  };

  const handleRemoveVideo = () => {
    setFormUnit(prev => ({
      ...prev,
      videoUrl: '',
      videoTitle: ''
    }));
  };

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    if (!editingUnit) return;

    // Normalize YouTube URL to embed format if valid ID found
    let normalizedEmbedUrl = formUnit.videoUrl;
    if (formUnit.videoUrl && formUnit.videoUrl.trim()) {
      const parsedEmbed = getYoutubeEmbedUrl(formUnit.videoUrl);
      if (parsedEmbed) {
        normalizedEmbedUrl = parsedEmbed;
      }
    }

    const updated = {
      ...editingUnit,
      unitTitle: formUnit.unitTitle,
      description: formUnit.description,
      lessonContent: formUnit.lessonContent,
      videoTitle: formUnit.videoTitle,
      videoUrl: normalizedEmbedUrl,
      thumbnailUrl: getYoutubeThumbnail(formUnit.videoUrl),
      questions: formUnit.questions
    };

    await api.saveUnit(updated);
    setShowModal(false);
    setMsg(`Unit ${editingUnit.unitNumberStr} and YouTube video saved successfully!`);
    setTimeout(() => setMsg(''), 3000);
    loadData();
  };

  const parsedEmbedPreviewUrl = getYoutubeEmbedUrl(formUnit.videoUrl);
  const hasValidVideo = Boolean(parsedEmbedPreviewUrl);

  return (
    <div>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px 30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">Curriculum & Video Governance</span>
              <span className="badge-pill badge-glass">1,400 Named Units Engine</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF' }}>
              Named Units, Video Lessons & Quizzes Management
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Add, replace, and preview educational YouTube videos and edit quizzes for 25 units across 7 Classes.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              SELECT ACADEMIC CLASS
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '12px', background: 'rgba(15, 18, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '13px' }}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.std})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              SELECT SUBJECT
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '12px', background: 'rgba(15, 18, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '13px' }}
            >
              {subjects.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {msg && (
        <div style={{ background: 'rgba(200, 245, 53, 0.15)', border: '1px solid var(--accent-lime)', color: '#FFFFFF', padding: '12px 18px', borderRadius: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="var(--accent-lime)" />
          <span>{msg}</span>
        </div>
      )}

      {/* 25 Named Units List for Selected Class & Subject */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
          25 Units for {classes.find(c => c.id === selectedClass)?.name} • {subjects.find(s => s.code === selectedSubject)?.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {units.map((unit) => {
            const hasVideo = Boolean(unit.videoUrl && unit.videoUrl.trim());
            return (
              <div
                key={unit.unitId}
                className="glass-panel-nested"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '16px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ maxWidth: '75%' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span className="badge-pill badge-glass" style={{ fontSize: '10px' }}>Unit {unit.unitNumberStr}</span>
                    <span className="badge-pill badge-lime" style={{ fontSize: '10px' }}>Published</span>
                    {hasVideo ? (
                      <span style={{ fontSize: '11px', color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '9999px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <Video size={11} /> Video Active
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>No Video Linked</span>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{unit.questions?.length || 5} Questions</span>
                  </div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#FFFFFF' }}>{unit.unitTitle}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{unit.description}</p>
                </div>

                <div>
                  <button
                    onClick={() => handleOpenEdit(unit)}
                    className="btn-accent"
                    style={{
                      padding: '7px 16px',
                      fontSize: '12px',
                      gap: '5px',
                    }}
                  >
                    <Edit2 size={12} />
                    <span>Edit Video & Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Unit & Video Modal with LIVE WORKING PREVIEW */}
      {showModal && editingUnit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '740px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
              Edit Unit {editingUnit.unitNumberStr}: {editingUnit.unitTitle}
            </h2>

            <form onSubmit={handleSaveUnit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Unit Title</label>
                <input
                  type="text"
                  required
                  value={formUnit.unitTitle}
                  onChange={(e) => setFormUnit({ ...formUnit, unitTitle: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                />
              </div>

              {/* YouTube Video Section with Live Preview */}
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '18px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Video size={18} color="#EF4444" />
                    <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#FFFFFF' }}>
                      Educational YouTube Video Settings
                    </h4>
                  </div>
                  {hasValidVideo && (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#F87171',
                        borderRadius: '9999px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={11} /> Remove Video
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Video Lesson Title
                    </label>
                    <input
                      type="text"
                      value={formUnit.videoTitle}
                      onChange={(e) => setFormUnit({ ...formUnit, videoTitle: e.target.value })}
                      placeholder="e.g. Fractions Explained for Kids"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      YouTube Video URL or ID (watch, youtu.be, or embed)
                    </label>
                    <input
                      type="text"
                      value={formUnit.videoUrl}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=M_Xn05fHqJg or M_Xn05fHqJg"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                {/* Live Working Video Preview Container */}
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Live Player Preview (Admin Test):
                  </span>

                  {hasValidVideo ? (
                    <div
                      style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: '#0D0F14',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                      }}
                    >
                      <iframe
                        src={parsedEmbedPreviewUrl}
                        title="Admin Video Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                        padding: '30px 20px',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px dashed rgba(255, 255, 255, 0.12)',
                        borderRadius: '14px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Video size={24} style={{ margin: '0 auto 6px', opacity: 0.5 }} />
                      <p style={{ fontSize: '12px' }}>Enter a valid YouTube video URL or ID above to see a live working player preview.</p>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                        Supports formats: youtube.com/watch?v=..., youtu.be/..., or bare video IDs
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={2}
                  value={formUnit.description}
                  onChange={(e) => setFormUnit({ ...formUnit, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Lesson Guide Content</label>
                <textarea
                  rows={4}
                  value={formUnit.lessonContent}
                  onChange={(e) => setFormUnit({ ...formUnit, lessonContent: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '13px' }}
                />
              </div>

              {/* Questions review/edit */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-lime)', marginBottom: '10px' }}>
                  Unit Quiz Questions ({formUnit.questions.length})
                </h4>
                {formUnit.questions.map((q, qIdx) => (
                  <div key={qIdx} className="glass-panel-nested" style={{ padding: '14px', borderRadius: '14px', marginBottom: '10px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Question {qIdx + 1}</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const copy = [...formUnit.questions];
                        copy[qIdx].question = e.target.value;
                        setFormUnit({ ...formUnit, questions: copy });
                      }}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '12.5px', marginBottom: '8px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {q.options.map((opt, optIdx) => (
                        <input
                          key={optIdx}
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const copy = [...formUnit.questions];
                            copy[qIdx].options[optIdx] = e.target.value;
                            setFormUnit({ ...formUnit, questions: copy });
                          }}
                          placeholder={`Option ${optIdx + 1}`}
                          style={{ padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: '11.5px' }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent"
                  style={{ padding: '8px 24px' }}
                >
                  Save Unit & Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
