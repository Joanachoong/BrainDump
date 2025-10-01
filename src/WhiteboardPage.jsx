import { useState, useEffect, useContext } from 'react';
import { ArrowLeft, X, Mic, Edit3, Circle } from 'lucide-react';
import { AppContext } from './App';
import './WhiteboardPage.css';

function WhiteboardPage() {
  const { selectedCategory, navigate, addIdea, getIdeasForCategory, deleteIdea, showToolbar, setShowToolbar } = useContext(AppContext);
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

export default WhiteboardPage;
