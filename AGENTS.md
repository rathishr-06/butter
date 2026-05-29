# Butter uhh 🪄 — Agent Instructions

## Project Overview

**Butter uhh** is an interactive digital diary web application designed to be a warm, comforting space for personal reflection. It features page-turning animations, voice notes, and ambient particle effects in a single-page vanilla JavaScript application.

**Tone & Philosophy**: Soft, gentle, emotionally-aware design. All interactions should feel safe and unhurried.

## Architecture

### File Structure

- **index.html** — Single-page structure with diary layout, page templates, and voice note cards
- **style.css** — All styling including animations, color variables (--cream, --butter, --pink, etc.), and responsive design
- **script.js** — Page navigation, audio synthesis, voice note playback, and DOM event handling
- **No build process** — Static files served directly; no bundling or compilation needed

### Key Features

- **Closed Diary State**: Cover design with open button
- **Book Navigation**: Previous/next buttons, keyboard arrows, page counter
- **Page System**: Dynamic `.page` articles with `.active` class toggling
- **Voice Notes**: Pre-recorded comfort messages with play buttons (page 4)
- **Magic Button**: Comfort messages (page 5)
- **Ambient Effects**: Canvas particle system, floating butterflies, ambient glows, animations
- **Audio**: Web Audio API for page-turn sounds and synth effects

## Development Patterns

### DOM Structure Conventions

- **Pages**: Each page is an `<article class="page" data-page="N">` with `.active` class when displayed
- **Buttons**: `.primary-button`, `.icon-button`, `.voice-card` for consistent styling
- **Sections**: `.closed-diary` (cover) and `.book-shell` (open diary)

### CSS Architecture

- **CSS Variables**: Color palette in `:root` (--cream, --paper, --pink, --butter, --lavender, --rose, --ink, --shadow)
- **Animations**: `sheen`, `drift`, `floatUp`, `flipping-out` defined at module level
- **Responsive**: Uses `clamp()` for typography, `vw/vmax` for fluid sizing, mobile-first approach
- **Accessibility**: `aria-label`, `aria-hidden` on decorative elements, `aria-live="polite"` on dynamic regions

### JavaScript Patterns

- **Query + Cache**: Elements cached at top (`pages`, `closedDiary`, buttons, etc.)
- **Event Listeners**: Registered on cached elements; uses `addEventListener`
- **State**: `currentPage`, `musicOn`, `trackIndex` as module-level variables
- **Audio Context**: Lazy-initialized via `ensureAudio()` function
- **Timing**: Uses `setTimeout` for animation synchronization (e.g., 260ms for page flip, 720ms for diary open)

## Common Tasks

### Adding New Pages

1. Add new `<article class="page" data-page="N">` to `#diaryBook` in index.html
2. Update `pageTotal.textContent = pages.length` logic if needed
3. Add corresponding styling in style.css for custom page layouts (e.g., `.poem-page`, `.story-layout`)
4. The script automatically detects pages via `querySelectorAll(".page")`

### Modifying Animations

- All animations defined in style.css (keyframes section)
- Update timing in `animation: name duration easing infinite` declarations
- Page flip timing (260ms) in `showPage()` function must match CSS transition times

### Adding Voice Notes

- Add new `<button class="voice-card" data-note="...">` to voice notes section (page 4)
- The `data-note` attribute contains the text to display
- JavaScript automatically handles click listeners

### Styling Customization

- Update CSS variables in `:root` for instant color theme changes
- Use existing `.primary-button`, `.icon-button` classes to maintain consistency
- Ensure all text maintains `var(--ink)` color for accessibility

## Accessibility Standards

- Decorative elements (canvas, glows, butterflies) use `aria-hidden="true"`
- Interactive buttons have descriptive `aria-label` attributes
- Dynamic content region uses `aria-live="polite"` for announcements
- Color palette maintains sufficient contrast for readability
- All buttons are keyboard accessible (including arrow key navigation)

## Development Environment

- **No dependencies** — Pure vanilla JavaScript, HTML, CSS
- **Fonts**: Imported from Google Fonts (Caveat, Cormorant Garamond, Inter)
- **Testing**: Open `index.html` directly in browser or use a local server
- **Browser Requirements**: Modern browser with Web Audio API, ES6 support, CSS Grid/Flexbox

## Tips for Agents

- Always preserve the emotional tone and design philosophy when making changes
- Test page navigation and animations thoroughly after edits
- Remember: timing is critical (animation durations must match setTimeout calls)
- Check that new elements include proper accessibility attributes
- Ensure CSS variable consistency for color and spacing
- When adding interactivity, follow existing event listener patterns
