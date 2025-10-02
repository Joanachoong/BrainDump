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

  const handleFontSizeChange = (e) => {
    onFormatChange({ ...textFormat, fontSize: parseInt(e.target.value) });
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

      <select
        className="font-size-select"
        value={textFormat.fontSize || 16}
        onChange={handleFontSizeChange}
        title="Font Size"
      >
        <option value="12">12px</option>
        <option value="14">14px</option>
        <option value="16">16px</option>
        <option value="18">18px</option>
        <option value="20">20px</option>
        <option value="24">24px</option>
        <option value="28">28px</option>
        <option value="32">32px</option>
        <option value="36">36px</option>
        <option value="48">48px</option>
        <option value="64">64px</option>
        <option value="72">72px</option>
      </select>
    </div>
  );
}

export default TextPopup;