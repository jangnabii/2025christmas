import React from 'react';

const letterImg = '/assets/images/letter.PNG';

interface WishTreePageProps {
  onNavigateBack: () => void;
  wishes: string[];
}

const WishTreePage: React.FC<WishTreePageProps> = ({ onNavigateBack, wishes }) => {
  return (
    <div className="relative w-screen h-screen bg-dark-navy flex flex-col p-4 sm:p-8">
      {/* Back Button */}
      <div 
        onClick={onNavigateBack}
        className="absolute top-4 left-4 z-20 p-2 cursor-pointer rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      <h1 className="text-3xl sm:text-4xl text-white text-center font-mono my-4">Wishes from Everyone</h1>

      {wishes.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-white text-xl">No wishes yet. Be the first!</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default WishTreePage;
