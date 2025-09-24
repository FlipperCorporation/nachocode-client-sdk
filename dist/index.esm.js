import { jsx } from 'react/jsx-runtime';
import { createContext, useRef, useState, useEffect, useContext } from 'react';

const SCRIPT_ID = 'nachocode-client-sdk';
const SCRIPT_URL = 'https://cdn.nachocode.io/nachocode/client-sdk/';
const SCRIPT_NAME = 'client-sdk.min.js';
const LATEST_VERSION = '1.7.0';

let cachedPromise;
function loadNachocode(apiKey, options, version, onInitialized) {
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
            window.Nachocode.event.on(Nachocode.event.EVENT_TYPES.INIT, onInitialized);
        }
        return initializeNachocode(apiKey, options);
    }
    const script = document.createElement('script');
    script.src = `${SCRIPT_URL}@${version || 'latest'}/${SCRIPT_NAME}?v=${LATEST_VERSION}`;
    script.id = SCRIPT_ID;
    script.async = true;
    document.head.appendChild(script);
    cachedPromise = new Promise((resolve, reject) => {
        script.onload = () => {
            if (window.Nachocode) {
                if (onInitialized) {
                    window.Nachocode.event.on(Nachocode.event.EVENT_TYPES.INIT, onInitialized);
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
            if (window.Nachocode.env.getSDKVersion() < '1.4.2') {
                window.Nachocode.init(apiKey, options);
            }
            else {
                await window.Nachocode.initAsync(apiKey, options);
            }
        }
        return window.Nachocode;
    }
    catch (error) {
        console.error('[Nachocode] An error occurred during SDK initialization.', error);
        throw new Error('[Nachocode] An error occurred during SDK initialization.');
    }
}

const initialContextValue = {
    isLoading: true,
    isError: false,
    error: null,
    Nachocode: null,
};
const NachoContext = createContext(initialContextValue);
function NachoProvider({ apiKey, options, version, onInitialized, children, }) {
    const isMounted = useRef(false);
    const [state, setState] = useState({
        isLoading: true,
        isError: false,
        error: null,
        Nachocode: null,
    });
    useEffect(() => {
        isMounted.current = true;
        if (options?.logger) {
            console.log('[Nachocode] NachoProvider mounted.');
        }
        loadNachocode(apiKey, options, version, onInitialized)
            .then(sdk => {
            if (!isMounted.current)
                return;
            if (options?.logger) {
                console.log('[Nachocode] Nachocode SDK successfully loaded:', sdk);
            }
            setState({
                isLoading: false,
                isError: false,
                error: null,
                Nachocode: sdk,
            });
        })
            .catch(err => {
            if (!isMounted.current)
                return;
            console.error('[Nachocode] Failed to load Nachocode SDK:', err);
            setState({
                isLoading: false,
                isError: true,
                error: err,
                Nachocode: null,
            });
        });
        return () => {
            isMounted.current = false;
        };
    }, [apiKey, version]);
    return (jsx(NachoContext.Provider, { value: state, children: children }));
}
function useNachocodeContext() {
    const context = useContext(NachoContext);
    if (!context) {
        throw new Error('[Nachocode] `useNachocodeContext` must be used within a `<NachoProvider>` component.');
    }
    return context;
}

function useNachocode(apiKey, options, version, onInitialized) {
    const isMounted = useRef(false);
    const [state, setState] = useState({
        isLoading: true,
        isError: false,
        error: null,
        Nachocode: null,
    });
    useEffect(() => {
        isMounted.current = true;
        if (options?.logger) {
            console.log('[Nachocode] NachoProvider mounted.');
        }
        loadNachocode(apiKey, options, version, onInitialized)
            .then((sdk) => {
            if (!isMounted.current)
                return;
            if (options?.logger) {
                console.log('[Nachocode] Nachocode SDK successfully loaded:', sdk);
            }
            setState({
                isLoading: false,
                isError: false,
                error: null,
                Nachocode: sdk,
            });
        })
            .catch((error) => {
            if (!isMounted.current)
                return;
            console.error('[Nachocode] Failed to load Nachocode SDK:', error);
            setState({
                isLoading: false,
                isError: true,
                error,
                Nachocode: null,
            });
        });
        return () => {
            isMounted.current = false;
        };
    }, [apiKey, version]);
    return state;
}

export { NachoProvider, loadNachocode, useNachocode, useNachocodeContext };
//# sourceMappingURL=index.esm.js.map
