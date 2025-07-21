import React, { useState } from 'react';
import { documents } from '../data/documents.js';
import AffiliateRecommendations from './AffiliateRecommendations.jsx';

function getRandomFact(facts) {
  if (!facts || !facts.length) return null;
  return facts[Math.floor(Math.random() * facts.length)];
}

const CATEGORY_LABELS = {
  'history': 'Historical Documents',
  'classic literature': 'Classic Literature',
  'pop culture': 'Pop Culture',
  'philosophy': 'Philosophy',
};

export default function DocumentLibrary({ onBack }) {
  const [openDoc, setOpenDoc] = useState(null);
  const [docText, setDocText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

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

  const handleToggleCategory = (cat) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="library-container" style={{ display: 'flex', minHeight: 600 }}>
      {/* Left pane: categories and document list */}
      <div className="library-sidebar" style={{ width: 340, borderRight: '1px solid #e1e8ed', padding: '2rem 1.5rem 2rem 2rem', background: '#f8f9fa' }}>
        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Archivist's Library</h2>
        {Object.entries(docsByCategory).map(([cat, docs]) => (
          <div key={cat} style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => handleToggleCategory(cat)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#2c3e50',
                padding: '0.5rem 0',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              aria-expanded={!!expanded[cat]}
            >
              <span style={{ fontSize: '1.2rem' }}>{expanded[cat] ? '▼' : '▶'}</span>
              {CATEGORY_LABELS[cat] || cat}
            </button>
            {expanded[cat] && (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                {docs.map(doc => (
                  <li key={doc.id} className="document-item" onClick={() => handleOpen(doc)} style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>{doc.title} <span style={{ color: '#6c757d', fontWeight: '400' }}>({doc.year})</span></div>
                    <div style={{ fontSize: '0.9rem', color: '#495057', marginBottom: '0.25rem' }}>{doc.theme}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6c757d', fontStyle: 'italic' }}>{getRandomFact(doc.funFacts)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <button onClick={onBack} className="primary" style={{ width: '100%', marginTop: '2rem' }}>Back to Home</button>
      </div>
      {/* Right pane: document details */}
      <div className="library-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {openDoc ? (
          <div>
            <button onClick={() => setOpenDoc(null)} style={{ marginBottom: '1rem' }}>&larr; Back to List</button>
            <h2 style={{ color: '#2c3e50' }}>{openDoc.title} <span style={{ color: '#6c757d', fontWeight: '400', fontSize: '1.1rem' }}>({openDoc.year})</span></h2>
            <div style={{ marginBottom: '1rem', color: '#495057' }}>{openDoc.theme}</div>
            <div style={{ marginBottom: '1rem', color: '#6c757d', fontStyle: 'italic' }}>{getRandomFact(openDoc.funFacts)}</div>
            {loading ? (
              <div>Loading document...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>{error}</div>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '1rem', background: '#f4f4f4', padding: '1rem', borderRadius: 8, maxHeight: 600, overflowY: 'auto' }}>{docText}</pre>
            )}
            <AffiliateRecommendations documentId={openDoc.id} />
          </div>
        ) : (
          <div style={{ color: '#6c757d', fontStyle: 'italic' }}>Select a document to view its details.</div>
        )}
      </div>
    </div>
  );
} 