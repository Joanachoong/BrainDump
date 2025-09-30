import { useState, createContext, useContext, useEffect } from 'react';
import { Plus, Settings, X, ArrowLeft, Mic, Edit3, Circle } from 'lucide-react';
import './App.css';

// ==================== CONTEXT ====================
const AppContext = createContext();

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
        { id: generateId(), name: 'BrainStorm 4', color: '#C4B5FD', createdAt: Date.now() }
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
    deleteCategory,
    addIdea,
    deleteIdea,
    getIdeasForCategory,
    navigate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ==================== HOME PAGE ====================
function HomePage() {
  const { navigate } = useApp();

  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="home-title">BrainDump</h1>
        <p className="home-subtitle">Capture your ideas instantly</p>
        <button onClick={() => navigate('select')} className="home-button">
          Get Started
        </button>
      </div>
    </div>
  );
}

// ==================== CATEGORY CARD ====================
function CategoryCard({ category, onClick }) {
  return (
    <button
      onClick={onClick}
      className="category-card"
      style={{ backgroundColor: category.color }}
    >
      {category.name}
    </button>
  );
}

// ==================== SELECT PAGE ====================
function SelectPage() {
  const { categories, navigate, addCategory, deleteCategory } = useApp();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const colors = ['#A5B4FC', '#93C5FD', '#C4B5FD', '#FBBF24', '#FB923C', '#34D399'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addCategory(newCategoryName, randomColor);
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className="select-page">
      <div className="select-header">
        <div className="user-info">
          <div className="user-avatar">U</div>
          <div>
            <p className="user-greeting">Hi, <span>User</span></p>
          </div>
        </div>
        <h2 className="select-title">Start your</h2>
        <h2 className="select-title">Brainstorm</h2>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <CategoryCard
              category={category}
              onClick={() => navigate('whiteboard', category)}
            />
            {editMode && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete "${category.name}"?`)) {
                    deleteCategory(category.id);
                  }
                }}
                className="delete-category-btn"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <p>No categories yet</p>
          <p className="empty-state-hint">Click the + button below to create your first category</p>
        </div>
      )}

      {showNewCategory && (
        <div className="modal-overlay" onClick={() => setShowNewCategory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Category name..."
              className="modal-input"
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={() => setShowNewCategory(false)} className="modal-btn-cancel">
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="modal-btn-create"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setShowNewCategory(true)} className="fab fab-center">
        <Plus size={28} />
      </button>

      <button
        onClick={() => setEditMode(!editMode)}
        className="fab fab-right"
        style={{ backgroundColor: editMode ? '#EF4444' : '#1F2937' }}
      >
        {editMode ? <X size={24} /> : <Settings size={24} />}
      </button>
    </div>
  );
}

// ==================== WHITEBOARD PAGE ====================
function WhiteboardPage() {
  const { selectedCategory, navigate, addIdea, getIdeasForCategory, deleteIdea, showToolbar, setShowToolbar } = useApp();
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const categoryIdeas = selectedCategory ? getIdeasForCategory(selectedCategory.id) : [];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setContent(prevContent => prevContent + ' ' + transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      try {
        setIsRecording(true);
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsRecording(false);
      }
    } else {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (content.trim() && selectedCategory) {
      addIdea(selectedCategory.id, content.trim(), isRecording ? 'voice' : 'text');
      setContent('');
    }
  };

  const handleDelete = (ideaId) => {
    if (window.confirm('Delete this idea?')) {
      deleteIdea(ideaId);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="whiteboard-page">
      <div className="whiteboard-header">
        <button onClick={() => navigate('select')} className="back-button">
          <ArrowLeft size={20} />
          <span>Previous</span>
        </button>
        
        <h1 className="whiteboard-title">{selectedCategory?.name || 'Title'}</h1>
        
        <button onClick={() => navigate('select')} className="close-button">
          <X size={20} />
        </button>
      </div>

      <div className="whiteboard-content">
        <div className="input-section">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your idea or use voice..."
            className="idea-textarea"
          />

          {content && (
            <button onClick={handleSave} className="save-button">
              Save Idea
            </button>
          )}
        </div>

        <div className="ideas-section">
          <h3 className="ideas-header">Your Ideas ({categoryIdeas.length})</h3>
          
          {categoryIdeas.length === 0 ? (
            <div className="empty-ideas">
              <p>No ideas yet</p>
              <p className="empty-ideas-hint">Start capturing your thoughts above!</p>
            </div>
          ) : (
            categoryIdeas.map(idea => (
              <div key={idea.id} className="idea-card">
                <p className="idea-content">{idea.content}</p>
                <div className="idea-footer">
                  <p className="idea-meta">
                    {formatDate(idea.createdAt)} • {idea.inputMethod === 'voice' ? '🎤 Voice' : '⌨️ Text'}
                  </p>
                  <button onClick={() => handleDelete(idea.id)} className="delete-idea-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showToolbar ? (
        <div className="toolbar-expanded">
          <div className="toolbar-grid">
            <button onClick={() => setShowToolbar(false)} className="toolbar-btn toolbar-btn-primary">
              <Edit3 size={20} />
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`toolbar-btn ${isRecording ? 'toolbar-btn-recording' : 'toolbar-btn-voice'}`}
            >
              <Mic size={20} />
            </button>
            <button className="toolbar-btn toolbar-btn-secondary">
              <Circle size={20} />
            </button>
            <button className="toolbar-btn toolbar-btn-secondary">
              <Circle size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowToolbar(true)} className="fab fab-right">
          <Edit3 size={24} />
        </button>
      )}

      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          <span>Recording...</span>
        </div>
      )}
    </div>
  );
}

// ==================== MAIN APP ====================
function App() {
  const app = useApp();

  const renderPage = () => {
    switch (app?.currentPage) {
      case 'home':
        return <HomePage />;
      case 'select':
        return <SelectPage />;
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