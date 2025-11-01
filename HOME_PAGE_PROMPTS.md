# DevGenie Home Page - Exact Prompts for Structure & Styling

## 📋 PROMPT FOR STRUCTURE (Home.jsx)

Create a React component called `Home` that replicates the exact structure and layout of ludovicargenty.com, adapted for DevGenie. The component should include:

### Navigation Section
- Fixed navigation bar at the top
- Logo text: "DevGenie"
- Numbered menu items: [01] Home, [02] Services, [03] About, [04] Templates, [05] Contact
- Each menu item should have the format: `[number]` followed by text
- Menu should be horizontally aligned

### Hero Section
- Centered content with large name display: "DEVGENIE"
- Three subtitle lines:
  - "Smart Development Platform"
  - "Project Generator"
  - "Code Automation Tool"
- Tech stack badges displayed horizontally: React, Next.js, Node.js, Python, TypeScript
- Two CTA buttons: "Get Started" (primary) and "View Templates" (secondary)
- Scroll indicator at the bottom with animated line

### Stats Section
- Three-column layout showing:
  - "1000+" with label "Projects Generated"
  - "500+" with label "Developers"
  - "50+" with label "Templates"
- Light background color to differentiate from hero

### Services Section
- Section title: "[04] Services"
- Two service items, each with:
  - Arrow indicator (→)
  - Service title (Basic Service / Advanced Service)
  - Service description explaining what it does
- Service items should be separated with borders

### Component Structure
```jsx
<div className="home">
  <nav className="nav">
    {/* Navigation with numbered items */}
  </nav>
  
  <section className="hero">
    {/* Hero content with name, titles, tech stack, CTAs, scroll indicator */}
  </section>
  
  <section className="stats">
    {/* Three stats in a row */}
  </section>
  
  <section className="services">
    {/* Services list with arrows */}
  </section>
</div>
```

---

## 🎨 PROMPT FOR STYLING (Home.css)

Create CSS that exactly matches the minimalist design aesthetic of ludovicargenty.com with the following specifications:

### Global Styles
- Reset margins and padding
- Use system fonts: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', etc.`
- White background (#ffffff)
- Black text (#000000)
- Smooth font rendering: `-webkit-font-smoothing: antialiased`

### Navigation Styles
- Fixed position at top
- White background with slight transparency (rgba(255, 255, 255, 0.95))
- Backdrop blur effect: `backdrop-filter: blur(10px)`
- Subtle bottom border: `1px solid rgba(0, 0, 0, 0.05)`
- Padding: 20px vertical
- Max-width container: 1400px, centered
- Horizontal flex layout with space-between
- Logo: 18px, weight 600, letter-spacing 1px
- Menu items: 14px font, 40px gap between items
- Number badges: 12px, weight 500, letter-spacing 0.5px
- Hover effect: opacity 0.7

### Hero Section Styles
- Full viewport height: `min-height: 100vh`
- Centered flex layout (vertical and horizontal)
- Padding: 120px top, 40px sides, 80px bottom
- Name ("DEVGENIE"):
  - Font size: 120px
  - Font weight: 700
  - Letter spacing: -2px
  - Line height: 1
  - Margin bottom: 40px
- Titles (3 subtitle lines):
  - Font size: 20px
  - Font weight: 400
  - Color: #666666
  - Letter spacing: 0.5px
  - Vertical gap: 8px between items
- Tech stack badges:
  - Background: #f5f5f5
  - Border: 1px solid #e0e0e0
  - Border radius: 20px
  - Padding: 8px 20px
  - Font size: 14px
  - Font weight: 500
  - Gap: 15px between badges
- CTA Buttons:
  - Primary button: Black background (#000000), white text, padding 14px 32px
  - Secondary button: Transparent, black border, black text
  - Both: 14px font, weight 500, uppercase, letter-spacing 0.5px, border-radius 2px
  - Hover: translateY(-2px), background color change
  - Gap: 20px between buttons
- Scroll indicator:
  - Position: absolute, bottom 40px
  - Font size: 12px
  - Weight: 400
  - Letter spacing: 2px
  - Uppercase
  - Color: #666666
  - Animated line: 1px width, 40px height, animated opacity and translateY

### Stats Section Styles
- Background: #f9f9f9
- Border top: 1px solid #e0e0e0
- Padding: 80px 40px
- Three-column flex layout
- Stat number:
  - Font size: 48px
  - Font weight: 700
  - Line height: 1
  - Margin bottom: 12px
- Stat label:
  - Font size: 14px
  - Weight: 400
  - Color: #666666
  - Letter spacing: 0.5px
  - Uppercase

### Services Section Styles
- Padding: 120px 40px
- Section title: 14px, weight 500, letter-spacing 1px, margin-bottom 60px
- Service items:
  - Flex layout with gap: 20px
  - Padding: 30px 0
  - Border bottom: 1px solid #e0e0e0
- Service arrow: 24px, color black, weight 300
- Service title: 24px, weight 600, letter-spacing -0.5px, margin-bottom 12px
- Service description: 16px, weight 400, line-height 1.6, color #666666, max-width 700px

### Responsive Breakpoints

**Tablet (max-width: 1024px)**
- Hero name: 80px
- Nav menu gap: 30px
- Stats gap: 40px
- Stat number: 36px

**Mobile (max-width: 768px)**
- Nav padding: 0 20px
- Nav menu gap: 20px
- Nav font: 12px
- Hero name: 60px
- Hero title: 18px
- Tech badges: 12px font, 6px 16px padding
- CTA buttons: Column layout, full width (max 300px)
- Stats: Column layout
- Service title: 20px
- Service description: 14px

**Small Mobile (max-width: 480px)**
- Nav menu: Wrap, center justify
- Hero name: 48px
- Hero title: 16px
- Tech badges: 11px font, 5px 12px padding

### Key Design Principles
1. **Minimalist**: Clean, uncluttered, lots of whitespace
2. **Monochromatic**: Primarily black, white, and grays (#666666, #f5f5f5, #f9f9f9)
3. **Typography-focused**: Large, bold headings with clean sans-serif fonts
4. **Subtle interactions**: Gentle hover effects, smooth transitions
5. **Professional spacing**: Generous padding and margins throughout
6. **Fixed navigation**: Always visible at top
7. **Centered content**: Max-width containers (1400px) centered on page
8. **Smooth animations**: Scroll indicator line animation, button hover effects

---

## ✅ Implementation Checklist

- [x] Navigation with numbered menu items
- [x] Hero section with large name display
- [x] Three subtitle lines
- [x] Tech stack badges
- [x] CTA buttons (primary and secondary)
- [x] Scroll indicator with animation
- [x] Stats section (3 columns)
- [x] Services section with arrows
- [x] Responsive design (tablet, mobile, small mobile)
- [x] Fixed navigation bar
- [x] Minimalist color scheme
- [x] Proper typography hierarchy
- [x] Smooth hover effects
- [x] Clean spacing and layout

---

## 📝 Notes

- All measurements are pixel-based
- Font sizes use px units
- Colors use hex codes or rgba
- Transitions: 0.3s ease
- Border radius: 2px for buttons, 20px for badges
- Max-width containers: 1400px
- Letter spacing varies by element (larger for smaller text, negative for large headings)

