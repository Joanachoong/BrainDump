import './TextPopup.css';

// Import text formatting icons
import BoldIcon from '../assets/Toolbar_control/Bold.png';
import UnderlineIcon from '../assets/Toolbar_control/Underline.png';
import ItalicIcon from '../assets/Toolbar_control/Italic.png';

function TextPopup({ onFormatChange, textFormat }) {
  const toggleBold = () => {
    onFormatChange({ ...textFormat, bold: !textFormat.bold });
  };

  const toggleUnderline = () => {
    onFormatChange({ ...textFormat, underline: !textFormat.underline });
  };

  const toggleItalic = () => {
    onFormatChange({ ...textFormat, italic: !textFormat.italic });
  };

  return (
    <div className="text-popup">
      <button
        className={`text-format-btn ${textFormat.bold ? 'active' : ''}`}
        onClick={toggleBold}
        title="Bold"
      >
        <img src={BoldIcon} alt="Bold" className="text-icon-48" />
      </button>

      <button
        className={`text-format-btn ${textFormat.underline ? 'active' : ''}`}
        onClick={toggleUnderline}
        title="Underline"
      >
        <img src={UnderlineIcon} alt="Underline" className="text-icon-48" />
      </button>

      <button
        className={`text-format-btn ${textFormat.italic ? 'active' : ''}`}
        onClick={toggleItalic}
        title="Italic"
      >
        <img src={ItalicIcon} alt="Italic" className="text-icon-48" />
      </button>
    </div>
  );
}

export default TextPopup;