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
    background: isCompleted ? '#f8f9fa' : 'white',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    borderLeft: `5px solid ${isCompleted ? '#28a745' : isActive ? '#ffc107' : '#667eea'}`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    backgroundColor: isActive ? '#fffef7' : (isCompleted ? '#f8f9fa' : 'white'),
  };

  const exerciseHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  };

  const exerciseTitleStyle: React.CSSProperties = {
    fontSize: '1.4em',
    fontWeight: 600,
    color: '#333',
  };

  const exerciseRepsStyle: React.CSSProperties = {
    background: '#667eea',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '20px',
    fontWeight: 500,
  };

  const exerciseDetailsStyle: React.CSSProperties = {
    marginBottom: '15px',
  };

  const exerciseNotesStyle: React.CSSProperties = {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    borderLeft: '3px solid #17a2b8',
  };

  const videoContainerStyle: React.CSSProperties = {
    background: '#f8f9fa',
    border: '2px solid #667eea',
    borderRadius: '10px',
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
    color: timerComplete ? 'white' : '#333',
    background: timerComplete ? '#28a745' : '#f8f9fa',
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
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  };

  const btnPrimaryStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#667eea',
    color: 'white',
  };

  const btnSecondaryStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#6c757d',
    color: 'white',
  };

  const btnSuccessStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#28a745',
    color: 'white',
  };

  const btnWarningStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#ffc107',
    color: '#333',
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