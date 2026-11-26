'use strict';

var react = require('react');

const SCRIPT_ID = 'nachocode-client-sdk';
const SCRIPT_LOADING_ATTRIBUTE = 'data-nachocode-loading';
const SCRIPT_URL = 'https://cdn.nachocode.io/nachocode/client-sdk/';
const SCRIPT_NAME = 'client-sdk.min.js';
const LATEST_VERSION = '1.11.4';
const INIT_EVENT = 'init';

let cachedPromise;
function loadNachocode(apiKey, options, version, onInitialized) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return Promise.reject(new Error('[Nachocode] This SDK cannot be run in a server-side environment.'));
    }
    if (!apiKey) {
        return Promise.reject(new Error('[Nachocode] apiKey is required but was not provided.'));
    }
    if (cachedPromise) {
        return cachedPromise;
    }
    const promise = loadScript(version).then(() => initializeNachocode(apiKey, options, onInitialized));
    cachedPromise = promise;
    promise.catch(() => {
        if (cachedPromise === promise) {
            cachedPromise = undefined;
        }
    });
    return promise;
}
function getScriptUrl(version) {
    const target = encodeURIComponent(version || 'latest');
    return `${SCRIPT_URL}@${target}/${SCRIPT_NAME}?v=${LATEST_VERSION}`;
}
function loadScript(version) {
    if (window.Nachocode) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const existingScript = document.getElementById(SCRIPT_ID);
        const isReusable = existingScript instanceof HTMLScriptElement &&
            existingScript.hasAttribute(SCRIPT_LOADING_ATTRIBUTE);
        const script = isReusable
            ? existingScript
            : document.createElement('script');
        const settle = (error) => {
            var _a;
            script.removeEventListener('load', onLoad);
            script.removeEventListener('error', onError);
            script.removeAttribute(SCRIPT_LOADING_ATTRIBUTE);
            if (error) {
                (_a = script.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(script);
                reject(error);
            }
            else {
                resolve();
            }
        };
        const onLoad = () => settle(window.Nachocode
            ? undefined
            :
                new Error('[Nachocode] Failed to initialize Nachocode SDK instance.'));
        const onError = () => settle(new Error('[Nachocode] An error occurred while loading the SDK.'));
        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);
        if (!isReusable) {
            script.id = SCRIPT_ID;
            script.src = getScriptUrl(version);
            script.async = true;
            script.setAttribute(SCRIPT_LOADING_ATTRIBUTE, '');
            (document.head || document.documentElement).appendChild(script);
        }
    });
}
async function initializeNachocode(apiKey, options, onInitialized) {
    var _a;
    const sdk = window.Nachocode;
    if (!sdk || !sdk.env) {
        throw new Error('[Nachocode] SDK is not available on the window object.');
    }
    try {
        if (onInitialized && typeof ((_a = sdk.event) === null || _a === void 0 ? void 0 : _a.on) === 'function') {
            sdk.event.on(INIT_EVENT, onInitialized);
        }
        if (!sdk.env.isInitialized()) {
            if (typeof sdk.initAsync === 'function') {
                await sdk.initAsync(apiKey, options);
            }
            else {
                sdk.init(apiKey, options);
            }
        }
        return sdk;
    }
    catch (error) {
        console.error('[Nachocode] An error occurred during SDK initialization.', error);
        throw new Error('[Nachocode] An error occurred during SDK initialization.', { cause: error });
    }
}

const LOADING_STATE = {
    isLoading: true,
    isError: false,
    error: null,
    Nachocode: null,
};
function assertHooksSupported(caller) {
    if (typeof react.useState !== 'function') {
        throw new Error(`[Nachocode] \`${caller}\` requires React 16.8 or later. Use \`loadNachocode\` instead.`);
    }
}
function useNachocodeLoader(caller, apiKey, options, version, onInitialized) {
    assertHooksSupported(caller);
    const [state, setState] = react.useState(LOADING_STATE);
    react.useEffect(() => {
        let isActive = true;
        if (options === null || options === void 0 ? void 0 : options.logger) {
            console.log(`[Nachocode] ${caller} mounted.`);
        }
        loadNachocode(apiKey, options, version, onInitialized)
            .then(sdk => {
            if (!isActive)
                return;
            if (options === null || options === void 0 ? void 0 : options.logger) {
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
            if (!isActive)
                return;
            console.error('[Nachocode] Failed to load Nachocode SDK:', error);
            setState({
                isLoading: false,
                isError: true,
                error: error instanceof Error ? error : new Error(String(error)),
                Nachocode: null,
            });
        });
        return () => {
            isActive = false;
        };
    }, [apiKey, version]);
    return state;
}
function useNachocode(apiKey, options, version, onInitialized) {
    return useNachocodeLoader('useNachocode', apiKey, options, version, onInitialized);
}

let nachoContext;
function getNachoContext() {
    if (!nachoContext) {
        nachoContext = react.createContext(null);
    }
    return nachoContext;
}
function NachoProvider({ apiKey, options, version, onInitialized, children, }) {
    const state = useNachocodeLoader('NachoProvider', apiKey, options, version, onInitialized);
    return react.createElement(getNachoContext().Provider, { value: state }, children);
}
function useNachocodeContext() {
    assertHooksSupported('useNachocodeContext');
    const context = react.useContext(getNachoContext());
    if (!context) {
        throw new Error('[Nachocode] `useNachocodeContext` must be used within a `<NachoProvider>` component.');
    }
    return context;
}

exports.NachoProvider = NachoProvider;
exports.loadNachocode = loadNachocode;
exports.useNachocode = useNachocode;
exports.useNachocodeContext = useNachocodeContext;
//# sourceMappingURL=index.cjs.map
