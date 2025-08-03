interface StickyHeaderProps {
  show: boolean;
  completedCount: number;
  totalCount: number;
  timeElapsed: number;
  timeRemaining: number;
  progress: number;
  workoutPaused: boolean;
  onTogglePause: () => void;
}

export function StickyHeader({
  show,
  completedCount,
  totalCount,
  timeElapsed,
  timeRemaining,
  progress,
  workoutPaused,
  onTogglePause,
}: StickyHeaderProps) {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const stickyHeaderStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    padding: '12px 20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.07)',
    transition: 'transform 0.3s ease',
    transform: show ? 'translateY(0)' : 'translateY(-100%)',
    borderBottom: '1px solid #e5e7eb',
  };

  const headerContentStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const workoutTitleStyle: React.CSSProperties = {
    fontSize: '1.1em',
    fontWeight: 600,
    color: '#111827',
    whiteSpace: 'nowrap',
  };

  const miniStatsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  };

  const miniStatStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.9em',
    color: '#4b5563',
  };

  const miniStatNumberStyle: React.CSSProperties = {
    fontWeight: 600,
    color: '#4f46e5',
  };

  const progressBarStyle: React.CSSProperties = {
    flex: 1,
    height: '6px',
    background: '#f3f4f6',
    borderRadius: '3px',
    margin: '0',
    overflow: 'hidden',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
    width: `${progress}%`,
  };

  const timerPauseBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '1.2em',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.2s ease',
    marginLeft: '8px',
  };

  return (
    <div style={stickyHeaderStyle}>
      <div style={headerContentStyle}>
        <div style={workoutTitleStyle}>ATG Workout</div>
        <div style={miniStatsStyle}>
          <div style={miniStatStyle}>
            <span style={miniStatNumberStyle}>{completedCount}</span>
            <span>/</span>
            <span>{totalCount}</span>
          </div>
          <div style={miniStatStyle}>
            <span style={miniStatNumberStyle}>{formatTime(timeElapsed)}</span>
            <button 
              style={timerPauseBtnStyle}
              onClick={onTogglePause}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = workoutPaused ? 'rgba(255, 193, 7, 0.2)' : 'none'}
            >
              {workoutPaused ? '▶️' : '⏸️'}
            </button>
          </div>
          <div style={miniStatStyle}>
            <span style={miniStatNumberStyle}>{timeRemaining} min left</span>
          </div>
        </div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
      </div>
    </div>
  );
}