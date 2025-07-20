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
const NUM_CHOICES = 4;
const QUESTIONS_PER_PLAYER = 5;
const MAX_SENTENCE_LENGTH = 300;

const PLAYER_COLORS = [
  '#4F8EF7', // blue
  '#F76E4F', // orange
  '#4FF7A1', // green
  '#F7E14F', // yellow
  '#B14FF7', // purple
  '#F74F8E', // pink
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
  // Split and filter out very long 'sentences'
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s && s.length > 0 && s.length <= MAX_SENTENCE_LENGTH);
}

const Game = ({ onEnd, difficulty = 'easy', playerInfo, mode, category = 'history' }) => {
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
      // Filter documents by category
      const docsInCategory = documents.filter(doc => doc.category === category);
      // Gather all docs with at least one valid fragment
      let docFragments = [];
      for (const doc of docsInCategory) {
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
      // Determine number of questions
      const totalQuestions = isMulti ? numPlayers * QUESTIONS_PER_PLAYER : NUM_QUESTIONS;
      // For each question, select a document at random (with replacement), but ensure unique (doc, fragment) pairs
      let qs = [];
      const usedPairs = new Set();
      let attemptsToFill = 0;
      let nextQuestionId = 1;
      while (qs.length < totalQuestions && attemptsToFill < totalQuestions * 10) { // safety limit
        // Pick a random doc
        const docInfo = docFragments[Math.floor(Math.random() * docFragments.length)];
        // Pick a random fragment from that doc
        const fragIdx = Math.floor(Math.random() * docInfo.fragments.length);
        const fragment = docInfo.fragments[fragIdx];
        const pairKey = docInfo.doc.id + '::' + fragIdx;
        if (usedPairs.has(pairKey)) {
          attemptsToFill++;
          continue; // skip duplicates
        }
        usedPairs.add(pairKey);
        const playerIdx = isMulti ? (qs.length % numPlayers) : 0;
        // Choices: correct + random others (from same category)
        const otherDocs = docsInCategory.filter(d => d.id !== docInfo.doc.id);
        const choices = shuffle([
          docInfo.doc,
          ...shuffle(otherDocs).slice(0, Math.max(0, NUM_CHOICES - 1))
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
    // eslint-disable-next-line
  }, [difficulty, playerInfo, category]);

  if (loading) return <div>Loading game...</div>;
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

  const handleSelect = (id) => {
    if (selected) return;
    setSelected(id);
    setShowFeedback(true);
    const correct = id === currentDoc.id;
    setAttempts(a => {
      // Only add if this questionId is not already present for this player
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
      // Group attempts by player for results
      let allAttempts = attempts;
      // Only add the last answer if it hasn't already been added for this questionId
      const lastQIdx = current;
      const lastQ = questions[lastQIdx];
      const alreadyAnswered = attempts.some(a => a.questionId === lastQ.questionId && a.playerIdx === lastQ.playerIdx);
      if (!alreadyAnswered) {
        allAttempts = attempts.concat({
          questionId: lastQ.questionId,
          id: currentDoc.id,
          title: currentDoc.title,
          correct: selected === currentDoc.id,
          playerIdx: currentPlayerIdx,
          excerpt,
        });
      }
      const perPlayerAttempts = Array(numPlayers).fill(0).map(() => []);
      allAttempts.forEach(a => {
        perPlayerAttempts[a.playerIdx].push(a);
      });
      // Debug log
      console.log('perPlayerAttempts', perPlayerAttempts);
      // Compute final scores from allAttempts
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
        mode,
      });
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  return (
    <div className="game-container">
      {/* Player color block with avatar */}
      <div style={{
        display: 'flex',
        justifyContent: blockJustify,
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div className="player-block" style={{
          background: playerColor,
          color: '#fff',
          minWidth: 220,
          minHeight: 56,
          borderRadius: 14,
          fontWeight: 'bold',
          fontSize: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px #0002',
          padding: '0 36px',
        }}>
          {isMulti && currentAvatar && (
            <img
              src={currentAvatar.src}
              alt={currentAvatar.label}
              title={currentAvatar.label}
              style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 16, border: '2px solid #fff', background: '#fff' }}
            />
          )}
          {isMulti ? `Player ${currentPlayerIdx + 1}: ${currentPlayer}` : 'Your Turn'}
        </div>
      </div>
      {isMulti && <div style={{ marginBottom: '0.5em', color: '#888' }}>Turn {current + 1} of {totalQuestions}</div>}
      <p><em>Which document is this {difficulty === 'hard' ? 'sentence' : 'paragraph'} from?</em></p>
      <blockquote style={{ fontSize: '1.2em', margin: '1em 0' }}>{excerpt}</blockquote>
      <div className="game-buttons">
        {choices.map(doc => (
          <button
            key={doc.id}
            onClick={() => handleSelect(doc.id)}
            disabled={!!selected}
            style={{
              margin: '0.5em',
              background: selected === doc.id
                ? (doc.id === currentDoc.id ? '#b2f2a5' : '#f2b2b2')
                : undefined
            }}
          >
            {doc.title}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div style={{ marginTop: '1em' }}>
          {selected === currentDoc.id ? (
            <span style={{ color: 'green' }}>Correct!</span>
          ) : (
            <span style={{ color: 'red' }}>
              Incorrect. The correct answer was <b>{currentDoc.title}</b>.<br />
              Fun fact: {currentDoc.funFacts ? currentDoc.funFacts[Math.floor(Math.random() * currentDoc.funFacts.length)] : ''}
            </span>
          )}
          <div>
            <button onClick={handleNext} style={{ marginTop: '1em' }}>
              {current + 1 === totalQuestions ? 'Finish' : 'Next Question'}
            </button>
          </div>
        </div>
      )}
      <div className="score-display" style={{ marginTop: '2em', color: '#888', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {isMulti
          ? playerNames.map((name, i) => (
              <span key={i} style={{ marginRight: '1.5em', display: 'flex', alignItems: 'center' }}>
                {playerAvatars[i] && AVATARS[playerAvatars[i]] && (
                  <img
                    src={AVATARS[playerAvatars[i]].src}
                    alt={AVATARS[playerAvatars[i]].label}
                    title={AVATARS[playerAvatars[i]].label}
                    style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 4, border: '1.5px solid #ccc', background: '#fff' }}
                  />
                )}
                {name}: {scores[i]}
              </span>
            ))
          : <>Score: {scores[0]} / {totalQuestions}</>
        }
      </div>
    </div>
  );
};

export default Game; 