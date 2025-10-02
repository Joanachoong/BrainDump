# Frontend Setup Tasks

# Frontend Description
- I want do build a **brainstorm web** using the similar feature like IOSapp freeform.
- ***Theme**: the theme of the app is space theme that surround these 5 colors : #021373 , #020F59 , #010B40 , #010626 , #8491D9 , #black 
- **Font**: /Users/joanachoong/visualPython/BrainDump/braindump/src/assets/DatesDetailDemoRegular-nAypR.ttf , -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
- 

- 

## Completed Tasks ✓

---

## 1. HomePage - Landing Page
### Main feature
- there is the get started button with starborder compone , the earth image should have a rotating sphere effect 

### Components
- **StarBorder Component**: Custom animated button wrapper
- **Hero Title**: "MAKE IDEAS INFINITE" - Large bold typography
- **Get Started Button**: Primary CTA with star border animation

### Styling Features (HomePage.css)

**Layout**
- Full height page: `min-height: 100vh`
- Background: Pure black `#000000`
- Flex layout: `flex-direction: column`, `align-items: flex-start`
- Padding: `80px 24px 0`

**Earth Background Image**
- Position: `bottom: -100px`, centered horizontally
- Size: `120%` width, `max-width: 800px`
- Height: `800px`
- Background image: `earth.jpg`
- Z-index: `0` (behind content)

**Title Styling**
- Font family: `'DatesDetail', sans-serif`
- Font size: `5rem`
- Color: White `#FFFFFF`
- Text transform: Uppercase
- Z-index: `1` (in front of Earth)

**Button Styling**
- Background: `#020930` (dark blue)
- Border: `1px solid #020F59`
- Border radius: `30px`
- Padding: `24px 80px`
- Font size: `1.5rem`
- Hover: Background changes to `#020F59`, scales to `1.05`

### File Locations
- JSX: `/Users/joanachoong/visualPython/BrainDump/braindump/src/HomePage.jsx`
- CSS: `/Users/joanachoong/visualPython/BrainDump/braindump/src/HomePage.css`

---

## 2. SelectionPage - Category Selection
### Feature 
1. Once the user click 'get started', system will display the selection page with all the planet theme card displayed in <smooth_flow> , 
2. If user click the planet theme card the system will move on to the white board page with <smooth_flow> . 
3. If the user clicked **delete icon** on the right bottom, the system will prompt a **comfimation page** to double comfirm if user decided to delete the app. 
4. If the user choose to delete the card, it will be removed from the planet theme card
5. If he user select to **add another card**, system will prompt user to **enter a name of the BrainStrom**, once the user added a card, system will **pick a random planet to be displayed** on the card. 

### Components
- **Header Section**: Welcome message with moon background
- **User Avatar Button**: Profile icon
- **Add Button**: Plus icon to create new categories
- **Categories Grid**: Responsive grid of category cards
- **Category Cards**: Planet-themed cards with names
- **Delete Mode**: Toggle to show delete buttons on cards
- **Modals**: New category creation and delete confirmation

### Styling Features (SelectionPage.css)

**Page Layout**
- Background: Pure black `#000000`
- Min height: `100vh`
- Padding bottom: `100px`
- Overflow: Auto scrolling

**Moon Header Positioning**
- Added `z-index: 0` to `.select-header::before` (moon element)
- Position: `top: -150px`, `right: 50px`
- Size: `width: 300px`, `height: 250px`
- Background size: `800px 200px`
- Opacity: `0.7`

**Text Layering**
- Added `position: relative` and `z-index: 1` to `.select-welcome`
- Added `position: relative` and `z-index: 1` to `.select-subtitle`
- This ensures the welcome text appears in front of the moon

**Welcome Text**
- Font size: `3rem`
- Color: `rgba(255, 255, 255, 0.7)`
- Text shadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`

**Planet Image Positioning**
- Position: `top: -60px`, horizontally centered with `left: 50%` and `transform: translateX(-50%)`
- Size: `width: 140px`, `height: 140px`
- Planet image appears at the top center of each card, partially extending above the card
- Drop shadow filter applied for depth

**Category Name**
- Text align: `center`
- Position: Bottom center of card (`bottom: 24px`, `left: 50%`, `transform: translateX(-50%)`)
- Font size: `1.125rem`
- Width: `90%` of card width

**Card Layout**
- Aspect ratio: `1.3` (slightly wider than square)
- Background: `rgba(44, 44, 44, 0.7)`
- Border radius: `20px`
- Padding: `16px`
- Planet images positioned at top center, extending above card
- Category names centered at bottom

**Responsive Grid**
- 2 columns (mobile default)
- 3 columns (tablet, min-width: 768px)
- 4 columns (desktop, min-width: 1024px)
- Gap: `16px` between cards
- Page background: Pure black `#000000`

- Position: `top: -30px`, `left: -30px` (previously `right: -30px`)
- Size: `width: 110px`, `height: 110px`
- Drop shadow filter applied
- Images positioned to be visible outside the card boundaries in a full circular form located at the top left

**Category Grid**
- Responsive: 2 columns (mobile), 3 columns (tablet), 4 columns (desktop)
- Gap: `16px`
- Padding: `0 24px`

**Category Cards**
- Aspect ratio: `1:1` (square)
- Border radius: `20px`
- Background: `rgba(44, 44, 44, 0.7)`
- Hover: Scale `1.05`, shadow increases
- Planet images positioned top-left, partially outside card

**Buttons**
- User avatar: Top right, `55px × 58px`, background `#2C2C2C`
- Add button: Top right, `70px × 70px`, background `#020930`
- Delete buttons: Top-right of cards, circular, `53px × 53px`

**Visual Hierarchy**
- **Background (lowest)**: Black background (`#000000`)
- **Middle layer**: Moon header image (`z-index: 0`)
- **Front layer (highest)**: Welcome text and subtitle (`z-index: 1`)

### File Locations
- JSX: `/Users/joanachoong/visualPython/BrainDump/braindump/src/SelectionPage.jsx`
- CSS: `/Users/joanachoong/visualPython/BrainDump/braindump/src/SelectionPage.css`

---

## 3. WhiteboardPage - Idea Capture

Build a collaborative brainstorming canvas app inspired by Apple Freeform:

CANVAS SYSTEM:
- Infinite 2D workspace with pan (drag background) and zoom (scroll/pinch)
- Grid background (subtle, optional)
- Coordinate system for positioning elements

ELEMENT TYPES:
1. Sticky Notes - colored rectangles with editable text
2. Text Boxes - for longer content
3. Shapes - circles, rectangles, rounded boxes
4. Images - upload and place images on canvas
5. Connectors - lines/arrows between elements

INTERACTIONS:
- Click element to select (show resize handles, delete button)
- Drag to move selected elements
- Double-click to edit text inline
- Right-click for context menu (color, duplicate, delete, bring to front/back)
- Shift+click for multi-select
- Draw connections by clicking and dragging from one element to another

TOOLBAR:
- Add new elements (sticky note, text, shapes, image upload)
- Color palette
- Connector tool
- Zoom controls (+/- buttons, fit to screen)
- Undo/redo
- Export/save button

DATA STRUCTURE:
- Each element should have: id, type, x, y, width, height, color, text, z-index
- Connections: id, fromElementId, toElementId, line style

Use React hooks for state, implement smooth drag interactions, and make it look modern with Tailwind CSS.

### Components
- **Header**: Back button, category title, close button
- **Input Section**: Textarea for typing ideas + Save button
- **Ideas Display**: Unlimited expandable white board like the universe
- **Toolbar**: Floating expandable toolbar with tools, close with smooth transtion when the user click on the 2nd right icon 
- **Voice Recording**: Speech-to-text functionality, with text shown while recording
- **Recording Indicator**: Visual feedback during voice recording,with summary feature provided using claude API

### Styling Features (WhiteboardPage.css)

**Page Layout**
- Background: Gradient `#0B0D21` → `#1A1B3D` → `#0B0D21`
- Animation: `galaxyShift` 20s infinite (subtle background movement)
- Min height: `100vh`

**Star Field Background**
- Multiple radial gradients creating star effect
- 6 different star positions with varying sizes
- Opacity: `0.5`
- Background size: `200% 200%`
- Pointer events: None (non-interactive)

**Header**
- Sticky positioning: `top: 0`
- Background: `rgba(11, 13, 33, 0.8)` with `backdrop-filter: blur(10px)`
- Padding: `16px 24px`
- Z-index: `30`
- Contains: Back button, Title, Close button

**Content Area**
- Scrollable: `overflow-y: auto`
- Padding: `24px`
- Grows infinitely with content

**Textarea**
- Height: `192px`
- Border: `2px solid rgba(99, 102, 241, 0.3)`
- Background: `rgba(30, 41, 59, 0.5)` with blur
- Focus state: Border changes to `#818CF8`
- Font size: `1.125rem`

**Save Button**
- Gradient background: `#6366F1` → `#8B5CF6`
- Shadow: `0 4px 15px rgba(99, 102, 241, 0.4)`
- Hover: Lifts up with `translateY(-2px)`

**Idea Cards**
- Background: `rgba(30, 41, 59, 0.5)` with blur
- Border: `1px solid rgba(99, 102, 241, 0.2)`
- Border radius: `12px`
- Hover: Shadow increases, border brightens, lifts up
- Delete button: Appears on hover

**Toolbar**
- Position: `fixed`, `bottom: 32px`, `right: 32px`
- 2×2 grid of circular buttons
- Background: `rgba(30, 41, 59, 0.8)` with blur
- Border radius: `24px`
- Buttons: `56px × 56px` circular
- Primary (Edit): Gradient `#6366F1` → `#8B5CF6`
- Voice: `rgba(99, 102, 241, 0.3)`
- Recording state: Red `#EF4444` with pulse animation

**Recording Indicator**
- Position: Fixed at top center
- Background: `rgba(239, 68, 68, 0.9)`
- Pulsing dot animation
- Z-index: `45`

**Animations**
- `galaxyShift`: Background gradient position shift
- `pulse`: Opacity pulse for recording states

### Features
- **Voice Input**: Web Speech API integration
- **Auto-save**: Ideas saved with timestamp and input method
- **Time Display**: Relative timestamps (e.g., "5m ago", "2h ago")
- **Delete Confirmation**: Modal popup before deletion
- **Infinite Scroll**: Content area grows with unlimited ideas

VOICE RECORDING FEATURE 
Create a React brainstorming canvas app similar to Apple's Freeform with an additional VOICE RECORDING feature:

CORE FEATURES:
1. Infinite canvas with pan and zoom
2. Draggable sticky notes/cards
3. Text boxes, shapes, and images
4. Connect items with lines/arrows
5. Multiple colors for organizing

VOICE RECORDING FEATURE (NEW):
- Floating microphone button on the canvas
- Click to start/stop recording audio
- Visual indicator while recording (pulsing animation, timer)
- Automatic speech-to-text transcription
- Transcribed text automatically creates a new sticky note on the canvas
- Option to save audio clips attached to notes
- Show recording status (recording, processing, complete)

TRANSCRIPTION IMPLEMENTATION:
- Use Web Speech API (browser's built-in speech recognition)
- Real-time transcription display while speaking
- Auto-create sticky note with transcribed text when recording stops
- Place new note near the recording button or at canvas center
- Handle multiple languages (optional language selector)

UI FOR VOICE FEATURE:
- Microphone icon button (red when recording)
- Recording timer display
- Transcription preview panel (shows text as you speak)
- "Add to Canvas" button after transcription completes
- Error handling if browser doesn't support speech recognition

TECHNICAL REQUIREMENTS:
- Implement Web Speech API (SpeechRecognition) using claude API model
- MediaRecorder API for audio capture
- Smooth animations for recording state
- Handle permissions for microphone access

Make the voice feature seamlessly integrated - users should be able to quickly capture ideas by voice and have them appear as organized notes on their canvas.

### File Locations
- JSX: `/Users/joanachoong/visualPython/BrainDump/braindump/src/WhiteboardPage.jsx`
- CSS: `/Users/joanachoong/visualPython/BrainDump/braindump/src/WhiteboardPage.css`

---

## Design System

### Color Palette
- **Black**: `#000000` (HomePage, SelectionPage backgrounds)
- **Dark Blues**: `#0B0D21`, `#1A1B3D`, `#020930`, `#020F59` (WhiteboardPage)
- **Grays**: `#2C2C2C`, `rgba(44, 44, 44, 0.7)` (Cards, buttons)
- **Purple/Indigo**: `#6366F1`, `#8B5CF6`, `#818CF8` (Primary actions)
- **White/Light**: `#FFFFFF`, `#F5F5F5`, `rgba(255, 255, 255, 0.7)` (Text)
- **Red**: `#EF4444` (Recording, delete actions)

### Typography
- **HomePage Title**: 5rem, DatesDetail font, uppercase
- **SelectionPage Headers**: 3rem, bold
- **WhiteboardPage Title**: 1.125rem, semibold
- **Body Text**: 1rem - 1.125rem

### Spacing
- **Padding**: 24px standard page padding
- **Gaps**: 12px-16px for grids
- **Margins**: 40px-80px for major sections

### Effects
- **Shadows**: Layered box-shadows with purple/indigo tints
- **Blur**: `backdrop-filter: blur(10px-20px)` for glassmorphism
- **Transitions**: 0.2s-0.3s for smooth interactions
- **Hover States**: Scale 1.05, shadow increases, slight translation

### Responsive Breakpoints
- Mobile: Default (2 columns)
- Tablet: `768px` (3 columns)
- Desktop: `1024px` (4 columns)

---

## Notes
- All pages maintain consistent space-themed design aesthetic
- Planet/celestial images positioned strategically for visual interest
- Z-index layering ensures proper visual hierarchy
- Animations are subtle and performant
- Accessibility considerations with proper contrast ratios
- Mobile-first responsive design approach


