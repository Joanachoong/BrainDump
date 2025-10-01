import { useState, useEffect, useContext, useRef } from 'react';
import { ArrowLeft, X, Mic, Square, Circle as CircleIcon, Type, Image as ImageIcon, Minus, Plus } from 'lucide-react';
import { AppContext } from './App';
import './WhiteboardPage.css';

function WhiteboardPage() {
  const { selectedCategory, navigate } = useContext(AppContext);

  // Canvas state
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [tool, setTool] = useState('select'); // select, sticky, text, shape, connector
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  const canvasRef = useRef(null);
  const [nextId, setNextId] = useState(1);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (final) {
          // Create sticky note with transcribed text
          createStickyNote(final.trim());
          setInterimTranscript('');
        } else {
          setInterimTranscript(interim);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setInterimTranscript('');
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
        setInterimTranscript('');
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const createStickyNote = (text = 'New Note') => {
    const newElement = {
      id: nextId,
      type: 'sticky',
      x: 100 + (nextId * 20),
      y: 100 + (nextId * 20),
      width: 200,
      height: 200,
      color: '#FFD700',
      text: text,
      zIndex: nextId
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
  };

  const createTextBox = () => {
    const newElement = {
      id: nextId,
      type: 'text',
      x: 100 + (nextId * 20),
      y: 100 + (nextId * 20),
      width: 300,
      height: 150,
      color: '#FFFFFF',
      text: 'Type here...',
      zIndex: nextId
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
  };

  const createShape = (shapeType) => {
    const newElement = {
      id: nextId,
      type: shapeType, // 'rectangle', 'circle'
      x: 100 + (nextId * 20),
      y: 100 + (nextId * 20),
      width: 150,
      height: 150,
      color: '#6366F1',
      text: '',
      zIndex: nextId
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
  };

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
      setInterimTranscript('');
    }
  };

  const handleCanvasMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicking on an element
    const clickedElement = [...elements].reverse().find(el =>
      x >= el.x && x <= el.x + el.width &&
      y >= el.y && y <= el.y + el.height
    );

    if (clickedElement && tool === 'select') {
      setSelectedElement(clickedElement.id);
      setIsDragging(true);
      setDragStart({ x: x - clickedElement.x, y: y - clickedElement.y });
    } else if (tool === 'sticky') {
      createStickyNote();
      setTool('select');
    } else if (tool === 'text') {
      createTextBox();
      setTool('select');
    } else if (tool === 'rectangle') {
      createShape('rectangle');
      setTool('select');
    } else if (tool === 'circle') {
      createShape('circle');
      setTool('select');
    } else {
      setSelectedElement(null);
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      setElements(elements.map(el =>
        el.id === selectedElement
          ? { ...el, x: x - dragStart.x, y: y - dragStart.y }
          : el
      ));
    } else if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(Math.min(Math.max(zoom * delta, 0.1), 3));
  };

  const deleteElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const updateElementText = (id, text) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, text } : el
    ));
  };

  const updateElementColor = (color) => {
    if (selectedElement) {
      setElements(elements.map(el =>
        el.id === selectedElement ? { ...el, color } : el
      ));
    }
  };

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#FFFFFF', '#6366F1'];

  return (
    <div className="freeform-page">
      {/* Header */}
      <div className="freeform-header">
        <button onClick={() => navigate('select')} className="back-button">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <h1 className="freeform-title">{selectedCategory?.name || 'Untitled Board'}</h1>

        <button onClick={() => navigate('select')} className="close-button">
          <X size={20} />
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="freeform-canvas"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="canvas-viewport"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Grid background */}
          <div className="canvas-grid"></div>

          {/* Elements */}
          {elements.map(element => (
            <div
              key={element.id}
              className={`canvas-element ${element.type} ${selectedElement === element.id ? 'selected' : ''}`}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
                backgroundColor: element.color,
                zIndex: element.zIndex,
                borderRadius: element.type === 'circle' ? '50%' : element.type === 'sticky' ? '8px' : '4px'
              }}
            >
              <textarea
                className="element-text"
                value={element.text}
                onChange={(e) => updateElementText(element.id, e.target.value)}
                placeholder={element.type === 'sticky' ? 'Type note...' : 'Type here...'}
                style={{
                  color: element.color === '#FFFFFF' || element.color === '#FFD700' ? '#000' : '#fff'
                }}
              />
              {selectedElement === element.id && (
                <button className="delete-element" onClick={deleteElement}>
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="freeform-toolbar">
        <div className="toolbar-section">
          <button
            className={`toolbar-btn ${tool === 'select' ? 'active' : ''}`}
            onClick={() => setTool('select')}
            title="Select (V)"
          >
            <span>✋</span>
          </button>
          <button
            className={`toolbar-btn ${tool === 'sticky' ? 'active' : ''}`}
            onClick={() => setTool('sticky')}
            title="Sticky Note (S)"
          >
            📝
          </button>
          <button
            className={`toolbar-btn ${tool === 'text' ? 'active' : ''}`}
            onClick={() => setTool('text')}
            title="Text Box (T)"
          >
            <Type size={20} />
          </button>
          <button
            className={`toolbar-btn ${tool === 'rectangle' ? 'active' : ''}`}
            onClick={() => setTool('rectangle')}
            title="Rectangle (R)"
          >
            <Square size={20} />
          </button>
          <button
            className={`toolbar-btn ${tool === 'circle' ? 'active' : ''}`}
            onClick={() => setTool('circle')}
            title="Circle (C)"
          >
            <CircleIcon size={20} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Color Palette */}
        <div className="toolbar-section color-section">
          {colors.map(color => (
            <button
              key={color}
              className="color-btn"
              style={{ backgroundColor: color }}
              onClick={() => updateElementColor(color)}
            />
          ))}
        </div>

        <div className="toolbar-divider"></div>

        {/* Zoom Controls */}
        <div className="toolbar-section">
          <button className="toolbar-btn" onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))}>
            <Minus size={20} />
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button className="toolbar-btn" onClick={() => setZoom(Math.min(zoom + 0.1, 3))}>
            <Plus size={20} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Voice Recording */}
        <div className="toolbar-section">
          <button
            className={`toolbar-btn voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            title="Voice Note (M)"
          >
            <Mic size={20} />
          </button>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          <span>Recording... {interimTranscript && `"${interimTranscript}"`}</span>
        </div>
      )}
    </div>
  );
}

export default WhiteboardPage;