import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Architectures
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
  },
  {
    id: 'layered',
    name: 'Layered',
    icon: '📚',
    description: 'Traditional N-tier architecture'
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

// Generate Basic Project
export const generateBasicProject = async (config) => {
  const zip = new JSZip();
  const { projectName, description, features, includeAuth, includeDatabase, includeTesting } = config;

  // package.json
  zip.file('package.json', JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: description,
    main: 'src/index.js',
    scripts: {
      start: 'node src/index.js',
      dev: 'nodemon src/index.js',
      test: includeTesting ? 'jest' : 'echo "No tests configured"'
    },
    keywords: features.split(',').map(f => f.trim()),
    author: '',
    license: 'MIT',
    dependencies: {
      express: '^4.18.2',
      dotenv: '^16.3.1',
      cors: '^2.8.5',
      ...(includeDatabase && { mongoose: '^8.0.0' }),
      ...(includeAuth && {
        jsonwebtoken: '^9.0.2',
        bcrypt: '^5.1.1'
      })
    },
    devDependencies: {
      nodemon: '^3.0.1',
      ...(includeTesting && { jest: '^29.7.0', supertest: '^6.3.3' })
    }
  }, null, 2));

  // README.md
  zip.file('README.md', `# ${projectName}

${description}

## Features
${features.split(',').map(f => `- ${f.trim()}`).join('\n')}

## Installation

\`\`\`bash
npm install
\`\`\`

## Environment Setup

Copy \`.env.example\` to \`.env\` and configure:

\`\`\`bash
cp .env.example .env
\`\`\`

## Usage

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
npm start
\`\`\`

${includeTesting ? `### Testing
\`\`\`bash
npm test
\`\`\`
` : ''}

## License
MIT
`);

  // .gitignore
  zip.file('.gitignore', `node_modules/
.env
.DS_Store
dist/
build/
*.log
coverage/
.vscode/
.idea/
`);

  // .env.example
  zip.file('.env.example', `PORT=3000
NODE_ENV=development
${includeDatabase ? 'DATABASE_URL=mongodb://localhost:27017/' + projectName.toLowerCase().replace(/\s+/g, '-') : ''}
${includeAuth ? 'JWT_SECRET=your-secret-key-here' : ''}
`);

  // src/index.js
  zip.file('src/index.js', `const express = require('express');
const cors = require('cors');
${includeDatabase ? "const mongoose = require('mongoose');" : ''}
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

${includeDatabase ? `// Database Connection
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection error:', err));
` : ''}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ${projectName}',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

${includeAuth ? `
// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
` : ''}

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});

module.exports = app;
`);

  // Config
  zip.file('src/config/index.js', `module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  ${includeDatabase ? "database: process.env.DATABASE_URL," : ''}
  ${includeAuth ? "jwtSecret: process.env.JWT_SECRET || 'default-secret'," : ''}
};
`);

  // Routes
  zip.file('src/routes/index.js', `const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = router;
`);

  if (includeAuth) {
    // Auth Routes
    zip.file('src/routes/auth.js', `const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.authenticate, authController.getProfile);

module.exports = router;
`);

    // Auth Controller
    zip.file('src/controllers/authController.js', `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const config = require('../config');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
`);

    // User Model
    zip.file('src/models/User.js', `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
`);
  }

  // Middleware
  zip.file('src/middleware/errorHandler.js', `module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
`);

  // Utils
  zip.file('src/utils/logger.js', `const logger = {
  info: (message, ...args) => console.log(\`[INFO] \${new Date().toISOString()} - \${message}\`, ...args),
  error: (message, ...args) => console.error(\`[ERROR] \${new Date().toISOString()} - \${message}\`, ...args),
  warn: (message, ...args) => console.warn(\`[WARN] \${new Date().toISOString()} - \${message}\`, ...args)
};

module.exports = logger;
`);

  if (includeTesting) {
    zip.file('tests/api.test.js', `const request = require('supertest');
const app = require('../src/index');

describe('API Tests', () => {
  test('GET / returns welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /health returns healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });
});
`);
  }

  return zip;
};

// Generate Advanced Project
export const generateAdvancedProject = async (config) => {
  const zip = new JSZip();
  const { projectName, description, architecture, methodologies, bestPractices, features, additionalFeatures } = config;

  // Enhanced package.json
  const packageJson = {
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: description,
    main: 'src/index.js',
    scripts: {
      start: 'node src/index.js',
      dev: 'nodemon src/index.js',
      test: methodologies.includes('tdd') ? 'jest --coverage' : 'jest',
      lint: bestPractices.includes('eslint') ? 'eslint src/**/*.js' : 'echo "No linting"',
      format: bestPractices.includes('prettier') ? 'prettier --write "src/**/*.js"' : 'echo "No formatting"'
    },
    keywords: features.split(',').map(f => f.trim()),
    author: '',
    license: 'MIT',
    dependencies: {
      express: '^4.18.2',
      dotenv: '^16.3.1',
      cors: '^2.8.5',
      helmet: '^7.1.0'
    },
    devDependencies: {
      nodemon: '^3.0.1',
      ...(methodologies.includes('tdd') && { jest: '^29.7.0', supertest: '^6.3.3' }),
      ...(bestPractices.includes('eslint') && { eslint: '^8.54.0' }),
      ...(bestPractices.includes('prettier') && { prettier: '^3.1.0' })
    }
  };

  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // Comprehensive README
  zip.file('README.md', `# ${projectName}

${description}

## Architecture: ${architectures.find(a => a.id === architecture)?.name}

${architectures.find(a => a.id === architecture)?.description}

## Methodologies
${methodologies.map(m => `- **${methodologies.find(meth => meth.id === m)?.name}**: ${methodologies.find(meth => meth.id === m)?.description}`).join('\n')}

## Features
${features.split(',').map(f => `- ${f.trim()}`).join('\n')}

${additionalFeatures && additionalFeatures.length > 0 ? `
## Additional Features
${additionalFeatures.map(f => `- **${f.name}**: ${f.description}`).join('\n')}
` : ''}

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

${methodologies.includes('tdd') ? `## Testing

\`\`\`bash
npm test
\`\`\`
` : ''}

${bestPractices.includes('eslint') ? `## Linting

\`\`\`bash
npm run lint
\`\`\`
` : ''}

## License
MIT
`);

  // Generate architecture-specific structure
  generateArchitectureFiles(zip, architecture, additionalFeatures);

  // Add ESLint config if selected
  if (bestPractices.includes('eslint')) {
    zip.file('.eslintrc.json', JSON.stringify({
      env: { node: true, es2021: true },
      extends: ['eslint:recommended'],
      parserOptions: { ecmaVersion: 'latest' },
      rules: { 'no-console': 'off' }
    }, null, 2));
  }

  // Add Prettier config if selected
  if (bestPractices.includes('prettier')) {
    zip.file('.prettierrc', JSON.stringify({
      singleQuote: true,
      trailingComma: 'es5',
      tabWidth: 2,
      semi: true
    }, null, 2));
  }

  zip.file('.gitignore', `node_modules/\n.env\n*.log\ncoverage/\ndist/\n`);
  zip.file('.env.example', `PORT=3000\nNODE_ENV=development\n`);

  return zip;
};

// Generate architecture-specific files
const generateArchitectureFiles = (zip, architecture, additionalFeatures = []) => {
  switch (architecture) {
    case 'mvc':
      // MVC Structure
      zip.file('src/controllers/homeController.js', `exports.index = (req, res) => {\n  res.json({ message: 'MVC Architecture' });\n};\n`);
      zip.file('src/models/User.js', `class User {\n  constructor(data) {\n    this.id = data.id;\n    this.name = data.name;\n  }\n}\n\nmodule.exports = User;\n`);
      zip.file('src/routes/index.js', `const express = require('express');\nconst router = express.Router();\nconst homeController = require('../controllers/homeController');\n\nrouter.get('/', homeController.index);\n\nmodule.exports = router;\n`);
      zip.file('src/index.js', `const express = require('express');\nconst app = express();\nconst routes = require('./routes');\n\napp.use(express.json());\napp.use('/api', routes);\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log(\`Server on port \${PORT}\`));\n`);
      break;

    case 'clean':
      // Clean Architecture
      zip.file('src/domain/entities/User.js', `class User {\n  constructor({ id, name, email }) {\n    this.id = id;\n    this.name = name;\n    this.email = email;\n  }\n}\n\nmodule.exports = User;\n`);
      zip.file('src/usecases/CreateUser.js', `class CreateUser {\n  constructor(userRepository) {\n    this.userRepository = userRepository;\n  }\n\n  async execute(userData) {\n    return await this.userRepository.create(userData);\n  }\n}\n\nmodule.exports = CreateUser;\n`);
      zip.file('src/adapters/UserRepository.js', `class UserRepository {\n  constructor() {\n    this.users = [];\n  }\n\n  async create(user) {\n    this.users.push(user);\n    return user;\n  }\n}\n\nmodule.exports = UserRepository;\n`);
      zip.file('src/index.js', `const express = require('express');\nconst app = express();\n\napp.use(express.json());\napp.get('/', (req, res) => res.json({ message: 'Clean Architecture' }));\n\nconst PORT = 3000;\napp.listen(PORT, () => console.log(\`Server on \${PORT}\`));\n`);
      break;

    case 'microservices':
      // Microservices
      zip.file('services/api-gateway/index.js', `const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => res.json({ service: 'API Gateway' }));\n\napp.listen(3000, () => console.log('Gateway on 3000'));\n`);
      zip.file('services/user-service/index.js', `const express = require('express');\nconst app = express();\n\napp.get('/users', (req, res) => res.json({ users: [] }));\n\napp.listen(3001, () => console.log('User Service on 3001'));\n`);
      zip.file('docker-compose.yml', `version: '3.8'\nservices:\n  api-gateway:\n    build: ./services/api-gateway\n    ports:\n      - "3000:3000"\n  user-service:\n    build: ./services/user-service\n    ports:\n      - "3001:3001"\n`);
      break;

    default:
      // Default structure
      zip.file('src/index.js', `const express = require('express');\nconst app = express();\n\napp.use(express.json());\napp.get('/', (req, res) => res.json({ message: 'Project Ready' }));\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log(\`Server running on \${PORT}\`));\n`);
  }

  // Add additional features
  additionalFeatures.forEach((feature) => {
    if (feature.name.toLowerCase().includes('login') || feature.name.toLowerCase().includes('auth')) {
      zip.file('src/features/auth/login.js', `// ${feature.name}\n// ${feature.description}\n\nconst login = async (req, res) => {\n  const { email, password } = req.body;\n  // TODO: Implement authentication logic\n  res.json({ message: 'Login endpoint ready' });\n};\n\nmodule.exports = { login };\n`);
    }
    
    if (feature.name.toLowerCase().includes('dashboard')) {
      zip.file('src/features/dashboard/index.js', `// ${feature.name}\n// ${feature.description}\n\nconst getDashboard = async (req, res) => {\n  res.json({ dashboard: 'ready' });\n};\n\nmodule.exports = { getDashboard };\n`);
    }
  });
};

// Download ZIP
export const downloadZip = async (zip, projectName) => {
  const content = await zip.generateAsync({ type: 'blob' });
  const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
  saveAs(content, fileName);
};

