import React, { useState } from 'react';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';
import Results from './components/Results.jsx';
import DocumentLibrary from './components/DocumentLibrary.jsx';
import './App.css';

const NAV_BG = '#f7f9fb';
const NAV_BORDER = '#e0e6ed';
const APP_TITLE = 'Historical Docs & Lit Game';

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
    <div style={{ background: '#f7f9fb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Navigation Bar */}
      <nav style={{
        background: NAV_BG,
        borderBottom: `1.5px solid ${NAV_BORDER}`,
        padding: '0.5em 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 8px #0001',
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#3366cc', marginLeft: 24, letterSpacing: 0.5 }}>{APP_TITLE}</div>
        <div style={{ display: 'flex', gap: 16, marginRight: 24 }}>
          <button onClick={() => setScreen('home')} style={navBtnStyle(screen === 'home')}>Home</button>
          <button onClick={() => setScreen('library')} style={navBtnStyle(screen === 'library')}>Library</button>
          {showPlayAgain && (
            <button onClick={handleRestart} style={navBtnStyle(false)}>Play Again</button>
          )}
        </div>
      </nav>
      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2em 0 4em 0' }}>
        {screen === 'home' && <Home onStart={handleStart} />}
        {screen === 'game' && gameParams && (
          <Game
            onEnd={handleEnd}
            difficulty={gameParams.difficulty}
            playerInfo={gameParams.playerInfo}
            mode={gameParams.mode}
            category={gameParams.category}
          />
        )}
        {screen === 'results' && results && (
          <Results results={results} onRestart={handleRestart} onHome={handleRestart} />
        )}
        {screen === 'library' && <DocumentLibrary onBack={handleRestart} />}
      </div>
    </div>
  );
}

function navBtnStyle(active) {
  return {
    background: active ? '#e6f0fa' : '#fff',
    color: '#3366cc',
    border: '1.5px solid #c3d3ee',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    padding: '0.5em 1.2em',
    marginLeft: 0,
    cursor: 'pointer',
    boxShadow: active ? '0 2px 8px #3366cc22' : undefined,
    transition: 'background 0.2s, box-shadow 0.2s',
  };
}
