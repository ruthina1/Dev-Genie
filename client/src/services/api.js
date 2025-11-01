// API Service for Dev-Genie Backend
const API_BASE_URL = 'https://dev-genie-backend.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for API calls
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON or blob (for ZIP files)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType && contentType.includes('application/zip')) {
        return await response.blob();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Generate Basic Project
  async generateBasicProject(config) {
    return this.request('/api/generate/basic', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  // Generate Advanced Project
  async generateAdvancedProject(config) {
    return this.request('/api/generate/advanced', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  // Download Project ZIP
  async downloadProject(projectId) {
    return this.request(`/api/download/${projectId}`, {
      method: 'GET',
    });
  }

  // Parse user prompt (AI endpoint)
  async parsePrompt(prompt) {
    return this.request('/api/parse-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  // Get available templates
  async getTemplates() {
    return this.request('/api/templates');
  }

  // Get architectures list
  async getArchitectures() {
    return this.request('/api/architectures');
  }

  // Get frameworks by language
  async getFrameworks(language) {
    return this.request(`/api/frameworks?language=${language}`);
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

// Export named exports for convenience
export const {
  healthCheck,
  generateBasicProject,
  generateAdvancedProject,
  downloadProject,
  parsePrompt,
  getTemplates,
  getArchitectures,
  getFrameworks
} = apiService;

