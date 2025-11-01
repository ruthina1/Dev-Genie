# Dev Genie - Complete Project Generator

## 🎯 Overview

Dev Genie is a comprehensive, AI-powered project generator with beautiful animations and an outstanding interface inspired by [Ludovic Argenty's portfolio](https://ludovicargenty.com/).

## ✨ Features

### 🏠 Home Page
- Beautiful landing page with animated gradients
- Smooth cursor animations
- Tech stack carousel
- "Get Started" button leading to mode selection

### 🚀 Get Started Page
- Mode selection interface
- Two beautifully animated cards:
  - **Basic Developer Mode** - Quick project generation
  - **Advanced Developer Mode** - Enterprise-grade projects
- Minimalist design with gradient orbs
- Fully responsive layout

### ⚡ Basic Developer Mode (`/basic`)

**Step 1: Configuration**
- Project name input
- Comprehensive description textarea
- Key features input
- Optional components selection:
  - 🔐 **Authentication System** (JWT + Bcrypt)
  - 🗄️ **Database Integration** (MongoDB + Mongoose)
  - ✅ **Testing Framework** (Jest + Supertest)
- Visual guidelines and tips

**Step 2: Review & Confirm**
- Success animation with checkmark
- Project summary display
- Complete file structure tree preview
- Confirmation: "Is this suitable?"
  - ✓ Yes → Download ZIP
  - ✕ No → Modify configuration

**Step 3: Thank You**
- Celebration animation
- Next steps guide
- Download confirmation
- Options to create another project or return home

### 🚀 Advanced Developer Mode (`/advanced`)

**Step 1: Project Information**
- Project name input
- Detailed description textarea
- Key features input
- Progress bar showing current step

**Step 2: Architecture & Methodologies**
- **6 Architecture Patterns** (select one):
  - 🏗️ MVC Architecture
  - 🎯 Clean Architecture
  - 🔗 Microservices
  - ☁️ Serverless
  - ⬡ Hexagonal (Ports & Adapters)
  - 📚 Layered Architecture

- **4 Development Methodologies** (select multiple):
  - ✅ Test-Driven Development (TDD)
  - 🎨 Domain-Driven Design (DDD)
  - 💎 SOLID Principles
  - 🔄 Agile Development

- **Best Practices & Tools** (select multiple):
  - 🔍 ESLint - Code quality
  - ✨ Prettier - Code formatting
  - 🎣 Git Hooks - Pre-commit checks
  - 📖 Documentation - Code docs

- **Development Rules** - 8 best practices displayed

**Step 3: Review & Add Features**
- Success animation
- Configuration summary with badges
- **Add Custom Features**:
  - Feature name input
  - Feature description textarea
  - Add/remove features dynamically
  - Features get added to the generated ZIP
- Examples:
  - "Login Page with Authentication"
  - "Admin Dashboard"
  - "User Profile Management"
- Confirmation: "Is this suitable?"

**Step 4: Download & Thank You**
- Celebration animation
- Project statistics display:
  - Selected architecture
  - Number of methodologies
  - Number of custom features
- Getting started guide
- Download confirmation

## 📦 Generated Files

### Basic Project Structure
```
project-name/
├── package.json           # Dependencies and scripts
├── README.md             # Project documentation
├── .gitignore           # Git ignore rules
├── .env.example         # Environment variables template
├── src/
│   ├── index.js         # Main server file
│   ├── config/
│   │   └── index.js     # Configuration
│   ├── routes/
│   │   ├── index.js     # Base routes
│   │   └── auth.js      # Auth routes (if selected)
│   ├── controllers/
│   │   └── authController.js  # Auth logic (if selected)
│   ├── models/
│   │   └── User.js      # User model (if auth selected)
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling
│   └── utils/
│       └── logger.js    # Logging utility
└── tests/               # Test files (if selected)
    └── api.test.js
```

### Advanced Project Structure
Varies based on selected architecture:

**MVC**: Controllers, Models, Views (routes)
**Clean Architecture**: Domain, UseCases, Adapters, Infrastructure
**Microservices**: Multiple service folders, docker-compose.yml
**Serverless**: Lambda functions, serverless.yml
**Hexagonal**: Core domain, Ports, Adapters
**Layered**: Presentation, Business, Data layers

Plus custom features added by user!

## 🎨 Design Features

### Color Scheme
- Background: `#0a0a0a` (near black)
- Primary Gradient: `#667eea` → `#764ba2` (purple)
- Secondary Gradient: `#f093fb` → `#f5576c` (pink)
- Accent Gradient: `#4facfe` → `#00f2fe` (blue)

### Animations
- **Fade In/Out** - Smooth page transitions
- **Slide Up/Down** - Element animations
- **Scale In** - Pop-in effects
- **Gradient Flow** - Animated text gradients
- **Float** - Background orb movements
- **Grid Move** - Animated grid backgrounds
- **Pulse** - Status indicators
- **Check Pop** - Selection confirmations
- **Celebration** - Success animations

### Typography
- Font: **Space Grotesk** (Google Fonts)
- Weights: 300, 400, 500, 600, 700
- Uppercase labels with letter-spacing
- Gradient text effects

## 🛠️ Technologies Used

### Frontend
- **React 19.2.0** - UI framework
- **React Router DOM 7.9.5** - Routing
- **React Icons 5.5.0** - Icon library

### File Generation
- **JSZip 3.10.1** - ZIP file creation
- **FileSaver 2.0.5** - File downloads

### Styling
- **Plain CSS** - No framework dependencies
- Custom animations
- Responsive design
- CSS Grid & Flexbox

## 🚀 How to Use

### 1. Navigate to Home
```
http://localhost:3000
```

### 2. Click "Get Started"
```
http://localhost:3000/get-started
```

### 3. Choose Your Mode

**For Quick Projects** → Click "Basic Structure"
```
http://localhost:3000/basic
```

**For Enterprise Projects** → Click "Advanced Setup"
```
http://localhost:3000/advanced
```

### 4. Follow the Steps
- Fill in project details
- Select options/architecture
- Review configuration
- Download ZIP file

### 5. Use Your Project
```bash
# Extract the ZIP
unzip project-name.zip
cd project-name

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev

# Run tests (if configured)
npm test
```

## 📋 Package Scripts (Generated Projects)

### Basic Projects
```json
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "test": "jest"
}
```

### Advanced Projects
```json
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "test": "jest --coverage",
  "lint": "eslint src/**/*.js",
  "format": "prettier --write 'src/**/*.js'"
}
```

## 🎯 Use Cases

### Basic Mode Perfect For:
- MVPs and prototypes
- Learning projects
- Simple REST APIs
- Quick backend setups
- Small-scale applications

### Advanced Mode Perfect For:
- Enterprise applications
- Microservices architectures
- Production-grade systems
- Complex business logic
- Team projects with strict standards
- Projects requiring specific patterns

## 💡 Tips & Best Practices

### Project Naming
- Use lowercase with hyphens: `my-project-name`
- Be descriptive: `e-commerce-api`, `blog-platform`
- Avoid spaces and special characters

### Descriptions
- Be comprehensive and specific
- Mention key technologies
- Describe main functionality
- Include target audience if relevant

### Feature Selection
- Only select what you need
- Authentication adds JWT implementation
- Database adds MongoDB connection
- Testing adds Jest framework

### Custom Features (Advanced)
- Be specific about requirements
- Include implementation details
- Think about integration points
- Consider dependencies

## 🔧 Customization

You can extend the generator by:

1. **Adding new architectures** in `projectGenerator.js`
2. **Adding new methodologies** in the methodologies array
3. **Adding new best practices** options
4. **Customizing file templates** in generation functions
5. **Adding new UI themes** in CSS files

## 🐛 Troubleshooting

### ZIP Download Fails
- Check browser console for errors
- Ensure jszip and file-saver are installed
- Try a different browser

### Missing Dependencies
```bash
cd client
npm install jszip file-saver react-router-dom react-icons
```

### Styling Issues
- Clear browser cache
- Check if CSS files are loaded
- Verify import statements

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Laptop**: 1024px - 1200px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## ♿ Accessibility

- Keyboard navigation support
- ARIA labels where needed
- Focus indicators on interactive elements
- Screen reader friendly
- Reduced motion support via `@media (prefers-reduced-motion)`

## 🎉 Credits

- Design inspiration: [Ludovic Argenty](https://ludovicargenty.com/)
- Fonts: Google Fonts (Space Grotesk)
- Icons: React Icons

## 📄 License

MIT License - Free to use for personal and commercial projects

---

**Built with ❤️ for developers, by developers**

