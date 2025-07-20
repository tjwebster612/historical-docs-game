import React from 'react';

const AffiliateRecommendations = ({ type = 'general', documentId = null }) => {
  // Replace these with your actual affiliate links
  const AFFILIATE_LINKS = {
    // Amazon Associates links (replace with your actual affiliate ID)
    amazon: {
      federalist: 'https://amazon.com/dp/0140444955?tag=YOUR_AFFILIATE_ID',
      constitution: 'https://amazon.com/dp/0451528815?tag=YOUR_AFFILIATE_ID',
      declaration: 'https://amazon.com/dp/0451528904?tag=YOUR_AFFILIATE_ID',
      gatsby: 'https://amazon.com/dp/0743273567?tag=YOUR_AFFILIATE_ID',
      mobydick: 'https://amazon.com/dp/0142437247?tag=YOUR_AFFILIATE_ID',
      frankenstein: 'https://amazon.com/dp/0141439475?tag=YOUR_AFFILIATE_ID',
      pride: 'https://amazon.com/dp/0141439513?tag=YOUR_AFFILIATE_ID',
      alice: 'https://amazon.com/dp/0141439769?tag=YOUR_AFFILIATE_ID',
      dracula: 'https://amazon.com/dp/014143984X?tag=YOUR_AFFILIATE_ID',
      sherlock: 'https://amazon.com/dp/0140439071?tag=YOUR_AFFILIATE_ID',
      treasure: 'https://amazon.com/dp/0141439491?tag=YOUR_AFFILIATE_ID',
      janeeyre: 'https://amazon.com/dp/0141441143?tag=YOUR_AFFILIATE_ID',
      huckfinn: 'https://amazon.com/dp/0142437174?tag=YOUR_AFFILIATE_ID',
      tale: 'https://amazon.com/dp/0141439602?tag=YOUR_AFFILIATE_ID',
      nineteen84: 'https://amazon.com/dp/0451524934?tag=YOUR_AFFILIATE_ID',
    },
    // Audible links
    audible: {
      gatsby: 'https://audible.com/pd/The-Great-Gatsby-Audiobook?asin=B002V5BQOQ&tag=YOUR_AFFILIATE_ID',
      mobydick: 'https://audible.com/pd/Moby-Dick-Audiobook?asin=B002V5BQOQ&tag=YOUR_AFFILIATE_ID',
      frankenstein: 'https://audible.com/pd/Frankenstein-Audiobook?asin=B002V5BQOQ&tag=YOUR_AFFILIATE_ID',
    },
    // Coursera links
    coursera: {
      history: 'https://coursera.org/learn/american-history?affiliate=YOUR_AFFILIATE_ID',
      literature: 'https://coursera.org/learn/literature?affiliate=YOUR_AFFILIATE_ID',
      writing: 'https://coursera.org/learn/creative-writing?affiliate=YOUR_AFFILIATE_ID',
    }
  };

  const getRecommendations = () => {
    if (documentId && AFFILIATE_LINKS.amazon[documentId]) {
      // Document-specific recommendations
      return [
        {
          title: `Read the full "${getDocumentTitle(documentId)}"`,
          description: `Get the complete book to dive deeper into this classic work.`,
          link: AFFILIATE_LINKS.amazon[documentId],
          type: 'book',
          icon: '📖'
        }
      ];
    }

    // General recommendations based on type
    switch (type) {
      case 'history':
        return [
          {
            title: 'American History Course',
            description: 'Deepen your understanding of American history with expert-led courses.',
            link: AFFILIATE_LINKS.coursera.history,
            type: 'course',
            icon: '🎓'
          },
          {
            title: 'Founding Documents Collection',
            description: 'Get the complete collection of America\'s founding documents.',
            link: AFFILIATE_LINKS.amazon.constitution,
            type: 'book',
            icon: '📜'
          }
        ];
      
      case 'literature':
        return [
          {
            title: 'Classic Literature Course',
            description: 'Study the great works of literature with university professors.',
            link: AFFILIATE_LINKS.coursera.literature,
            type: 'course',
            icon: '🎓'
          },
          {
            title: 'Classic Novels Collection',
            description: 'Build your personal library of classic literature.',
            link: AFFILIATE_LINKS.amazon.gatsby,
            type: 'book',
            icon: '📚'
          }
        ];
      
      default:
        return [
          {
            title: 'Creative Writing Course',
            description: 'Learn to write like the great authors you\'re studying.',
            link: AFFILIATE_LINKS.coursera.writing,
            type: 'course',
            icon: '✍️'
          },
          {
            title: 'Study Guide Collection',
            description: 'Get study guides to help you understand these classic works.',
            link: AFFILIATE_LINKS.amazon.federalist,
            type: 'book',
            icon: '📖'
          }
        ];
    }
  };

  const getDocumentTitle = (id) => {
    const titles = {
      federalist10: 'Federalist No. 10',
      constitution: 'The United States Constitution',
      declaration: 'The Declaration of Independence',
      gatsby: 'The Great Gatsby',
      mobydick: 'Moby Dick',
      frankenstein: 'Frankenstein',
      pride: 'Pride and Prejudice',
      alice: 'Alice\'s Adventures in Wonderland',
      dracula: 'Dracula',
      sherlock: 'The Adventures of Sherlock Holmes',
      treasure: 'Treasure Island',
      janeeyre: 'Jane Eyre',
      huckfinn: 'The Adventures of Huckleberry Finn',
      tale: 'A Tale of Two Cities',
      nineteen84: '1984'
    };
    return titles[id] || 'this work';
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  return (
    <div className="affiliate-recommendations" style={{
      background: '#f8f9fa',
      border: '1px solid #e1e8ed',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '1.5rem 0',
      borderLeft: '4px solid #3498db'
    }}>
      <h4 style={{ 
        margin: '0 0 1rem 0', 
        color: '#2c3e50',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        📚 Continue Your Learning Journey
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recommendations.map((rec, index) => (
          <a
            key={index}
            href={rec.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '1rem',
              background: '#ffffff',
              border: '1px solid #e1e8ed',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{rec.icon}</span>
              <div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  marginBottom: '0.25rem'
                }}>
                  {rec.title}
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#6c757d',
                  lineHeight: '1.4'
                }}>
                  {rec.description}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div style={{ 
        fontSize: '0.8rem', 
        color: '#6c757d', 
        marginTop: '1rem',
        fontStyle: 'italic'
      }}>
        *As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
      </div>
    </div>
  );
};

export default AffiliateRecommendations; 