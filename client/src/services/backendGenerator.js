// Backend-integrated project generator
import apiService from './api';
import { saveAs } from 'file-saver';

// Architectures (can be fetched from backend or use local)
export const architectures = [
  {
    id: 'mvc',
    name: 'MVC Architecture',
    icon: '🏗️',
    description: 'Model-View-Controller pattern for organized code structure'
  },
  {
    id: 'clean',
    name: 'Clean Architecture',
    icon: '🎯',
    description: 'Layered architecture with dependency inversion'
  },
  {
    id: 'microservices',
    name: 'Microservices',
    icon: '🔗',
    description: 'Distributed services architecture'
  },
  {
    id: 'monolith',
    name: 'Monolith',
    icon: '🏢',
    description: 'Single unified application'
  },
  {
    id: 'serverless',
    name: 'Serverless',
    icon: '☁️',
    description: 'Cloud-native serverless functions'
  },
  {
    id: 'hexagonal',
    name: 'Hexagonal',
    icon: '⬡',
    description: 'Ports and adapters pattern'
  }
];

// Methodologies
export const methodologies = [
  {
    id: 'tdd',
    name: 'Test-Driven Development',
    icon: '✅',
    description: 'Write tests before implementation'
  },
  {
    id: 'ddd',
    name: 'Domain-Driven Design',
    icon: '🎨',
    description: 'Model complex business domains'
  },
  {
    id: 'solid',
    name: 'SOLID Principles',
    icon: '💎',
    description: 'Five design principles for maintainability'
  },
  {
    id: 'agile',
    name: 'Agile Development',
    icon: '🔄',
    description: 'Iterative and incremental approach'
  }
];

// Best Practices
export const bestPractices = [
  {
    id: 'eslint',
    name: 'ESLint',
    icon: '🔍',
    description: 'Code quality and consistency'
  },
  {
    id: 'prettier',
    name: 'Prettier',
    icon: '✨',
    description: 'Automatic code formatting'
  },
  {
    id: 'husky',
    name: 'Git Hooks',
    icon: '🎣',
    description: 'Pre-commit quality checks'
  },
  {
    id: 'documentation',
    name: 'Documentation',
    icon: '📖',
    description: 'Comprehensive code docs'
  }
];

// Generate Basic Project via Backend
export const generateBasicProject = async (config) => {
  try {
    const response = await apiService.generateBasicProject(config);
    return response;
  } catch (error) {
    console.error('Backend generation failed, using local fallback:', error);
    // Fallback to local generation if backend fails
    const localGenerator = await import('./projectGenerator');
    return localGenerator.generateBasicProject(config);
  }
};

// Generate Advanced Project via Backend
export const generateAdvancedProject = async (config) => {
  try {
    const response = await apiService.generateAdvancedProject(config);
    return response;
  } catch (error) {
    console.error('Backend generation failed, using local fallback:', error);
    // Fallback to local generation if backend fails
    const localGenerator = await import('./projectGenerator');
    return localGenerator.generateAdvancedProject(config);
  }
};

// Download ZIP via Backend
export const downloadZip = async (zipData, projectName) => {
  try {
    // If zipData is from backend (has projectId)
    if (zipData && zipData.projectId) {
      const blob = await apiService.downloadProject(zipData.projectId);
      const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
      saveAs(blob, fileName);
      return;
    }

    // If zipData is JSZip object (local generation)
    if (zipData && typeof zipData.generateAsync === 'function') {
      const content = await zipData.generateAsync({ type: 'blob' });
      const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
      saveAs(content, fileName);
      return;
    }

    // If zipData is already a blob
    if (zipData instanceof Blob) {
      const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
      saveAs(zipData, fileName);
      return;
    }

    throw new Error('Invalid ZIP data format');
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

// Parse user prompt via Backend AI
export const parsePrompt = async (prompt) => {
  try {
    const response = await apiService.parsePrompt(prompt);
    return response;
  } catch (error) {
    console.error('Backend parsing failed, using local fallback:', error);
    // Local fallback parsing
    return parsePromptLocally(prompt);
  }
};

// Local fallback parsing
const parsePromptLocally = (prompt) => {
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

// Check backend health
export const checkBackendHealth = async () => {
  try {
    const response = await apiService.healthCheck();
    return response.status === 'ok' || response.status === 'healthy';
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

