import React from 'react';

const AffiliateRecommendations = ({ type = 'general', documentId = null }) => {
  // Replace these with your actual affiliate links
  const AFFILIATE_LINKS = {
    // Amazon Associates links
    amazon: {
      federalist: 'https://amazon.com/dp/0140444955?tag=tjw126-20',
      constitution: 'https://amazon.com/dp/0451528815?tag=tjw126-20',
      declaration: 'https://amazon.com/dp/0451528904?tag=tjw126-20',
      gatsby: 'https://amazon.com/dp/0743273567?tag=tjw126-20',
      mobydick: 'https://amazon.com/dp/0142437247?tag=tjw126-20',
      frankenstein: 'https://amazon.com/dp/0141439475?tag=tjw126-20',
      pride: 'https://amazon.com/dp/0141439513?tag=tjw126-20',
      alice: 'https://amazon.com/dp/0141439769?tag=tjw126-20',
      dracula: 'https://amazon.com/dp/014143984X?tag=tjw126-20',
      sherlock: 'https://amazon.com/dp/0140439071?tag=tjw126-20',
      treasure: 'https://amazon.com/dp/0141439491?tag=tjw126-20',
      janeeyre: 'https://amazon.com/dp/0141441143?tag=tjw126-20',
      huckfinn: 'https://amazon.com/dp/0142437174?tag=tjw126-20',
      tale: 'https://amazon.com/dp/0141439602?tag=tjw126-20',
      nineteen84: 'https://amazon.com/dp/0451524934?tag=tjw126-20',
      // Study guides and collections
      foundingDocs: 'https://amazon.com/dp/0451528815?tag=tjw126-20',
      classicCollection: 'https://amazon.com/dp/0142437247?tag=tjw126-20',
      literatureGuide: 'https://amazon.com/dp/0743273567?tag=tjw126-20',
      // Historical biographies and accounts
      washingtonBio: 'https://amazon.com/dp/0143119966?tag=tjw126-20', // Washington biography
      jeffersonBio: 'https://amazon.com/dp/0812979486?tag=tjw126-20', // Jefferson biography
      madisonBio: 'https://amazon.com/dp/0812979095?tag=tjw126-20', // Madison biography
      lincolnBio: 'https://amazon.com/dp/0743270754?tag=tjw126-20', // Lincoln biography
      americanRevolution: 'https://amazon.com/dp/014312398X?tag=tjw126-20', // American Revolution history
      civilWar: 'https://amazon.com/dp/0394749138?tag=tjw126-20', // Civil War history
      foundingFathers: 'https://amazon.com/dp/0812970411?tag=tjw126-20', // Founding Fathers book
      constitutionalHistory: 'https://amazon.com/dp/0195304438?tag=tjw126-20', // Constitutional history
      monroeDoctrine: 'https://amazon.com/dp/0199765925?tag=tjw126-20', // Monroe Doctrine history
      gettysburgHistory: 'https://amazon.com/dp/0743273206?tag=tjw126-20', // Gettysburg history
      emancipationHistory: 'https://amazon.com/dp/0393062381?tag=tjw126-20', // Emancipation history
      // Historical study guides
      apushGuide: 'https://amazon.com/dp/1506262085?tag=tjw126-20', // AP US History guide
      americanHistory: 'https://amazon.com/dp/0393602205?tag=tjw126-20', // American history textbook
      governmentTextbook: 'https://amazon.com/dp/0134162077?tag=tjw126-20', // Government textbook
      // Pop culture and social media
      socialMediaBook: 'https://amazon.com/dp/0143124471?tag=tjw126-20', // Social media impact book
      viralMarketing: 'https://amazon.com/dp/1591845637?tag=tjw126-20', // Viral marketing strategies
      internetCulture: 'https://amazon.com/dp/0143127799?tag=tjw126-20', // Internet culture book
      celebrityMemoir: 'https://amazon.com/dp/1501139165?tag=tjw126-20', // Celebrity memoir
      twitterBook: 'https://amazon.com/dp/1591846358?tag=tjw126-20', // Twitter history book
      memeBook: 'https://amazon.com/dp/0143127799?tag=tjw126-20', // Meme culture book
      // Pop culture specific
      trumpBook: 'https://amazon.com/dp/1501139165?tag=tjw126-20', // Trump biography
      kanyeBook: 'https://amazon.com/dp/1501139165?tag=tjw126-20', // Kanye West biography
      justinBieberBook: 'https://amazon.com/dp/1501139165?tag=tjw126-20', // Justin Bieber biography
      kimKardashianBook: 'https://amazon.com/dp/1501139165?tag=tjw126-20', // Kim Kardashian book
      ellenBook: 'https://amazon.com/dp/1501139165?tag=tjw126-20', // Ellen DeGeneres book
    },
    // Audible links
    audible: {
      gatsby: 'https://audible.com/pd/The-Great-Gatsby-Audiobook?asin=B002V5BQOQ&tag=tjw126-20',
      mobydick: 'https://audible.com/pd/Moby-Dick-Audiobook?asin=B002V5BQOQ&tag=tjw126-20',
      frankenstein: 'https://audible.com/pd/Frankenstein-Audiobook?asin=B002V5BQOQ&tag=tjw126-20',
      // Historical audiobooks
      washingtonBio: 'https://audible.com/pd/His-Excellency-George-Washington-Audiobook?asin=B002V5BQOQ&tag=tjw126-20',
      lincolnBio: 'https://audible.com/pd/Team-of-Rivals-Audiobook?asin=B002V5BQOQ&tag=tjw126-20',
      americanRevolution: 'https://audible.com/pd/American-Revolution-Audiobook?asin=B002V5BQOQ&tag=tjw126-20',
    },
    // Coursera links
    coursera: {
      history: 'https://coursera.org/learn/american-history?affiliate=YOUR_AFFILIATE_ID',
      literature: 'https://coursera.org/learn/literature?affiliate=YOUR_AFFILIATE_ID',
      writing: 'https://coursera.org/learn/creative-writing?affiliate=YOUR_AFFILIATE_ID',
      government: 'https://coursera.org/learn/american-government?affiliate=YOUR_AFFILIATE_ID',
      constitutional: 'https://coursera.org/learn/constitutional-law?affiliate=YOUR_AFFILIATE_ID',
    }
  };

  const getRecommendations = () => {
    if (documentId && AFFILIATE_LINKS.amazon[documentId]) {
      // Document-specific recommendations
      const recommendations = [
        {
          title: `Read the full "${getDocumentTitle(documentId)}"`,
          description: `Get the complete book to dive deeper into this classic work.`,
          link: AFFILIATE_LINKS.amazon[documentId],
          type: 'book',
          icon: '📖'
        }
      ];

      // Add historical context books for historical documents
      if (documentId === 'constitution' || documentId === 'declaration' || documentId === 'federalist10') {
        recommendations.push({
          title: 'The Founding Fathers: A Comprehensive Biography',
          description: 'Learn about the lives and contributions of America\'s founding fathers.',
          link: AFFILIATE_LINKS.amazon.foundingFathers,
          type: 'book',
          icon: '👥'
        });
      }

      // Add specific biographies for key figures
      if (documentId === 'constitution' || documentId === 'federalist10') {
        recommendations.push({
          title: 'James Madison: A Biography',
          description: 'The life and legacy of the "Father of the Constitution."',
          link: AFFILIATE_LINKS.amazon.madisonBio,
          type: 'book',
          icon: '👤'
        });
      }

      if (documentId === 'declaration') {
        recommendations.push({
          title: 'Thomas Jefferson: A Biography',
          description: 'Explore the life of the Declaration\'s principal author.',
          link: AFFILIATE_LINKS.amazon.jeffersonBio,
          type: 'book',
          icon: '👤'
        });
      }

      if (documentId === 'gettysburg' || documentId === 'emancipation') {
        recommendations.push({
          title: 'Abraham Lincoln: A Biography',
          description: 'The definitive biography of America\'s greatest president.',
          link: AFFILIATE_LINKS.amazon.lincolnBio,
          type: 'book',
          icon: '👤'
        });
      }

      if (documentId === 'constitution') {
        recommendations.push({
          title: 'Constitutional History: From Ratification to Today',
          description: 'Explore the fascinating history of the U.S. Constitution.',
          link: AFFILIATE_LINKS.amazon.constitutionalHistory,
          type: 'book',
          icon: '📜'
        });
      }

      if (documentId === 'declaration') {
        recommendations.push({
          title: 'The American Revolution: A Complete History',
          description: 'Dive deep into the revolutionary period that led to independence.',
          link: AFFILIATE_LINKS.amazon.americanRevolution,
          type: 'book',
          icon: '🎖️'
        });
      }

      if (documentId === 'gettysburg' || documentId === 'emancipation') {
        recommendations.push({
          title: 'The Civil War: A Comprehensive History',
          description: 'Understand the full context of the Civil War era.',
          link: AFFILIATE_LINKS.amazon.civilWar,
          type: 'book',
          icon: '⚔️'
        });
      }

      if (documentId === 'gettysburg') {
        recommendations.push({
          title: 'Gettysburg: The Battle and Its Impact',
          description: 'Explore the pivotal battle that changed the course of the war.',
          link: AFFILIATE_LINKS.amazon.gettysburgHistory,
          type: 'book',
          icon: '🏛️'
        });
      }

      if (documentId === 'emancipation') {
        recommendations.push({
          title: 'Emancipation: The Story of Freedom',
          description: 'Learn about the journey to emancipation and its lasting impact.',
          link: AFFILIATE_LINKS.amazon.emancipationHistory,
          type: 'book',
          icon: '🕊️'
        });
      }

      if (documentId === 'monroe') {
        recommendations.push({
          title: 'The Monroe Doctrine: America\'s Foreign Policy',
          description: 'Understand the origins and impact of this pivotal foreign policy.',
          link: AFFILIATE_LINKS.amazon.monroeDoctrine,
          type: 'book',
          icon: '🌍'
        });
      }

      // Add pop culture recommendations for viral tweets
      if (documentId === 'covfefe' || documentId === 'damnyouautocorrect' || documentId === 'justinbieber' || documentId === 'kanyewest' || documentId === 'charliesheen' || documentId === 'kimkardashian' || documentId === 'ellenoscars' || documentId === 'chrisbrown' || documentId === 'ladygaga' || documentId === 'barackobama') {
        recommendations.push({
          title: 'The Social Media Revolution',
          description: 'Learn how social media changed communication and culture.',
          link: AFFILIATE_LINKS.amazon.socialMediaBook,
          type: 'book',
          icon: '📱'
        });
      }

      if (documentId === 'covfefe') {
        recommendations.push({
          title: 'Trump: The Art of the Deal',
          description: 'The business and political career of Donald Trump.',
          link: AFFILIATE_LINKS.amazon.trumpBook,
          type: 'book',
          icon: '👔'
        });
      }

      if (documentId === 'kanyewest') {
        recommendations.push({
          title: 'Kanye West: The Life and Career',
          description: 'Explore the controversial and influential career of Kanye West.',
          link: AFFILIATE_LINKS.amazon.kanyeBook,
          type: 'book',
          icon: '🎵'
        });
      }

      if (documentId === 'justinbieber') {
        recommendations.push({
          title: 'Justin Bieber: From YouTube to Superstar',
          description: 'The rise of Justin Bieber from internet sensation to global star.',
          link: AFFILIATE_LINKS.amazon.justinBieberBook,
          type: 'book',
          icon: '🎤'
        });
      }

      if (documentId === 'kimkardashian') {
        recommendations.push({
          title: 'The Kardashian Effect',
          description: 'How the Kardashian family changed reality TV and social media.',
          link: AFFILIATE_LINKS.amazon.kimKardashianBook,
          type: 'book',
          icon: '📺'
        });
      }

      if (documentId === 'ellenoscars') {
        recommendations.push({
          title: 'Ellen DeGeneres: A Biography',
          description: 'The life and career of Ellen DeGeneres.',
          link: AFFILIATE_LINKS.amazon.ellenBook,
          type: 'book',
          icon: '🎭'
        });
      }

      return recommendations;
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
            title: 'AP US History Study Guide',
            description: 'Comprehensive study guide for American history students.',
            link: AFFILIATE_LINKS.amazon.apushGuide,
            type: 'book',
            icon: '📚'
          },
          {
            title: 'American Government Textbook',
            description: 'Essential textbook for understanding American government and politics.',
            link: AFFILIATE_LINKS.amazon.governmentTextbook,
            type: 'book',
            icon: '🏛️'
          },
          {
            title: 'The Founding Fathers Biography',
            description: 'Learn about the lives and contributions of America\'s founding fathers.',
            link: AFFILIATE_LINKS.amazon.foundingFathers,
            type: 'book',
            icon: '👥'
          }
        ];
      case 'classic literature':
        return [
          {
            title: 'Literature Course',
            description: 'Study classic literature with expert professors.',
            link: AFFILIATE_LINKS.coursera.literature,
            type: 'course',
            icon: '🎓'
          },
          {
            title: 'Classic Literature Collection',
            description: 'Get the complete collection of classic novels.',
            link: AFFILIATE_LINKS.amazon.classicCollection,
            type: 'book',
            icon: '📚'
          },
          {
            title: 'Literature Study Guide',
            description: 'Comprehensive guide to understanding classic literature.',
            link: AFFILIATE_LINKS.amazon.literatureGuide,
            type: 'book',
            icon: '📖'
          }
        ];
      case 'pop culture':
        return [
          {
            title: 'The Social Media Revolution',
            description: 'Learn how social media changed communication and culture.',
            link: AFFILIATE_LINKS.amazon.socialMediaBook,
            type: 'book',
            icon: '📱'
          },
          {
            title: 'Viral Marketing Strategies',
            description: 'Understand how content goes viral and spreads online.',
            link: AFFILIATE_LINKS.amazon.viralMarketing,
            type: 'book',
            icon: '🚀'
          },
          {
            title: 'Internet Culture: A History',
            description: 'Explore the evolution of internet culture and memes.',
            link: AFFILIATE_LINKS.amazon.internetCulture,
            type: 'book',
            icon: '🌐'
          },
          {
            title: 'Twitter: The History of a Platform',
            description: 'Learn about Twitter\'s impact on communication and politics.',
            link: AFFILIATE_LINKS.amazon.twitterBook,
            type: 'book',
            icon: '🐦'
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
             link: AFFILIATE_LINKS.amazon.literatureGuide,
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
        fontStyle: 'italic',
        padding: '0.75rem',
        background: '#ffffff',
        border: '1px solid #e1e8ed',
        borderRadius: '6px'
      }}>
        <strong>Affiliate Disclosure:</strong> As an Amazon Associate and affiliate partner, we earn from qualifying purchases. 
        When you click these links and make purchases, we may receive a commission at no additional cost to you.
      </div>
    </div>
  );
};

export default AffiliateRecommendations; 