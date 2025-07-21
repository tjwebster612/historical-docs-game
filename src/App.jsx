import React, { useState } from 'react';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';
import CategoryGame from './components/CategoryGame.jsx';
import Results from './components/Results.jsx';
import DocumentLibrary from './components/DocumentLibrary.jsx';
import LegalFooter from './components/LegalFooter.jsx';
import './App.css';

const APP_TITLE = 'Archivist Academy';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [gameParams, setGameParams] = useState(null);
  const [results, setResults] = useState(null);

  const handleStart = (mode, difficulty, playerInfoOrCategory, maybeCategory) => {
    if (mode === 'library') {
      setScreen('library');
      return;
    }
    if (mode === 'multi') {
      setGameParams({
        mode,
        difficulty,
        playerInfo: playerInfoOrCategory,
        category: playerInfoOrCategory.category || 'history',
      });
    } else if (mode === 'category') {
      setGameParams({
        mode,
        difficulty,
        playerInfo: playerInfoOrCategory,
        category: 'category',
      });
    } else {
      setGameParams({
        mode,
        difficulty,
        playerInfo: null,
        category: playerInfoOrCategory || 'history',
      });
    }
    setScreen('game');
  };

  const handleEnd = (results) => {
    setResults(results);
    setScreen('results');
  };

  const handleRestart = () => {
    setResults(null);
    setScreen('home');
  };

  // Navigation bar
  const showPlayAgain = screen === 'results' || screen === 'game';
  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid #e1e8ed',
        padding: '1rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        marginBottom: '2rem',
      }}>
        <div style={{ fontWeight: '700', fontSize: '1.5rem', color: '#2c3e50', marginLeft: '2rem', letterSpacing: '-0.02em' }}>{APP_TITLE}</div>
        <div style={{ display: 'flex', gap: '1rem', marginRight: '2rem' }}>
          <button 
            onClick={() => setScreen('home')} 
            className={screen === 'home' ? 'primary' : ''}
            style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
          >
            Home
          </button>
          <button 
            onClick={() => setScreen('library')} 
            className={screen === 'library' ? 'primary' : ''}
            style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
          >
            Library
          </button>
          {showPlayAgain && (
            <button 
              onClick={handleRestart} 
              style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
            >
              Play Again
            </button>
          )}
        </div>
      </nav>
      {/* Main Content */}
      <div className="container">
        {screen === 'home' && <Home onStart={handleStart} />}
        {screen === 'game' && gameParams && (
          gameParams.mode === 'category' ? (
            <CategoryGame
              onEnd={handleEnd}
              difficulty={gameParams.difficulty}
              playerInfo={gameParams.playerInfo}
            />
          ) : (
            <Game
              onEnd={handleEnd}
              difficulty={gameParams.difficulty}
              playerInfo={gameParams.playerInfo}
              mode={gameParams.mode}
              category={gameParams.category}
            />
          )
        )}
        {screen === 'results' && results && (
          <Results results={results} onRestart={handleRestart} onHome={handleRestart} />
        )}
        {screen === 'library' && <DocumentLibrary onBack={handleRestart} />}
      </div>
      
      {/* Legal Footer */}
      <LegalFooter />
    </div>
  );
}
