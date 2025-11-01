import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GetStarted.css';

const GetStarted = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className={`get-started-container ${isVisible ? 'visible' : ''}`}>
      {/* Animated Background */}
      <div className="background-wrapper">
        <div className="gradient-blur gradient-blur-1"></div>
        <div className="gradient-blur gradient-blur-2"></div>
        <div className="grid-background"></div>
      </div>

      {/* Navigation */}
      <nav className="get-started-nav">
        <div className="nav-content">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-bracket">[</span>
            <span className="logo-dev">DEV</span>
            <span className="logo-bracket">]</span>
            <span className="logo-genie">GENIE</span>
          </div>
          <div className="nav-links">
            <button className="nav-btn" onClick={() => navigate('/')}>
              <span className="nav-number">[01]</span>
              <span className="nav-text">Home</span>
            </button>
            <button className="nav-btn active">
              <span className="nav-number">[02]</span>
              <span className="nav-text">Get Started</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="get-started-main">
        <div className="content-wrapper">
          {/* Header Section */}
          <div className="header-section">
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="status-text">READY TO BUILD</span>
            </div>
            
            <h1 className="main-heading">
              <span className="heading-line">What are you</span>
              <span className="heading-line heading-highlight">looking for</span>
              <span className="heading-line">today?</span>
            </h1>

            <p className="subtext">
              Choose how you want DevGenie to help you start your next project.
              <br />
              Fast, smart, and tailored to your needs.
            </p>
          </div>

          {/* Cards Section */}
          <div className="cards-container">
            {/* Basic Structure Card */}
            <div
              className={`option-card ${hoveredCard === 'basic' ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard('basic')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick('/basic')}
            >
              <div className="card-inner">
                <div className="card-header">
                  <div className="card-icon basic-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <div className="card-number">[01]</div>
                </div>

                <h2 className="card-title">Basic Structure</h2>
                
                <p className="card-description">
                  Quickly generate common environments and folder structures. 
                  Perfect for rapid prototyping and standard setups.
                </p>

                <div className="card-features">
                  <div className="feature-tag">Fast Setup</div>
                  <div className="feature-tag">Pre-configured</div>
                  <div className="feature-tag">Best Practices</div>
                </div>

                <div className="card-footer">
                  <span className="card-link">
                    Get Started
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>

                <div className="card-glow"></div>
              </div>
            </div>

            {/* Advanced Setup Card */}
            <div
              className={`option-card advanced-card ${hoveredCard === 'advanced' ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard('advanced')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick('/advanced')}
            >
              <div className="featured-label">RECOMMENDED</div>
              
              <div className="card-inner">
                <div className="card-header">
                  <div className="card-icon advanced-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                  <div className="card-number">[02]</div>
                </div>

                <h2 className="card-title">Advanced Setup</h2>
                
                <p className="card-description">
                  Describe your project idea, and DevGenie will build the complete 
                  setup for you with AI-powered architecture selection.
                </p>

                <div className="card-features">
                  <div className="feature-tag">AI-Powered</div>
                  <div className="feature-tag">Custom Architecture</div>
                  <div className="feature-tag">Enterprise-Ready</div>
                </div>

                <div className="card-footer">
                  <span className="card-link">
                    Start Building
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>

                <div className="card-glow advanced-glow"></div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-number">100+</div>
                <div className="info-label">Templates</div>
              </div>
              <div className="info-divider"></div>
              <div className="info-item">
                <div className="info-number">6</div>
                <div className="info-label">Architectures</div>
              </div>
              <div className="info-divider"></div>
              <div className="info-item">
                <div className="info-number">∞</div>
                <div className="info-label">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="get-started-footer">
        <div className="footer-content">
          <p>Built for developers, by developers</p>
          <div className="footer-links">
            <a href="#docs">Documentation</a>
            <a href="#github">GitHub</a>
            <a href="#support">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GetStarted;

