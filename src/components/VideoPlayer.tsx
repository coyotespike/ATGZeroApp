import { useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  startTime?: number;
  thumbnail: string;
  title: string;
  description: string;
}

export function VideoPlayer({ videoId, startTime, thumbnail, title, description }: VideoPlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const loadVideo = () => {
    setShowPlayer(true);
  };

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${startTime ? `&start=${startTime}` : ''}`;

  const videoContainerStyle: React.CSSProperties = {
    background: '#f8f9fa',
    border: '2px solid #667eea',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
    textAlign: 'center',
  };

  const videoTitleStyle: React.CSSProperties = {
    fontSize: '1.1em',
    fontWeight: 600,
    color: '#333',
    marginBottom: '10px',
  };

  const videoDescriptionStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '0.9em',
    marginBottom: '15px',
  };

  const videoEmbedStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '560px',
    margin: '0 auto',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
  };

  const videoThumbnailStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    aspectRatio: '16/9',
    borderRadius: '8px',
    transition: 'transform 0.2s ease',
  };

  const playButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '3em',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
  };

  const youtubePlayerStyle: React.CSSProperties = {
    width: '100%',
    height: '315px',
    border: 'none',
    borderRadius: '8px',
  };

  return (
    <div style={videoContainerStyle}>
      <div style={videoTitleStyle}>{title}</div>
      <div style={videoDescriptionStyle}>{description}</div>
      <div style={videoEmbedStyle}>
        {showPlayer ? (
          <iframe 
            style={youtubePlayerStyle}
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img 
              src={thumbnail}
              alt="Exercise preview"
              style={videoThumbnailStyle}
              onClick={loadVideo}
              loading="lazy"
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            <button 
              style={playButtonStyle} 
              onClick={loadVideo}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              ▶️
            </button>
          </>
        )}
      </div>
    </div>
  );
}