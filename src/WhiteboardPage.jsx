import { useState, useContext, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppContext } from './App';
import Toolbar from './components/Toolbar';
import TextPopup from './components/TextPopup';
import ShapePopup from './components/ShapePopup';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
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
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState(null);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);
  const [lastTouchCenter, setLastTouchCenter] = useState(null);

  // Popup states
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [showShapePopup, setShowShapePopup] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Text formatting state
  const [textFormat, setTextFormat] = useState({
    bold: false,
    underline: false,
    italic: false,
    fontSize: 16
  });

  const canvasRef = useRef(null);
  const [nextId, setNextId] = useState(1);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Text formatting shortcuts
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setTextFormat(prev => ({ ...prev, bold: !prev.bold }));
        }
        if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          setTextFormat(prev => ({ ...prev, italic: !prev.italic }));
        }
        if (e.key === 'u' || e.key === 'U') {
          e.preventDefault();
          setTextFormat(prev => ({ ...prev, underline: !prev.underline }));
        }
        // Select all
        if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          // Select all elements logic would go here
        }
        // Delete
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          // Duplicate selected element logic would go here
        }
      }

      // Delete selected element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement && !e.target.matches('textarea, input')) {
          e.preventDefault();
          deleteSelectedElement();
        }
      }

      // Deselect all
      if (e.key === 'Escape') {
        if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
        } else {
          setSelectedElement(null);
          setShowTextPopup(false);
          setShowShapePopup(false);
        }
      }

      // Show keyboard shortcuts help
      if (e.key === '?' || (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsHelp(prev => !prev);
      }

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.target.matches('textarea, input')) {
        if (e.key === 'v' || e.key === 'V') {
          setTool('navigate');
        }
        if (e.key === 't' || e.key === 'T') {
          setTool('text');
          setShowTextPopup(true);
        }
        if (e.key === 's' || e.key === 'S') {
          setShowShapePopup(true);
        }
        if (e.key === 'h' || e.key === 'H') {
          setTool('navigate');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, showShortcutsHelp]);

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
      italic: textFormat.italic,
      fontSize: textFormat.fontSize
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
    setTool('navigate');
  };

  const createShape = (shapeType) => {
    if (shapeType === 'arrow') {
      // Enable arrow drawing mode instead of creating default arrow
      setTool('arrow');
      setShowShapePopup(false);
      return;
    }

    const newElement = {
      id: nextId,
      type: shapeType,
      x: 200 + (nextId * 10),
      y: 200 + (nextId * 10),
      width: 500,
      height: 500,
      color: '#6366F1',
      text: '',
      fontSize: 24, // Default font size for shapes
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
        // Calculate 10% of typical canvas size (1920x1080)
        const minCanvasSize = Math.min(window.innerWidth, window.innerHeight);
        const minImageSize = minCanvasSize * 0.1; // 10% of canvas

        let width = img.width;
        let height = img.height;
        const aspectRatio = width / height;

        // Ensure image is at least 10% of canvas size
        if (width < minImageSize && height < minImageSize) {
          if (aspectRatio >= 1) {
            width = minImageSize;
            height = minImageSize / aspectRatio;
          } else {
            height = minImageSize;
            width = minImageSize * aspectRatio;
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
    } else if (tool === 'arrow') {
      setIsDrawingArrow(true);
      setArrowStart({ x, y });
      setSelectedElement(null);
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

  const handleCanvasMouseUp = (e) => {
    if (isDrawingArrow && arrowStart) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      // Calculate arrow dimensions
      const startX = Math.min(arrowStart.x, x);
      const startY = Math.min(arrowStart.y, y);
      const width = Math.abs(x - arrowStart.x);
      const height = Math.abs(y - arrowStart.y);

      // Only create arrow if it has minimum size
      if (width > 10 || height > 10) {
        const newElement = {
          id: nextId,
          type: 'arrow',
          x: startX,
          y: startY,
          width: Math.max(width, 50),
          height: Math.max(height, 50),
          color: '#6366F1',
          text: '',
          zIndex: nextId,
          rotation: 0,
          startPoint: { x: arrowStart.x, y: arrowStart.y },
          endPoint: { x, y }
        };
        setElements([...elements, newElement]);
        setNextId(nextId + 1);
      }

      setIsDrawingArrow(false);
      setArrowStart(null);
      setTool('navigate');
    }

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

  // Trackpad gesture handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      setLastTouchDistance(distance);
      setLastTouchCenter({ x: centerX, y: centerY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistance) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      // Pinch to zoom
      const zoomDelta = distance / lastTouchDistance;
      setZoom(prev => Math.min(Math.max(prev * zoomDelta, 0.25), 4));

      // Two-finger pan
      if (lastTouchCenter) {
        const dx = centerX - lastTouchCenter.x;
        const dy = centerY - lastTouchCenter.y;
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      }

      setLastTouchDistance(distance);
      setLastTouchCenter({ x: centerX, y: centerY });
    }
  };

  const handleTouchEnd = () => {
    setLastTouchDistance(null);
    setLastTouchCenter(null);
  };

  const updateElementText = (id, text) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, text } : el
    ));
  };

  const updateElementFontSize = (id, fontSize) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, fontSize } : el
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
      fontStyle: element.italic ? 'italic' : 'normal',
      fontSize: element.fontSize ? `${element.fontSize}px` : '16px'
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: tool === 'arrow' ? 'crosshair' : tool === 'navigate' ? 'grab' : isPanning ? 'grabbing' : 'default' }}
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
        onImageUpload={createImageElement}
        onDelete={deleteSelectedElement}
        showTextPopup={showTextPopup}
        setShowTextPopup={setShowTextPopup}
        showShapePopup={showShapePopup}
        setShowShapePopup={setShowShapePopup}
      />

      {/* Keyboard Shortcuts Help */}
      {showShortcutsHelp && (
        <KeyboardShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />
      )}
    </div>
  );
}

export default WhiteboardPage;