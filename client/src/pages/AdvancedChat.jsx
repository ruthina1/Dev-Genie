import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  generateAdvancedProject, 
  downloadZip,
  architectures,
  methodologies,
  bestPractices 
} from '../services/projectGenerator';
import './AdvancedChat.css';

const AdvancedChat = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [projectConfig, setProjectConfig] = useState({
    projectName: '',
    description: '',
    features: '',
    architecture: '',
    methodologies: [],
    bestPractices: [],
    additionalFeatures: []
  });

  const [generatedZip, setGeneratedZip] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const toggleSelection = (field, value) => {
    setProjectConfig(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const zip = await generateAdvancedProject(projectConfig);
      setGeneratedZip(zip);
      setStep(3);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate project');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (generatedZip) {
      setLoading(true);
      try {
        await downloadZip(generatedZip, projectConfig.projectName);
        setStep(4);
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setProjectConfig({
      projectName: '',
      description: '',
      features: '',
      architecture: '',
      methodologies: [],
      bestPractices: [],
      additionalFeatures: []
    });
    setGeneratedZip(null);
  };

  return (
    <div className={`advanced-page ${isVisible ? 'visible' : ''}`}>
      {/* Navigation - Same as GetStarted */}
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
      <main className="get-started-main">
        <div className="content-wrapper">
          {/* Step 1: Project Info */}
          {step === 1 && (
            <div className="section">
              <div className="header-section">
                <div className="status-badge">
                  <span className="status-dot"></span>
                  <span className="status-text">ADVANCED MODE</span>
                </div>
                
                <h1 className="main-heading">
                  <span className="heading-line">Enterprise</span>
                  <span className="heading-line heading-highlight">Grade</span>
                  <span className="heading-line">Generator</span>
                </h1>

                <p className="subtext">
                  Create production-ready projects with advanced architectures.
                  <br />
                  Professional, scalable, and best-practice driven.
                </p>
              </div>

              <div className="form-container">
                <div className="input-wrapper">
                  <label className="input-label">PROJECT NAME</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="enterprise-platform"
                    value={projectConfig.projectName}
                    onChange={(e) => setProjectConfig(prev => ({ ...prev, projectName: e.target.value }))}
                  />
                </div>

                <div className="input-wrapper">
                  <label className="input-label">PROJECT DESCRIPTION</label>
                  <textarea
                    className="textarea-field"
                    rows="6"
                    placeholder="A highly scalable microservices platform with event-driven architecture, CQRS pattern, and comprehensive testing."
                    value={projectConfig.description}
                    onChange={(e) => setProjectConfig(prev => ({ ...prev, description: e.target.value }))}
                  ></textarea>
                </div>

                <div className="input-wrapper">
                  <label className="input-label">KEY FEATURES</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Microservices, Event Sourcing, CQRS, API Gateway"
                    value={projectConfig.features}
                    onChange={(e) => setProjectConfig(prev => ({ ...prev, features: e.target.value }))}
                  />
                </div>

                <button
                  className="btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!projectConfig.projectName || !projectConfig.description || !projectConfig.features}
                >
                  CONTINUE TO ARCHITECTURE →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Architecture Selection */}
          {step === 2 && (
            <div className="section">
              <div className="header-section">
                <div className="status-badge">
                  <span className="status-dot"></span>
                  <span className="status-text">SELECT CONFIGURATION</span>
                </div>
                
                <h1 className="main-heading">
                  <span className="heading-line">Choose</span>
                  <span className="heading-line heading-highlight">Architecture</span>
                </h1>

                <p className="subtext">
                  Select your architectural pattern and extra features.
                </p>
              </div>

              {/* Architecture Selection */}
              <div className="selection-section">
                <h2 className="selection-title">ARCHITECTURE PATTERN</h2>
                <div className="arch-grid">
                  {architectures.map((arch) => (
                    <div
                      key={arch.id}
                      className={`arch-card ${projectConfig.architecture === arch.id ? 'selected' : ''}`}
                      onClick={() => setProjectConfig(prev => ({ ...prev, architecture: arch.id }))}
                    >
                      <div className="arch-icon">{arch.icon}</div>
                      <h3 className="arch-name">{arch.name}</h3>
                      <p className="arch-desc">{arch.description}</p>
                      {projectConfig.architecture === arch.id && <div className="check-mark">✓</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Features */}
              <div className="selection-section">
                <h2 className="selection-title">EXTRA FEATURES</h2>
                <div className="features-grid">
                  {methodologies.map((method) => (
                    <div
                      key={method.id}
                      className={`feature-card ${projectConfig.methodologies.includes(method.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelection('methodologies', method.id)}
                    >
                      <div className="feature-icon">{method.icon}</div>
                      <div className="feature-content">
                        <h4 className="feature-name">{method.name}</h4>
                        <p className="feature-desc">{method.description}</p>
                      </div>
                      {projectConfig.methodologies.includes(method.id) && <div className="check-mark">✓</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Practices */}
              <div className="selection-section">
                <h2 className="selection-title">BEST PRACTICES</h2>
                <div className="features-grid">
                  {bestPractices.map((practice) => (
                    <div
                      key={practice.id}
                      className={`feature-card ${projectConfig.bestPractices.includes(practice.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelection('bestPractices', practice.id)}
                    >
                      <div className="feature-icon">{practice.icon}</div>
                      <div className="feature-content">
                        <h4 className="feature-name">{practice.name}</h4>
                        <p className="feature-desc">{practice.description}</p>
                      </div>
                      {projectConfig.bestPractices.includes(practice.id) && <div className="check-mark">✓</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="actions">
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  ← BACK
                </button>
                <button
                  className={`btn-primary ${loading ? 'loading' : ''}`}
                  onClick={handleGenerate}
                  disabled={!projectConfig.architecture || loading}
                >
                  {loading ? 'GENERATING...' : 'GENERATE PROJECT →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="section">
              <div className="header-section">
                <div className="status-badge">
                  <span className="status-dot"></span>
                  <span className="status-text">READY TO DOWNLOAD</span>
                </div>
                
                <h1 className="main-heading">
                  <span className="heading-line">Project</span>
                  <span className="heading-line heading-highlight">Generated</span>
                </h1>

                <p className="subtext">
                  Review your configuration below.
                </p>
              </div>

              <div className="project-info">
                <div className="info-row">
                  <span className="info-label">PROJECT NAME</span>
                  <span className="info-value">{projectConfig.projectName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">ARCHITECTURE</span>
                  <span className="info-value">
                    {architectures.find(a => a.id === projectConfig.architecture)?.name}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">METHODOLOGIES</span>
                  <span className="info-value">
                    {projectConfig.methodologies.length > 0 
                      ? projectConfig.methodologies.map(mid => 
                          methodologies.find(m => m.id === mid)?.name
                        ).join(', ')
                      : 'None selected'
                    }
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">BEST PRACTICES</span>
                  <span className="info-value">
                    {projectConfig.bestPractices.length > 0
                      ? projectConfig.bestPractices.map(pid =>
                          bestPractices.find(p => p.id === pid)?.name
                        ).join(', ')
                      : 'None selected'
                    }
                  </span>
                </div>
              </div>

              <div className="actions">
                <button
                  className={`btn-primary ${loading ? 'loading' : ''}`}
                  onClick={handleDownload}
                  disabled={loading}
                >
                  {loading ? 'PREPARING...' : 'DOWNLOAD ZIP →'}
                </button>
                <button className="btn-secondary" onClick={handleReset}>
                  START OVER
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Thank You */}
          {step === 4 && (
            <div className="section">
              <div className="header-section">
                <div className="status-badge">
                  <span className="status-dot"></span>
                  <span className="status-text">DOWNLOAD COMPLETE</span>
                </div>
                
                <h1 className="main-heading">
                  <span className="heading-line">Thank</span>
                  <span className="heading-line heading-highlight">You</span>
                </h1>

                <p className="subtext">
                  Your enterprise-grade project is ready.
                </p>
              </div>

              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2>DOWNLOAD SUCCESSFUL</h2>
                <p>Extract the ZIP and follow the README for setup instructions</p>
              </div>

              <div className="actions">
                <button className="btn-primary" onClick={handleReset}>
                  CREATE ANOTHER PROJECT →
                </button>
                <button className="btn-secondary" onClick={() => navigate('/')}>
                  BACK TO HOME
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Same as GetStarted */}
      <footer className="get-started-footer">
        <div className="footer-content">
          <p>[04] Built for developers</p>
        </div>
      </footer>
    </div>
  );
};

export default AdvancedChat;
