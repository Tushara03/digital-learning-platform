import React, { useState } from 'react';
import { Sparkles, BookOpen, Calculator, Leaf, Compass, Cpu, Award, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const SelectClassPage = ({ onClassSelected }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [selectedClassId, setSelectedClassId] = useState(currentUser?.classId || 'c1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classes = [
    {
      id: 'c1',
      name: 'Class 1',
      std: '1st STD',
      stage: 'Foundational Stage',
      desc: 'Early letters, numbers, colors, shapes & picture stories',
      icon: Sparkles,
      color: '#C8F535'
    },
    {
      id: 'c2',
      name: 'Class 2',
      std: '2nd STD',
      stage: 'Foundational Stage',
      desc: 'Reading fluency, 2-digit arithmetic, nature & senses',
      icon: BookOpen,
      color: '#2BD1C7'
    },
    {
      id: 'c3',
      name: 'Class 3',
      std: '3rd STD',
      stage: 'Preparatory Stage',
      desc: 'Sentence building, multiplication, plant & animal life',
      icon: Calculator,
      color: '#38BDF8'
    },
    {
      id: 'c4',
      name: 'Class 4',
      std: '4th STD',
      stage: 'Preparatory Stage',
      desc: 'Grammar mastery, fractions, geometry & Indian geography',
      icon: Leaf,
      color: '#F59E0B'
    },
    {
      id: 'c5',
      name: 'Class 5',
      std: '5th STD',
      stage: 'Preparatory Stage',
      desc: 'Advanced decimals, punctuation, ecosystems & coding',
      icon: Compass,
      color: '#EC4899'
    },
    {
      id: 'c6',
      name: 'Class 6',
      std: '6th STD',
      stage: 'Middle School Stage',
      desc: 'Algebra foundations, integers, human anatomy & history',
      icon: Cpu,
      color: '#A855F7'
    },
    {
      id: 'c7',
      name: 'Class 7',
      std: '7th STD',
      stage: 'Middle School Stage',
      desc: 'Equations, physics & chemistry basics, literary essays',
      icon: Award,
      color: '#10B981'
    },
  ];

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      await api.selectStudentClass(currentUser.id, selectedClassId);
      if (onClassSelected) {
        onClassSelected(selectedClassId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 10px 40px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(200, 245, 53, 0.1)',
            border: '1px solid rgba(200, 245, 53, 0.25)',
            borderRadius: '9999px',
            color: 'var(--accent-lime)',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '14px',
          }}
        >
          <ShieldCheck size={14} />
          <span>Student Grade Enrollment</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.5px', marginBottom: '8px' }}>
          Select Your Class
        </h1>
        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
          Choose your current class to start your personalized learning journey with grade-specific subjects and 25 named units.
        </p>
      </div>

      {/* 7 Selectable Class Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
          marginBottom: '36px',
        }}
      >
        {classes.map((cls) => {
          const isSelected = selectedClassId === cls.id;
          const IconComp = cls.icon;

          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className="glass-panel"
              style={{
                padding: '24px 20px',
                borderRadius: '24px',
                cursor: 'pointer',
                position: 'relative',
                border: isSelected ? `2px solid ${cls.color}` : '1px solid var(--border-glass)',
                background: isSelected
                  ? `linear-gradient(135deg, rgba(25, 30, 42, 0.9), rgba(15, 18, 26, 0.95))`
                  : 'var(--bg-card)',
                boxShadow: isSelected ? `0 12px 30px -8px ${cls.color}40, inset 0 1px 0 rgba(255,255,255,0.15)` : 'none',
                transform: isSelected ? 'translateY(-3px)' : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Checkmark bubble if selected */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: cls.color,
                    color: '#0F141C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 12px ${cls.color}`,
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              )}

              {/* Icon Container */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: isSelected ? `${cls.color}25` : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isSelected ? cls.color : 'rgba(255, 255, 255, 0.1)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: isSelected ? cls.color : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconComp size={24} />
              </div>

              {/* Class Name & STD Badge */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#FFFFFF' }}>{cls.name}</h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: cls.color,
                    background: `${cls.color}15`,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: `1px solid ${cls.color}30`,
                  }}
                >
                  {cls.std}
                </span>
              </div>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                {cls.stage}
              </span>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
                {cls.desc}
              </p>

              <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>8 Subjects</span>
                <span>25 Named Units</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Action Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleContinue}
          disabled={isSubmitting}
          className="btn-accent"
          style={{
            padding: '14px 40px',
            fontSize: '15px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '9999px',
            boxShadow: '0 8px 25px rgba(200, 245, 53, 0.35)',
            cursor: 'pointer',
          }}
        >
          <span>{isSubmitting ? 'Loading Class Curriculum...' : `Continue to ${classes.find(c => c.id === selectedClassId)?.name || 'Class'}`}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
