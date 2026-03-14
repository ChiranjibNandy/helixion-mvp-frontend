# Helixion MVP Frontend - Code Standards & Security Guide

## 🎯 Overview

This document outlines the coding standards, security practices, and architecture decisions for the Helixion MVP frontend application.

## 📁 Project Structure

```
helixion-mvp-frontend/
├── app/                      # Next.js App Router
│   ├── layout.jsx           # Root layout
│   ├── page.jsx             # Home/Login page
│   └── register/
│       └── page.jsx         # Registration page
├── components/
│   ├── auth/                # Authentication components
│   │   ├── LoginForm.jsx    # Secure login form
│   │   └── RegisterForm.jsx # Secure registration form
│   ├── layout/              # Layout components
│   │   ├── LeftPanel.jsx    # Branding panel
│   │   ├── RightPanel.jsx   # Login container
│   │   ├── RegisterLeftPanel.jsx
│   │   └── RegisterRightPanel.jsx
│   └── ui/                  # Reusable UI components
│       ├── Icons.jsx        # Icon components
│       └── FormComponents.jsx # Form primitives
├── lib/                     # Core utilities
│   ├── constants.js        # Design system tokens
│   └── security.js         # Security utilities
├── styles/
│   └── globals.css         # Global styles
├── tailwind.config.js      # Tailwind configuration
└── README.md               # This file
```

## 🛡️ Security Architecture

### Authentication & Storage

- **Session Storage**: Uses `sessionStorage` instead of `localStorage` for tokens (cleared when browser closes)
- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Rate Limiting**: Built-in rate limiting for login (5 attempts/5min) and registration (3 attempts/10min)
- **CSRF Protection**: CSRF tokens generated and validated for all API requests
- **Secure Redirects**: All redirect URLs are validated to prevent open redirect attacks
- **Password Validation**: Strong password requirements enforced (8+ chars, uppercase, lowercase, numbers)

### Security Utilities (`lib/security.js`)

```javascript
// Key security functions:
- sanitizeInput()           // XSS prevention
- isValidEmail()           // Email validation
- isValidUsername()        // Username validation
- validatePassword()       // Password strength validation
- secureStorage           // sessionStorage wrapper
- checkRateLimit()       // Rate limiting
- validateRedirect()     // Safe redirect validation
- mockLogin()           // Secure mock authentication
- mockRegister()        // Secure mock registration
```

## 🎨 Design System

### Color Palette (`lib/constants.js`)

```javascript
COLORS = {
  primary: {    // Blue theme
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ... 9 shades
  },
  background: {  // Dark theme
    main: '#060d1a',
    secondary: '#08101e',
    input: '#0c1828',
  },
  text: {
    primary: '#e8edf5',
    secondary: '#c8d4e8',
    muted: '#6b7d96',
  }
}
```

### Typography

- **Font Family**: Bricolage Grotesque, system-ui, sans-serif
- **Scale**: xs (10.5px) → 4xl (44px)
- **Weights**: 400-800

### Spacing System

```javascript
SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
}
```

## 📝 Coding Standards

### Component Structure

```jsx
/**
 * ComponentName
 * 
 * Brief description of what this component does.
 * 
 * @author Author Name
 * @version 1.0.0
 */

'use client';

import { useState, useCallback } from 'react';
// Group imports: external → internal → utils

// Constants at top
const VALIDATION_RULES = {
  // Validation configuration
};

/**
 * Main component with JSDoc
 * @param {Object} props
 * @param {string} props.propName - Description
 */
export default function ComponentName({ propName }) {
  // State management - group related state
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Handlers with useCallback for performance
  const handleChange = useCallback((field, value) => {
    // Implementation
  }, [dependencies]);
  
  const validate = useCallback(() => {
    // Validation logic
  }, [dependencies]);
  
  const handleSubmit = async (e) => {
    // Event handling
  };
  
  // Render with semantic HTML and accessibility
  return (
    <form onSubmit={handleSubmit} aria-label="Form description">
      {/* Form fields with proper labels */}
    </form>
  );
}

// Export for testing
export { VALIDATION_RULES };
```

### Key Standards

1. **JSDoc Comments**: All functions and components must have JSDoc
2. **useCallback**: Wrap handlers to prevent unnecessary re-renders
3. **Semantic HTML**: Use proper HTML elements (`<form>`, `<label>`, etc.)
4. **Accessibility**: Always include `aria-*` attributes
5. **Consistent Naming**: 
   - Components: PascalCase
   - Functions: camelCase
   - Constants: UPPER_SNAKE_CASE
6. **Destructured Props**: Always destructure props in function parameters
7. **No Magic Numbers**: Use constants from `lib/constants.js`

## 🔐 Security Checklist

### Input Handling

- ✅ All inputs sanitized via `sanitizeInput()`
- ✅ Email validation with `isValidEmail()`
- ✅ Username validation with `isValidUsername()`
- ✅ Password strength validation
- ✅ XSS prevention (no `dangerouslySetInnerHTML`)

### Authentication

- ✅ No passwords stored in state after form submission
- ✅ Session storage for tokens (not localStorage)
- ✅ Rate limiting on all auth endpoints
- ✅ CSRF tokens for state-changing operations
- ✅ Secure redirect validation

### API Calls

- ✅ All API calls use `secureFetch()` wrapper
- ✅ Request/response sanitization
- ✅ Error handling with user-friendly messages
- ✅ Loading states to prevent double submission

## 🧪 Testing

### Unit Test Structure

```javascript
import { validateForm, sanitizeInput } from '@/lib/security';

describe('ComponentName', () => {
  describe('validation', () => {
    it('should validate email format', () => {
      // Test cases
    });
  });
  
  describe('security', () => {
    it('should sanitize malicious input', () => {
      // Test cases
    });
  });
});
```

### E2E Testing

- Test form submissions
- Test error states
- Test rate limiting behavior
- Test accessibility (keyboard navigation)

## 🚀 Performance

### Optimization Techniques

1. **useCallback**: Memoize handler functions
2. **Consolidated State**: Group related state into objects
3. **Lazy Loading**: Use dynamic imports for heavy components
4. **CSS**: Use Tailwind for atomic CSS (no runtime overhead)
5. **Images**: Optimize and lazy load images

### Bundle Analysis

```bash
npm run build
npm run analyze
```

## 📚 Best Practices

### Form Handling

```jsx
// ✅ Good: Consolidated state, validation, error handling
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});

const validate = useCallback(() => {
  const errors = {};
  if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email';
  }
  return errors;
}, [formData]);
```

### Security

```jsx
// ✅ Good: Input sanitization
const handleChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: sanitizeInput(value), // Always sanitize!
  }));
};
```

### Accessibility

```jsx
// ✅ Good: Accessible form
<label htmlFor="email">Email</label>
<input
  id="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" role="alert">{errors.email}</p>
)}
```

## 🔄 Migration Guide

### From Old Code to New Standards

1. **Replace localStorage with secureStorage**
   ```diff
   - localStorage.setItem('token', value);
   + secureStorage.set('token', value);
   ```

2. **Add input sanitization**
   ```diff
   - onChange={(e) => setValue(e.target.value)}
   + onChange={(e) => setValue(sanitizeInput(e.target.value))}
   ```

3. **Use design system colors**
   ```diff
   - style={{ color: '#3b6fe0' }}
   + style={{ color: COLORS.primary[500] }}
   ```

4. **Add validation**
   ```diff
   - const handleSubmit = () => { submit(); };
   + const handleSubmit = () => {
   +   if (!validate()) return;
   +   submit();
   + };
   ```

## 🆘 Troubleshooting

### Common Issues

**Problem**: "localStorage is not defined" error
- **Solution**: Use `secureStorage` which handles SSR properly

**Problem**: Form inputs not validating
- **Solution**: Check that validation rules are properly configured in `VALIDATION_RULES`

**Problem**: Rate limit errors
- **Solution**: Wait for the cooldown period or clear browser storage

**Problem**: Styles not applying
- **Solution**: Ensure `globals.css` is imported in `app/layout.jsx`

## 📞 Support

For questions about:
- **Security**: Check `lib/security.js` documentation
- **Components**: See JSDoc comments in component files
- **Styling**: Refer to `lib/constants.js` for design tokens
- **Architecture**: Review this document and code examples

## 🏆 Success Metrics

- ✅ Zero XSS vulnerabilities
- ✅ 100% form validation coverage
- ✅ ARIA accessibility compliance
- ✅ < 3s initial page load
- ✅ 100% test coverage for security utilities

---

**Last Updated**: 2024
**Version**: 2.0.0
**Maintained by**: Helixion Team
