import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import SantasRoom from './pages/SantasRoom';
import WishTreePage from './pages/WishTreePage';

type PageName = 'landing' | 'home' | 'santas-room' | 'wish-tree';

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('landing');
  const [wishes, setWishes] = useState<string[]>([]);
  // This flag now specifically means "show buttons immediately on home page load"
  const [showHomeButtonsOnLoad, setShowHomeButtonsOnLoad] = useState(false);

  useEffect(() => {
    // This is a full reset of the app state, correct.
    sessionStorage.removeItem('homeVideoPlayed'); 
  }, []);

  const navigate = (page: PageName) => {
    // If we are going to the home page FROM another page (not landing), set the flag.
    if (page === 'home' && currentPage !== 'landing') {
      setShowHomeButtonsOnLoad(true);
    }
    // If we ever go back to the start, reset the flag.
    if (page === 'landing') {
      setShowHomeButtonsOnLoad(false);
    }
    setCurrentPage(page);
  };

  const addWish = (text: string) => {
    if (text.trim()) {
      setWishes(prevWishes => [text, ...prevWishes]);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onComplete={() => navigate('home')} />;
      case 'home':
        return (
          <HomePage 
            showButtonsOnLoad={showHomeButtonsOnLoad}
            onNavigateToSantasRoom={() => navigate('santas-room')}
            onNavigateToWishTree={() => navigate('wish-tree')}
          />
        );
      case 'santas-room':
        return <SantasRoom onNavigateBack={() => navigate('home')} onAddWish={addWish} />;
      case 'wish-tree':
        return <WishTreePage onNavigateBack={() => navigate('home')} wishes={wishes} />;
      default:
        return <LandingPage onComplete={() => navigate('home')} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;