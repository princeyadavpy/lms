/**
 * HiGen Labs — VM Detection Module
 * Uses WebGL GPU fingerprinting to detect virtualized environments.
 * Detects: VMware, VirtualBox, Parallels, Microsoft Basic Render, SwiftShader
 *
 * Does NOT block the exam — flags the attempt for admin review only.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Known VM GPU indicators (lowercase) ───────────────────────────
const VM_INDICATORS = [
    'vmware',
    'virtualbox',
    'parallels',
    'microsoft basic render',
    'swiftshader',
    'llvmpipe',           // Mesa software renderer (common in Linux VMs)
    'softpipe',           // Mesa software rasterizer
    'virgl',              // VirtIO GL (QEMU/KVM virtual GPU)
    'google swiftshader', // Chrome's software WebGL fallback
];

// ── WebGL GPU Fingerprinting ───────────────────────────────────────

/**
 * Reads GPU renderer and vendor via the WEBGL_debug_renderer_info extension.
 * @returns {{ renderer: string, vendor: string } | null}
 */
const getWebGLInfo = () => {
    try {
        const canvas = document.createElement('canvas');
        // Prefer webgl2 for broader support, fall back to webgl
        const gl =
            canvas.getContext('webgl2') ||
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');

        if (!gl) return null;

        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (!ext) {
            // Extension unavailable — some hardened browsers disable it
            return { renderer: 'unavailable', vendor: 'unavailable' };
        }

        const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
        const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || '';

        // Dispose canvas to free GPU resources
        const loseCtx = gl.getExtension('WEBGL_lose_context');
        if (loseCtx) loseCtx.loseContext();

        return { renderer, vendor };
    } catch (err) {
        console.warn('[vmDetection] WebGL info extraction failed:', err);
        return null;
    }
};

// ── Core Detection Function ────────────────────────────────────────

/**
 * Detects whether the browser is running inside a virtual machine
 * by inspecting the WebGL renderer and vendor strings.
 *
 * @returns {{
 *   isVirtualMachine: boolean,
 *   renderer: string,
 *   vendor: string,
 *   matchedIndicator: string | null
 * }}
 */
export const detectVirtualMachine = () => {
    const info = getWebGLInfo();

    if (!info) {
        // WebGL entirely unavailable — treat as inconclusive (not a block)
        return {
            isVirtualMachine: false,
            renderer: 'webgl_unavailable',
            vendor: 'webgl_unavailable',
            matchedIndicator: null,
        };
    }

    const { renderer, vendor } = info;
    const rendererLower = renderer.toLowerCase();
    const vendorLower = vendor.toLowerCase();
    const combined = `${rendererLower} ${vendorLower}`;

    const matchedIndicator =
        VM_INDICATORS.find((indicator) => combined.includes(indicator)) || null;

    return {
        isVirtualMachine: matchedIndicator !== null,
        renderer,
        vendor,
        matchedIndicator,
    };
};

// ── Backend Reporting ──────────────────────────────────────────────

/**
 * Reports a VM detection result to the backend proctoring endpoint.
 * Fires-and-forgets — never disrupts the exam flow.
 *
 * @param {object} result - Result from detectVirtualMachine()
 * @param {string} submissionId
 * @param {string} token - JWT auth token
 */
const reportVMDetection = async (result, submissionId, token) => {
    if (!submissionId || !token) return;
    try {
        await fetch(`${API_BASE}/proctoring/vm-detection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                submissionId,
                ...result,
                detectedAt: new Date().toISOString(),
            }),
        });
    } catch (_) {
        /* silent fail — never disrupt the exam */
    }
};

// ── Warning Event Dispatcher ───────────────────────────────────────

/**
 * Fires a custom DOM event so other proctoring modules can react
 * without tight coupling to this module.
 *
 * @param {object} result - Result from detectVirtualMachine()
 */
const dispatchVMWarning = (result) => {
    const event = new CustomEvent('proctoring:vm-detected', {
        detail: result,
        bubbles: true,
        cancelable: false,
    });
    window.dispatchEvent(event);
};

// ── Public Entry Point ─────────────────────────────────────────────

/**
 * Runs VM detection, dispatches a warning event if a VM is found,
 * and reports the result to the backend.
 *
 * This function is NON-BLOCKING — it flags for review, never halts the exam.
 *
 * @param {string} submissionId  - Active submission ID
 * @param {string} token         - JWT auth token
 * @param {object} [options]
 * @param {function} [options.onVMDetected] - Optional callback: (result) => void
 * @returns {Promise<{
 *   isVirtualMachine: boolean,
 *   renderer: string,
 *   vendor: string,
 *   matchedIndicator: string | null
 * }>}
 */
export const runVMDetection = async (submissionId, token, options = {}) => {
    const result = detectVirtualMachine();

    if (result.isVirtualMachine) {
        console.warn(
            `[vmDetection] Virtual machine detected! ` +
            `Renderer: "${result.renderer}" | Vendor: "${result.vendor}" | ` +
            `Matched: "${result.matchedIndicator}"`
        );

        // 1. Dispatch warning event for the exam monitoring system
        dispatchVMWarning(result);

        // 2. Invoke caller-supplied callback (e.g. show an in-app banner)
        options.onVMDetected?.(result);

        // 3. Report to backend (fire-and-forget)
        await reportVMDetection(result, submissionId, token);
    } else {
        console.info(
            '[vmDetection] No VM indicators found.' +
            (result.renderer !== 'webgl_unavailable'
                ? ` Renderer: "${result.renderer}"`
                : ' WebGL unavailable.')
        );
    }

    return result;
};
