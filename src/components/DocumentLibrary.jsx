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
      <div className="library-sidebar" style={{ width: 340, borderRight: '1px solid #e1e8ed', padding: '2rem 1.5rem 2rem 2rem', background: '#f8f9fa' }}>
        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Archivist's Library</h2>
        {Object.entries(docsByCategory).map(([cat, docs]) => (
          <div key={cat} style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50', fontSize: '1.1rem', fontWeight: '600' }}>{CATEGORY_LABELS[cat] || cat}</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {docs.map(doc => (
                <li key={doc.id} className="document-item" onClick={() => handleOpen(doc)}>
                  <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>{doc.title} <span style={{ color: '#6c757d', fontWeight: '400' }}>({doc.year})</span></div>
                  <div style={{ fontSize: '0.9rem', color: '#495057', marginBottom: '0.25rem' }}>{doc.theme}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6c757d', fontStyle: 'italic' }}>{getRandomFact(doc.funFacts)}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button onClick={onBack} className="primary" style={{ width: '100%', marginTop: '2rem' }}>Back to Home</button>
      </div>
      {/* Right pane: document text */}
      <div className="library-content" style={{ flex: 1, padding: '2rem', minWidth: 0 }}>
        {openDoc ? (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>{openDoc.title}</h2>
            <div className="document-text" style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', maxHeight: 500, overflowY: 'auto', border: '1px solid #e1e8ed', padding: '1.5rem', background: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
              {loading ? (
                <div style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>Loading document...</div>
              ) : error ? (
                <div style={{ color: '#e74c3c', padding: '1rem' }}>{error}</div>
              ) : (
                docText
              )}
            </div>
            <button onClick={() => setOpenDoc(null)} style={{ marginTop: '1.5rem' }}>Close Document</button>
          </div>
        ) : (
                      <div style={{ color: '#6c757d', fontSize: '1.1rem', textAlign: 'center', marginTop: '6rem', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🏛️</div>
              Select a document from the Archivist's Library to view its full text.
            </div>
        )}
      </div>
    </div>
  );
};

export default DocumentLibrary; 