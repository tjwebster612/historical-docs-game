import React, { useState } from 'react';
import avatar1 from '../assets/avatars/avatar1.jpg';
import avatar2 from '../assets/avatars/avatar2.jpg';
import avatar3 from '../assets/avatars/avatar3.jpg';
import avatar4 from '../assets/avatars/avatar4.jpg';
import avatar5 from '../assets/avatars/avatar5.jpg';
import avatar6 from '../assets/avatars/avatar6.jpg';

const AVATARS = [
  { id: 'avatar1', label: 'Avatar 1', src: avatar1 },
  { id: 'avatar2', label: 'Avatar 2', src: avatar2 },
  { id: 'avatar3', label: 'Avatar 3', src: avatar3 },
  { id: 'avatar4', label: 'Avatar 4', src: avatar4 },
  { id: 'avatar5', label: 'Avatar 5', src: avatar5 },
  { id: 'avatar6', label: 'Avatar 6', src: avatar6 },
];

const CATEGORIES = [
  { value: 'history', label: 'History Documents' },
  { value: 'classic literature', label: 'Classic Literature' },
  { value: 'pop culture', label: 'Pop Culture' },
];

export default function Home({ onStart }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [mode, setMode] = useState('single');
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [playerAvatars, setPlayerAvatars] = useState(['avatar1', 'avatar2']);
  const [category, setCategory] = useState('history');

  const handleMode = (m) => {
    setMode(m);
    if (m === 'multi' && playerNames.length < 2) {
      setPlayerNames(['Player 1', 'Player 2']);
      setPlayerAvatars(['avatar1', 'avatar2']);
      setNumPlayers(2);
    }
  };

  const handleNumPlayers = (n) => {
    setNumPlayers(n);
    setPlayerNames((prev) => {
      const arr = prev.slice(0, n);
      while (arr.length < n) arr.push(`Player ${arr.length + 1}`);
      return arr;
    });
    setPlayerAvatars((prev) => {
      const arr = prev.slice(0, n);
      while (arr.length < n) arr.push(AVATARS[arr.length % AVATARS.length].id);
      return arr;
    });
  };

  const handleNameChange = (i, val) => {
    setPlayerNames((prev) => {
      const arr = [...prev];
      arr[i] = val;
      return arr;
    });
  };

  const handleAvatarChange = (i, avatarId) => {
    setPlayerAvatars((prev) => {
      const arr = [...prev];
      arr[i] = avatarId;
      return arr;
    });
  };

  const handleStart = () => {
    if (mode === 'multi') {
      onStart('multi', difficulty, { numPlayers, playerNames, playerAvatars, category });
    } else if (mode === 'category') {
      onStart('category', difficulty, { numPlayers, playerNames, playerAvatars });
    } else {
      onStart('single', difficulty, category);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="app-header">
        <h1 className="app-title">Welcome to Archivist Academy!</h1>
        <p className="app-subtitle">
          Master the art of document identification.<br />
          Test your knowledge of history and classic literature.
        </p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setMode('single')} 
          className={mode === 'single' ? 'primary' : ''}
          style={{ minWidth: '140px' }}
        >
          Single Player
        </button>
        <button 
          onClick={() => setMode('multi')} 
          className={mode === 'multi' ? 'primary' : ''}
          style={{ minWidth: '140px' }}
        >
          Multiplayer
        </button>
        <button 
          onClick={() => setMode('category')} 
          className={mode === 'category' ? 'primary' : ''}
          style={{ minWidth: '140px' }}
        >
          Category Mode
        </button>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: '600', color: '#2c3e50', display: 'block', marginBottom: '0.5rem' }}>Difficulty:</label>
        <select 
          value={difficulty} 
          onChange={e => setDifficulty(e.target.value)} 
          style={{ 
            width: '100%', 
            fontSize: '1rem', 
            borderRadius: '8px', 
            border: '1px solid #e1e8ed', 
            padding: '0.75rem 1rem',
            background: '#ffffff',
            color: '#2c3e50'
          }}
        >
          <option value="easy">Easy (Paragraph)</option>
          <option value="hard">Hard (Sentence)</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ fontWeight: '600', color: '#2c3e50', display: 'block', marginBottom: '0.5rem' }}>Choose a category:</label>
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          style={{ 
            width: '100%', 
            fontSize: '1rem', 
            borderRadius: '8px', 
            border: '1px solid #e1e8ed', 
            padding: '0.75rem 1rem',
            background: '#ffffff',
            color: '#2c3e50'
          }}
          disabled={mode === 'category'}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        {mode === 'category' && (
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
            Category mode tests your ability to identify which category content belongs to.
          </p>
        )}
      </div>
      {mode === 'multi' && (
        <div style={{ margin: '1em 0', border: '1px solid #eee', padding: '1em', borderRadius: 8, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', background: '#f7f9fb' }}>
          <div style={{ marginBottom: 8, fontWeight: 600, color: '#3366cc' }}>Players</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <label>Number of Players:</label>
            <input type="number" min={2} max={6} value={numPlayers} onChange={e => setNumPlayers(Number(e.target.value))} style={{ width: 48, fontSize: 16, borderRadius: 6, border: '1.5px solid #c3d3ee', padding: '0.2em 0.5em' }} />
          </div>
          {Array.from({ length: numPlayers }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <input type="text" value={playerNames[i] || ''} onChange={e => handleNameChange(i, e.target.value)} placeholder={`Player ${i + 1}`} style={{ fontSize: 15, borderRadius: 6, border: '1.5px solid #c3d3ee', padding: '0.2em 0.5em', width: 120 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                {AVATARS.map(a => (
                  <img
                    key={a.id}
                    src={a.src}
                    alt={a.label}
                    title={a.label}
                    onClick={() => handleAvatarChange(i, a.id)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: playerAvatars[i] === a.id ? '2.5px solid #3366cc' : '2px solid #ccc',
                      background: playerAvatars[i] === a.id ? '#e6f0fa' : '#fff',
                      boxShadow: playerAvatars[i] === a.id ? '0 0 6px #3366cc88' : undefined,
                      cursor: 'pointer',
                      transition: 'border 0.2s, box-shadow 0.2s',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
        <button onClick={handleStart} style={mainBtnStyle()}>Start Game</button>
        <button onClick={() => onStart('library')} style={mainBtnStyle({ secondary: true })}>Browse Documents</button>
      </div>
    </div>
  );
}

function modeBtnStyle(active) {
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

function mainBtnStyle(opts = {}) {
  return {
    background: opts.secondary ? '#fff' : '#3366cc',
    color: opts.secondary ? '#3366cc' : '#fff',
    border: '1.5px solid #3366cc',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 17,
    padding: '0.7em 1.6em',
    marginLeft: 0,
    cursor: 'pointer',
    boxShadow: opts.secondary ? undefined : '0 2px 8px #3366cc22',
    transition: 'background 0.2s, box-shadow 0.2s',
  };
} 