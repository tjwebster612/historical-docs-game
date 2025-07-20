import React, { useState } from 'react';
import { documents } from '../data/documents.js';

function getRandomFact(facts) {
  if (!facts || !facts.length) return null;
  return facts[Math.floor(Math.random() * facts.length)];
}

const CATEGORY_LABELS = {
  'history': 'Historical Documents',
  'classic literature': 'Classic Literature',
};

const DocumentLibrary = ({ onBack }) => {
  const [openDoc, setOpenDoc] = useState(null);
  const [docText, setDocText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="library-container" style={{ display: 'flex', minHeight: 600 }}>
      {/* Left pane: categories and document list */}
      <div className="library-sidebar" style={{ width: 340, borderRight: '1px solid #eee', padding: '2em 1.5em 2em 2em', background: '#fafbfc' }}>
        <h2 style={{ marginTop: 0 }}>Document Library</h2>
        {Object.entries(docsByCategory).map(([cat, docs]) => (
          <div key={cat} style={{ marginBottom: '2em' }}>
            <h3 style={{ marginBottom: 8 }}>{CATEGORY_LABELS[cat] || cat}</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {docs.map(doc => (
                <li key={doc.id} className="document-item" style={{ marginBottom: '1.2em', cursor: 'pointer', background: openDoc && openDoc.id === doc.id ? '#e6f0fa' : undefined, borderRadius: 6, padding: '0.5em 0.5em 0.5em 0.5em' }} onClick={() => handleOpen(doc)}>
                  <div style={{ fontWeight: 600 }}>{doc.title} <span style={{ color: '#888', fontWeight: 400 }}>({doc.year})</span></div>
                  <div style={{ fontSize: '0.95em', color: '#666' }}>{doc.theme}</div>
                  <div style={{ fontSize: '0.92em', color: '#aaa' }}>{getRandomFact(doc.funFacts)}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button onClick={onBack} style={{ marginTop: '2em' }}>Back to Home</button>
      </div>
      {/* Right pane: document text */}
      <div className="library-content" style={{ flex: 1, padding: '2em', minWidth: 0 }}>
        {openDoc ? (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2>{openDoc.title}</h2>
            <div className="document-text" style={{ fontSize: '0.95em', whiteSpace: 'pre-wrap', maxHeight: 500, overflowY: 'auto', border: '1px solid #ddd', padding: '1em', background: '#fff', borderRadius: 8 }}>
              {loading ? 'Loading...' : error ? error : docText}
            </div>
            <button onClick={() => setOpenDoc(null)} style={{ marginTop: '1em' }}>Close</button>
          </div>
        ) : (
          <div style={{ color: '#888', fontSize: '1.1em', textAlign: 'center', marginTop: '6em' }}>
            Select a document on the left to view its full text.
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentLibrary; 