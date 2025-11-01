import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateBasicProject, downloadZip } from '../services/projectGenerator';
import './ChatBasic.css';

const ChatBasic = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [projectConfig, setProjectConfig] = useState({
    projectName: '',
    description: '',
    features: 'REST API, Authentication, Database',
    includeAuth: true,
    includeDatabase: true,
    includeTesting: true
  });

  const [generatedZip, setGeneratedZip] = useState(null);

  const handleGenerate = async () => {
    if (!projectConfig.projectName || !projectConfig.description) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const zip = await generateBasicProject(projectConfig);
      setGeneratedZip(zip);
      setStep(2);
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
        setStep(3);
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
      features: 'REST API, Authentication, Database',
      includeAuth: true,
      includeDatabase: true,
      includeTesting: true
    });
    setGeneratedZip(null);
  };

  return (
    <div className="basic-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-number">[01]</div>
          <button className="nav-link" onClick={() => navigate('/')}>Home</button>
        </div>
        <div className="nav-container">
          <div className="nav-number">[02]</div>
          <button className="nav-link active">Basic</button>
        </div>
      </nav>

      <main className="main-content">
        {step === 1 && (
          <div className="section">
            <div className="section-header">
              <h1 className="main-title">
                QUICK PROJECT
                <br />
                GENERATOR
              </h1>
              <p className="main-subtitle">
                Enter your project details and generate a complete structure instantly
              </p>
            </div>

            <div className="form-container">
              <div className="input-wrapper">
                <label className="input-label">PROJECT NAME</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="my-awesome-project"
                  value={projectConfig.projectName}
                  onChange={(e) => setProjectConfig(prev => ({ ...prev, projectName: e.target.value }))}
                />
              </div>

              <div className="input-wrapper">
                <label className="input-label">PROJECT DESCRIPTION</label>
                <textarea
                  className="textarea-field"
                  rows="6"
                  placeholder="A modern REST API with authentication, database integration, and comprehensive testing. Built with Express.js, MongoDB, and best practices."
                  value={projectConfig.description}
                  onChange={(e) => setProjectConfig(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              <button
                className={`btn-primary ${loading ? 'loading' : ''}`}
                onClick={handleGenerate}
                disabled={!projectConfig.projectName || !projectConfig.description || loading}
              >
                {loading ? 'GENERATING...' : 'START GENERATE →'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="section">
            <div className="section-header">
              <h1 className="main-title">
                PROJECT
                <br />
                GENERATED
              </h1>
              <p className="main-subtitle">
                Your project structure is ready to download
              </p>
            </div>

            <div className="project-info">
              <div className="info-row">
                <span className="info-label">NAME</span>
                <span className="info-value">{projectConfig.projectName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">DESCRIPTION</span>
                <span className="info-value">{projectConfig.description}</span>
              </div>
            </div>

            <div className="file-structure">
              <h3 className="structure-title">GENERATED FILES</h3>
              <div className="file-list">
                <div className="file-item">📄 package.json</div>
                <div className="file-item">📄 README.md</div>
                <div className="file-item">📄 .gitignore</div>
                <div className="file-item">📄 .env.example</div>
                <div className="file-item">📁 src/</div>
                <div className="file-item indent">📄 index.js</div>
                <div className="file-item indent">📁 config/</div>
                <div className="file-item indent">📁 routes/</div>
                <div className="file-item indent">📁 controllers/</div>
                <div className="file-item indent">📁 models/</div>
                <div className="file-item indent">📁 middleware/</div>
                <div className="file-item indent">📁 utils/</div>
                <div className="file-item">📁 tests/</div>
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

        {step === 3 && (
          <div className="section">
            <div className="section-header">
              <h1 className="main-title">
                DOWNLOAD
                <br />
                COMPLETE
              </h1>
              <p className="main-subtitle">
                Your project has been downloaded successfully
              </p>
            </div>

            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>THANK YOU</h2>
              <p>Extract the ZIP file and run <code>npm install</code> to get started</p>
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

export default ChatBasic;
