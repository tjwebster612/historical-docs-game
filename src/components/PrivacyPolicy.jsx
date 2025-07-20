import React from 'react';

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="app-header">
        <h1 className="app-title">Privacy Policy</h1>
        <p className="app-subtitle">How we handle your information</p>
      </div>

      <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
        <h3>Information We Collect</h3>
        <p>
          Archivist Academy is designed with privacy in mind. We collect minimal information necessary for the game to function:
        </p>
        <ul>
          <li><strong>Game Progress:</strong> Your scores and performance are stored locally in your browser</li>
          <li><strong>No Personal Data:</strong> We do not collect names, emails, or personal identifiers</li>
          <li><strong>No Tracking:</strong> We do not use cookies or tracking technologies</li>
        </ul>

        <h3>How We Use Information</h3>
        <p>
          Any information collected is used solely for:
        </p>
        <ul>
          <li>Providing game functionality and scoring</li>
          <li>Improving the educational experience</li>
          <li>Technical support and bug fixes</li>
        </ul>

        <h3>Third-Party Services</h3>
        <p>
          We use the following third-party services:
        </p>
        <ul>
          <li><strong>Vercel:</strong> Hosting and deployment (no personal data shared)</li>
          <li><strong>Amazon Associates:</strong> Affiliate links (standard affiliate tracking)</li>
        </ul>

        <h3>Data Security</h3>
        <p>
          We implement appropriate security measures to protect any information collected. 
          Since we collect minimal data, the risk of data breaches is extremely low.
        </p>

        <h3>Children's Privacy</h3>
        <p>
          Archivist Academy is suitable for educational use by all ages. We do not knowingly collect 
          personal information from children under 13. If you believe we have collected such information, 
          please contact us immediately.
        </p>

        <h3>Changes to This Policy</h3>
        <p>
          We may update this privacy policy from time to time. Any changes will be posted on this page 
          with an updated revision date.
        </p>

        <h3>Contact Information</h3>
        <p>
          If you have any questions about this privacy policy, please contact us through the 
          GitHub repository for this project.
        </p>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e1e8ed'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={onBack} className="primary">Back to App</button>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 