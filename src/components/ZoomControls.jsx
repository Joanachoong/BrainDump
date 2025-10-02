import { useState } from 'react';
import './ZoomControls.css';

function ZoomControls({ zoom, setZoom }) {
  const [zoomInActive, setZoomInActive] = useState(false);
  const [zoomOutActive, setZoomOutActive] = useState(false);

  const handleZoomIn = () => {
    if (zoom < 4) {
      setZoomInActive(true);
      setZoom(Math.min(zoom * 1.25, 4));
      setTimeout(() => setZoomInActive(false), 400);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.25) {
      setZoomOutActive(true);
      setZoom(Math.max(zoom * 0.75, 0.25));
      setTimeout(() => setZoomOutActive(false), 400);
    }
  };

  return (
    <div className="zoom-controls-container">
      <button
        className={`zoom-control-btn zoom-in ${zoom >= 4 ? 'disabled' : ''} ${zoomInActive ? 'active' : ''}`}
        onClick={handleZoomIn}
        disabled={zoom >= 4}
        title="Zoom In (25%)"
      >
        <div className="zoom-icon-plus">
          <div className="plus-horizontal"></div>
          <div className="plus-vertical"></div>
        </div>
      </button>
      <button
        className={`zoom-control-btn zoom-out ${zoom <= 0.25 ? 'disabled' : ''} ${zoomOutActive ? 'active' : ''}`}
        onClick={handleZoomOut}
        disabled={zoom <= 0.25}
        title="Zoom Out (25%)"
      >
        <div className="zoom-icon-minus">
          <div className="minus-horizontal"></div>
        </div>
      </button>
    </div>
  );
}

export default ZoomControls;