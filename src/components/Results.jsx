import React, { useState } from 'react';
import { documents } from '../data/documents.js';
import avatar1 from '../assets/avatars/avatar1.jpg';
import avatar2 from '../assets/avatars/avatar2.jpg';
import avatar3 from '../assets/avatars/avatar3.jpg';
import avatar4 from '../assets/avatars/avatar4.jpg';
import avatar5 from '../assets/avatars/avatar5.jpg';
import avatar6 from '../assets/avatars/avatar6.jpg';

const AVATARS = {
  avatar1: { label: 'Avatar 1', src: avatar1 },
  avatar2: { label: 'Avatar 2', src: avatar2 },
  avatar3: { label: 'Avatar 3', src: avatar3 },
  avatar4: { label: 'Avatar 4', src: avatar4 },
  avatar5: { label: 'Avatar 5', src: avatar5 },
  avatar6: { label: 'Avatar 6', src: avatar6 },
};

const Results = ({ results, onRestart, onHome }) => {
  const [openDoc, setOpenDoc] = useState(null);
  const [docText, setDocText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!results) return null;

  const handleOpen = async (doc) => {
    setOpenDoc(doc);
    setError(null);
    setDocText('');
    if (doc.textFile) {
      setLoading(true);
      try {
        const res = await fetch(`/texts/${doc.textFile}`);
        if (!res.ok) throw new Error('Failed to load document text');
        const text = await res.text();
        setDocText(text);
      } catch (e) {
        setDocText('');
        setError('Could not load document text.');
      }
      setLoading(false);
    } else {
      setDocText(doc.fullText || 'No text available.');
    }
  };

  const handleClose = () => {
    setOpenDoc(null);
    setDocText('');
    setError(null);
  };

  // Multiplayer Results
  const isMulti = Array.isArray(results.scores) && results.playerNames;
  if (isMulti) {
    const { scores, total, attempts, playerNames, playerAvatars } = results;
    const QUESTIONS_PER_PLAYER = attempts[0]?.length || 0;
    // Find winner(s)
    const maxScore = Math.max(...scores);
    const winners = playerNames
      .map((name, i) => ({ name, score: scores[i], idx: i }))
      .filter(p => p.score === maxScore);
    const winner = winners[0];
    const winnerAvatar = playerAvatars && AVATARS[playerAvatars[winner.idx]];

    return (
      <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Winner announcement */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            <span role="img" aria-label="trophy" style={{ fontSize: '2.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>🏆</span>
            Winner: {winner.name}!
          </div>
          {winnerAvatar && (
            <img src={winnerAvatar.src} alt={winnerAvatar.label} style={{ width: 90, height: 90, borderRadius: '50%', border: '4px solid gold', margin: '0.5rem auto', display: 'block', background: '#fff' }} />
          )}
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#3498db' }}>Score: {winner.score} / {QUESTIONS_PER_PLAYER}</div>
        </div>

        {/* Leaderboard */}
        <div style={{ marginBottom: '2rem' }}>
          <h3>Leaderboard</h3>
          <ol style={{ fontSize: '1.1rem' }}>
            {playerNames
              .map((name, i) => ({ name, score: scores[i], idx: i }))
              .sort((a, b) => b.score - a.score)
              .map(({ name, score, idx }, rank) => (
                <li key={idx} style={{ fontWeight: rank === 0 ? 'bold' : undefined, display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  {rank === 0 && <span role="img" aria-label="trophy" style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🏆</span>}
                  {playerAvatars && AVATARS[playerAvatars[idx]] && (
                    <img src={AVATARS[playerAvatars[idx]].src} alt={AVATARS[playerAvatars[idx]].label} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: '0.5rem', border: '2px solid #e1e8ed', background: '#fff' }} />
                  )}
                  {name}: {score} / {QUESTIONS_PER_PLAYER}
                </li>
              ))}
          </ol>
        </div>

        {/* Player Knowledge Breakdown */}
        <div style={{ margin: '2rem 0' }}>
          <h3>Player Knowledge Breakdown</h3>
          {playerNames.map((name, i) => {
            const playerAttempts = attempts[i] || [];
            // Per-document stats for this player
            const docStats = {};
            let totalAssigned = 0;
            let totalCorrect = 0;
            for (const a of playerAttempts) {
              totalAssigned++;
              if (a.correct) totalCorrect++;
              if (!docStats[a.id]) {
                docStats[a.id] = { ...a, shown: 0, correct: 0 };
              }
              docStats[a.id].shown += 1;
              if (a.correct) docStats[a.id].correct += 1;
            }
            const docList = Object.values(docStats);
            const knowWell = docList.filter(d => d.correct / d.shown > 0.5);
            const toReview = docList.filter(d => d.correct / d.shown <= 0.5);
            return (
              <div key={i} style={{ marginBottom: '1.5rem', border: '1px solid #e1e8ed', borderRadius: '12px', padding: '1.5rem', background: '#f8f9fa' }}>
                <h4 style={{ marginTop: 0, color: '#2c3e50' }}>{name} ({totalCorrect} / {totalAssigned})</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#27ae60' }}>Documents you know well:</strong>
                  {knowWell.length ? (
                    <ul style={{ marginTop: '0.5rem' }}>
                      {knowWell.map(d => (
                        <li key={d.id} style={{ marginBottom: '0.25rem' }}>
                          <button 
                            onClick={() => handleOpen(d)} 
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#3498db', 
                              textDecoration: 'underline', 
                              cursor: 'pointer',
                              fontSize: 'inherit',
                              padding: 0,
                              fontFamily: 'inherit'
                            }}
                          >
                            {d.title}
                          </button>
                          {' '}({d.correct} / {d.shown} correct, {Math.round((d.correct/d.shown)*100)}%)
                        </li>
                      ))}
                    </ul>
                  ) : <span> (None this time)</span>}
                </div>
                <div>
                  <strong style={{ color: '#e74c3c' }}>Documents to review:</strong>
                  {toReview.length ? (
                    <ul style={{ marginTop: '0.5rem' }}>
                      {toReview.map(d => (
                        <li key={d.id} style={{ marginBottom: '0.25rem' }}>
                          <button 
                            onClick={() => handleOpen(d)} 
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#3498db', 
                              textDecoration: 'underline', 
                              cursor: 'pointer',
                              fontSize: 'inherit',
                              padding: 0,
                              fontFamily: 'inherit'
                            }}
                          >
                            {d.title}
                          </button>
                          {' '}({d.correct} / {d.shown} correct, {Math.round((d.correct/d.shown)*100)}%)
                        </li>
                      ))}
                    </ul>
                  ) : <span> (None! Great job!)</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Document text display */}
        {openDoc && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>{openDoc.title}</h3>
              <button onClick={handleClose} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Close</button>
            </div>
            <div className="document-text" style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', maxHeight: 400, overflowY: 'auto', border: '1px solid #e1e8ed', padding: '1.5rem', background: '#ffffff', borderRadius: '12px' }}>
              {loading ? (
                <div style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>Loading document...</div>
              ) : error ? (
                <div style={{ color: '#e74c3c', padding: '1rem' }}>{error}</div>
              ) : (
                docText
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={onRestart} className="primary" style={{ marginRight: '1rem' }}>Play Again</button>
          <button onClick={onHome}>Return Home</button>
        </div>
      </div>
    );
  }

  // Single Player Results
  const { score, total, attempts, questions } = results;
  // Aggregate per-document stats
  const docStats = {};
  for (const a of attempts) {
    if (!docStats[a.id]) {
      docStats[a.id] = { ...a, shown: 0, correct: 0 };
    }
    docStats[a.id].shown += 1;
    if (a.correct) docStats[a.id].correct += 1;
  }
  const docList = Object.values(docStats);
  const knowWell = docList.filter(d => d.correct / d.shown > 0.5);
  const toReview = docList.filter(d => d.correct / d.shown <= 0.5);

  // Helper to get full doc info from questions
  const getDoc = (id) => questions.find(q => q.id === id);

  return (
    <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="app-header">
        <h1 className="app-title">Results</h1>
        <p className="app-subtitle">Your score: {score} / {total}</p>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <h3 style={{ color: '#27ae60' }}>Documents you know well:</h3>
        {knowWell.length ? (
          <ul style={{ fontSize: '1.1rem' }}>
            {knowWell.map(d => {
              const doc = getDoc(d.id);
              const hasText = doc && (doc.textFile || doc.fullText);
              return (
                <li key={d.id} style={{ marginBottom: '0.5rem' }}>
                  {hasText ? (
                    <button 
                      onClick={() => handleOpen(doc)} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#3498db', 
                        textDecoration: 'underline', 
                        cursor: 'pointer',
                        fontSize: 'inherit',
                        padding: 0,
                        fontFamily: 'inherit'
                      }}
                    >
                      {d.title}
                    </button>
                  ) : (
                    <span>{d.title} <span style={{ color: '#6c757d' }}>(Full text not available)</span></span>
                  )}
                  {' '}({d.correct} / {d.shown} correct, {Math.round((d.correct/d.shown)*100)}%)
                </li>
              );
            })}
          </ul>
        ) : <p>(None this time)</p>}
      </div>

      <div style={{ margin: '2rem 0' }}>
        <h3 style={{ color: '#e74c3c' }}>Documents to review:</h3>
        {toReview.length ? (
          <ul style={{ fontSize: '1.1rem' }}>
            {toReview.map(d => {
              const doc = getDoc(d.id);
              const hasText = doc && (doc.textFile || doc.fullText);
              return (
                <li key={d.id} style={{ marginBottom: '0.5rem' }}>
                  {hasText ? (
                    <button 
                      onClick={() => handleOpen(doc)} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#3498db', 
                        textDecoration: 'underline', 
                        cursor: 'pointer',
                        fontSize: 'inherit',
                        padding: 0,
                        fontFamily: 'inherit'
                      }}
                    >
                      {d.title}
                    </button>
                  ) : (
                    <span>{d.title} <span style={{ color: '#6c757d' }}>(Full text not available)</span></span>
                  )}
                  {' '}({d.correct} / {d.shown} correct, {Math.round((d.correct/d.shown)*100)}%)
                </li>
              );
            })}
          </ul>
        ) : <p>(None! Great job!)</p>}
      </div>

      {/* Document text display */}
      {openDoc && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#2c3e50' }}>{openDoc.title}</h3>
            <button onClick={handleClose} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Close</button>
          </div>
          <div className="document-text" style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', maxHeight: 400, overflowY: 'auto', border: '1px solid #e1e8ed', padding: '1.5rem', background: '#ffffff', borderRadius: '12px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>Loading document...</div>
            ) : error ? (
              <div style={{ color: '#e74c3c', padding: '1rem' }}>{error}</div>
            ) : (
              docText
            )}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={onRestart} className="primary" style={{ marginRight: '1rem' }}>Play Again</button>
        <button onClick={onHome}>Return Home</button>
      </div>
    </div>
  );
};

export default Results; 