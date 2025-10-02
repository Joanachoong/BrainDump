import './ShapePopup.css';

// Import shape icons
import StarIcon from '../assets/Toolbar_control/Star.png';
import CircleIcon from '../assets/Toolbar_control/Circle.png';
import TriangleIcon from '../assets/Toolbar_control/Triangle.png';
import SquareIcon from '../assets/Toolbar_control/Square-7.png';
import ArrowIcon from '../assets/Toolbar_control/Arrow up-right.png';

function ShapePopup({ onShapeSelect }) {
  const handleShapeClick = (shapeType) => {
    onShapeSelect(shapeType);
  };

  return (
    <div className="shape-popup">
      <button
        className="shape-btn"
        onClick={() => handleShapeClick('star')}
        title="Star"
      >
        <img src={StarIcon} alt="Star" className="shape-icon-48" />
      </button>

      <button
        className="shape-btn"
        onClick={() => handleShapeClick('circle')}
        title="Circle"
      >
        <img src={CircleIcon} alt="Circle" className="shape-icon-48" />
      </button>

      <button
        className="shape-btn"
        onClick={() => handleShapeClick('triangle')}
        title="Triangle"
      >
        <img src={TriangleIcon} alt="Triangle" className="shape-icon-48" />
      </button>

      <button
        className="shape-btn"
        onClick={() => handleShapeClick('square')}
        title="Square"
      >
        <img src={SquareIcon} alt="Square" className="shape-icon-48" />
      </button>

      <button
        className="shape-btn"
        onClick={() => handleShapeClick('arrow')}
        title="Arrow"
      >
        <img src={ArrowIcon} alt="Arrow" className="shape-icon-48" />
      </button>
    </div>
  );
}

export default ShapePopup;