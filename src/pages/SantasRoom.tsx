import { useRef, useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';

// Asset Paths
const roomVideo = '/assets/videos/room.mov';
const backButtonImg = '/assets/images/back.png';
const musicFile = '/assets/audio/10.Oh Little Town of Bethlehem(Flugel Horn).mp3';
const cakeImg1 = '/assets/images/cake1.PNG';
const cakeImg2 = '/assets/images/cake2.PNG';
const blowSound = '/assets/audio/blow.mp3';
const letterImg = '/assets/images/letter.PNG';

interface SantasRoomProps {
  onNavigateBack: () => void;
  onAddWish: (text: string) => void;
}

const objectCoordinates = [
  { name: 'Cake', cx: 120, cy: 820, w: 100, h: 180 },
  { name: 'Postcard', cx: 240, cy: 745, w: 100, h: 140 },
  { name: 'Turntable', cx: 170, cy: 560, w: 200, h: 140 },
];

type CakeState = 'hidden' | 'zooming' | 'blown_out';

const SantasRoom = ({ onNavigateBack, onAddWish }: SantasRoomProps) => {
  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const turntableAudioRef = useRef<HTMLAudioElement>(null);
  const blowAudioRef = useRef<HTMLAudioElement>(null);

  // --- State ---
  const [hitboxes, setHitboxes] = useState<CSSProperties[]>([]);
  const [backButtonStyle, setBackButtonStyle] = useState<CSSProperties>({});
  const [cakeState, setCakeState] = useState<CakeState>('hidden');
  const [cakeInitialStyle, setCakeInitialStyle] = useState<CSSProperties>({});
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showPostcard, setShowPostcard] = useState(false);
  const [wishText, setWishText] = useState('');

  // --- Functions ---
  const updateElementPositions = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    const videoRect = video.getBoundingClientRect();

    setBackButtonStyle({
      position: 'absolute',
      top: `${videoRect.top + 16}px`,
      left: `${videoRect.left + 56}px`,
      cursor: 'pointer',
    });

    const scaleX = videoRect.width / video.videoWidth;
    const scaleY = videoRect.height / video.videoHeight;

    const newHitboxes: CSSProperties[] = objectCoordinates.map(obj => ({
      position: 'absolute',
      left: `${(obj.cx - obj.w / 2) * scaleX + videoRect.left}px`,
      top: `${(obj.cy - obj.h / 2) * scaleY + videoRect.top}px`,
      width: `${obj.w * scaleX}px`,
      height: `${obj.h * scaleY}px`,
      backgroundColor: 'transparent',
      cursor: 'pointer',
    }));

    setHitboxes(newHitboxes);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    window.addEventListener('resize', updateElementPositions);
    video?.addEventListener('loadedmetadata', updateElementPositions);

    return () => {
      window.removeEventListener('resize', updateElementPositions);
      video?.removeEventListener('loadedmetadata', updateElementPositions);
    };
  }, [updateElementPositions]);

  useEffect(() => {
    return () => {
      turntableAudioRef.current?.pause();
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration - video.currentTime < 0.2) {
      video.currentTime = 0;
      video.play();
    }
  };

  const handleHitboxClick = (objectName: string, index: number) => {
    if (cakeState !== 'hidden' || showPostcard) return;

    if (objectName === 'Turntable') {
      const audio = turntableAudioRef.current;
      if (audio) audio.paused ? audio.play() : audio.pause();
    }

    if (objectName === 'Cake') {
      const style = hitboxes[index];
      setCakeInitialStyle({
        top: style.top,
        left: style.left,
        width: style.width,
        height: style.height,
      });
      setIsFadingOut(false);
      setCakeState('zooming');
    }

    if (objectName === 'Postcard') {
      setShowPostcard(true);
    }
  };

  const handleCakeClick = () => {
    if (cakeState !== 'zooming') return;

    const audio = blowAudioRef.current;
    if (audio) {
      audio.volume = 1;
      audio.play();
    }

    setCakeState('blown_out');
    setTimeout(() => setIsFadingOut(true), 1500);
    setTimeout(() => setCakeState('hidden'), 2000);
  };

  const handleWishSubmit = () => {
    onAddWish(wishText);
    setWishText('');
    setShowPostcard(false);
  };

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      <audio ref={turntableAudioRef} src={musicFile} onPlay={e => (e.currentTarget.currentTime = 31)} />
      <audio ref={blowAudioRef} src={blowSound} />

      <img
        src={backButtonImg}
        alt="Back"
        style={backButtonStyle}
        onClick={onNavigateBack}
        className="absolute z-40 w-48 p-2 cursor-pointer"
      />

      <video
        ref={videoRef}
        src={roomVideo}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-contain"
      />

      {cakeState === 'hidden' &&
        !showPostcard &&
        hitboxes.map((style, index) => (
          <div
            key={index}
            style={style}
            onClick={() => handleHitboxClick(objectCoordinates[index].name, index)}
            className="z-20"
          />
        ))}

      {cakeState !== 'hidden' && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center"
          onClick={handleCakeClick}
        >
          <img
            src={cakeState === 'blown_out' ? cakeImg2 : cakeImg1}
            alt="Christmas Cake"
            style={cakeState === 'zooming' ? cakeInitialStyle : {}}
            className={`cake-image zoomed ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>
      )}

      {showPostcard && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center"
          onClick={() => setShowPostcard(false)}
        >
          <div className="flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="relative w-[90vw] max-w-lg">
              <img src={letterImg} alt="Letter" className="w-full h-auto" />
              <textarea
                value={wishText}
                onChange={e => setWishText(e.target.value)}
                placeholder="Write your wish here..."
                className="absolute top-[20%] bottom-[15%] left-[10%] right-[10%] bg-transparent border-none outline-none resize-none p-2 text-gray-800 text-lg text-center"
              />
            </div>

            <button
              onClick={handleWishSubmit}
              className="mt-4 bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SantasRoom;