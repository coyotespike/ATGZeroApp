import { useState, useEffect, useRef } from 'react';
import { EXERCISE_DATA, EXERCISE_ORDER } from './data';
import { StickyHeader } from './components/StickyHeader';
import { Stats } from './components/Stats';
import { ExerciseCard } from './components/ExerciseCard';

function App() {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [workoutPausedTime, setWorkoutPausedTime] = useState(0);
  const [workoutPaused, setWorkoutPaused] = useState(false);
  const [workoutPauseStartTime, setWorkoutPauseStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setShowStickyHeader(headerBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('atgWorkoutState');
    if (savedState) {
      const {
        completed,
        active,
        startTime,
        pausedTime,
      } = JSON.parse(savedState);
      setCompletedExercises(completed);
      setActiveExercise(active);
      setWorkoutStartTime(startTime);
      setWorkoutPausedTime(pausedTime);
    } else {
      setActiveExercise(EXERCISE_ORDER[0]);
      setWorkoutStartTime(Date.now());
    }
  }, []);

  useEffect(() => {
    if (workoutStartTime) {
      const state = {
        completed: completedExercises,
        active: activeExercise,
        startTime: workoutStartTime,
        pausedTime: workoutPausedTime,
      };
      localStorage.setItem('atgWorkoutState', JSON.stringify(state));
    }
  }, [completedExercises, activeExercise, workoutStartTime, workoutPausedTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (workoutStartTime && !workoutPaused) {
      timer = setInterval(() => {
        setTimeElapsed(Date.now() - workoutStartTime - workoutPausedTime);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [workoutStartTime, workoutPaused, workoutPausedTime]);

  const calculateTimeRemaining = () => {
    return EXERCISE_ORDER.reduce((total, id) => {
      if (!completedExercises.includes(id)) {
        return total + (EXERCISE_DATA[id as keyof typeof EXERCISE_DATA].timeMinutes || 0);
      }
      return total;
    }, 0);
  };

  const handleCompleteExercise = (id: string) => {
    if (!completedExercises.includes(id)) {
      const newCompleted = [...completedExercises, id];
      setCompletedExercises(newCompleted);

      const currentIndex = EXERCISE_ORDER.indexOf(id);
      const nextExercise = EXERCISE_ORDER[currentIndex + 1];
      setActiveExercise(nextExercise || null);

      if (newCompleted.length === EXERCISE_ORDER.length) {
        localStorage.removeItem('atgWorkoutState');
      }
    }
  };

  const toggleWorkoutPause = () => {
    if (workoutPaused) {
      // Resume - add pause duration to total paused time
      if (workoutPauseStartTime) {
        setWorkoutPausedTime(prev => prev + (Date.now() - workoutPauseStartTime));
      }
      setWorkoutPaused(false);
      setWorkoutPauseStartTime(null);
    } else {
      // Pause - record when pause started
      setWorkoutPaused(true);
      setWorkoutPauseStartTime(Date.now());
    }
  };

  const resetWorkout = () => {
    if (window.confirm('Reset workout progress?')) {
      setCompletedExercises([]);
      setActiveExercise(EXERCISE_ORDER[0]);
      setWorkoutStartTime(Date.now());
      setWorkoutPausedTime(0);
      setWorkoutPaused(false);
      setWorkoutPauseStartTime(null);
      setTimeElapsed(0);
    }
  };

  const timeRemaining = calculateTimeRemaining();
  const progress = (completedExercises.length / EXERCISE_ORDER.length) * 100;

  const containerStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '30px 40px',
    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.08)',
    paddingTop: showStickyHeader ? '110px' : '30px',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
  };

  const headerTitleStyle: React.CSSProperties = {
    color: '#111827',
    fontSize: '2.25em',
    fontWeight: 700,
    marginBottom: '10px',
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '10px',
    background: '#f3f4f6',
    borderRadius: '5px',
    margin: '20px 0',
    overflow: 'hidden',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
    width: `${progress}%`,
  };

  const resetBtnStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    background: '#ffffff',
    color: '#374151',
    marginTop: '15px',
    fontSize: '0.9em',
  };

  const completionBannerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #10b981, #34d399)',
    color: 'white',
    padding: '25px',
    borderRadius: '16px',
    textAlign: 'center',
    marginBottom: '20px',
    animation: 'slideIn 0.5s ease',
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #e0e7ff 0%, #d1fae5 100%)',
    minHeight: '100vh',
    padding: '20px',
  };

  return (
    <div style={bodyStyle}>
      <StickyHeader
        show={showStickyHeader}
        completedCount={completedExercises.length}
        totalCount={EXERCISE_ORDER.length}
        timeElapsed={timeElapsed}
        timeRemaining={timeRemaining}
        progress={progress}
        workoutPaused={workoutPaused}
        onTogglePause={toggleWorkoutPause}
      />
      <div style={containerStyle}>
        <div style={headerStyle} ref={headerRef}>
          <h1 style={headerTitleStyle}>ATG Picture Book Workout</h1>
          <Stats
            completedCount={completedExercises.length}
            totalCount={EXERCISE_ORDER.length}
            timeElapsed={timeElapsed}
            timeRemaining={timeRemaining}
          />
          <div style={progressBarStyle}>
            <div style={progressFillStyle}></div>
          </div>
          <button 
            style={resetBtnStyle} 
            onClick={resetWorkout}
            onMouseEnter={(e) => e.currentTarget.style.background = '#5a6268'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#6c757d'}
          >
            Reset Workout
          </button>
        </div>

        {completedExercises.length === EXERCISE_ORDER.length && (
          <div style={completionBannerStyle}>
            <h2>🎉 Congratulations! You've completed the ATG Picture Book Workout!</h2>
          </div>
        )}

        {EXERCISE_ORDER.map((id) => {
          const exercise = EXERCISE_DATA[id as keyof typeof EXERCISE_DATA];
          const isCompleted = completedExercises.includes(id);
          const isActive = activeExercise === id;

          return (
            <ExerciseCard
              key={id}
              id={id}
              exercise={exercise}
              isCompleted={isCompleted}
              isActive={isActive}
              onComplete={handleCompleteExercise}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;