import React, { useState, useEffect } from 'react';
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

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const NUM_QUESTIONS = 10;
const QUESTIONS_PER_PLAYER = 5;

const PLAYER_COLORS = [
  '#4F8EF7', // blue
  '#F76E4F', // orange
  '#4FF7A1', // green
  '#F7E14F', // yellow
  '#B14FF7', // purple
  '#F74F8E', // pink
];

// Available categories for the game
const CATEGORIES = [
  { id: 'history', name: 'History', icon: '🏛️', color: '#4F8EF7' },
  { id: 'classic literature', name: 'Classic Literature', icon: '📚', color: '#F76E4F' },
  { id: 'pop culture', name: 'Pop Culture', icon: '📱', color: '#4FF7A1' }
];

async function getDocText(doc) {
  if (doc.textFile) {
    try {
      const res = await fetch(`/texts/${doc.textFile}`);
      if (!res.ok) return '';
      const text = await res.text();
      return text;
    } catch {
      return '';
    }
  } else if (doc.fullText) {
    return doc.fullText;
  }
  return '';
}

function splitParagraphs(text) {
  return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s && s.length > 0 && s.length <= 300);
}

const CategoryGame = ({ onEnd, difficulty = 'easy', playerInfo }) => {
  const isMulti = !!playerInfo;
  const numPlayers = isMulti ? playerInfo.numPlayers : 1;
  const playerNames = isMulti ? playerInfo.playerNames : ['You'];
  const playerAvatars = isMulti ? playerInfo.playerAvatars : [];
  const totalQuestions = isMulti ? numPlayers * QUESTIONS_PER_PLAYER : NUM_QUESTIONS;

  const [questions, setQuestions] = useState([]); // [{doc, choices, excerpt, playerIdx}]
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState([]); // [{id, title, correct, playerIdx}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scores, setScores] = useState(Array(numPlayers).fill(0));

  useEffect(() => {
    let isMounted = true;
    async function prepareQuestions() {
      setLoading(true);
      setError(null);
      
      // Gather all docs with at least one valid fragment
      let docFragments = [];
      for (const doc of documents) {
        const text = await getDocText(doc);
        let sections = [];
        if (difficulty === 'hard') {
          sections = splitSentences(text);
        } else {
          sections = splitParagraphs(text);
        }
        if (sections.length > 0) {
          docFragments.push({ doc, fragments: sections });
        }
      }
      
      if (docFragments.length === 0) {
        if (isMounted) {
          setError('No documents with available text to play the game.');
          setLoading(false);
        }
        return;
      }

      // Generate questions
      let qs = [];
      const usedPairs = new Set();
      let attemptsToFill = 0;
      let nextQuestionId = 1;
      
      while (qs.length < totalQuestions && attemptsToFill < totalQuestions * 10) {
        // Pick a random doc
        const docInfo = docFragments[Math.floor(Math.random() * docFragments.length)];
        // Pick a random fragment from that doc
        const fragIdx = Math.floor(Math.random() * docInfo.fragments.length);
        const fragment = docInfo.fragments[fragIdx];
        const pairKey = docInfo.doc.id + '::' + fragIdx;
        
        if (usedPairs.has(pairKey)) {
          attemptsToFill++;
          continue;
        }
        
        usedPairs.add(pairKey);
        const playerIdx = isMulti ? (qs.length % numPlayers) : 0;
        
        // Choices: correct category + random other categories
        const otherCategories = CATEGORIES.filter(c => c.id !== docInfo.doc.category);
        const choices = shuffle([
          CATEGORIES.find(c => c.id === docInfo.doc.category),
          ...shuffle(otherCategories).slice(0, 2)
        ]);
        
        qs.push({
          questionId: nextQuestionId++,
          doc: docInfo.doc,
          choices,
          excerpt: fragment,
          playerIdx,
        });
        attemptsToFill++;
      }
      
      if (qs.length < totalQuestions) {
        if (isMounted) {
          setError('Not enough unique document fragments to generate all questions.');
          setLoading(false);
        }
        return;
      }
      
      if (isMounted) {
        setQuestions(qs);
        setCurrent(0);
        setSelected(null);
        setShowFeedback(false);
        setAttempts([]);
        setScores(Array(numPlayers).fill(0));
        setLoading(false);
      }
    }
    prepareQuestions();
  }, [difficulty, playerInfo]);

  if (loading) return <div>Loading category game...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!questions.length) return <div>No questions available.</div>;

  const { doc: currentDoc, choices, excerpt, playerIdx } = questions[current];
  const currentPlayerIdx = isMulti ? playerIdx : 0;
  const currentPlayer = playerNames[currentPlayerIdx];
  const currentAvatar = isMulti ? AVATARS[playerAvatars[currentPlayerIdx]] : null;
  const playerColor = PLAYER_COLORS[currentPlayerIdx % PLAYER_COLORS.length];

  // Visual block position: left for even, right for odd, center for single
  let blockJustify = 'center';
  if (isMulti) {
    blockJustify = currentPlayerIdx % 2 === 0 ? 'flex-start' : 'flex-end';
  }

  const handleSelect = (categoryId) => {
    if (selected) return;
    setSelected(categoryId);
    setShowFeedback(true);
    const correct = categoryId === currentDoc.category;
    setAttempts(a => {
      if (a.some(attempt => attempt.questionId === questions[current].questionId && attempt.playerIdx === currentPlayerIdx)) {
        return a;
      }
      return [
        ...a,
        {
          questionId: questions[current].questionId,
          id: currentDoc.id,
          title: currentDoc.title,
          correct,
          playerIdx: currentPlayerIdx,
          excerpt,
        },
      ];
    });
    if (correct) {
      setScores(prev => prev.map((s, i) => i === currentPlayerIdx ? s + 1 : s));
    }
  };

  const handleNext = () => {
    if (current + 1 >= totalQuestions) {
      let allAttempts = attempts;
      const lastQIdx = current;
      const lastQ = questions[lastQIdx];
      const alreadyAnswered = attempts.some(a => a.questionId === lastQ.questionId && a.playerIdx === lastQ.playerIdx);
      if (!alreadyAnswered) {
        allAttempts = attempts.concat({
          questionId: lastQ.questionId,
          id: currentDoc.id,
          title: currentDoc.title,
          correct: selected === currentDoc.category,
          playerIdx: currentPlayerIdx,
          excerpt,
        });
      }
      const perPlayerAttempts = Array(numPlayers).fill(0).map(() => []);
      allAttempts.forEach(a => {
        perPlayerAttempts[a.playerIdx].push(a);
      });
      const finalScores = Array(numPlayers).fill(0);
      allAttempts.forEach(a => {
        if (a.correct) finalScores[a.playerIdx] += 1;
      });
      onEnd({
        scores: finalScores,
        total: totalQuestions,
        attempts: perPlayerAttempts,
        playerNames,
        playerAvatars: isMulti ? playerAvatars : undefined,
        mode: 'category',
      });
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  return (
    <div className="game-container">
      {/* Progress indicator */}
      <div className="progress-bar">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`progress-dot ${
              i < current ? 'completed' : i === current ? 'active' : ''
            }`}
          />
        ))}
      </div>

      {/* Player color block with avatar */}
      <div style={{
        display: 'flex',
        justifyContent: blockJustify,
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div className="player-block">
          {isMulti && currentAvatar && (
            <img
              src={currentAvatar.src}
              alt={currentAvatar.label}
              title={currentAvatar.label}
            />
          )}
          {isMulti ? `Player ${currentPlayerIdx + 1}: ${currentPlayer}` : 'Your Turn'}
        </div>
      </div>
      
      {isMulti && <div style={{ marginBottom: '1rem', color: '#6c757d', fontSize: '0.9rem' }}>Turn {current + 1} of {totalQuestions}</div>}
      
      <p style={{ fontSize: '1.1rem', color: '#2c3e50', marginBottom: '1.5rem' }}>
        <em>Which category does this {difficulty === 'hard' ? 'sentence' : 'paragraph'} belong to?</em>
      </p>
      
      <blockquote>{excerpt}</blockquote>
      
      <div className="game-buttons">
        {choices.map(category => (
          <button
            key={category.id}
            onClick={() => handleSelect(category.id)}
            disabled={!!selected}
            className={
              selected === category.id
                ? category.id === currentDoc.category ? 'correct' : 'incorrect'
                : ''
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              padding: '1rem 1.5rem',
              border: `2px solid ${category.color}`,
              backgroundColor: selected === category.id && category.id === currentDoc.category ? category.color : 'white',
              color: selected === category.id && category.id === currentDoc.category ? 'white' : category.color,
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
      
      {showFeedback && (
        <div className={`feedback-section ${selected === currentDoc.category ? 'feedback-correct' : 'feedback-incorrect'}`}>
          {selected === currentDoc.category ? (
            <span style={{ fontWeight: '600' }}>✓ Correct! This is {CATEGORIES.find(c => c.id === currentDoc.category)?.name}.</span>
          ) : (
            <div>
              <span style={{ fontWeight: '600' }}>
                ✗ Incorrect. This is actually <strong>{CATEGORIES.find(c => c.id === currentDoc.category)?.name}</strong>.
              </span>
              {currentDoc.funFacts && (
                <p style={{ marginTop: '1rem', marginBottom: '0' }}>
                  <strong>Fun fact:</strong> {currentDoc.funFacts[Math.floor(Math.random() * currentDoc.funFacts.length)]}
                </p>
              )}
            </div>
          )}
          <div style={{ marginTop: '1.5rem' }}>
            <button 
              onClick={handleNext} 
              className="primary"
              style={{ width: 'auto', minWidth: '120px' }}
            >
              {current + 1 === totalQuestions ? 'Finish' : 'Next Question'}
            </button>
          </div>
        </div>
      )}
      
      <div className="score-display">
        {isMulti
          ? playerNames.map((name, i) => (
              <div key={i} className="score-item">
                {playerAvatars[i] && AVATARS[playerAvatars[i]] && (
                  <img
                    src={AVATARS[playerAvatars[i]].src}
                    alt={AVATARS[playerAvatars[i]].label}
                    title={AVATARS[playerAvatars[i]].label}
                  />
                )}
                <span>{name}: {scores[i]}</span>
              </div>
            ))
          : <div className="score-item">Score: {scores[0]} / {totalQuestions}</div>
        }
      </div>
    </div>
  );
};

export default CategoryGame; 