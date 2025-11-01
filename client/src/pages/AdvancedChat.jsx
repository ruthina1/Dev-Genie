import React, { useState } from 'react';
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
    <div className="advanced-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-number">[01]</div>
          <button className="nav-link" onClick={() => navigate('/')}>Home</button>
        </div>
        <div className="nav-container">
          <div className="nav-number">[02]</div>
          <button className="nav-link active">Advanced</button>
        </div>
      </nav>

      <main className="main-content">
        {/* Step 1: Project Info */}
        {step === 1 && (
          <div className="section">
            <div className="section-header">
              <h1 className="main-title">
                ADVANCED
                <br />
                GENERATOR
              </h1>
              <p className="main-subtitle">
                Enterprise-grade projects with advanced architectures
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
            <div className="section-header">
              <h1 className="main-title">
                SELECT
                <br />
                ARCHITECTURE
              </h1>
              <p className="main-subtitle">
                Choose your architectural pattern and extra features
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
            <div className="section-header">
              <h1 className="main-title">
                PROJECT
                <br />
                GENERATED
              </h1>
              <p className="main-subtitle">
                Review your configuration
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
            <div className="section-header">
              <h1 className="main-title">
                DOWNLOAD
                <br />
                COMPLETE
              </h1>
              <p className="main-subtitle">
                Your enterprise-grade project is ready
              </p>
            </div>

            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>THANK YOU</h2>
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
      </main>

      <footer className="page-footer">
        <p>[03] Built for developers</p>
      </footer>
    </div>
  );
};

export default AdvancedChat;
