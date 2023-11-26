export {};

declare global {
    interface Window {
        _ota: { t?: string, p?: string };
    }
}

window._ota = window._ota || [];
