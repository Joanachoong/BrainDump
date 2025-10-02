import { useState, useEffect, useContext, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { AppContext } from './App';
import Toolbar from './components/Toolbar';
import TextPopup from './components/TextPopup';
import ShapePopup from './components/ShapePopup';
import ZoomControls from './components/ZoomControls';
import './WhiteboardPage.css';

function WhiteboardPage() {
  const { selectedCategory, navigate } = useContext(AppContext);

  // Canvas state
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [tool, setTool] = useState('navigate');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Popup states
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [showShapePopup, setShowShapePopup] = useState(false);

  // Text formatting state
  const [textFormat, setTextFormat] = useState({
    bold: false,
    underline: false,
    italic: false
  });

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [accumulatedTranscript, setAccumulatedTranscript] = useState('');

  const canvasRef = useRef(null);
  const [nextId, setNextId] = useState(1);
  const recognitionRef = useRef(null);
  const isStoppingRef = useRef(false);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

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
          // Accumulate final results instead of creating immediately
          setAccumulatedTranscript(prev => prev + final);
          setInterimTranscript('');
        } else {
          setInterimTranscript(interim);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        // Handle network errors by restarting
        if (event.error === 'network' && isRecording && !isStoppingRef.current) {
          console.log('Network error, restarting recognition...');
          setTimeout(() => {
            if (recognitionRef.current && isRecording) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.error('Failed to restart recognition:', e);
              }
            }
          }, 100);
        } else if (event.error === 'aborted' && isRecording && !isStoppingRef.current) {
          // Restart if aborted unexpectedly
          setTimeout(() => {
            if (recognitionRef.current && isRecording) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.error('Failed to restart recognition:', e);
              }
            }
          }, 100);
        } else {
          setIsRecording(false);
          if (accumulatedTranscript.trim()) {
            createTextElement(accumulatedTranscript.trim());
          }
          setAccumulatedTranscript('');
          setInterimTranscript('');
        }
      };

      recognitionInstance.onend = () => {
        console.log('Recognition ended');

        // Auto-restart if still recording (unless manually stopped)
        if (isRecording && !isStoppingRef.current) {
          console.log('Auto-restarting recognition...');
          setTimeout(() => {
            if (recognitionRef.current && isRecording) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.error('Failed to restart recognition:', e);
              }
            }
          }, 100);
        } else {
          // Only create text element when actually stopping
          setIsRecording(false);
          if (accumulatedTranscript.trim()) {
            createTextElement(accumulatedTranscript.trim());
          }
          setAccumulatedTranscript('');
          setInterimTranscript('');
          isStoppingRef.current = false;
        }
      };

      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
    }
  }, []);

  const createTextElement = (text = 'Enter your Text') => {
    const newElement = {
      id: nextId,
      type: 'text',
      x: 200 + (nextId * 10),
      y: 200 + (nextId * 10),
      width: 300,
      height: 150,
      color: '#FFFFFF',
      text: text,
      zIndex: nextId,
      rotation: 0,
      bold: textFormat.bold,
      underline: textFormat.underline,
      italic: textFormat.italic
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
    setTool('navigate');
  };

  const createShape = (shapeType) => {
    const newElement = {
      id: nextId,
      type: shapeType,
      x: 200 + (nextId * 10),
      y: 200 + (nextId * 10),
      width: 100,
      height: 100,
      color: '#6366F1',
      text: '',
      zIndex: nextId,
      rotation: 0
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
    setShowShapePopup(false);
  };

  const createImageElement = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        const newElement = {
          id: nextId,
          type: 'image',
          x: 200 + (nextId * 10),
          y: 200 + (nextId * 10),
          width: width,
          height: height,
          imageSrc: e.target.result,
          zIndex: nextId,
          rotation: 0
        };
        setElements([...elements, newElement]);
        setNextId(nextId + 1);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const startRecording = () => {
    if (recognition) {
      try {
        isStoppingRef.current = false;
        setAccumulatedTranscript(''); // Reset accumulated transcript
        setInterimTranscript('');
        setIsRecording(true);
        recognition.start();
        console.log('Recording started');
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
      console.log('Stopping recording...');
      isStoppingRef.current = true; // Prevent auto-restart
      recognition.stop();
      // The onend handler will create the text element with accumulated transcript
    }
  };

  const deleteSelectedElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
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

    if (clickedElement) {
      setSelectedElement(clickedElement.id);

      // Check if clicking on resize handle
      const handle = getResizeHandle(clickedElement, x, y);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        setDragStart({ x, y });
      } else {
        setIsDragging(true);
        setDragStart({ x: x - clickedElement.x, y: y - clickedElement.y });
      }
    } else if (tool === 'navigate' || !tool) {
      setSelectedElement(null);
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (tool === 'text') {
      createTextElement();
    }
  };

  const getResizeHandle = (element, x, y) => {
    const handleSize = 10;
    const corners = {
      nw: { x: element.x, y: element.y },
      ne: { x: element.x + element.width, y: element.y },
      sw: { x: element.x, y: element.y + element.height },
      se: { x: element.x + element.width, y: element.y + element.height },
      n: { x: element.x + element.width / 2, y: element.y },
      s: { x: element.x + element.width / 2, y: element.y + element.height },
      w: { x: element.x, y: element.y + element.height / 2 },
      e: { x: element.x + element.width, y: element.y + element.height / 2 }
    };

    for (const [handle, pos] of Object.entries(corners)) {
      if (Math.abs(x - pos.x) < handleSize && Math.abs(y - pos.y) < handleSize) {
        return handle;
      }
    }
    return null;
  };

  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (isDragging && selectedElement) {
      setElements(elements.map(el =>
        el.id === selectedElement
          ? { ...el, x: x - dragStart.x, y: y - dragStart.y }
          : el
      ));
    } else if (isResizing && selectedElement && resizeHandle) {
      setElements(elements.map(el => {
        if (el.id === selectedElement) {
          const dx = x - dragStart.x;
          const dy = y - dragStart.y;

          let newEl = { ...el };

          if (resizeHandle.includes('e')) {
            newEl.width = Math.max(50, el.width + dx);
          }
          if (resizeHandle.includes('w')) {
            newEl.width = Math.max(50, el.width - dx);
            newEl.x = el.x + dx;
          }
          if (resizeHandle.includes('s')) {
            newEl.height = Math.max(50, el.height + dy);
          }
          if (resizeHandle.includes('n')) {
            newEl.height = Math.max(50, el.height - dy);
            newEl.y = el.y + dy;
          }

          return newEl;
        }
        return el;
      }));
      setDragStart({ x, y });
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
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.75 : 1.25;
    setZoom(Math.min(Math.max(zoom * delta, 0.25), 4));
  };

  const updateElementText = (id, text) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, text } : el
    ));
  };

  const renderElement = (element) => {
    const isSelected = selectedElement === element.id;

    let shapeStyle = {
      borderRadius: '4px'
    };

    if (element.type === 'circle') {
      shapeStyle.borderRadius = '50%';
    } else if (element.type === 'triangle') {
      return (
        <div
          key={element.id}
          className={`canvas-element triangle ${isSelected ? 'selected' : ''}`}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            zIndex: element.zIndex
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" fill={element.color} />
          </svg>
          {isSelected && renderResizeHandles()}
        </div>
      );
    } else if (element.type === 'star') {
      return (
        <div
          key={element.id}
          className={`canvas-element star ${isSelected ? 'selected' : ''}`}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            zIndex: element.zIndex
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={element.color} />
          </svg>
          {isSelected && renderResizeHandles()}
        </div>
      );
    } else if (element.type === 'arrow') {
      return (
        <div
          key={element.id}
          className={`canvas-element arrow ${isSelected ? 'selected' : ''}`}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            zIndex: element.zIndex
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M 10 90 L 90 10 M 90 10 L 70 10 M 90 10 L 90 30" stroke={element.color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isSelected && renderResizeHandles()}
        </div>
      );
    }

    const textStyle = {
      fontWeight: element.bold ? 'bold' : 'normal',
      textDecoration: element.underline ? 'underline' : 'none',
      fontStyle: element.italic ? 'italic' : 'normal'
    };

    return (
      <div
        key={element.id}
        className={`canvas-element ${element.type} ${isSelected ? 'selected' : ''}`}
        style={{
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          backgroundColor: element.color,
          zIndex: element.zIndex,
          ...shapeStyle
        }}
      >
        {element.type === 'image' ? (
          <img src={element.imageSrc} alt="" className="element-image" />
        ) : (
          <textarea
            className="element-text"
            value={element.text}
            onChange={(e) => updateElementText(element.id, e.target.value)}
            placeholder="Type here..."
            style={{
              ...textStyle,
              color: element.color === '#FFFFFF' ? '#000' : '#fff'
            }}
          />
        )}
        {isSelected && renderResizeHandles()}
      </div>
    );
  };

  const renderResizeHandles = () => (
    <>
      <div className="resize-handle nw"></div>
      <div className="resize-handle ne"></div>
      <div className="resize-handle sw"></div>
      <div className="resize-handle se"></div>
      <div className="resize-handle n"></div>
      <div className="resize-handle s"></div>
      <div className="resize-handle w"></div>
      <div className="resize-handle e"></div>
    </>
  );

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
        style={{ cursor: tool === 'navigate' ? 'grab' : isPanning ? 'grabbing' : 'default' }}
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
          {elements.map(element => renderElement(element))}
        </div>
      </div>

      {/* Text Formatting Popup */}
      {showTextPopup && (
        <TextPopup textFormat={textFormat} onFormatChange={setTextFormat} />
      )}

      {/* Shape Selection Popup */}
      {showShapePopup && (
        <ShapePopup onShapeSelect={createShape} />
      )}

      {/* Toolbar Component */}
      <Toolbar
        tool={tool}
        setTool={setTool}
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        onImageUpload={createImageElement}
        onDelete={deleteSelectedElement}
        showTextPopup={showTextPopup}
        setShowTextPopup={setShowTextPopup}
        showShapePopup={showShapePopup}
        setShowShapePopup={setShowShapePopup}
      />

      {/* Zoom Controls Component */}
      <ZoomControls zoom={zoom} setZoom={setZoom} />

      {/* Recording Indicator */}
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          <span>
            Recording...
            {(accumulatedTranscript || interimTranscript) &&
              ` "${accumulatedTranscript}${interimTranscript}"`
            }
          </span>
        </div>
      )}
    </div>
  );
}

export default WhiteboardPage;