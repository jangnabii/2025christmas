import React, { useState, useEffect } from 'react';

const letterImg = '/assets/images/letter.PNG';

interface WishTreePageProps {
  onNavigateBack: () => void;
}

const WishTreePage: React.FC<WishTreePageProps> = ({ onNavigateBack }) => {
  const [wishes, setWishes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/wishes');
        if (!response.ok) {
          throw new Error('Failed to fetch wishes.');
        }
        const data = await response.json();
        setWishes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishes();
  }, []);

  let content;
  if (isLoading) {
    content = <p className="text-white text-xl">Loading wishes...</p>;
  } else if (error) {
    content = <p className="text-red-500 text-xl">{error}</p>;
  } else if (wishes.length === 0) {
    content = <p className="text-white text-xl">No wishes yet. Be the first!</p>;
  } else {
    content = (
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-4">
          {wishes.map((wish, index) => (
            <div key={index} className="relative">
              <img src={letterImg} alt="A letter with a wish" className="w-full h-auto" />
              <p className="absolute top-[20%] bottom-[15%] left-[10%] right-[10%] w-[80%] h-[65%] p-2 text-gray-800 text-sm sm:text-base leading-tight text-center overflow-hidden whitespace-pre-wrap">
                {wish}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-dark-navy flex flex-col p-4 sm:p-8">
      <div onClick={onNavigateBack} className="absolute top-4 left-4 z-20 p-2 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-4xl text-white text-center font-mono my-4">Wishes from Everyone</h1>
      <div className="flex-grow flex items-center justify-center">
        {content}
      </div>
    </div>
  );
};

export default WishTreePage;