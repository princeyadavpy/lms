/**
 * HiGen Labs — L1 Proctoring Module
 * Detects: tab switches, fullscreen exits, copy/paste attempts, right-click, DevTools
 * Reports events to backend via PATCH /api/submissions/:id/proctor-event
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let _submissionId = null;
let _token = null;
let _callbacks = {};
let _listeners = [];
let _devToolsInterval = null;
let _tabSwitchCount = 0;

// Send event to backend (non-blocking)
const reportEvent = async (event, detail = '') => {
    if (!_submissionId || !_token) return;
    try {
        await fetch(`${API_BASE}/submissions/${_submissionId}/proctor-event`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_token}` },
            body: JSON.stringify({ event, detail })
        });
    } catch (_) { /* silent fail — don't disrupt exam */ }
};

// ── Event Handlers ────────────────────────────────────────────────

const onVisibilityChange = () => {
    if (document.hidden) {
        _tabSwitchCount++;
        reportEvent('TAB_SWITCH', `Switch #${_tabSwitchCount}`);
        _callbacks.onTabSwitch?.(_tabSwitchCount);
    }
};

const onFullscreenChange = () => {
    const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
    );
    if (!isFullscreen) {
        reportEvent('FULLSCREEN_EXIT', 'User exited fullscreen');
        _callbacks.onFullscreenExit?.();
    }
};

const onCopy = (e) => {
    e.preventDefault();
    reportEvent('COPY_ATTEMPT', 'Ctrl+C / copy');
    _callbacks.onCopyAttempt?.();
};

const onCut = (e) => {
    e.preventDefault();
    reportEvent('COPY_ATTEMPT', 'Ctrl+X / cut');
};

const onPaste = (e) => {
    e.preventDefault();
    reportEvent('PASTE_ATTEMPT', 'Ctrl+V / paste');
    _callbacks.onPasteAttempt?.();
};

const onContextMenu = (e) => {
    e.preventDefault(); // Block right-click
};

const onKeyDown = (e) => {
    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (DevTools shortcuts)
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
    ) {
        e.preventDefault();
        reportEvent('DEVTOOLS', `KeyCombo: ${e.key}`);
        _callbacks.onDevTools?.();
    }
    // Block PrintScreen
    if (e.key === 'PrintScreen') {
        e.preventDefault();
    }
};

// DevTools size-based detection (runs every 2s)
let _devToolsLastW = window.outerWidth;
let _devToolsLastH = window.outerHeight;
const detectDevToolsBySize = () => {
    const widthThreshold = 160;
    const heightThreshold = 160;
    const wDiff = Math.abs(window.outerWidth - window.innerWidth);
    const hDiff = Math.abs(window.outerHeight - window.innerHeight);
    if (wDiff > widthThreshold || hDiff > heightThreshold) {
        reportEvent('DEVTOOLS', `Size diff: w=${wDiff} h=${hDiff}`);
        _callbacks.onDevTools?.();
    }
};

// ── Public API ────────────────────────────────────────────────────

/**
 * Start proctoring session
 * @param {string} submissionId
 * @param {string} token - JWT token
 * @param {Object} callbacks - { onTabSwitch, onFullscreenExit, onCopyAttempt, onPasteAttempt, onDevTools }
 */
export const startProctoring = (submissionId, token, callbacks = {}) => {
    _submissionId = submissionId;
    _token = token;
    _callbacks = callbacks;
    _tabSwitchCount = 0;

    // Attach listeners
    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('copy', onCopy);
    document.addEventListener('cut', onCut);
    document.addEventListener('paste', onPaste);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);

    // DevTools size detection
    _devToolsInterval = setInterval(detectDevToolsBySize, 2000);
};

/**
 * Request browser fullscreen
 */
export const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
};

/**
 * Stop proctoring and clean up
 */
export const stopProctoring = () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    document.removeEventListener('copy', onCopy);
    document.removeEventListener('cut', onCut);
    document.removeEventListener('paste', onPaste);
    document.removeEventListener('contextmenu', onContextMenu);
    document.removeEventListener('keydown', onKeyDown);
    if (_devToolsInterval) clearInterval(_devToolsInterval);

    _submissionId = null;
    _token = null;
    _callbacks = {};
};

export const getTabSwitchCount = () => _tabSwitchCount;
