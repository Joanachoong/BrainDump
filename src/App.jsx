import { useState, createContext, useContext, useEffect } from 'react';
import './App.css';
import HomePage from './HomePage';
import SelectionPage from './SelectionPage';
import WhiteboardPage from './WhiteboardPage';

// ==================== CONTEXT ====================
export const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// ==================== STORAGE UTILITIES ====================
const STORAGE_KEYS = {
  CATEGORIES: 'braindump_categories',
  IDEAS: 'braindump_ideas'
};

const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ==================== APP PROVIDER ====================
function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    const savedCategories = loadFromStorage(STORAGE_KEYS.CATEGORIES);
    const savedIdeas = loadFromStorage(STORAGE_KEYS.IDEAS);

    if (savedCategories && savedCategories.length > 0) {
      setCategories(savedCategories);
    } else {
      const defaultCategories = [
        { id: generateId(), name: 'BrainStorm 1', color: '#A5B4FC', createdAt: Date.now() },
        { id: generateId(), name: 'BrainStorm 2', color: '#A5B4FC', createdAt: Date.now() },
        { id: generateId(), name: 'BrainStorm 3', color: '#93C5FD', createdAt: Date.now() },
        { id: generateId(), name: 'BrainStorm 4', color: '#C4B5FD', createdAt: Date.now() },
        { id: generateId(), name: 'BrainStorm 5', color: '#FBBF24', createdAt: Date.now() },
        { id: generateId(), name: 'BrainStorm 6', color: '#FB923C', createdAt: Date.now() },
        { id: generateId(), name: 'BrainStorm 7', color: '#34D399', createdAt: Date.now() },
        { id: generateId(), name: 'BrainStorm 8', color: '#60A5FA', createdAt: Date.now() }
      ];
      setCategories(defaultCategories);
      saveToStorage(STORAGE_KEYS.CATEGORIES, defaultCategories);
    }

    if (savedIdeas) {
      setIdeas(savedIdeas);
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    }
  }, [categories]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.IDEAS, ideas);
  }, [ideas]);

  const addCategory = (name, color = '#A5B4FC') => {
    const newCategory = {
      id: generateId(),
      name,
      color,
      createdAt: Date.now()
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id, updates) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setIdeas(ideas.filter(idea => idea.categoryId !== id));
  };

  const addIdea = (categoryId, content, inputMethod = 'text') => {
    const newIdea = {
      id: generateId(),
      categoryId,
      content,
      inputMethod,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setIdeas([...ideas, newIdea]);
    return newIdea;
  };

  const deleteIdea = (id) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const getIdeasForCategory = (categoryId) => {
    return ideas.filter(idea => idea.categoryId === categoryId)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  const navigate = (page, category = null) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    }
  };

  const value = {
    currentPage,
    selectedCategory,
    categories,
    ideas,
    showToolbar,
    setShowToolbar,
    addCategory,
    updateCategory,
    deleteCategory,
    addIdea,
    deleteIdea,
    getIdeasForCategory,
    navigate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ==================== MAIN APP ====================
function App() {
  const app = useApp();

  const renderPage = () => {
    switch (app?.currentPage) {
      case 'home':
        return <HomePage />;
      case 'select':
        return <SelectionPage />;
      case 'whiteboard':
        return <WhiteboardPage />;
      default:
        return <HomePage />;
    }
  };

  return renderPage();
}

export default function BrainDump() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}