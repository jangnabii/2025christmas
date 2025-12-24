import React, { useState, useEffect } from 'react';

const linesToType = [
  '$ initializing holiday protocol...',
  '✔ checking snow particles',
  '✔ warming fireplace',
  '✔ syncing santa.network',
  '✔ loading christmas spirit [██████████] 100%',
];

interface LandingPageProps {
  onComplete: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showContinue, setShowContinue] = useState(false);

  // Typing animation effect
  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = '';

    const type = () => {
      if (lineIndex < linesToType.length) {
        if (charIndex < linesToType[lineIndex].length) {
          currentLine += linesToType[lineIndex].charAt(charIndex);
          setLines(prevLines => {
            const newLines = [...prevLines];
            newLines[lineIndex] = currentLine;
            return newLines;
          });
          charIndex++;
          setTimeout(type, 50);
        } else {
          lineIndex++;
          charIndex = 0;
          currentLine = '';
          setTimeout(type, 200);
        }
      } else {
        setTimeout(() => setShowContinue(true), 500);
      }
    };

    setTimeout(type, 500);
  }, []);

  // Handle click or Enter key to continue
  useEffect(() => {
    if (!showContinue) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showContinue, onComplete]);

  const handleClick = () => {
    if (showContinue) {
      onComplete();
    }
  };

  return (
    <div 
      className="h-screen p-4 font-mono flex flex-col justify-center items-center cursor-pointer"
      onClick={handleClick}
    >
        <>
          <div>
            {lines.map((line, index) => (
              <p 
                key={index} 
                className={`
                  ${line.startsWith('✔') ? 'text-christmas-green' : 'text-white'}
                  ${index === 1 ? 'mt-4' : ''}
                `}
              >
                {line}
              </p>
            ))}
          </div>
          <div className="mt-8 h-8">
            {showContinue ? (
              <p className="animate-pulse">Click or Press Enter to continue</p>
            ) : (
              lines.length > 0 && (
                <div className="flex justify-center">
                  <span className="bg-white w-2 h-4 inline-block animate-pulse"></span>
                </div>
              )
            )}
          </div>
        </>
    </div>
  );
};

export default LandingPage;