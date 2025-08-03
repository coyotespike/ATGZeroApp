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
    maxWidth: '1000px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    paddingTop: showStickyHeader ? '110px' : '30px',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '3px solid #667eea',
  };

  const headerTitleStyle: React.CSSProperties = {
    color: '#333',
    fontSize: '2.5em',
    marginBottom: '10px',
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    background: '#e0e0e0',
    borderRadius: '4px',
    margin: '20px 0',
    overflow: 'hidden',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
    width: `${progress}%`,
  };

  const resetBtnStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    background: '#6c757d',
    color: 'white',
    marginTop: '15px',
    fontSize: '0.9em',
  };

  const completionBannerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: 'white',
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    marginBottom: '20px',
    animation: 'slideIn 0.5s ease',
  };

  return (
    <>
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
    </>
  );
}

export default App;