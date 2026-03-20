import { Attributs } from './types/Attributs.type';

function toBase64Utf8(value: string): string {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary);
}

window.addEventListener('load', async () => {
    const attributes: Attributs = {
        title: document.title,
    };
    if (document.referrer && document.referrer.length > 0) {
        attributes.referer = document.referrer;
    } else {
        attributes.referer = 'direct';
    }

    const _ota = window._ota = window._ota || {};
    const host = (_ota.t) ? _ota.t : document.location.host;
    const path = (_ota.p) ? _ota.p : `/otela/${toBase64Utf8(JSON.stringify(attributes))}`;
    navigator.sendBeacon(`//${host}${path}`);
});

