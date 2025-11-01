import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { 
  FaBolt, 
  FaBullseye, 
  FaRobot, 
  FaBox, 
  FaCog, 
  FaRocket 
} from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [cursorPosition, setCursorPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isWhiteBackground, setIsWhiteBackground] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [stepsVisible, setStepsVisible] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const cursorRef = useRef({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  });
  const stepsRef = useRef([]);

  useEffect(() => {
    let animationFrameId;
    let isInitialized = false;

    const updateCursor = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      
      if (!isInitialized) {
        setCursorPosition({ x: e.clientX, y: e.clientY });
        isInitialized = true;
      }
      
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          setCursorPosition(cursorRef.current);
          animationFrameId = null;
        });
      }
    };

    // Track background color based on mouse position
    const checkBackgroundColor = (e) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) {
        setIsWhiteBackground(true);
        return;
      }
      
      // Check multiple levels up the DOM tree
      let currentElement = element;
      let isInBlackSection = false;
      let depth = 0;
      
      while (currentElement && depth < 10) {
        if (currentElement.classList) {
          if (currentElement.classList.contains('stats') ||
              currentElement.classList.contains('how-to-use') ||
              currentElement.classList.contains('footer')) {
            isInBlackSection = true;
            break;
          }
        }
        currentElement = currentElement.parentElement;
        depth++;
      }
      
      setIsWhiteBackground(!isInBlackSection);
    };

    // Track hover on interactive elements
    const handleInteractiveHover = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.component-item') || 
        target.closest('.service-item') ||
        target.closest('.step-item') ||
        target.closest('.btn') ||
        target.closest('.nav-link');
      
      setIsHovering(isInteractive);
    };

    // Combined mouse move handler
    const handleMouseMove = (e) => {
      updateCursor(e);
      checkBackgroundColor(e);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleInteractiveHover, { passive: true });
    document.addEventListener('mouseout', handleInteractiveHover, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleInteractiveHover);
      document.removeEventListener('mouseout', handleInteractiveHover);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Scroll detection for active navigation
  useEffect(() => {
    const sections = ['home', 'services', 'about', 'components', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && sections.includes(sectionId)) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Fallback: check on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll-triggered section animations
  useEffect(() => {
    const animationObserverOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const animationObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    };

    const animationObserver = new IntersectionObserver(
      animationObserverCallback,
      animationObserverOptions
    );

    // Observe all sections
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
      animationObserver.observe(section);
    });

    // Initial check for sections already in viewport
    setTimeout(() => {
      allSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          section.classList.add('section-visible');
        }
      });
    }, 100);

    return () => {
      allSections.forEach(section => {
        animationObserver.unobserve(section);
      });
    };
  }, []);

  // Scroll progress indicator
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial check

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);

  // Steps chain animation on scroll - progressive reveal
  useEffect(() => {
    const stepsList = document.querySelector('.steps-list');
    const stepItems = document.querySelectorAll('.step-item');
    
    if (!stepsList || stepItems.length === 0) return;

    stepsRef.current = Array.from(stepItems);

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = stepsRef.current.indexOf(entry.target);
          if (stepIndex !== -1) {
            // Progressive reveal: show step when it's 25% visible
            if (entry.intersectionRatio >= 0.25) {
              setVisibleSteps(prev => {
                const newSet = new Set(prev);
                newSet.add(stepIndex);
                return newSet;
              });
              
              // Show chain line when first step is visible
              if (stepIndex === 0) {
                setStepsVisible(true);
              }
            }
          }
        }
      });
    };

    const stepObserver = new IntersectionObserver(observerCallback, observerOptions);
    
    stepItems.forEach((step) => {
      stepObserver.observe(step);
    });

    // Also check on scroll for progressive reveal
    const handleStepsScroll = () => {
      const howToUseSection = document.getElementById('how-to-use');
      if (!howToUseSection) return;

      const rect = howToUseSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 1.2 && rect.bottom > -window.innerHeight * 0.2;
      
      if (isInView) {
        const newVisibleSteps = new Set();
        
        stepItems.forEach((step, index) => {
          const stepRect = step.getBoundingClientRect();
          const viewportMiddle = window.innerHeight * 0.5;
          const stepInView = stepRect.top < viewportMiddle && stepRect.bottom > viewportMiddle - 200;
          
          if (stepInView || stepRect.top < viewportMiddle) {
            newVisibleSteps.add(index);
          }
        });
        
        if (newVisibleSteps.size > 0) {
          setVisibleSteps(newVisibleSteps);
          setStepsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleStepsScroll, { passive: true });
    handleStepsScroll(); // Initial check

    return () => {
      stepObserver.disconnect();
      window.removeEventListener('scroll', handleStepsScroll);
    };
  }, []);

  const techItems = ['React', 'Next.js', 'Node.js', 'Python', 'TypeScript'];

  return (
    <div className="home">
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Custom Cursor */}
      <div 
        className={`custom-cursor ${isHovering ? 'cursor-hover' : ''} ${isWhiteBackground ? '' : 'cursor-white'}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      />
      
      <div 
        className={`cursor-dot ${isWhiteBackground ? '' : 'cursor-dot-white'}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      />
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-logo">DevGenie</div>
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#home" className={`nav-link ${activeSection === 'home' ? 'nav-active' : ''}`}>
                <span className="nav-number">[01]</span>
                <span className="nav-text">Home</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#services" className={`nav-link ${activeSection === 'services' ? 'nav-active' : ''}`}>
                <span className="nav-number">[02]</span>
                <span className="nav-text">Services</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#about" className={`nav-link ${activeSection === 'about' ? 'nav-active' : ''}`}>
                <span className="nav-number">[03]</span>
                <span className="nav-text">About</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#components" className={`nav-link ${activeSection === 'components' ? 'nav-active' : ''}`}>
                <span className="nav-number">[04]</span>
                <span className="nav-text">Components</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'nav-active' : ''}`}>
                <span className="nav-number">[05]</span>
                <span className="nav-text">Contact</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-name">
              DEVGENIE
            </h1>
            <div className="hero-titles">
              <span className="hero-title">Smart Development Platform</span>
              <span className="hero-title">Project Generator</span>
              <span className="hero-title">Code Automation Tool</span>
            </div>
            
            <div className="tech-stack-wrapper">
              <div className="tech-stack">
                {/* First set */}
                {techItems.map((item, index) => (
                  <span key={`first-${index}`} className="tech-item">{item}</span>
                ))}
                {/* Duplicate set for seamless loop */}
                {techItems.map((item, index) => (
                  <span key={`second-${index}`} className="tech-item">{item}</span>
                ))}
              </div>
            </div>

            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate('/get-started')}>Get Started</button>
              <button className="btn btn-secondary" onClick={() => navigate('/get-started')}>View Templates</button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Projects Generated</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Developers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Templates</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="services-container">
          <div className="services-header">
            <h2 className="section-title">[02] Our Services</h2>
            <p className="services-subtitle">
              Two powerful modes to match your workflow. Choose the speed of Basic or the intelligence of Advanced.
            </p>
          </div>

          <div className="services-grid">
            {/* Basic Service Card */}
            <div className="service-card basic-service">
              <div className="service-card-header">
                <div className="service-badge">QUICK SETUP</div>
                <div className="service-icon-wrapper">
                  <FaBolt />
                </div>
              </div>

              <div className="service-card-body">
                <h3 className="service-card-title">Basic Developer Mode</h3>
                <p className="service-card-description">
                  Lightning-fast project generation for developers who know exactly what they need. 
                  Get common environments and folder structures instantly with zero configuration.
                </p>

                <div className="service-features-list">
                  <div className="service-feature">
                    <span className="feature-check">✓</span>
                    <span>Pre-configured templates</span>
                  </div>
                  <div className="service-feature">
                    <span className="feature-check">✓</span>
                    <span>Instant ZIP download</span>
                  </div>
                  <div className="service-feature">
                    <span className="feature-check">✓</span>
                    <span>Popular tech stacks</span>
                  </div>
                  <div className="service-feature">
                    <span className="feature-check">✓</span>
                    <span>Best practice structure</span>
                  </div>
                </div>
              </div>

              <div className="service-card-footer">
                <button className="service-btn" onClick={() => navigate('/get-started')}>
                  <span>Get Started</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>

              <div className="service-card-number">01</div>
            </div>

            {/* Advanced Service Card */}
            <div className="service-card advanced-service">
              <div className="service-card-header">
                <div className="service-badge recommended">RECOMMENDED</div>
                <div className="service-icon-wrapper advanced-icon">
                  <FaRobot />
                </div>
              </div>

              <div className="service-card-body">
                <h3 className="service-card-title">Advanced Developer Mode</h3>
                <p className="service-card-description">
                  AI-powered project builder that understands your needs. Describe your vision in plain English, 
                  and DevGenie creates a complete, production-ready setup tailored to your specifications.
                </p>

                <div className="service-features-list">
                  <div className="service-feature">
                    <span className="feature-check">✓</span>
                    <span>Custom architecture selection</span>
                  </div>
                  <div className="service-feature">
                    <span className="feature-check">✓</span>
                    <span>AI-powered code generation</span>
                  </div>
                  <div className="service-feature">
                    <span className="feature-check">✓</span>
                  <span>Authentication & database setup</span>
                  </div>
                  <div className="service-feature">
                    <span className="feature-check">✓</span>
                    <span>Testing & Docker configuration</span>
                  </div>
                </div>
              </div>

              <div className="service-card-footer">
                <button className="service-btn advanced-btn" onClick={() => navigate('/get-started')}>
                  <span>Start Building</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>

              <div className="service-card-number advanced-number">02</div>
            </div>
          </div>

          {/* Services Comparison */}
          <div className="services-comparison">
            <div className="comparison-item">
              <div className="comparison-icon">
                <FaBullseye />
              </div>
              <div className="comparison-content">
                <h4 className="comparison-title">Perfect for Every Developer</h4>
                <p className="comparison-text">
                  Whether you're prototyping quickly or building enterprise applications, 
                  DevGenie adapts to your needs and experience level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about">
        <div className="about-container">
          <h2 className="section-title">[03] About DevGenie</h2>
          
          <div className="about-content">
            <div className="about-main">
              <div className="about-text">
                <h3 className="about-heading">
                  Skip the boring setup,
                  <br />
                  jump straight into building.
                </h3>
                <p className="about-description">
                  DevGenie is a smart web platform designed for developers who want to focus on what matters—building great software. 
                  We eliminate the repetitive, time-consuming setup work that slows you down at the start of every project.
                </p>
                <p className="about-description">
                  Whether you need a basic Node.js environment or a full-stack application with authentication, 
                  database integration, and Docker configuration, DevGenie creates production-ready project structures 
                  tailored to your exact specifications in seconds.
                </p>
              </div>

              <div className="about-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaBolt />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">10x</div>
                    <div className="stat-label">Faster Setup</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaRocket />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">100+</div>
                    <div className="stat-label">Templates</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaCog />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">∞</div>
                    <div className="stat-label">Configurations</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-features">
              <div className="feature-item">
                <div className="feature-number">01</div>
                <div className="feature-details">
                  <h4 className="feature-title">Instant Project Generation</h4>
                  <p className="feature-text">
                    Get fully configured project structures in seconds, not hours. 
                    No more copying and pasting from old projects.
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-number">02</div>
                <div className="feature-details">
                  <h4 className="feature-title">Industry Best Practices</h4>
                  <p className="feature-text">
                    Every generated project follows modern conventions and best practices, 
                    ensuring clean, maintainable code from day one.
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-number">03</div>
                <div className="feature-details">
                  <h4 className="feature-title">Production-Ready Code</h4>
                  <p className="feature-text">
                    Start with code that's ready for production deployment, complete with 
                    configuration files, documentation, and testing setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="how-to-use">
        <div className="how-to-use-container">
          <h2 className="section-title">[06] How to Use</h2>
          <div className={`steps-list ${stepsVisible ? 'steps-visible' : ''}`}>
            <div className={`step-item ${visibleSteps.has(0) ? 'step-visible' : ''}`}>
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Choose Your Service</h3>
                <p className="step-description">
                  Select between Basic Service for quick common setups or Advanced Service for 
                  custom project configurations tailored to your needs.
                </p>
              </div>
            </div>
            <div className={`step-item ${visibleSteps.has(1) ? 'step-visible' : ''}`}>
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">Configure Your Project</h3>
                <p className="step-description">
                  For Basic Service, choose from our template library. For Advanced Service, 
                  describe your project idea in natural language.
                </p>
              </div>
            </div>
            <div className={`step-item ${visibleSteps.has(2) ? 'step-visible' : ''}`}>
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Generate & Download</h3>
                <p className="step-description">
                  DevGenie creates your complete project setup with all dependencies, folder structures, 
                  and starter files. Download it as a ZIP file and start coding immediately.
                </p>
              </div>
            </div>
            <div className={`step-item ${visibleSteps.has(3) ? 'step-visible' : ''}`}>
              <div className="step-number">04</div>
              <div className="step-content">
                <h3 className="step-title">Start Building</h3>
                <p className="step-description">
                  Extract the ZIP file, install dependencies, and you're ready to build. 
                  No configuration needed - just start coding your features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section id="components" className="components">
        <div className="components-container">
          <h2 className="section-title">[04] Components</h2>
          <div className="components-grid">
            <div className="component-item" onClick={() => navigate('/get-started')}>
              <div className="component-icon">
                <FaBolt />
              </div>
              <h3 className="component-title">Project Generator</h3>
              <p className="component-description">
                Instantly generate project structures with all necessary files and configurations.
              </p>
            </div>
            <div className="component-item" onClick={() => navigate('/basic')}>
              <div className="component-icon">
                <FaBullseye />
              </div>
              <h3 className="component-title">Template Library</h3>
              <p className="component-description">
                Access a wide range of pre-built templates for common project types and frameworks.
              </p>
            </div>
            <div className="component-item" onClick={() => navigate('/advanced')}>
              <div className="component-icon">
                <FaRobot />
              </div>
              <h3 className="component-title">AI-Powered Setup</h3>
              <p className="component-description">
                Advanced service uses AI to understand your requirements and build the perfect setup.
              </p>
            </div>
            <div className="component-item">
              <div className="component-icon">
                <FaBox />
              </div>
              <h3 className="component-title">Dependency Management</h3>
              <p className="component-description">
                Automatically includes all necessary dependencies with proper version management.
              </p>
            </div>
            <div className="component-item">
              <div className="component-icon">
                <FaCog />
              </div>
              <h3 className="component-title">Configuration Files</h3>
              <p className="component-description">
                Pre-configured settings for linting, testing, and build tools ready to use.
              </p>
            </div>
            <div className="component-item">
              <div className="component-icon">
                <FaRocket />
              </div>
              <h3 className="component-title">One-Click Download</h3>
              <p className="component-description">
                Get your complete project as a ZIP file, ready to extract and start working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-logo">DevGenie</h3>
              <p className="footer-tagline">
                Skip the setup. Start building.
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-heading">Product</h4>
                <ul className="footer-list">
                  <li><a href="#services" className="footer-link">Services</a></li>
                  <li><a href="#components" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('components')?.scrollIntoView({ behavior: 'smooth' }); }}>Templates</a></li>
                  <li><a href="#components" className="footer-link">Components</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <ul className="footer-list">
                  <li><a href="#about" className="footer-link">About Us</a></li>
                  <li><a href="#how-to-use" className="footer-link">How to Use</a></li>
                  <li><a href="#contact" className="footer-link">Contact</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Resources</h4>
                <ul className="footer-list">
                  <li><a href="#" className="footer-link">Documentation</a></li>
                  <li><a href="#" className="footer-link">Support</a></li>
                  <li><a href="#" className="footer-link">Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} DevGenie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

