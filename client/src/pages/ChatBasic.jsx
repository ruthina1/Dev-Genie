import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaNode, FaReact, FaPython, FaServer, FaPaperPlane, FaCheck, FaDownload } from 'react-icons/fa';
import { SiExpress, SiMongodb, SiDjango, SiFlask } from 'react-icons/si';
import { generateBasicProject, downloadZip, parsePrompt } from '../services/backendGenerator';
import './ChatBasic.css';

const ChatBasic = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedZip, setGeneratedZip] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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

  const parseUserPrompt = (prompt) => {
    const projectName = prompt.match(/(?:called|named)\s+["']?([^"'\s,]+)["']?/i)?.[1] || 
                       'my-project';
    
    let framework = '';
    let features = [];
    
    if (prompt.toLowerCase().includes('node') || prompt.toLowerCase().includes('express')) {
      framework = 'Node.js + Express';
      features.push('REST API', 'Express Server');
    }
    if (prompt.toLowerCase().includes('react')) {
      framework = 'React';
      features.push('React Components', 'Webpack');
    }
    if (prompt.toLowerCase().includes('python') || prompt.toLowerCase().includes('flask')) {
      framework = 'Python + Flask';
      features.push('Flask API', 'Python Routes');
    }
    if (prompt.toLowerCase().includes('django')) {
      framework = 'Django';
      features.push('Django REST', 'Admin Panel');
    }
    
    if (prompt.toLowerCase().includes('mongodb') || prompt.toLowerCase().includes('mongo')) {
      features.push('MongoDB Database');
    }
    if (prompt.toLowerCase().includes('postgres') || prompt.toLowerCase().includes('postgresql')) {
      features.push('PostgreSQL Database');
    }
    if (prompt.toLowerCase().includes('auth')) {
      features.push('Authentication');
    }
    if (prompt.toLowerCase().includes('test')) {
      features.push('Testing');
    }

    return {
      projectName,
      description: prompt,
      framework,
      features: features.join(', ') || 'Basic Project Structure',
      includeAuth: prompt.toLowerCase().includes('auth'),
      includeDatabase: prompt.toLowerCase().includes('mongo') || prompt.toLowerCase().includes('database'),
      includeTesting: prompt.toLowerCase().includes('test')
    };
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isGenerating) return;

    const userMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsGenerating(true);

    // AI thinking message
    setTimeout(() => {
      const thinkingMessage = {
        type: 'ai',
        content: 'analyzing',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, thinkingMessage]);
    }, 500);

    // AI response
    setTimeout(async () => {
      const config = parseUserPrompt(userMessage.content);
      
      const aiMessage = {
        type: 'ai',
        content: 'response',
        data: {
          projectName: config.projectName,
          framework: config.framework,
          features: config.features,
          structure: [
            '📄 package.json',
            '📄 README.md',
            '📄 .gitignore',
            '📄 .env.example',
            '📁 src/',
            '  📄 index.js',
            '  📁 config/',
            '  📁 routes/',
            '  📁 controllers/',
            config.includeDatabase && '  📁 models/',
            '  📁 middleware/',
            '  📁 utils/',
            config.includeTesting && '📁 tests/'
          ].filter(Boolean)
        },
        timestamp: new Date()
      };

      setMessages(prev => [...prev.filter(m => m.content !== 'analyzing'), aiMessage]);

      // Generate ZIP
      try {
        const zip = await generateBasicProject(config);
        setGeneratedZip({ zip, name: config.projectName, messageIndex: messages.length + 1 });
      } catch (error) {
        console.error('Generation error:', error);
      }

      setIsGenerating(false);
    }, 2500);
  };

  const handleDownload = async (messageIndex) => {
    if (generatedZip && generatedZip.messageIndex === messageIndex) {
      try {
        await downloadZip(generatedZip.zip, generatedZip.name);
        
        const successMessage = {
          type: 'ai',
          content: 'downloaded',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        setGeneratedZip(null);
      } catch (error) {
        console.error('Download error:', error);
      }
    }
  };

  const useCaseExamples = [
    {
      icon: <FaNode />,
      title: 'Node.js Backend',
      prompt: 'I want a Node.js setup with Express and MongoDB'
    },
    {
      icon: <FaReact />,
      title: 'React Frontend',
      prompt: 'Create a React frontend base structure'
    },
    {
      icon: <SiFlask />,
      title: 'Python Flask',
      prompt: 'I need a Python Flask project skeleton'
    },
    {
      icon: <SiDjango />,
      title: 'Django REST',
      prompt: 'Setup Django REST API with authentication'
    }
  ];

  const handleExampleClick = (prompt) => {
    setUserInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={`basic-page ${isVisible ? 'visible' : ''}`}>
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
              <span className="nav-text">Basic</span>
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
              <span className="status-text">QUICK SETUP</span>
            </div>
            
            <h1 className="description-title">
              <span className="title-line">Basic</span>
              <span className="title-line title-highlight">Service</span>
            </h1>

            <p className="description-subtitle">
              Describe what environment you want, and DevGenie will create it instantly.
              <br />
              Fast, simple, and production-ready project structures.
            </p>
          </div>

          <div className="how-it-works">
            <h2 className="section-label">HOW IT WORKS</h2>
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-number">01</div>
                <h3>Describe Your Project</h3>
                <p>Enter a prompt describing what you want to build</p>
              </div>
              <div className="step-item">
                <div className="step-number">02</div>
                <h3>AI Generates Structure</h3>
                <p>DevGenie creates folders, files, and configurations</p>
              </div>
              <div className="step-item">
                <div className="step-number">03</div>
                <h3>Download & Build</h3>
                <p>Download the ZIP file and start coding immediately</p>
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
                  onClick={() => handleExampleClick(example.prompt)}
                >
                  <div className="example-icon">{example.icon}</div>
                  <h4>{example.title}</h4>
                  <p>"{example.prompt}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface Section - ChatGPT Style */}
        <div className="chat-section">
          <div className="chat-container">
            {/* Messages */}
            <div className="messages-container">
              {messages.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FaServer size={40} />
                  </div>
                  <h3>Start a conversation</h3>
                  <p>Type your project requirements below or click an example</p>
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
                      <div className="message-text">{message.content}</div>
                    ) : message.content === 'analyzing' ? (
                      <div className="message-text">
                        <div className="typing-indicator">
                          <span></span><span></span><span></span>
                        </div>
                        Analyzing your requirements...
                      </div>
                    ) : message.content === 'response' ? (
                      <div className="message-text">
                        <p className="ai-intro">I've generated your project structure:</p>
                        
                        <div className="project-details">
                          <div className="detail-row">
                            <span className="detail-label">Project</span>
                            <span className="detail-value">{message.data.projectName}</span>
                          </div>
                          {message.data.framework && (
                            <div className="detail-row">
                              <span className="detail-label">Framework</span>
                              <span className="detail-value">{message.data.framework}</span>
                            </div>
                          )}
                          <div className="detail-row">
                            <span className="detail-label">Features</span>
                            <span className="detail-value">{message.data.features}</span>
                          </div>
                        </div>

                        <div className="file-structure">
                          <div className="structure-header">
                            <FaServer size={14} />
                            <span>Project Structure</span>
                          </div>
                          <div className="structure-content">
                            {message.data.structure.map((file, idx) => (
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
                        <p>Your project has been downloaded successfully. Extract the ZIP and run <code>npm install</code> to get started!</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - ChatGPT Style */}
            <div className="input-area">
              <div className="input-wrapper-chat">
                <textarea
                  ref={textareaRef}
                  className="chat-input"
                  placeholder="Describe your project... (e.g., I want a Node.js setup with Express and MongoDB)"
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
          <p>[04] Quick Setup Service</p>
        </div>
      </footer>
    </div>
  );
};

export default ChatBasic;
