import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaNode, FaReact, FaPython, FaJava, FaServer, FaPaperPlane, 
  FaCheck, FaDownload, FaCode, FaCube, FaLayerGroup 
} from 'react-icons/fa';
import { 
  SiExpress, SiDjango, SiFlask, SiSpringboot, SiVuedotjs, 
  SiAngular, SiFastapi, SiGo 
} from 'react-icons/si';
import { generateAdvancedProject, downloadZip } from '../services/backendGenerator';
import './AdvancedChat.css';

const AdvancedChat = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedZip, setGeneratedZip] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    language: '',
    framework: '',
    architecture: '',
    features: {
      authentication: false,
      database: false,
      testing: false,
      docker: false,
      api: false,
      frontend: false
    }
  });

  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [userInput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: <FaNode /> },
    { value: 'python', label: 'Python', icon: <FaPython /> },
    { value: 'java', label: 'Java', icon: <FaJava /> },
    { value: 'go', label: 'Go', icon: <SiGo /> }
  ];

  const frameworks = {
    javascript: [
      { value: 'express', label: 'Express.js', icon: <SiExpress /> },
      { value: 'react', label: 'React', icon: <FaReact /> },
      { value: 'vue', label: 'Vue.js', icon: <SiVuedotjs /> },
      { value: 'angular', label: 'Angular', icon: <SiAngular /> }
    ],
    python: [
      { value: 'django', label: 'Django', icon: <SiDjango /> },
      { value: 'flask', label: 'Flask', icon: <SiFlask /> },
      { value: 'fastapi', label: 'FastAPI', icon: <SiFastapi /> }
    ],
    java: [
      { value: 'spring', label: 'Spring Boot', icon: <SiSpringboot /> }
    ],
    go: [
      { value: 'gin', label: 'Gin', icon: <FaServer /> }
    ]
  };

  const architectures = [
    { value: 'mvc', label: 'MVC (Model-View-Controller)', icon: <FaLayerGroup /> },
    { value: 'microservices', label: 'Microservices', icon: <FaCube /> },
    { value: 'monolith', label: 'Monolith', icon: <FaServer /> },
    { value: 'clean', label: 'Clean Architecture', icon: <FaCode /> }
  ];

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'language') {
      setFormData(prev => ({ ...prev, framework: '' }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isGenerating) return;
    if (!formData.language || !formData.framework || !formData.architecture) {
      alert('Please select Language, Framework, and Architecture first');
      return;
    }

    const userMessage = {
      type: 'user',
      content: userInput,
      config: { ...formData },
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setShowForm(false);
    setIsGenerating(true);

    // AI thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', content: 'analyzing', timestamp: new Date() }]);
    }, 500);

    // AI response
    setTimeout(async () => {
      const selectedFeatures = Object.keys(formData.features).filter(k => formData.features[k]);
      
      const aiMessage = {
        type: 'ai',
        content: 'response',
        data: {
          projectName: userInput.match(/(?:called|named)\s+["']?([^"'\s,]+)["']?/i)?.[1] || 'my-advanced-project',
          language: languages.find(l => l.value === formData.language)?.label,
          framework: frameworks[formData.language]?.find(f => f.value === formData.framework)?.label,
          architecture: architectures.find(a => a.value === formData.architecture)?.label,
          features: selectedFeatures.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ') || 'None',
          structure: generateStructure(formData),
          files: generateFileList(formData, userInput)
        },
        timestamp: new Date()
      };

      setMessages(prev => [...prev.filter(m => m.content !== 'analyzing'), aiMessage]);

      // Generate ZIP
      try {
        const zip = await generateAdvancedProject({
          projectName: aiMessage.data.projectName,
          description: userInput,
          architecture: formData.architecture,
          methodologies: selectedFeatures,
          bestPractices: [],
          features: selectedFeatures.join(', '),
          additionalFeatures: []
        });
        setGeneratedZip({ zip, name: aiMessage.data.projectName, messageIndex: messages.length + 1 });
      } catch (error) {
        console.error('Generation error:', error);
      }

      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = async (messageIndex) => {
    if (generatedZip && generatedZip.messageIndex === messageIndex) {
      try {
        await downloadZip(generatedZip.zip, generatedZip.name);
        
        setMessages(prev => [...prev, {
          type: 'ai',
          content: 'downloaded',
          timestamp: new Date()
        }]);
        setGeneratedZip(null);
      } catch (error) {
        console.error('Download error:', error);
      }
    }
  };

  const generateStructure = (config) => {
    const base = ['src/', 'config/', 'routes/', 'controllers/'];
    if (config.features.database) base.push('models/');
    if (config.features.authentication) base.push('auth/');
    if (config.features.testing) base.push('tests/');
    if (config.features.docker) base.push('docker/');
    if (config.features.frontend) base.push('views/');
    return base.join(', ');
  };

  const generateFileList = (config, prompt) => {
    const files = [
      '📄 package.json / requirements.txt',
      '📄 README.md',
      '📄 .gitignore',
      '📄 .env.example',
      '📁 src/',
      '  📄 index.js / app.py / main.go'
    ];

    if (prompt.toLowerCase().includes('login') || config.features.authentication) {
      files.push('  📁 auth/');
      files.push('    📄 authController.js');
      files.push('    📄 authRoutes.js');
    }

    files.push('  📁 routes/');
    files.push('  📁 controllers/');
    
    if (config.features.database) {
      files.push('  📁 models/');
      files.push('  📁 database/');
      files.push('    📄 db.js / connection.py');
    }

    files.push('  📁 middleware/');
    files.push('  📁 utils/');

    if (config.features.testing) {
      files.push('📁 tests/');
      files.push('  📄 api.test.js');
    }

    if (config.features.docker) {
      files.push('📄 Dockerfile');
      files.push('📄 docker-compose.yml');
    }

    if (config.features.frontend) {
      files.push('📁 client/');
      files.push('  📁 src/');
      files.push('    📁 components/');
      files.push('    📄 App.jsx');
    }

    return files;
  };

  const useCaseExamples = [
    {
      icon: <FaServer />,
      title: 'Full-Stack Auth',
      description: 'Complete authentication system with JWT',
      config: { language: 'javascript', framework: 'express', architecture: 'mvc', features: { authentication: true, database: true, testing: true } },
      prompt: 'A login and signup system with JWT authentication using Node.js backend and React frontend'
    },
    {
      icon: <FaReact />,
      title: 'Blog System',
      description: 'REST API for blog with CRUD operations',
      config: { language: 'javascript', framework: 'express', architecture: 'mvc', features: { database: true, api: true } },
      prompt: 'REST API for a blog system with posts, comments, and users'
    },
    {
      icon: <FaCube />,
      title: 'CRUD Dashboard',
      description: 'React + Express dashboard',
      config: { language: 'javascript', framework: 'react', architecture: 'mvc', features: { frontend: true, api: true, database: true } },
      prompt: 'CRUD dashboard setup with React and Express'
    },
    {
      icon: <FaCode />,
      title: 'SaaS Backend',
      description: 'Scalable backend starter',
      config: { language: 'javascript', framework: 'express', architecture: 'microservices', features: { authentication: true, database: true, docker: true, testing: true } },
      prompt: 'Starter code for a SaaS product backend with microservices'
    }
  ];

  const handleExampleClick = (example) => {
    setFormData(example.config);
    setUserInput(example.prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={`advanced-page ${isVisible ? 'visible' : ''}`}>
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
              <span className="nav-text">Advanced</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="basic-main">
        {/* Description Section */}
        <div className="description-section">
          <div className="description-header">
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="status-text">AI PROJECT BUILDER</span>
            </div>
            
            <h1 className="description-title">
              <span className="title-line">Advanced</span>
              <span className="title-line title-highlight">Service</span>
            </h1>

            <p className="description-subtitle">
              Powerful and customizable project generation with advanced configurations.
              <br />
              Choose your stack, architecture, and features for enterprise-grade setups.
            </p>
          </div>

          <div className="how-it-works">
            <h2 className="section-label">HOW IT WORKS</h2>
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-number">01</div>
                <h3>Configure Your Stack</h3>
                <p>Select programming language, framework, and architecture</p>
              </div>
              <div className="step-item">
                <div className="step-number">02</div>
                <h3>Choose Features</h3>
                <p>Pick features like authentication, database, testing, Docker</p>
              </div>
              <div className="step-item">
                <div className="step-number">03</div>
                <h3>Describe Your Idea</h3>
                <p>AI generates complete boilerplate code tailored to your needs</p>
              </div>
              <div className="step-item">
                <div className="step-number">04</div>
                <h3>Download & Deploy</h3>
                <p>Get production-ready code with all dependencies configured</p>
              </div>
            </div>
          </div>

          <div className="use-cases">
            <h2 className="section-label">USE CASE EXAMPLES</h2>
            <div className="examples-grid">
              {useCaseExamples.map((example, index) => (
                <div 
                  key={index}
                  className="example-card"
                  onClick={() => handleExampleClick(example)}
                >
                  <div className="example-icon">{example.icon}</div>
                  <h4>{example.title}</h4>
                  <p>{example.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface Section */}
        <div className="chat-section">
          <div className="chat-container">
            {/* Messages */}
            <div className="messages-container">
              {messages.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FaServer size={40} />
                  </div>
                  <h3>Configure and build your project</h3>
                  <p>Select your preferences below and describe your project idea</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type === 'user' ? 'message-user' : 'message-ai'}`}>
                  <div className="message-avatar">
                    {message.type === 'user' ? (
                      <div className="avatar-user">YOU</div>
                    ) : (
                      <div className="avatar-ai">AI</div>
                    )}
                  </div>
                  
                  <div className="message-content">
                    {message.type === 'user' ? (
                      <>
                        <div className="user-config">
                          <div className="config-tag">{message.config.language}</div>
                          <div className="config-tag">{message.config.framework}</div>
                          <div className="config-tag">{message.config.architecture}</div>
                        </div>
                        <div className="message-text">{message.content}</div>
                      </>
                    ) : message.content === 'analyzing' ? (
                      <div className="message-text">
                        <div className="typing-indicator">
                          <span></span><span></span><span></span>
                        </div>
                        Analyzing your requirements and generating project structure...
                      </div>
                    ) : message.content === 'response' ? (
                      <div className="message-text">
                        <p className="ai-intro">I've generated your enterprise-grade project:</p>
                        
                        <div className="project-details">
                          <div className="detail-row">
                            <span className="detail-label">Project</span>
                            <span className="detail-value">{message.data.projectName}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Language</span>
                            <span className="detail-value">{message.data.language}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Framework</span>
                            <span className="detail-value">{message.data.framework}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Architecture</span>
                            <span className="detail-value">{message.data.architecture}</span>
                          </div>
                          {message.data.features !== 'None' && (
                            <div className="detail-row">
                              <span className="detail-label">Features</span>
                              <span className="detail-value">{message.data.features}</span>
                            </div>
                          )}
                        </div>

                        <div className="file-structure">
                          <div className="structure-header">
                            <FaServer size={14} />
                            <span>Generated Files</span>
                          </div>
                          <div className="structure-content">
                            {message.data.files.map((file, idx) => (
                              <div key={idx} className="structure-line">{file}</div>
                            ))}
                          </div>
                        </div>

                        <button className="download-button" onClick={() => handleDownload(index)}>
                          <FaDownload />
                          <span>Download ZIP</span>
                        </button>
                      </div>
                    ) : message.content === 'downloaded' ? (
                      <div className="message-text">
                        <div className="success-indicator">
                          <FaCheck />
                          <span>Download Complete</span>
                        </div>
                        <p>Your project has been downloaded successfully. Extract the ZIP, run <code>npm install</code>, and start building!</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Configuration Form */}
            {showForm && (
              <div className="config-form">
                <h3 className="form-title">PROJECT CONFIGURATION</h3>
                
                <div className="form-grid">
                  {/* Language Selection */}
                  <div className="form-group">
                    <label className="form-label">Programming Language *</label>
                    <select 
                      className="form-select"
                      value={formData.language}
                      onChange={(e) => handleFormChange('language', e.target.value)}
                    >
                      <option value="">Select Language</option>
                      {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Framework Selection */}
                  <div className="form-group">
                    <label className="form-label">Framework *</label>
                    <select 
                      className="form-select"
                      value={formData.framework}
                      onChange={(e) => handleFormChange('framework', e.target.value)}
                      disabled={!formData.language}
                    >
                      <option value="">Select Framework</option>
                      {formData.language && frameworks[formData.language]?.map(fw => (
                        <option key={fw.value} value={fw.value}>{fw.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Architecture Selection */}
                  <div className="form-group">
                    <label className="form-label">Architecture *</label>
                    <select 
                      className="form-select"
                      value={formData.architecture}
                      onChange={(e) => handleFormChange('architecture', e.target.value)}
                    >
                      <option value="">Select Architecture</option>
                      {architectures.map(arch => (
                        <option key={arch.value} value={arch.value}>{arch.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features Checkboxes */}
                <div className="features-section">
                  <label className="form-label">Additional Features</label>
                  <div className="checkbox-grid">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.authentication}
                        onChange={() => handleFeatureToggle('authentication')}
                      />
                      <span>Authentication (JWT)</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.database}
                        onChange={() => handleFeatureToggle('database')}
                      />
                      <span>Database Integration</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.testing}
                        onChange={() => handleFeatureToggle('testing')}
                      />
                      <span>Testing Framework</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.docker}
                        onChange={() => handleFeatureToggle('docker')}
                      />
                      <span>Docker Support</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.api}
                        onChange={() => handleFeatureToggle('api')}
                      />
                      <span>REST API Setup</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.frontend}
                        onChange={() => handleFeatureToggle('frontend')}
                      />
                      <span>Frontend Boilerplate</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="input-area">
              <div className="input-wrapper-chat">
                <textarea
                  ref={textareaRef}
                  className="chat-input"
                  placeholder="Describe your project idea... (e.g., A login and signup system with JWT authentication)"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows="1"
                  disabled={isGenerating}
                />
                <button 
                  className={`send-button ${!userInput.trim() || isGenerating ? 'disabled' : ''}`}
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <div className="spinner"></div>
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="get-started-footer">
        <div className="footer-content">
          <p>[04] AI Project Builder</p>
        </div>
      </footer>
    </div>
  );
};

export default AdvancedChat;
