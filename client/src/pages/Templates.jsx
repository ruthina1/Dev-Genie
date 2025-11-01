import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaNode, FaReact, FaPython, FaJava, FaVuejs, FaAngular,
  FaDatabase, FaDocker, FaCode, FaDownload, FaFilter,
  FaSearch, FaTimes, FaCheck, FaSpinner
} from 'react-icons/fa';
import { SiExpress, SiDjango, SiFlask, SiMongodb, SiPostgresql } from 'react-icons/si';
import { generateAdvancedProject, downloadZip } from '../services/backendGenerator';
import './Templates.css';

const Templates = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  });
  const [isHovering, setIsHovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [generatingTemplate, setGeneratingTemplate] = useState(null);
  const [downloadedTemplates, setDownloadedTemplates] = useState(new Set());
  const cursorRef = useRef({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Custom cursor effect
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

    const handleInteractiveHover = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.template-card') ||
        target.closest('.filter-btn') ||
        target.closest('.nav-btn') ||
        target.closest('.logo') ||
        target.closest('.search-input');
      
      setIsHovering(isInteractive);
    };

    document.addEventListener('mousemove', updateCursor, { passive: true });
    document.addEventListener('mouseover', handleInteractiveHover, { passive: true });
    document.addEventListener('mouseout', handleInteractiveHover, { passive: true });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleInteractiveHover);
      document.removeEventListener('mouseout', handleInteractiveHover);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Sample template data - in real app, this would come from backend/localStorage
  const templates = [
    {
      id: 1,
      name: 'Full-Stack MERN Authentication',
      description: 'Complete authentication system with JWT, MongoDB, Express, React, and Node.js',
      language: 'JavaScript',
      framework: 'React + Express',
      architecture: 'MVC',
      features: ['Authentication', 'Database', 'API', 'Testing'],
      icon: <FaReact />,
      prompt: 'Create a full-stack authentication system with login, signup, and JWT tokens',
      downloads: 245
    },
    {
      id: 2,
      name: 'Django REST API Blog',
      description: 'RESTful API for a blog with user management, posts, and comments',
      language: 'Python',
      framework: 'Django',
      architecture: 'REST API',
      features: ['Database', 'API', 'Authentication'],
      icon: <SiDjango />,
      prompt: 'Build a blog REST API with Django including posts, comments, and user auth',
      downloads: 189
    },
    {
      id: 3,
      name: 'React Dashboard Template',
      description: 'Modern admin dashboard with charts, tables, and responsive design',
      language: 'JavaScript',
      framework: 'React',
      architecture: 'SPA',
      features: ['Frontend', 'Responsive'],
      icon: <FaReact />,
      prompt: 'Create a modern admin dashboard with data visualization',
      downloads: 412
    },
    {
      id: 4,
      name: 'Node.js Microservices',
      description: 'Microservices architecture with Docker, API Gateway, and service discovery',
      language: 'JavaScript',
      framework: 'Express',
      architecture: 'Microservices',
      features: ['Docker', 'API', 'Database'],
      icon: <FaNode />,
      prompt: 'Setup microservices architecture with multiple services and Docker',
      downloads: 156
    },
    {
      id: 5,
      name: 'Flask API with PostgreSQL',
      description: 'RESTful API using Flask with PostgreSQL database and SQLAlchemy ORM',
      language: 'Python',
      framework: 'Flask',
      architecture: 'REST API',
      features: ['Database', 'API', 'Testing'],
      icon: <SiFlask />,
      prompt: 'Build a Flask REST API with PostgreSQL database',
      downloads: 203
    },
    {
      id: 6,
      name: 'E-Commerce MERN Stack',
      description: 'Complete e-commerce platform with cart, payments, and order management',
      language: 'JavaScript',
      framework: 'React + Express',
      architecture: 'Full-Stack',
      features: ['Authentication', 'Database', 'API', 'Frontend'],
      icon: <FaReact />,
      prompt: 'Create an e-commerce platform with shopping cart and payment integration',
      downloads: 567
    }
  ];

  const filters = [
    { id: 'all', label: 'All Templates', icon: <FaCode /> },
    { id: 'javascript', label: 'JavaScript', icon: <FaNode /> },
    { id: 'python', label: 'Python', icon: <FaPython /> },
    { id: 'fullstack', label: 'Full-Stack', icon: <FaDatabase /> },
    { id: 'api', label: 'API', icon: <FaCode /> }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         template.language.toLowerCase() === selectedFilter ||
                         (selectedFilter === 'fullstack' && template.architecture === 'Full-Stack') ||
                         (selectedFilter === 'api' && template.features.includes('API'));
    
    return matchesSearch && matchesFilter;
  });

  const handleTemplateClick = async (template) => {
    // Check if already downloaded
    if (downloadedTemplates.has(template.id)) {
      return;
    }

    setGeneratingTemplate(template.id);

    // Simulate generation delay
    setTimeout(async () => {
      try {
        // Map template data to project config
        const config = {
          language: template.language.toLowerCase(),
          framework: template.framework.toLowerCase(),
          architecture: template.architecture.toLowerCase().replace(/\s+/g, '-'),
          projectName: template.name.toLowerCase().replace(/\s+/g, '-'),
          description: template.description,
          prompt: template.prompt,
          includeAuth: template.features?.includes('Authentication') || false,
          includeDatabase: template.features?.includes('Database') || false,
          includeTesting: template.features?.includes('Testing') || false,
          includeDocker: template.features?.includes('Docker') || false,
          features: {
            authentication: template.features?.includes('Authentication') || false,
            database: template.features?.includes('Database') || false,
            testing: template.features?.includes('Testing') || false,
            docker: template.features?.includes('Docker') || false,
            api: template.features?.includes('API') || false,
            frontend: template.features?.includes('Frontend') || false
          }
        };

        console.log('Generating template with config:', config);

        // Generate project ZIP
        const zip = await generateAdvancedProject(config);
        
        // Download ZIP
        await downloadZip(zip, config.projectName);

        // Mark as downloaded
        setDownloadedTemplates(prev => new Set([...prev, template.id]));
        
        // Reset generating state after success
        setTimeout(() => {
          setGeneratingTemplate(null);
        }, 1000);

      } catch (error) {
        console.error('Error generating template:', error);
        setGeneratingTemplate(null);
        alert('Failed to generate template. Please try again or try using the Advanced mode directly.');
      }
    }, 500);
  };

  const handleCardClick = (template) => {
    console.log('Customizing template:', template);
    
    // Navigate to advanced page with pre-filled template data
    const templateData = {
      name: template.name || '',
      description: template.description || '',
      language: template.language || '',
      framework: template.framework || '',
      architecture: template.architecture || '',
      features: Array.isArray(template.features) ? template.features : [],
      prompt: template.prompt || ''
    };
    
    console.log('Sending template data to Advanced page:', templateData);
    
    navigate('/advanced', { 
      state: { template: templateData } 
    });
  };

  return (
    <div className={`templates-page ${isVisible ? 'visible' : ''}`}>
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
            <button className="nav-btn" onClick={() => navigate('/get-started')}>
              <span className="nav-number">[02]</span>
              <span className="nav-text">Get Started</span>
            </button>
            <button className="nav-btn active">
              <span className="nav-number">[03]</span>
              <span className="nav-text">Templates</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="templates-main">
        <div className="templates-content">
          {/* Header */}
          <div className="templates-header">
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="status-text">BROWSE LIBRARY</span>
            </div>
            
            <h1 className="main-heading">
              <span className="heading-line">Project</span>
              <span className="heading-line">Templates</span>
            </h1>

            <p className="subtext">
              Explore our collection of production-ready project templates. 
              Each template is generated from real developer prompts and includes complete setup, dependencies, and best practices.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="templates-controls">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="filters">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  <span className="filter-icon">{filter.icon}</span>
                  <span className="filter-label">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="templates-grid">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <div 
                  key={template.id} 
                  className={`template-card ${generatingTemplate === template.id ? 'generating-card' : ''} ${downloadedTemplates.has(template.id) ? 'downloaded-card' : ''}`}
                >
                  <div className="template-card-header">
                    <div className="template-icon">{template.icon}</div>
                    <div className="template-downloads">
                      <FaDownload />
                      <span>{template.downloads}</span>
                    </div>
                  </div>

                  <div className="template-card-body">
                    <h3 className="template-title">{template.name}</h3>
                    <p className="template-description">{template.description}</p>

                    <div className="template-meta">
                      <div className="meta-item">
                        <span className="meta-label">Language:</span>
                        <span className="meta-value">{template.language}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Framework:</span>
                        <span className="meta-value">{template.framework}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Architecture:</span>
                        <span className="meta-value">{template.architecture}</span>
                      </div>
                    </div>

                    <div className="template-features">
                      {template.features.map((feature, index) => (
                        <span key={index} className="feature-badge">{feature}</span>
                      ))}
                    </div>

                    <div className="template-prompt">
                      <span className="prompt-label">Original Prompt:</span>
                      <p className="prompt-text">"{template.prompt}"</p>
                    </div>
                  </div>

                  <div className="template-card-footer">
                    <div className="footer-actions">
                      <button 
                        className="customize-btn"
                        onClick={() => handleCardClick(template)}
                      >
                        <FaCode />
                        <span>Customize</span>
                      </button>
                      <button 
                        className={`download-template-btn ${generatingTemplate === template.id ? 'generating' : ''} ${downloadedTemplates.has(template.id) ? 'downloaded' : ''}`}
                        onClick={() => handleTemplateClick(template)}
                        disabled={generatingTemplate === template.id || downloadedTemplates.has(template.id)}
                      >
                        {generatingTemplate === template.id ? (
                          <>
                            <FaSpinner className="spinner-icon" />
                            <span>Generating...</span>
                          </>
                        ) : downloadedTemplates.has(template.id) ? (
                          <>
                            <FaCheck />
                            <span>Downloaded</span>
                          </>
                        ) : (
                          <>
                            <FaDownload />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <FaSearch />
                </div>
                <h3>No templates found</h3>
                <p>Try adjusting your search or filters</p>
                <button className="reset-btn" onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="templates-cta">
            <div className="cta-content">
              <h2 className="cta-title">Don't see what you need?</h2>
              <p className="cta-text">
                Use our Advanced AI to generate a custom project setup based on your specific requirements.
              </p>
              <button className="cta-btn" onClick={() => navigate('/advanced')}>
                <span>Create Custom Project</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="get-started-footer">
        <div className="footer-content">
          <p>[04] Template Library • {filteredTemplates.length} Templates Available</p>
        </div>
      </footer>

      {/* Custom Cursor */}
      <div
        className={`custom-cursor ${isHovering ? 'cursor-hover' : ''}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      />
      <div
        className="cursor-dot"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      />
    </div>
  );
};

export default Templates;

