interface StatsProps {
  completedCount: number;
  totalCount: number;
  timeElapsed: number;
  timeRemaining: number;
}

export function Stats({ completedCount, totalCount, timeElapsed, timeRemaining }: StatsProps) {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const statsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  };

  const statCardStyle: React.CSSProperties = {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '2em',
    fontWeight: 600,
    color: '#667eea',
  };

  const statLabelStyle: React.CSSProperties = {
    color: '#6c757d',
    marginTop: '5px',
  };

  return (
    <div style={statsStyle}>
      <div style={statCardStyle}>
        <div style={statNumberStyle}>{completedCount}</div>
        <div style={statLabelStyle}>Completed</div>
      </div>
      <div style={statCardStyle}>
        <div style={statNumberStyle}>{totalCount}</div>
        <div style={statLabelStyle}>Total Steps</div>
      </div>
      <div style={statCardStyle}>
        <div style={statNumberStyle}>{formatTime(timeElapsed)}</div>
        <div style={statLabelStyle}>Time Elapsed</div>
      </div>
      <div style={statCardStyle}>
        <div style={statNumberStyle}>{timeRemaining} min remaining</div>
        <div style={statLabelStyle}>Est. Remaining</div>
      </div>
    </div>
  );
}