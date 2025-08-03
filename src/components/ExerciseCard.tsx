import { useState, useEffect, useRef } from 'react';
import { VideoPlayer } from './VideoPlayer';

interface ExerciseData {
  videoId: string;
  startTime?: number;
  timeMinutes: number;
  thumbnail: string;
  title: string;
  reps: string;
  notes?: string;
  videoTitle: string;
  videoDescription: string;
}

interface ExerciseCardProps {
  id: string;
  exercise: ExerciseData;
  isCompleted: boolean;
  isActive: boolean;
  onComplete: (id: string) => void;
}

export function ExerciseCard({ id, exercise, isCompleted, isActive, onComplete }: ExerciseCardProps) {
  const [timerTime, setTimerTime] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize timer based on exercise reps
  useEffect(() => {
    if (exercise.reps.includes('minutes')) {
      const minutes = parseInt(exercise.reps);
      setTimerTime(minutes * 60);
    } else if (exercise.reps.includes('seconds')) {
      const seconds = parseInt(exercise.reps);
      setTimerTime(seconds);
    }
  }, [exercise.reps]);

  // Auto scroll to active exercise
  useEffect(() => {
    if (isActive && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [isActive]);

  const startTimer = () => {
    if (timerTime === null) return;
    setTimerRunning(true);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  useEffect(() => {
    if (timerRunning && timerTime !== null && timerTime > 0) {
      timerRef.current = setInterval(() => {
        setTimerTime(prev => {
          if (prev === null || prev <= 1) {
            setTimerRunning(false);
            setTimerComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning, timerTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const exerciseCardStyle: React.CSSProperties = {
    background: isActive ? '#fafaff' : (isCompleted ? '#f9fafb' : '#ffffff'),
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    borderLeft: `6px solid ${isCompleted ? '#22c55e' : isActive ? '#f59e0b' : '#6366f1'}`,
    transition: 'all 0.3s ease',
    transform: isActive ? 'scale(1.02)' : 'scale(1)',
  };

  const exerciseHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const exerciseTitleStyle: React.CSSProperties = {
    fontSize: '1.25em',
    fontWeight: 600,
    color: '#1f2937',
  };

  const exerciseRepsStyle: React.CSSProperties = {
    background: '#eef2ff',
    color: '#4338ca',
    padding: '6px 12px',
    borderRadius: '9999px',
    fontWeight: 500,
    fontSize: '0.875em',
  };

  const exerciseDetailsStyle: React.CSSProperties = {
    marginBottom: '15px',
  };

  const exerciseNotesStyle: React.CSSProperties = {
    background: '#f0f9ff',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    borderLeft: '4px solid #38bdf8',
    color: '#075985',
    fontSize: '0.9em',
  };

  const videoContainerStyle: React.CSSProperties = {
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '15px',
    textAlign: 'center',
  };

  const videoHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  }

  const videoPlayerWrapperStyle: React.CSSProperties = {
    maxHeight: videoExpanded ? '500px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.5s ease-in-out',
  };

  const timerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  };

  const timerDisplayStyle: React.CSSProperties = {
    fontSize: '1.2em',
    fontWeight: 600,
    color: timerComplete ? 'white' : '#1f2937',
    background: timerComplete ? '#22c55e' : '#f3f4f6',
    padding: '8px 15px',
    borderRadius: '8px',
  };

  const timerControlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  };

  const btnStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    background: '#ffffff',
    color: '#374151',
  };

  const btnPrimaryStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#4f46e5',
    color: 'white',
    border: 'none',
  };

  const btnSecondaryStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#6b7280',
    color: 'white',
    border: 'none',
  };

  const btnSuccessStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#22c55e',
    color: 'white',
    border: 'none',
  };

  const btnWarningStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#f59e0b',
    color: 'white',
    border: 'none',
  };

  return (
    <div
      ref={cardRef}
      style={exerciseCardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={exerciseHeaderStyle}>
        <div style={exerciseTitleStyle}>{exercise.title}</div>
        <div style={exerciseRepsStyle}>{exercise.reps}</div>
      </div>
      <div style={exerciseDetailsStyle}>
        {exercise.notes && (
          <div style={exerciseNotesStyle}>
            <strong>{exercise.notes}</strong>
          </div>
        )}
        <div style={videoContainerStyle}>
          <div style={videoHeaderStyle} onClick={() => setVideoExpanded(!videoExpanded)}>
            <div>
              <h3 style={{fontSize: '1.1em', fontWeight: 600, color: '#333', margin: 0, textAlign: 'left'}}>
                {exercise.videoTitle}
              </h3>
              <p style={{color: '#666', fontSize: '0.9em', margin: 0, textAlign: 'left'}}>{exercise.videoDescription}</p>
            </div>
            <span style={{fontSize: '1.5em'}}>{videoExpanded ? '▲' : '▼'}</span>
          </div>
          <div style={videoPlayerWrapperStyle}>
            <div style={{paddingTop: '15px'}}>
              <VideoPlayer
                videoId={exercise.videoId}
                startTime={exercise.startTime}
                thumbnail={exercise.thumbnail}
              />
            </div>
          </div>
        </div>
        
        {timerTime !== null && (
          <div style={timerStyle}>
            <div style={timerDisplayStyle}>
              {timerComplete ? 'Complete!' : formatTime(timerTime)}
            </div>
            <div style={timerControlsStyle}>
              <button 
                style={btnPrimaryStyle}
                onClick={startTimer}
                disabled={timerRunning || timerComplete}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#5a6fd8')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#667eea')}
              >
                Start
              </button>
              <button 
                style={btnSecondaryStyle}
                onClick={pauseTimer}
                disabled={!timerRunning}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#5a6268')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#6c757d')}
              >
                Pause
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {id === 'step6' && (
            <button 
              style={btnWarningStyle}
              onClick={() => onComplete(id)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e0a800'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffc107'}
            >
              Skip
            </button>
          )}
          <button 
            style={btnSuccessStyle}
            onClick={() => onComplete(id)}
            onMouseEnter={(e) => e.currentTarget.style.background = '#218838'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#28a745'}
          >
            Complete {exercise.reps.includes('reps') ? exercise.reps : ''}
          </button>
        </div>
      </div>
    </div>
  );
}