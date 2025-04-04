import { jsx } from 'react/jsx-runtime';
import { createContext, useState, useEffect, useContext } from 'react';

const SCRIPT_ID = 'nachocode-client-sdk';
const SCRIPT_URL = 'https://cdn.nachocode.io/nachocode/client-sdk/';
const SCRIPT_NAME = 'client-sdk.min.js';

let cachedPromise;
function loadNachocode(apiKey, options = {}, version, onInitialized) {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('[Nachocode] This SDK cannot be run in a server-side environment.'));
    }
    if (!apiKey) {
        return Promise.reject(new Error('[Nachocode] apiKey is required but was not provided.'));
    }
    if (cachedPromise) {
        return cachedPromise;
    }
    if (window.Nachocode) {
        if (onInitialized) {
            window.Nachocode.event.on(Nachocode.event.EventType.INIT, onInitialized);
        }
        return initializeNachocode(apiKey, options);
    }
    const script = document.createElement('script');
    script.src = `${SCRIPT_URL}@${version || 'latest'}/${SCRIPT_NAME}`;
    script.id = SCRIPT_ID;
    script.async = true;
    document.head.appendChild(script);
    cachedPromise = new Promise((resolve, reject) => {
        script.onload = () => {
            if (window.Nachocode) {
                if (onInitialized) {
                    window.Nachocode.event.on(Nachocode.event.EventType.INIT, onInitialized);
                }
                initializeNachocode(apiKey, options).then(resolve).catch(reject);
            }
            else {
                reject(new Error('[Nachocode] Failed to initialize Nachocode SDK instance.'));
            }
        };
        script.onerror = () => reject(new Error('[Nachocode] An error occurred while loading the SDK.'));
    });
    return cachedPromise;
}
async function initializeNachocode(apiKey, options) {
    if (!window.Nachocode || !window.Nachocode.env) {
        throw new Error('[Nachocode] SDK is not available on the window object.');
    }
    try {
        if (!window.Nachocode.env.isInitialized()) {
            await window.Nachocode.initAsync(apiKey, options);
        }
        return window.Nachocode;
    }
    catch (error) {
        console.error('[Nachocode] An error occurred during SDK initialization.', error);
        throw new Error('[Nachocode] An error occurred during SDK initialization.');
    }
}

const NachoContext = createContext(undefined);
function NachoProvider({ apiKey, options, version, onInitialized, children, }) {
    const [nachocode, setNachocode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (options?.logger) {
            console.log('[Nachocode] NachoProvider mounted.');
        }
        loadNachocode(apiKey, options, version, onInitialized)
            .then(sdk => {
            if (options?.logger) {
                console.log('[Nachocode] Nachocode SDK successfully loaded:', sdk);
            }
            setNachocode(sdk);
        })
            .catch(err => {
            console.error('[Nachocode] Failed to load Nachocode SDK:', err);
            setError(err);
        })
            .finally(() => setLoading(false));
    }, [apiKey, options, version, onInitialized]);
    return (jsx(NachoContext.Provider, { value: { Nachocode: nachocode, loading, error }, children: children }));
}
function useNachocode() {
    const context = useContext(NachoContext);
    if (!context) {
        throw new Error('[Nachocode] `useNachocode` must be used within a `<NachoProvider>` component.');
    }
    return context;
}

export { NachoProvider, loadNachocode, useNachocode };
//# sourceMappingURL=index.esm.js.map
