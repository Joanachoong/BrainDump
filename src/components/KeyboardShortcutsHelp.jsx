import './KeyboardShortcutsHelp.css';

function KeyboardShortcutsHelp({ onClose }) {
  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>Keyboard Shortcuts</h2>
          <button onClick={onClose} className="shortcuts-close">×</button>
        </div>

        <div className="shortcuts-content">
          <div className="shortcuts-section">
            <h3>Text Formatting</h3>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>
              <span className="shortcut-desc">Bold</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>I</kbd></span>
              <span className="shortcut-desc">Italic</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>U</kbd></span>
              <span className="shortcut-desc">Underline</span>
            </div>
          </div>

          <div className="shortcuts-section">
            <h3>Canvas Navigation</h3>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Space</kbd> + Drag</span>
              <span className="shortcut-desc">Pan canvas</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Ctrl</kbd> + Scroll</span>
              <span className="shortcut-desc">Zoom in/out</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>0</kbd></span>
              <span className="shortcut-desc">Reset zoom</span>
            </div>
          </div>

          <div className="shortcuts-section">
            <h3>Element Management</h3>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Delete</kbd></span>
              <span className="shortcut-desc">Delete selected</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>D</kbd></span>
              <span className="shortcut-desc">Duplicate</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>A</kbd></span>
              <span className="shortcut-desc">Select all</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Esc</kbd></span>
              <span className="shortcut-desc">Deselect all</span>
            </div>
          </div>

          <div className="shortcuts-section">
            <h3>Tools</h3>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>V</kbd></span>
              <span className="shortcut-desc">Select/Navigate</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>T</kbd></span>
              <span className="shortcut-desc">Text tool</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>S</kbd></span>
              <span className="shortcut-desc">Shape tool</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>H</kbd></span>
              <span className="shortcut-desc">Hand/Pan tool</span>
            </div>
          </div>

          <div className="shortcuts-section">
            <h3>Trackpad Gestures</h3>
            <div className="shortcut-item">
              <span className="shortcut-keys">Two-finger drag</span>
              <span className="shortcut-desc">Pan canvas</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys">Pinch in/out</span>
              <span className="shortcut-desc">Zoom</span>
            </div>
          </div>
        </div>

        <div className="shortcuts-footer">
          <p>Press <kbd>Esc</kbd> or <kbd>?</kbd> to close this help</p>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;
