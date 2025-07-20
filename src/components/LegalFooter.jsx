import React from 'react';

const LegalFooter = () => {
  return (
    <footer style={{
      background: '#f8f9fa',
      borderTop: '1px solid #e1e8ed',
      padding: '2rem 0',
      marginTop: '3rem',
      fontSize: '0.85rem',
      color: '#6c757d',
      lineHeight: '1.5'
    }}>
      <div className="container">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h4 style={{ 
            color: '#2c3e50', 
            marginBottom: '1rem',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            Legal Information & Disclaimers
          </h4>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ 
              color: '#2c3e50', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              📚 Public Domain Works
            </h5>
            <p style={{ marginBottom: '0.5rem' }}>
              All historical documents and classic literature featured in Archivist Academy are in the public domain. 
              These works are freely available for educational use and have no copyright restrictions. 
              The original authors and publishers retain no rights to these works.
            </p>
            <p>
              Text excerpts are used for educational purposes to help users learn about and identify 
              important historical and literary works. This constitutes fair use under educational guidelines.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ 
              color: '#2c3e50', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              💰 Affiliate Disclosure
            </h5>
            <p style={{ marginBottom: '0.5rem' }}>
              Archivist Academy participates in various affiliate marketing programs, including the Amazon Services LLC Associates Program. 
              As an Amazon Associate, we earn from qualifying purchases made through our affiliate links.
            </p>
            <p>
              When you click on affiliate links and make purchases, we may receive a commission at no additional cost to you. 
              This helps support the development and maintenance of Archivist Academy.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ 
              color: '#2c3e50', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              🎓 Educational Purpose
            </h5>
            <p>
              Archivist Academy is designed for educational purposes to help users learn about historical documents 
              and classic literature. The game format is intended to make learning engaging and interactive. 
              All content is presented in good faith for educational use.
            </p>
          </div>

          <div style={{ 
            borderTop: '1px solid #e1e8ed', 
            paddingTop: '1rem',
            fontSize: '0.8rem',
            color: '#6c757d'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Disclaimer:</strong> While we strive for accuracy, Archivist Academy is provided "as is" 
              without warranties of any kind. We are not responsible for any errors or omissions in the content.
            </p>
            <p>
              <strong>Privacy:</strong> We do not collect personal information beyond what is necessary for game functionality. 
              <a href="/privacy" style={{ color: '#3498db', textDecoration: 'underline' }}>View our full privacy policy</a>.
            </p>
            <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter; 