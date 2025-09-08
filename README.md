# MyMedia App

A modern and well-structured React application for sharing content, managing posts, and exploring products.

## 🚀 Features

- **Clean Architecture**: Well-organized and scalable file structure
- **Reusable Components**: Modular UI component system
- **TypeScript**: Static typing for better development and maintenance
- **Tailwind CSS**: Utility CSS framework for modern design
- **Context API**: Global state management with React Context
- **Custom Hooks**: Reusable logic encapsulated in hooks
- **API Service**: Service layer for data handling
- **Responsive Design**: Adaptive design for all devices

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base components (Button, Card, Input)
│   ├── layout/         # Structure components (Header, Footer, Layout)
│   └── features/       # Specific components (PostCard, ProductCard)
├── pages/              # Application pages
│   ├── HomePage.tsx    # Main page
│   └── PostsPage.tsx   # Posts page
├── hooks/              # Custom hooks
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── context/            # Global application context
│   └── AppContext.tsx
├── services/           # Services and API calls
│   └── apiService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utilities and helper functions
│   ├── api.ts
│   └── helpers.ts
└── assets/             # Static resources
```

## 🛠️ Technologies Used

- **React 18** - User interface library
- **TypeScript** - JavaScript superset with static typing
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility CSS framework
- **PostCSS** - CSS processor
- **ESLint** - Linter for JavaScript/TypeScript

## 🚀 Installation and Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📚 Implemented Concepts

### UI Components
- **Button**: Reusable button with variants and states
- **Card**: Card system with header, content and footer
- **Input**: Input field with validation and states

### Custom Hooks
- **useLocalStorage**: Data persistence in localStorage
- **useDebounce**: Search optimization with debounce

### State Management
- **Context API**: Global state with useReducer
- **Local State**: useState for component state

### Services
- **API Service**: Class for HTTP call handling
- **Error Handling**: Robust API error handling
- **TypeScript**: Complete API response typing

## 🎨 Design and UX

- **Responsive**: Adaptive design for mobile, tablet and desktop
- **Accessibility**: Use of HTML semantics and ARIA labels
- **Performance**: Lazy loading and rendering optimizations
- **Modern**: Clean and professional design with Tailwind CSS

## 🔧 Configuration

### Tailwind CSS
The project includes custom Tailwind configuration with:
- Custom colors
- CSS animations
- Extended utilities

### TypeScript
Strict TypeScript configuration for:
- Early error detection
- Better autocompletion
- Code documentation

## 📝 Usage Examples

### Create a new component
```tsx
import React from 'react';
import { Button, Card } from '../components/ui';

export const MyComponent: React.FC = () => {
  return (
    <Card>
      <h2>My Component</h2>
      <Button>Click me</Button>
    </Card>
  );
};
```

### Use global context
```tsx
import { useAppContext } from '../context/AppContext';

export const MyComponent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  return <div>Theme: {state.theme}</div>;
};
```

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - User interface library
- [Tailwind CSS](https://tailwindcss.com/) - Utility CSS framework
- [Vite](https://vitejs.dev/) - Fast build tool
- [TypeScript](https://www.typescriptlang.org/) - JavaScript superset
