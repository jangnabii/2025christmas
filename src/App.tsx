import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import SantasRoom from './pages/SantasRoom';
import WishTreePage from './pages/WishTreePage';

type PageName = 'landing' | 'home' | 'santas-room' | 'wish-tree';

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('landing');
  const [showHomeButtonsOnLoad, setShowHomeButtonsOnLoad] = useState(false);

  useEffect(() => {
    // This logic to reset the journey on a fresh load is no longer needed
    // as the home page is now fully self-contained.
  }, []);

  const navigate = (page: PageName) => {
    if (page === 'home' && currentPage !== 'landing') {
      setShowHomeButtonsOnLoad(true);
    }
    if (page === 'landing') {
      setShowHomeButtonsOnLoad(false);
    }
    setCurrentPage(page);
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
        // No longer needs to pass onAddWish
        return <SantasRoom onNavigateBack={() => navigate('home')} />;
      case 'wish-tree':
        // No longer needs to pass wishes
        return <WishTreePage onNavigateBack={() => navigate('home')} />;
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
