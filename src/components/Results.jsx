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

const CATEGORY_LABELS = {
  'history': 'Historical Documents',
  'classic literature': 'Classic Literature',
};

const Results = ({ results, onRestart, onHome }) => {
  const [openDoc, setOpenDoc] = useState(null);
  const [docText, setDocText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!results) return null;

  // Group documents by category
  const docsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const handleOpen = async (doc) => {
    setOpenDoc(doc);
    setError(null);
    setDocText('');
    if (doc.textFile) {
      setLoading(true);
      try {
        const res = await fetch(`/src/data/texts/${doc.textFile}`);
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
      <div style={{ display: 'flex', minHeight: 600 }}>
        {/* Left pane: document browser */}
        <div style={{ width: 340, borderRight: '1px solid #eee', padding: '2em 1.5em 2em 2em', background: '#fafbfc' }}>
          <h2 style={{ marginTop: 0 }}>Documents</h2>
          {Object.entries(docsByCategory).map(([cat, docs]) => (
            <div key={cat} style={{ marginBottom: '2em' }}>
              <h3 style={{ marginBottom: 8 }}>{CATEGORY_LABELS[cat] || cat}</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {docs.map(doc => (
                  <li key={doc.id} style={{ marginBottom: '1.2em', cursor: 'pointer', background: openDoc && openDoc.id === doc.id ? '#e6f0fa' : undefined, borderRadius: 6, padding: '0.5em 0.5em 0.5em 0.5em' }} onClick={() => handleOpen(doc)}>
                    <div style={{ fontWeight: 600 }}>{doc.title} <span style={{ color: '#888', fontWeight: 400 }}>({doc.year})</span></div>
                    <div style={{ fontSize: '0.95em', color: '#666' }}>{doc.theme}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={onHome} style={{ marginTop: '2em' }}>Back to Home</button>
        </div>
        {/* Right pane: results and document text */}
        <div style={{ flex: 1, padding: '2em', minWidth: 0 }}>
          {/* Winner announcement */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
              <span role="img" aria-label="trophy" style={{ fontSize: 40, verticalAlign: 'middle', marginRight: 10 }}>🏆</span>
              Winner: {winner.name}!
            </div>
            {winnerAvatar && (
              <img src={winnerAvatar.src} alt={winnerAvatar.label} style={{ width: 90, height: 90, borderRadius: '50%', border: '4px solid gold', margin: '0.5em auto', display: 'block', background: '#fff' }} />
            )}
            <div style={{ fontSize: 24, fontWeight: 600, color: '#3366cc' }}>Score: {winner.score} / {QUESTIONS_PER_PLAYER}</div>
          </div>
          {/* Leaderboard */}
          <div style={{ marginBottom: 32 }}>
            <h3>Leaderboard</h3>
            <ol style={{ fontSize: 20 }}>
              {playerNames
                .map((name, i) => ({ name, score: scores[i], idx: i }))
                .sort((a, b) => b.score - a.score)
                .map(({ name, score, idx }, rank) => (
                  <li key={idx} style={{ fontWeight: rank === 0 ? 'bold' : undefined, display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                    {rank === 0 && <span role="img" aria-label="trophy" style={{ fontSize: 22, marginRight: 6 }}>🏆</span>}
                    {playerAvatars && AVATARS[playerAvatars[idx]] && (
                      <img src={AVATARS[playerAvatars[idx]].src} alt={AVATARS[playerAvatars[idx]].label} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8, border: '2px solid #ccc', background: '#fff' }} />
                    )}
                    {name}: {score} / {QUESTIONS_PER_PLAYER}
                  </li>
                ))}
            </ol>
          </div>
          {/* Player Knowledge Breakdown */}
          <div style={{ margin: '2em 0' }}>
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
                <div key={i} style={{ marginBottom: '2em', border: '1px solid #eee', borderRadius: 8, padding: '1em' }}>
                  <h4>{name} ({totalCorrect} / {totalAssigned})</h4>
                  <div>
                    <b>Documents you know well:</b>
                    {knowWell.length ? (
                      <ul>
                        {knowWell.map(d => <li key={d.id}>{d.title} ({d.correct} / {d.shown} correct, {Math.round((d.correct/d.shown)*100)}%)</li>)}
                      </ul>
                    ) : <span> (None this time)</span>}
                  </div>
                  <div style={{ marginTop: '1em' }}>
                    <b>Documents to review:</b>
                    {toReview.length ? (
                      <ul>
                        {toReview.map(d => <li key={d.id}>{d.title} ({d.correct} / {d.shown} correct, {Math.round((d.correct/d.shown)*100)}%)</li>)}
                      </ul>
                    ) : <span> (None! Great job!)</span>}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Right pane: document text */}
          {openDoc && (
            <div style={{ background: '#f9f9f9', padding: '1em', borderRadius: 8, maxWidth: 800, margin: '2em auto' }}>
              <h3>{openDoc.title}</h3>
              <div style={{ fontSize: '0.95em', whiteSpace: 'pre-wrap', maxHeight: 400, overflowY: 'auto', border: '1px solid #ddd', padding: '1em', background: '#fff' }}>
                {loading ? 'Loading...' : error ? error : docText}
              </div>
              <button onClick={() => setOpenDoc(null)} style={{ marginTop: '1em' }}>Close</button>
            </div>
          )}
          {!openDoc && (
            <div style={{ color: '#888', fontSize: '1.1em', textAlign: 'center', marginTop: '4em' }}>
              Select a document on the left to view its full text.
            </div>
          )}
          <button onClick={onRestart} style={{ marginTop: '2em' }}>Play Again</button>
        </div>
      </div>
    );
  }

  // Single Player Results (unchanged, but with doc browser)
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

  const handleOpenSingle = async (doc) => {
    setOpenDoc(doc);
    setError(null);
    setDocText('');
    if (doc.textFile) {
      setLoading(true);
      try {
        const res = await fetch(`/src/data/texts/${doc.textFile}`);
        if (!res.ok) throw new Error('Failed to load document text');
        const text = await res.text();
        setDocText(text.trim() ? text : 'Full text not available.');
      } catch (e) {
        setDocText('');
        setError('Could not load document text.');
      }
      setLoading(false);
    } else if (doc.fullText) {
      setDocText(doc.fullText);
    } else {
      setDocText('Full text not available.');
    }
  };

  const handleCloseSingle = () => {
    setOpenDoc(null);
    setDocText('');
    setError(null);
  };

  return (
    <div>
      <h2>Results</h2>
      <p>Your score: {score} / {total}</p>
      <div style={{ margin: '2em 0' }}>
        <h3>Documents you know well:</h3>
        {knowWell.length ? (
          <ul>
            {knowWell.map(d => {
              const doc = getDoc(d.id);
              const hasText = doc && (doc.textFile || doc.fullText);
              return (
                <li key={d.id}>
                  {hasText ? (
                    <button style={{ background: 'none', border: 'none', color: '#3366cc', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleOpenSingle(doc)}>
                      {d.title}
                    </button>
                  ) : (
                    <span>{d.title} <span style={{ color: '#888' }}>(Full text not available)</span></span>
                  )}
                  {' '}({d.correct} / {d.shown} correct, {Math.round((d.correct/d.shown)*100)}%)
                  {openDoc === d.id && (
                    <div style={{ background: '#f9f9f9', padding: '1em', margin: '0.5em 0', borderRadius: '8px' }}>
                      <strong>Full Text:</strong>
                      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{loading ? 'Loading...' : error ? error : docText}</pre>
                      <button onClick={handleCloseSingle}>Close</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : <p>(None this time)</p>}
      </div>
      <div style={{ margin: '2em 0' }}>
        <h3>Documents to review:</h3>
        {toReview.length ? (
          <ul>
            {toReview.map(d => {
              const doc = getDoc(d.id);
              const hasText = doc && (doc.textFile || doc.fullText);
              return (
                <li key={d.id}>
                  {hasText ? (
                    <button style={{ background: 'none', border: 'none', color: '#3366cc', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleOpenSingle(doc)}>
                      {d.title}
                    </button>
                  ) : (
                    <span>{d.title} <span style={{ color: '#888' }}>(Full text not available)</span></span>
                  )}
                  {' '}({d.correct} / {d.shown} correct, {Math.round((d.correct/d.shown)*100)}%)
                  {openDoc === d.id && (
                    <div style={{ background: '#f9f9f9', padding: '1em', margin: '0.5em 0', borderRadius: '8px' }}>
                      <strong>Full Text:</strong>
                      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{loading ? 'Loading...' : error ? error : docText}</pre>
                      <button onClick={handleCloseSingle}>Close</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : <p>(None! Great job!)</p>}
      </div>
      <button onClick={onRestart}>Play Again</button>
      <button onClick={onHome} style={{ marginLeft: '1em' }}>Return Home</button>
    </div>
  );
};

export default Results; 