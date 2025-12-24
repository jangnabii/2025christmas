import React, { useRef, useState } from 'react';

const treeOnVideo = '/assets/videos/hometree.mov';
const roomButtonImg = '/assets/images/roombutton.PNG';
const letterButtonImg = '/assets/images/letterbutton.PNG';

interface HomePageProps {
  showButtonsOnLoad: boolean;
  onNavigateToSantasRoom: () => void;
  onNavigateToWishTree: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  showButtonsOnLoad,
  onNavigateToSantasRoom, 
  onNavigateToWishTree 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video && !hasPlayed) {
      video.play().catch(error => console.error("Video playback failed:", error));
      setHasPlayed(true);
    }
  };

  const triggerEndState = () => {
    if (!showButtons) {
      setTimeout(() => {
        setShowButtons(true);
      }, 2000);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && hasPlayed && !showButtons && video.duration > 0 && video.currentTime >= video.duration - 0.2) {
      triggerEndState();
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={treeOnVideo}
        muted
        playsInline
        preload="auto"
        onClick={handleVideoClick}
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerEndState}
        className={`w-full h-full object-contain ${!hasPlayed ? 'cursor-pointer' : ''}`}
      />

      {(showButtons || showButtonsOnLoad) && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 animate-fade-in">
          <img 
            src={roomButtonImg} 
            alt="Go to Santa's Room" 
            className="w-32 h-auto cursor-pointer hover:scale-110 transition-transform"
            onClick={onNavigateToSantasRoom}
          />
          <img 
            src={letterButtonImg} 
            alt="Go to Wish Tree" 
            className="w-32 h-auto cursor-pointer hover:scale-110 transition-transform"
            onClick={onNavigateToWishTree}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;