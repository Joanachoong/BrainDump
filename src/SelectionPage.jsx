import { useState, useContext } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { AppContext } from './App';
import './SelectionPage.css';

// Import planet images
import marsImg from './assets/mars.png';
import jupiterImg from './assets/jupiter.png';
import venusImg from './assets/venus.png';
import moonImg from './assets/moon.jpg';
import saturnImg from './assets/saturn.png';
import uranusImg from './assets/uranus.png';
import neptuneImg from './assets/neptune.png';
import earthImg from './assets/earth.png';

// Planet images array
const planetImages = [
  marsImg,
  jupiterImg,
  venusImg,
  saturnImg,
  uranusImg,
  neptuneImg,
  earthImg
];

// Category Card Component
function CategoryCard({ category, onClick, planetIndex }) {
  return (
    <button
      onClick={onClick}
      className="category-card"
    >
      <img
        src={planetImages[planetIndex % planetImages.length]}
        alt={category.name}
        className="planet-image"
      />
      <span className="category-name">{category.name}</span>
    </button>
  );
}

function SelectionPage() {
  const { categories, navigate, addCategory, deleteCategory } = useContext(AppContext);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const colors = ['#2C2C2C'];
      const randomColor = colors;
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
        <h1 className="select-welcome">Welcome , username</h1>
        <button className="user-avatar-button">
          {/* ← ADJUST USER ICON SIZE HERE */}
          <User size={20} />
        </button>
        <button onClick={() => setShowNewCategory(true)} className="add-button">
          {/* ← ADJUST ADD (+) ICON SIZE HERE */}
          <Plus size={30} />
        </button>
        <h2 className="select-subtitle">Pick your planet</h2>
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={category.id} className="category-item">
            <CategoryCard
              category={category}
              onClick={() => navigate('whiteboard', category)}
              planetIndex={index}
            />
            {editMode && (
              <button
                onClick={() => setDeleteConfirm(category)}
                className="delete-category-btn"
              >
                {/* ← ADJUST DELETE ICON SIZE HERE */}
                <Trash2 size={20} />
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

      <button
        onClick={() => setEditMode(!editMode)}
        className="fab fab-right"
        style={{ backgroundColor: editMode ? '#EF4444' : '#2C2C2C' }}
      >
        {/* ← ADJUST FAB (TRASH/CLOSE) ICON SIZE HERE */}
        {editMode ? <Plus size={15} /> : <Trash2 size={24} />}
      </button>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDeleteConfirm(null)} className="delete-confirm-close">
              <X size={28} strokeWidth={2.5} />
            </button>
            <div className="delete-confirm-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="delete-confirm-text">Delete "{deleteConfirm.name}"?</p>
            <button
              onClick={() => {
                deleteCategory(deleteConfirm.id);
                setDeleteConfirm(null);
              }}
              className="delete-confirm-btn"
            >
              Yes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectionPage;
