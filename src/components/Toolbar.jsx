import './Toolbar.css';

// Import toolbar icons
import NavigationIcon from '../assets/Toolbar_control/Navigation.png';
import ImageIcon from '../assets/Toolbar_control/Image.png';
import TypeIcon from '../assets/Toolbar_control/Type.png';
import ShapeIcon from '../assets/Toolbar_control/Shape.png';
import TrashIcon from '../assets/Toolbar_control/Trash 7.png';

function Toolbar({
  tool,
  setTool,
  onImageUpload,
  onDelete,
  showTextPopup,
  setShowTextPopup,
  showShapePopup,
  setShowShapePopup
}) {
  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png, .jpg, .jpeg, .gif, .svg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && onImageUpload) {
        onImageUpload(file);
      }
    };
    input.click();
  };

  const handleTextClick = () => {
    setTool('text');
    setShowTextPopup(!showTextPopup);
    setShowShapePopup(false);
  };

  const handleShapeClick = () => {
    setShowShapePopup(!showShapePopup);
    setShowTextPopup(false);
  };

  return (
    <div className="toolbar-container">
      <div className="toolbar-main">
        <button
          className={`toolbar-icon-btn ${tool === 'navigate' ? 'active' : ''}`}
          onClick={() => {
            setTool('navigate');
            setShowTextPopup(false);
            setShowShapePopup(false);
          }}
          title="Navigate"
        >
          <img src={NavigationIcon} alt="Navigate" className="toolbar-icon-48" />
        </button>

        <button
          className="toolbar-icon-btn"
          onClick={handleImageClick}
          title="Image"
        >
          <img src={ImageIcon} alt="Image" className="toolbar-icon-48" />
        </button>

        <button
          className={`toolbar-icon-btn ${tool === 'text' ? 'active' : ''}`}
          onClick={handleTextClick}
          title="Text"
        >
          <img src={TypeIcon} alt="Text" className="toolbar-icon-48" />
        </button>

        <button
          className={`toolbar-icon-btn ${showShapePopup ? 'active' : ''}`}
          onClick={handleShapeClick}
          title="Shape"
        >
          <img src={ShapeIcon} alt="Shape" className="toolbar-icon-48" />
        </button>

        <button
          className="toolbar-icon-btn"
          onClick={onDelete}
          title="Delete"
        >
          <img src={TrashIcon} alt="Delete" className="toolbar-icon-48" />
        </button>
      </div>
    </div>
  );
}

export default Toolbar;