import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

declare function loadNachocode(apiKey: string, options?: Nachocode.InitializeOptions, version?: Nachocode.VersionString, onInitialized?: (response?: {
    appKey?: string;
    appName?: string;
    appSourceVersion?: Nachocode.VersionString;
    appVersion?: Nachocode.VersionString;
    deviceModel?: string;
    os?: 'iOS' | 'Android';
    osVersion?: string;
    packageName?: string;
    pushToken?: string;
}) => void): Promise<typeof Nachocode>;

declare global {
  /**
   * nachocode JavaScript Client SDK Type Declaration v1.9.0
   *
   * GitHub
   *   - https://github.com/FlipperCorporation/nachocode-client-sdk
   *   - https://github.com/FlipperCorporation/nachocode-client-sdk-js
   *
   * CDN
   *   - https://cdn.nachocode.io/nachocode/client-sdk/@1.9.0/Nachocode.d.ts
   *
   * Last Updated Date: 2026-01-15
   */
  namespace Nachocode {
    /**
     * An error thrown when attempting to use the SDK before it has been initialized.
     */
    export declare class NotInitializedError extends Error {
      /**
       * Error status code
       */
      statusCode: 400;
      /**
       * Error message describing the issue
       */
      message: 'NOT_INITIALIZED';
      /**
       * Error description about the issue
       */
      desc: string;
      /**
       * Error code in the format `ERR-<TYPE>`
       */
      code: 'ERR-NS-CNI-001';
    }

    /**
     * nachocode Server API Error
     */
    export declare interface ApiError extends error {
      /**
       * Server error status code
       */
      statusCode: number;
      /**
       * Error message describing the issue
       */
      message: string;
      /**
       * Error description about the issue
       */
      desc: string;
      /**
       * Error code in the format `ERR-<TYPE>`
       */
      code: `ERR-${string}`;
    }

    /**
     * Standard SDK Error
     */
    export declare interface SDKError {
      /**
       * Error message describing the issue
       */
      message: string;
      /**
       * Error code in the format `ERR-<TYPE>`
       */
      code: `ERR-${string}`;
      /**
       * SDK error status code
       */
      statusCode?: number;
    }

    /**
     * Options for nachocode SDK environment
     */
    export declare type InitializeOptions = {
      /**
       * Option to use sandbox server or not
       */
      sandbox?: boolean;
      /**
       * Option to use logger or not
       */
      logger?: boolean;
    };

    /**
     * Version string
     */
    export declare type VersionString = `${number}.${number}.${number}`;

    /**
     * Initializes the nachocode SDK with the provided API key and environment setting.
     * @param apiKey - The API key for accessing nachocode services.
     * @example
     * // checks nachocode script loaded or not
     * if (window.Nachocode) {
     *   // registers event willing to be fired after SDK initialization
     *   Nachocode.event.on('init', () => {
     *     if (Nachocode.env.isApp()) {
     *       // logic here only works in `App` environment..
     *     }
     *   });
     *
     *   // initializes nachocode SDK
     *   Nachocode.init('your_api_key_here', { logger: true });
     * } else {
     *   console.error('nachocode SDK not loaded..');
     * }
     * @since 1.0.0
     */
    function init(apiKey: string, options?: InitializeOptions): void;

    /**
     * Asynchronously initializes the nachocode SDK with the provided API key and options.
     * @param apiKey - The API key for accessing nachocode services.
     * @example
     * // asynchronously initializes nachocode SDK
     * await Nachocode.initAsync('your_api_key_here');
     *
     * if (Nachocode.env.isApp()) {
     *  // logic here only works in `App` environment..
     * }
     * @since 1.4.2
     */
    function initAsync(
      apiKey: string,
      options?: InitializeOptions
    ): Promise<void>;

    /**
     * Namespace for application specific functions
     * @since 1.0.0
     * @lastupdated 1.8.0 - `exitApp` added
     */
    namespace app {
      /**
       * Checks whether the application is first launched or not.
       * @param callback - Called with `true` if this is the first launch, `false` otherwise.
       * @since 1.4.0
       */
      function checkFirstLaunch(
        callback: (isFirstLaunch: boolean) => void
      ): void;

      /**
       * Retrieves the stored application name.
       * @returns {string} The name of the application.
       * @since 1.0.0
       */
      function getAppName(): string;

      /**
       * Retrieves the stored application key.
       * @returns {string | void} The key of the application.
       * - `void` if called in web environment.
       * @since 1.0.0
       */
      function getAppKey(): string | void;

      /**
       * Retrieves the stored application version.
       * @returns {VersionString | void} The current version of the application installed.
       * - `void` if called in web environment.
       * @since 1.0.0
       */
      function getCurrentAppVersion(): VersionString | void;

      /**
       * Retrieves the stored application package name.
       * @returns {string | void} The package name of the application.
       * - `void` if called in web environment.
       * @since 1.0.0
       */
      function getPackageName(): string | void;

      /**
       * Exits the application.
       * @since 1.8.0
       */
      function exitApp(): void;
    }

    /**
     * Namespace for Apple native features
     *
     *   - _Currently, only iOS supported._
     * @since 1.4.0
     * @lastupdated 1.6.1
     */
    namespace apple {
      /**
       * Apple success result from native layer
       * @since 1.6.1
       */
      export declare type AppleSuccessResult = {
        status: 'success';
      };

      /**
       * Apple error result from native layer
       * @since 1.6.1
       */
      export declare type AppleErrorResult = {
        status: 'error';
        errorCode: string;
        message: string;
      };

      /**
       * Apple result from native layer
       * @since 1.4.0
       * @lastupdated 1.6.1
       */
      export declare type AppleResult = AppleSuccessResult | AppleErrorResult;

      /**
       * Reserved Apple permission types
       * @since 1.4.0
       */
      export declare type ApplePermissionTypes = ['email', 'fullName'];

      /**
       * Apple permissions
       * @since 1.4.0
       */
      export declare type ApplePermissions =
        (typeof ApplePermissionTypes)[string][];

      /**
       * Apple user data from native layer
       * @since 1.4.0
       */
      export declare type AppleUserData = {
        identifier: string;
        token: string;
        authorizationCode: string;
        email?: string;
        name?: {
          givenName: string;
          familyName: string;
        };
        [fields: string]: any;
      };

      /**
       * Apple native social login
       * @since 1.4.0
       * @lastupdated 1.6.1
       */
      function login(
        permissions: ApplePermissions,
        callback: (result: AppleResult, userData?: AppleUserData) => void
      ): void;

      /**
       * Check whether logged in with Apple native social login
       * @since 1.4.0
       */
      function isLoggedIn(
        identifier: string,
        callback: (result: AppleResult, isLoggedIn: boolean) => void
      ): void;

      /**
       * @description
       * Function to get Apple user identifier from native layer.
       *
       * Calls callback function with the user identifier.
       * @since 1.4.0
       * @lastupdated 1.6.1
       */
      function getUserIdentifier(
        callback: (result: AppleResult, userIdentifier?: string) => void
      ): void;
    }

    /**
     * Namespace for integrated Appsflyer native features.
     * @since 1.7.0
     */
    namespace appsflyer {
      export declare type AppsflyerSuccessResult = {
        status: 'success';
        statusCode: 200;
        message: string;
      };

      export declare type AppsflyerErrorResult = {
        status: 'error';
        statusCode: number;
        errorCode: string;
        message: string;
      };

      export declare type AppsflyerResult =
        | AppsflyerSuccessResult
        | AppsflyerErrorResult;

      interface GetCustomerUserIdSuccessResult extends AppsflyerSuccessResult {
        userId: string;
      }

      export declare type GetCustomerUserIdResult =
        | GetCustomerUserIdSuccessResult
        | AppsflyerErrorResult;

      /**
       * @example
       * {
       *   timestamp: 1758550124487,
       *   data_type: "conversion_data",
       *   install_time: "2025-09-22 09:30:36.455",
       *   af_message: "organic install",
       *   af_status: "Organic",
       *   is_first_launch: true
       * }
       */
      export declare interface ConversionData {
        /**
         * Unix epoch time in milliseconds when the attribution was received.
         */
        timestamp: number;
        /**
         * How the attribution was received.
         */
        data_type: 'conversion_data';
        install_time: string;
        /**
         * `true` if this session marked as the very first launch for the install.
         */
        is_first_launch: boolean;
        /**
         * Install attribution type reported by AppsFlyer.
         * - "Organic": Natural install (no campaign).
         * - "Non-organic": Attributed to a campaign or ad network.
         */
        af_status: 'Organic' | 'Non-organic';
        af_message?: string;
      }

      /**
       * @example
       * {
       *   timestamp: 1758610751590,
       *   data_type: "deeplink_data",
       *   link_type: "app_link",
       *   scheme: "https",
       *   host: "nachocode.link",
       *   path: "/",
       *   link: "https://nachocode.link/",
       *   is_deferred: false
       * }
       */
      export declare interface BaseDeepLinkData {
        /**
         * Unix epoch time in milliseconds when the attribution was received.
         */
        timestamp: number;
        /**
         * How the attribution was received.
         */
        data_type: 'deeplink_data';
        link_type: 'app_link' | 'universal_link' | 'uri_scheme';
        scheme: string;
        host: string;
        path: string;
        /**
         * Full URL
         */
        link: string;
        is_deferred: false;
      }

      /**
       * @see {@link https://dev.appsflyer.com/hc/docs/android-sdk-reference-deeplink}
       * @see {@link https://dev.appsflyer.com/hc/docs/ios-sdk-reference-appsflyerdeeplink}
       */
      export declare interface BaseDeferredDeepLinkData {
        /**
         * Unix epoch time in milliseconds when the attribution was received.
         */
        timestamp: number;
        /**
         * How the attribution was received.
         */
        data_type: 'deeplink_data';
        link_type: 'deferred_link';
        is_deferred: true;
        match_type:
          | 'referrer' // Google Play referrer string
          | 'id_matching'
          | 'probabilistic'
          | 'srn'; // self-reporting network
        media_source: string;
        campaign: string;
        campaign_id: string;
        click_http_referrer: string;
        deep_link_value: string;
        af_sub1: string;
        af_sub2: string;
        af_sub3: string;
        af_sub4: string;
        af_sub5: string;
      }

      export declare type DeepLinkData = BaseDeepLinkData &
        Omit<Record<string, string>, keyof BaseDeepLinkData>;

      export declare type DeferredDeepLinkData = BaseDeferredDeepLinkData &
        Omit<Record<string, string>, keyof BaseDeepLinkData>;

      export declare type AttributionData =
        | ConversionData
        | DeepLinkData
        | DeferredDeepLinkData;

      interface GetAttributionDataSuccessResult extends AppsflyerSuccessResult {
        data: AttributionData;
      }

      export declare type GetAttributionDataResult =
        | GetAttributionDataSuccessResult
        | AppsflyerErrorResult;

      interface GetAttributionListSuccessResult extends AppsflyerSuccessResult {
        data: AttributionData[];
      }

      export declare type GetAttributionListResult =
        | GetAttributionListSuccessResult
        | AppsflyerErrorResult;

      /**
       * Function to set a customer user id with provided parameter `customUserId` to Appsflyer feature in the native layer.
       * Enables you to cross-reference your own unique ID with AppsFlyer's unique ID and the other devices' IDs.
       * @see {@link https://dev.appsflyer.com/hc/docs/set-customer-user-id}
       * @see {@link https://dev.appsflyer.com/hc/docs/integrate-ios-sdk#setting-the-customer-user-id}
       * @see {@link https://dev.appsflyer.com/hc/docs/integrate-android-sdk#set-the-customer-user-id}
       * @param customUserId - client customer user identifier.
       * @since 1.7.0
       * @lastupdated 1.8.0 - renamed from `setCustomUserId` to `setCustomerUserId`
       */
      function setCustomerUserId(
        customUserId: string
      ): Promise<AppsflyerResult>;

      /**
       * Function to get registered customer user id for Appsflyer features in the native layer.
       * @since 1.7.0
       * @lastupdated 1.8.0 - renamed from `getCustomUserId` to `getCustomerUserId`
       */
      function getCustomerUserId(): Promise<GetCustomerUserIdResult>;

      /**
       * Function to delete registered customer user id from Appsflyer feature in the native layer.
       * @since 1.7.0
       * @lastupdated 1.8.0 - renamed from `deleteCustomUserId` to `deleteCustomerUserId`
       */
      function deleteCustomerUserId(): Promise<AppsflyerResult>;

      /**
       * Function to get attribution data.
       * @since 1.7.0
       */
      function getAttributionData(): Promise<GetAttributionDataResult>;

      /**
       * Function to clear attribution data.
       * @param timestamp - Unix epoch time in milliseconds to clear specific attribution data with the given time.
       * @since 1.7.0
       */
      function clearAttributionData(
        timestamp?: number
      ): Promise<AppsflyerResult>;

      /**
       * Function to get attribution data list.
       * @since 1.7.0
       */
      function getAttributionList(): Promise<GetAttributionListResult>;

      /**
       * Function to clear attribution data list.
       * @since 1.7.0
       */
      function clearAttributionList(): Promise<AppsflyerResult>;

      /**
       * Function to log custom event on AppsFlyer.
       * @param eventName - Custom event name
       * @param values - Custom event value object
       * @since 1.7.0
       */
      function logEvent(
        eventName: string,
        values: Record<string, any>
      ): Promise<AppsflyerResult>;
    }

    /**
     * Namespace for authentication handling
     * @since 1.3.0
     */
    namespace authentication {
      /**
       * Authentication result
       */
      export declare type AuthenticationResult =
        | {
            authenticated: boolean;
          }
        | {
            authenticated: false;
            error: SDKError;
          };

      /**
       * Function to check availability of biometrics authentication.
       * Calls callback function with the value whether it is available or not.
       * @since 1.3.0
       */
      function canUseBiometrics(
        callback: (available: boolean, error?: SDKError | undefined) => void
      ): void;

      /**
       * Function to use native biometrics authentication.
       * Calls callback function with the authentication result.
       * @since 1.3.0
       */
      function useBiometrics(
        callback: (result: AuthenticationResult) => void
      ): void;
    }

    /**
     * Namespace for native hardware back key pressed handling
     *   - _Android Only_
     * @since 1.2.0
     */
    namespace backkey {
      /**
       * Registers an event listener for native back key handler.
       * If registered, instead of default back key handling, calls registered callback.
       * @param {function} event - Function willing to be called when back key pressed.
       * @param eventId - Event id willing to be set.
       * @returns {string | void} - Returns registered event id, or `void` if failed.
       * @example
       * // Default event id provided
       * Nachocode.backkey.addEvent((eventId) => {
       *  console.log('Back key pressed.');
       *  console.log(eventId); // 1
       * });
       * @example
       * // Set specific event id
       * Nachocode.backkey.addEvent((eventId) => {
       *  console.log('Back key pressed.');
       *  console.log(eventId); // sample
       * }, 'sample');
       * @since 1.2.0
       */
      function addEvent(
        event: (eventId: string) => void,
        eventId?: string
      ): string | void;

      /**
       * Removes all of registered event listeners.
       * @example
       * // Clears registered back key handling event listeners.
       * Nachocode.backkey.clearEvents();
       * @since 1.2.0
       */
      function clearEvents(): void;

      /**
       * Gets last event id
       * @returns {string | void} - Returns last registered event id, or `void` if failed.
       * @example
       * // Register first event for backkey handling
       * Nachocode.backkey.addEvent((eventId) => {
       *  console.log('Back key pressed.');
       *  console.log(eventId); // sample1
       * }, 'sample1');
       *
       * // Register second event for backkey handling
       * Nachocode.backkey.addEvent((eventId) => {
       *  console.log('Back key pressed.');
       *  console.log(eventId); // sample2
       * }, 'sample2');
       *
       * // Get event id of last registered event.
       * const eventId = Nachocode.backkey.getLastEvent(); // sample2
       * @since 1.2.0
       */
      function getLastEvent(): string | void;

      /**
       * Removes registered event listener for native back key handler.
       * @param {string} [eventId] - Registered event id
       * @returns {string | void} - Returns removed event id, or void if failed.
       * @example
       * // Default removes last event
       * Nachocode.backkey.removeEvent();
       * @example
       * // Remove specific event with event id
       * Nachocode.backkey.removeEvent('sample');
       * @since 1.2.0
       */
      function removeEvent(eventId?: string): string | void;
    }

    /**
     * Namespace for browser-related functions
     * @since 1.0.3
     * @updated 1.6.3 - new option added in `OpenURLOption`
     * @lastupdated 1.8.0 - `setInternalBrowser` added
     */
    namespace browser {
      /**
       * Option for opening a URL.
       *   - Default : 'external'
       * @since 1.0.3
       * @lastupdated 1.6.3 - `internal_default` newly added
       */
      export declare type OpenURLOption =
        | 'external' // opens link with external browser ex. Safari, Chrome
        | 'internal' // uses customized in-app browser
        | 'internal_default'; // uses default browser engine ex. Safari, Chrome

      /**
       * Sets the internal browser option.
       * @since 1.8.0
       */
      export declare type SetInternalBrowserOption = {
        usingUrl: boolean; // Whether to show URL bar in internal browser or not.
      };

      /**
       * Opens the provided URL with the specified option.
       * @param url - The URL to be opened.
       * @param option - The option for the way to open the URL.
       *   - Default : `'external'`
       * @example
       * // Default option : 'external'
       * Nachocode.browser.openLink('https://nachocode.io');
       * @example
       * // Open external browser
       * Nachocode.browser.openLink('https://nachocode.io', 'external');
       * @example
       * // Open internal browser
       * Nachocode.browser.openLink('https://nachocode.io', 'internal');
       * @example
       * // Open default internal browser (ex. `Safari`, `Chrome`)
       * Nachocode.browser.openLink('https://nachocode.io', 'internal_default');
       * @since 1.0.3
       * @lastupdated 1.6.3 - `internal_default` newly added
       */
      function openLink(url: string, option?: OpenURLOption): void;

      /**
       * Function to set internal browser options.
       *
       * Supported Platforms
       * - Android
       * - iOS
       * @since 1.8.0
       * @param option - Options for internal browser
       */
      function setInternalBrowser(option: SetInternalBrowserOption): void;
    }

    /**
     * Namespace for clipboard related functions
     * @since 1.4.0
     * @lastupdated 1.6.3 - updated to support `Web` platforms
     */
    namespace clipboard {
      /**
       * Function to get text from the clipboard.
       *
       * Automatically checks current OS and gets text from the clipboard.
       *
       * Supported Platforms
       * - Android
       * - iOS
       * - Web
       * @since 1.4.0
       * @lastupdated 1.6.3 - updated to support `Web` platforms
       */
      function getText(callback: (text: string) => void): void;

      /**
       * Function to set text to the clipboard.
       *
       * Automatically checks current OS and sets text to the clipboard.
       *
       * Supported Platforms
       * - Android
       * - iOS
       * - Web
       * @since 1.4.0
       * @lastupdated 1.6.3 - updated to support `Web` platforms
       */
      function setText(
        text: string,
        callback?: (status: 'success' | 'error', message: string) => void
      ): void;
    }

    /**
     * Namespace for device specific functions
     * @since 1.0.0
     * @lastupdated 1.8.0 - `getSafeAreaInsets` added
     */
    namespace device {
      /**
       * Device types
       * @since 1.4.2
       */
      export declare const DEVICE_TYPES = {
        ANDROID: 'Android',
        IOS: 'iOS',
        UNKNOWN: 'Unknown',
      } as const;

      /**
       * Type for device types
       * @since 1.0.0
       * @lastupdated 1.4.2
       */
      export declare type DeviceType =
        (typeof DEVICE_TYPES)[keyof typeof DEVICE_TYPES];

      /**
       * Network connection types
       * @since 1.4.2
       */
      export declare const NETWORK_CONNECTION_TYPES = {
        WIFI: 'Wi-Fi',
        CELLULAR: 'Cellular',
        ETHERNET: 'Ethernet',
        UNKNOWN: 'No Internet Connection',
      } as const;

      /**
       * Type for network connection types
       * @since 1.3.0
       * @lastupdated 1.4.2
       */
      export declare type NetworkConnectionType =
        (typeof NETWORK_CONNECTION_TYPES)[keyof typeof NETWORK_CONNECTION_TYPES];

      /**
       * Safe area insets type
       * @since 1.8.0
       */
      export declare type SafeAreaInsets = {
        top: number;
        bottom: number;
        left: number;
        right: number;
      };

      /**
       * Get safe area success result type
       * @since 1.8.0
       */
      export declare type GetSafeAreaInsetsSuccessResult = {
        isError: false;
      } & SafeAreaInsets;

      /**
       * Get safe area error result type
       * @since 1.8.0
       */
      export declare type GetSafeAreaInsetsErrorResult = {
        isError: true;
        errorMessage: string;
      };

      /**
       * Get safe area result type
       * @since 1.8.0
       */
      export declare type GetSafeAreaInsetsResult =
        | GetSafeAreaInsetsSuccessResult
        | GetSafeAreaInsetsErrorResult;

      /**
       * Detect the device type using the User-Agent string.
       * @returns {DeviceType} The detected device type (e.g., "Android", "iOS", "Unknown").
       * @since 1.0.0
       */
      function detectType(): DeviceType;

      /**
       * Retrieves the battery level of the device from native layer.
       * Calls callback function with the value.
       * @example
       * Nachocode.device.getBatteryLevel(status => {
       *   const message =
       *     `충전 여부 : ${status.isCharging ? '충전 중' : '충전 중 아님'}\n` +
       *     `현재 배터리 : ${status.batteryLevel || '알 수 없음'}`;
       *   alert(message);
       * });
       * @since 1.3.0
       */
      function getBatteryLevel(
        callback: (status: {
          batteryLevel: number;
          isCharging: boolean;
        }) => void
      ): void;

      /**
       * Retrieves the current language of the device from native layer.
       * Calls callback function with the value.
       * @example
       * Nachocode.device.getCurrentLanguage(language => {
       *   const message = `현재 디바이스 언어 : ${language}`;
       *   alert(message);
       * });
       * @since 1.4.0
       */
      function getCurrentLanguage(callback: (language: string) => void): void;

      /**
       * Retrieves the device model from the native layer.
       * @see {@link https://storage.googleapis.com/play_public/supported_devices.html} for full supported android devices info
       * @since 1.3.0
       */
      function getDeviceModel(): string;

      /**
       * Retrieves the device os from the native layer.
       * @since 1.3.0
       */
      function getDeviceOS(): { os: DeviceType; version: string };

      /**
       * Retrieves the network status from the native layer.
       * Calls callback function with the value.
       * @since 1.3.0
       */
      function getNetworkStatus(
        callback: (status: {
          isConnected: boolean;
          connectionType: NetworkConnectionType;
        }) => void
      ): void;

      /**
       * Asynchronously calculates the safe area insets of the device from native layer.
       *
       * Supported Platforms
       * - iOS (iPhone X and later)
       * @example
       * const safeArea = await Nachocode.device.getSafeAreaInsets();
       * if (!safeArea.isError) {
       *   console.log(`Top: ${safeArea.top}`);
       *   console.log(`Bottom: ${safeArea.bottom}`);
       *   console.log(`Left: ${safeArea.left}`);
       *   console.log(`Right: ${safeArea.right}`);
       *   console.log(`Scale: ${safeArea.scale}`);
       * } else {
       *   console.error(`Error retrieving safe area: ${safeArea.errorMessage}`);
       * }
       * @since 1.8.0
       */
      function getSafeAreaInsets(): Promise<GetSafeAreaInsetsResult>;

      /**
       * Retrieves the type of the device.
       * @since 1.0.0
       */
      function getType(): DeviceType;

      /**
       * Returns whether current device is Android or not.
       * @since 1.0.0
       */
      function isAndroid(): boolean;

      /**
       * Returns whether current device is iOS or not.
       * @since 1.0.0
       */
      function isIOS(): boolean;
    }

    /**
     * Namespace for environment and configuration
     * @since 1.0.0
     * @lastupdated 1.2.0
     */
    namespace env {
      const RUNNING_ENVIRONMENTS = {
        WEB: 'web',
        APP: 'app',
      } as const;

      /**
       * Type for nachocode application running environment
       * @since 1.0.0
       * @lastupdated 1.4.2
       */
      export declare type RunningEnvironment =
        (typeof RUNNING_ENVIRONMENTS)[keyof typeof RUNNING_ENVIRONMENTS];

      /**
       * Current environment of the application
       */
      export declare type CurrentEnvironment = {
        /**
         * Current device type
         */
        deviceType: device.DeviceType;
        /**
         * Using logger or not
         */
        logger: boolean;
        /**
         * Current running environment
         */
        runningEnv: RunningEnvironment;
        /**
         * Using sandbox server or not
         */
        sandbox: boolean;
        /**
         * Current SDK version
         */
        sdkVersion: VersionString;
        /**
         * Current application source version
         */
        srcVersion: VersionString;
      };

      /**
       * Options for environment of the application
       */
      export declare type EnvironmentOptions = {
        /**
         * Using sandbox server or not
         */
        sandbox?: boolean;
        /**
         * Using logger or not
         */
        logger?: boolean;
      };

      /**
       * Retrieves the stored application source version.
       * @returns {VersionString | void} The source version of the application.
       * - `void` if called in web environment
       * @since 1.2.0
       */
      function getAppSourceVersion(): VersionString | void;

      /**
       * Retrieves the current environment of the application.
       * @since 1.0.0
       */
      function getCurrentEnv(): CurrentEnvironment;

      /**
       * Retrieves the running environment whether Web or App.
       * @since 1.0.0
       */
      function getRunningEnv(): RunningEnvironment;

      /**
       * Retrieves the current SDK version.
       * @since 1.0.0
       */
      function getSDKVersion(): VersionString;

      /**
       * Check whether the application is running on `Native Application`.
       * @since 1.0.0
       */
      function isApp(): boolean;

      /**
       * Checks whether the nachocode SDK is initialized.
       * @since 1.0.0
       */
      function isInitialized(): boolean;

      /**
       * Checks whether currently using sandbox server.
       * @since 1.0.0
       */
      function isUsingSandbox(): boolean;

      /**
       * Check whether the application is running on `Web Application`.
       * @since 1.0.0
       */
      function isWeb(): boolean;
    }

    /**
     * Namespace for event handling
     * @since 1.0.2
     * @lastupdated 1.4.2
     */
    namespace event {
      /**
       * Reserved event types
       * @since 1.0.2
       * @lastupdated 1.4.2
       */
      export declare const EVENT_TYPES = {
        /**
         * Callback event triggered when the SDK is initialized.
         * @since 1.0.2
         */
        INIT: 'init',

        /**
         * Callback event automatically triggered when the app transitions to the background.
         * @since 1.2.0
         */
        BACKGROUND: 'background',

        /**
         * Callback event automatically triggered when the app transitions to the foreground.
         * @since 1.2.0
         */
        FOREGROUND: 'foreground',

        /**
         * Callback event triggered when the network status changes,
         * such as losing internet connection or switching from Wi-Fi to cellular.
         * @since 1.4.0
         */
        NETWORK_CHANGED: 'networkchanged',

        /**
         * Callback event triggered when the native keyboard is shown.
         * @since 1.4.2
         */
        KEYBOARD_SHOWN: 'keyboardshown',

        /**
         * Callback event triggered when the native keyboard is hidden.
         * @since 1.4.2
         */
        KEYBOARD_HIDDEN: 'keyboardhidden',
      } as const;

      /**
       * Type for reserved event types
       * @since 1.0.2
       * @lastupdated 1.4.2
       */
      export declare type EventType =
        (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

      /**
       * Registers an event listener for the specified event name.
       * @param eventName - The event type to register.
       * @param callback - The callback function to execute when the event is triggered.
       * @since 1.0.2
       */
      function on(eventName: EventType, callback: (params?: any) => void): void;

      /**
       * Unbinds registered event listener for the specified event name.
       * @param eventName - The event type to unregister.
       * @since 1.0.3
       */
      function off(eventName: EventType): void;

      /**
       * Registered events
       */
      const callbacks: {
        [eventName: EventType]: (response: any) => void;
      };
    }

    /**
     * Namespace for Facebook native features
     * @since 1.4.0
     * @lastupdated 1.9.0 - `logEvent` added
     */
    namespace facebook {
      /**
       * Facebook success result from native layer
       * @since 1.6.1
       */
      export declare type FacebookSuccessResult = {
        /**
         * Status which shows success of Facebook native feature.
         */
        status: 'success';
      };
      /**
       * Facebook error result from native layer
       * @since 1.6.1
       */
      export declare type FacebookErrorResult = {
        status: 'error';
        errorCode: string;
        message: string;
      };
      /**
       * Facebook result from native layer
       * @since 1.4.0
       * @lastupdated 1.6.1
       */
      export declare type FacebookResult =
        | FacebookSuccessResult
        | FacebookErrorResult;

      /**
       * Reserved facebook permission types
       * @see {@link https://developers.facebook.com/docs/permissions}
       * @since 1.4.0
       */
      export declare type FacebookPermissionTypes = [
        'email',
        'public_profile',
        'user_friends',
        'user_birthday',
        'user_hometown',
        'user_location',
        'user_photos',
        'user_posts',
        'user_gender',
        'user_link',
        'user_likes',
        'user_events',
        'user_videos',
        'user_tagged_places',
        'user_age_range',
        'user_managed_groups',
        'user_work_history',
        'user_education_history',
        'user_relationships',
        'user_relationship_details',
        'user_friends_relationships',
        'user_pages',
      ];

      /**
       * Facebook permissions
       * @since 1.4.0
       */
      export declare type FacebookPermissions =
        (typeof FacebookPermissionTypes)[string][];

      /**
       * Facebook user data from native layer
       * @since 1.4.0
       */
      export declare type FacebookUserData = {
        email?: string;
        name?: string;
        id?: number;
        first_name?: string;
        last_name?: string;
        [fields: string]: any;
      };

      /**
       * Facebook native social login
       * @since 1.4.0
       * @lastupdated 1.6.1
       */
      function login(
        permissions: FacebookPermissions,
        callback: (
          result: FacebookResult,
          accessToken?: string,
          userId?: string,
          userData?: FacebookUserData
        ) => void
      ): void;

      /**
       * Check whether logged in with Facebook native social login
       * @since 1.4.0
       * @lastupdated 1.6.1
       */
      function isLoggedIn(
        callback: (
          result: FacebookResult,
          isLoggedIn: boolean,
          accessToken?: string,
          userId?: string
        ) => void
      ): void;

      /**
       * @description
       * Requests to get Facebook user data from native layer.
       *
       * Calls callback function with the data.
       * @since 1.4.0
       * @lastupdated 1.6.1
       */
      function getUserData(
        permissions: FacebookPermissions,
        callback: (result: FacebookResult, userData?: FacebookUserData) => void
      ): void;

      /**
       * @description
       * Facebook native social logout
       * @since 1.4.0
       */
      function logout(): void;

      /**
       * @description
       * Function to trigger facebook app event.
       * @returns {void}
       * @since 1.9.0
       */
      function logEvent(
        eventName: string,
        parameters?: Record<string, string>
      ): void;
    }

    /**
     * Namespace for Google native features
     * @since 1.5.0
     * @lastupdated 1.6.1
     */
    namespace google {
      /**
       * Google success result from native layer
       * @since 1.6.1
       */
      export declare type GoogleSuccessResult = {
        /**
         * Status which shows success of Google native feature.
         */
        status: 'success';
        /**
         * Google native feature result status code. 200 when successful.
         */
        statusCode: 200;
      };
      /**
       * Google error result from native layer
       * @since 1.6.1
       */
      export declare type GoogleErrorResult = {
        /**
         * Status which shows failure of Google native feature.
         */
        status: 'error';
        /**
         * Failure result status code of Google native feature.
         */
        statusCode: number;
        /**
         * Google native feature result message from native layer when failed.
         */
        message: string;
      };
      /**
       * Google result from native layer
       * @since 1.5.0
       * @lastupdated 1.6.1
       */
      export declare type GoogleResult =
        | GoogleSuccessResult
        | GoogleErrorResult;

      /**
       * Google user data from native layer
       * @since 1.5.0
       */
      export declare type GoogleUserData = {
        uid: string;
        email?: string;
        displayName?: string;
        photoURL?: string;
        phoneNumber?: string;
        isEmailVerified: boolean;
        providerId?: string;
      };

      /**
       * @description
       * Function to authenticate with native Google social login.
       *
       * Calls callback function with the user data value.
       * @since 1.5.0
       */
      function login(
        callback: (
          result: GoogleResult,
          idToken?: string,
          userData?: GoogleUserData
        ) => void
      ): void;

      /**
       * @description
       * Function to check whether authenticated with native Google social login.
       *
       * Calls callback function with the value whether the user is logged in or not.
       * @since 1.5.0
       * @lastupdated 1.6.1
       */
      function isLoggedIn(
        callback: (
          result: GoogleResult,
          isLoggedIn: boolean,
          idToken?: string
        ) => void
      ): void;

      /**
       * @description
       * Function to get Google user data from native layer.
       *
       * Calls callback function with the user data.
       * @since 1.5.0
       * @lastupdated 1.6.1
       */
      function getUserData(
        callback: (result: GoogleResult, userData?: GoogleUserData) => void
      ): void;

      /**
       * @description
       * Function to logout with Google native social features.
       * @since 1.5.0
       * @lastupdated 1.6.2
       */
      function logout(callback?: (result: GoogleResult) => void): void;
    }

    /**
     * Namespace for in-app purchase functions
     * @since 1.4.0
     */
    namespace iap {
      /**
       * In app purchase result from native layer
       * @since 1.4.0
       */
      export declare type IapPurchaseResult = {
        purchaseEnv: 'sandbox' | 'production';
        userId: string;
        productId?: string;
        nachoProductId: string;
        purchaseId?: number;
        os: 'android' | 'ios' | null;
        status: {
          success: boolean;
          error?: {
            code?: string;
            message: string;
          };
        };
      };

      /**
       * Initiates a purchase transaction for the specified product.
       * @server Calls nachocode server api internally
       * @since 1.4.0
       */
      function purchase(
        productKey: string,
        userId: string,
        callback: (result: IapPurchaseResult) => void
      ): Promise<any>;
    }

    /**
     * Namespace for Kakao native features
     * @since 1.5.0
     * @lastupdated 1.6.1
     */
    namespace kakao {
      /**
       * Kakao success result from native layer
       * @since 1.6.1
       */
      export declare type KakaoSuccessResult = {
        /**
         * Status which shows success of Kakao native feature.
         */
        status: 'success';
        /**
         * Kakao native feature result status code. 200 when successful.
         */
        statusCode: number;
      };
      /**
       * Kakao error result from native layer
       * @since 1.6.1
       */
      export declare type KakaoErrorResult = {
        /**
         * Status which shows failure of Kakao native feature.
         */
        status: 'error';
        /**
         * Failure result status code of Kakao native feature.
         */
        statusCode: number;
        /**
         * Kakao native feature result message from native layer when failed.
         */
        message: string;
      };
      /**
       * Kakao result from native layer
       * @since 1.5.0
       * @lastupdated 1.6.1
       */
      export declare type KakaoResult = KakaoSuccessResult | KakaoErrorResult;

      /**
       * Kakao login data from native layer.
       *
       * Returned when a user logs in or checks logged in.
       * @since 1.5.0
       */
      export declare type KakaoLoginData = {
        accessToken?: string;
        accessTokenExpiresAt?: Date;
        refreshToken?: string;
        refreshTokenExpiresAt?: Date;
        idToken?: string;
      };

      /**
       * Kakao user data from native layer.
       * @since 1.5.0
       */
      export declare type KakaoUserData = {
        id: number;
        connectedAt?: Date;
        /**
         * Whether profile can be provided under user consent
         */
        profileNeedsAgreement?: boolean;
        /**
         * Whether profile can be provided under user consent
         */
        profileNeedsAgreement?: boolean;
        /**
         * Whether profileNickname can be provided under user consent
         */
        profileNicknameNeedsAgreement?: boolean;
        /**
         * Whether profileImage can be provided under user consent
         */
        profileImageNeedsAgreement?: boolean;
        /**
         * Profile information
         */
        profile?: string;
        /**
         * Whether name can be provided under user consent
         */
        nameNeedsAgreement?: boolean;
        /**
         * Name of Kakao Account
         */
        name?: string;
        /**
         * Whether email can be provided under user consent
         */
        emailNeedsAgreement?: boolean;
        /**
         * Whether email address is valid
         */
        isEmailValid?: boolean;
        /**
         * Whether email address is verified
         */
        isEmailVerified?: boolean;
        /**
         * Representative email of Kakao Account
         */
        email?: string;
        /**
         * Whether age can be provided under user consent
         */
        ageRangeNeedsAgreement?: boolean;
        /**
         * Age range
         */
        ageRange?: unknown;
        /**
         * Whether birthyear can be provided under user consent
         */
        birthyearNeedsAgreement?: boolean;
        /**
         * Birth year in `YYYY` format
         */
        birthyear?: string;
        /**
         * Whether birthday can be provided under user consent
         */
        birthdayNeedsAgreement?: boolean;
        /**
         * Birthday in `MMDD` format
         */
        birthday?: string;
        /**
         * Birthday type
         */
        birthdayType?: unknown;
        /**
         * Whether gender can be provided under user consent
         */
        genderNeedsAgreement?: boolean;
        /**
         * Gender
         */
        gender?: string;
        /**
         * Legal name
         */
        legalName?: string;
        /**
         * Whether legalGender can be provided under user consent
         */
        legalGenderNeedsAgreement?: boolean;
        /**
         * Legal gender
         */
        legalGender?: string;
        /**
         * Whether isKorean can be provided under user consent
         */
        legalBirthDateNeedsAgreement?: boolean;
        /**
         * Legal birth date in yyyyMMDD format
         */
        legalBirthDate?: string;
        /**
         * Whether phoneNumber can be provided under user consent
         */
        phoneNumberNeedsAgreement?: boolean;
        /**
         * Phone number of Kakao Account
         */
        phoneNumber?: string;
        /**
         * Whether consent to isKorean can be provided under user consent
         */
        isKoreanNeedsAgreement?: boolean;
        /**
         * Whether the user is Korean
         */
        isKorean?: boolean;
      };

      /**
       * @description
       * Function to authenticate with native Kakao social login.
       *
       * Calls callback function with the login data value.
       * @since 1.5.0
       * @lastupdated 1.6.1
       */
      function login(
        callback: (result: KakaoResult, loginData?: KakaoLoginData) => void
      ): void;

      /**
       * @description
       * Function to check whether authenticated with native Kakao social login.
       *
       * Calls callback function with the value whether the user is logged in or not.
       * @since 1.5.0
       * @lastupdated 1.6.1
       */
      function isLoggedIn(
        callback: (
          result: KakaoResult,
          isLoggedIn: boolean,
          loginData?: KakaoLoginData
        ) => void
      ): void;

      /**
       * @description
       * Function to get user data from native Kakao features.
       *
       * Calls callback function with the user data.
       * @since 1.5.0
       * @lastupdated 1.6.1
       */
      function getUserData(
        callback: (result: KakaoResult, userData?: KakaoUserData) => void
      ): void;

      /**
       * @description
       * Function to logout Kakao. Unavailable to use `isLoggedIn` and `getUserData` any more.
       *
       * When the user attempts to log in, automatically authorized again
       * with past account info from KakaoTalk.
       * @since 1.5.0
       * @lastupdated 1.6.2
       */
      function logout(callback?: (result: KakaoResult) => void): void;

      /**
       * @description
       * Function to completely disconnect Kakao between the account and the app.
       *
       * When the user attempts to log in, must be authorized again
       * from scratch on KakaoTalk, after unlinked.
       * @since 1.5.0
       * @lastupdated 1.6.2
       */
      function unlink(callback?: (result: KakaoResult) => void): void;

      /**
       * Native Kakao sharing types
       * @since 1.5.0
       */
      export declare const KAKAO_SHARE_TYPES = {
        CUSTOM: 'custom',
        SCRAP: 'scrap',
      } as const;

      /**
       * Type for native Kakao sharing types
       * @since 1.5.0
       */
      export declare type KakaoShareType =
        (typeof KAKAO_SHARE_TYPES)[keyof typeof KAKAO_SHARE_TYPES];

      /**
       * Native Kakao custom data to send
       * @since 1.5.0
       */
      export declare type KakaoShareCustom = {
        templateId: number;
        templateArgs?: {
          [key: string]: string;
        };
        serverCallbackArgs?: {
          [key: string]: string;
        };
      };

      /**
       * Native Kakao scrap data to send
       * @since 1.5.0
       */
      export declare type KakaoShareScrap = {
        requestUrl: string;
        templateId?: number;
        templateArgs?: {
          [key: string]: string;
        };
        serverCallbackArgs?: {
          [key: string]: string;
        };
      };

      /**
       * Native Kakao share result status codes
       * @since 1.5.0
       */
      const KAKAO_SHARE_STATUS_CODES = {
        ERROR_JSON_FAILED: 102,
        ERROR_JSON_FAILED_TO_MODEL: 103,
        ERROR_JSON_FAILED_TO_KAKAO_MODEL: 104,
        ERROR_JSON_WRONG_SHARE_TYPE: 105,
        ERROR_JSON_EMPTY_REQUEST_URL: 106,
        ERROR_JSON_EMPTY_TEMPLATE_ID: 108,
        ERROR_KAKAO_FAILED: 199,
        SUCCESS_KAKAO: 200,
        SUCCESS_SAFARI: 201,
      } as const;

      /**
       * Kakao share result status code
       * @since 1.5.0
       */
      export declare type KakaoShareStatusCode =
        (typeof KAKAO_SHARE_RESULT_STATUS_CODES)[keyof typeof KAKAO_SHARE_RESULT_STATUS_CODES];

      /**
       * Kakao share result
       * @since 1.5.0
       */
      export declare type KakaoShareResult = {
        status: 'success' | 'error';
        statusCode: KakaoShareStatusCode;
        message?: string;
      };

      /**
       * Send Kakao sharing
       * @param type - Kakao sharing type
       * @param data - Data to send kakao
       * @param callback - Callback function called after sharing kakao
       * @since 1.5.0
       */
      function share(
        type: KakaoShareType,
        data: KakaoShareCustom | KakaoShareScrap,
        callback?: (result: KakaoShareResult) => void
      ): void;
    }

    /**
     * Namespace for loading related features
     * @since 1.8.0
     */
    namespace loading {
      /**
       * @description
       * Hides native loading indicator.
       * @since 1.8.0
       */
      function hideIndicator(): void;
    }

    /**
     * Namespace for location related features
     * @since 1.6.2
     */
    namespace location {
      export declare type LocationPosition = {
        /**
         * A double number representing the position's `latitude` in decimal degrees.
         */
        latitude: number;
        /**
         * A double number representing the position's `latitude` in decimal degrees.
         */
        longitude: number;
      };

      /**
       * Get current position success result
       * @since 1.6.2
       */
      export declare type GetCurrentPositionSuccessResult = {
        /**
         * request was successful
         */
        status: 'success';
        /**
         * status code
         */
        statusCode: 200;
        /**
         * result message
         */
        message: string;
        /**
         * result location data
         */
        data: LocationPosition;
      };

      /**
       * Get current position error result
       * @since 1.6.2
       */
      export declare type GetCurrentPositionErrorResult = {
        /**
         * request failed
         */
        status: 'error';
        /**
         * status code
         */
        statusCode: 400 | number;
        /**
         * result message, describes error
         */
        message: string;
        /**
         * error code
         */
        errorCode: string;
      };

      /**
       * Get current position result
       * @since 1.6.2
       */
      export declare type GetCurrentPositionResult =
        | GetCurrentPositionSuccessResult
        | GetCurrentPositionErrorResult;

      /**
       * Retrieves the current location position of the device.
       *
       * Automatically checks current environment and uses different interface.
       *
       * Asks location permission if not granted, and called for the first time.
       *
       * Supported Platforms
       * - **Android** : Uses native interface
       * - **iOS** : Uses native interface
       * - **Web** : Uses Web Geolocation API
       * @since 1.6.2
       */
      function getCurrentPosition(): Promise<GetCurrentPositionResult>;
    }

    /**
     * Namespace for functions called from native-side of the application.
     * @since 1.0.0
     * @lastupdated 1.0.3
     */
    namespace native {
      export declare type CallbackResponse = {
        method: string;
        data?: object;
        message?: string;
      };

      /**
       * A placeholder callback function that can be called from the native application.
       * This function should be implemented to handle specific callback from native code.
       */
      function handleCallback(response: CallbackResponse): void;

      /**
       * A collection of named callback functions that can be invoked from native code.
       * Each property of this object can be a function that gets executed in response to a native call.
       */
      const handleCallbacks: {
        [callbackName: string]: (response: any) => void;
      };
    }

    /**
     * Namespace for Naver native features
     * @since 1.9.0
     */
    namespace naver {
      /**
       * Naver success result from native layer
       * @since 1.9.0
       */
      export declare type NaverSuccessResult = {
        /**
         * Status which shows success of Naver native feature.
         */
        status: 'success';
      };
      /**
       * Naver error result from native layer
       * @since 1.9.0
       */
      export declare type NaverErrorResult = {
        /**
         * Status which shows failure of Naver native feature.
         */
        status: 'error';
        /**
         * Failure result error code of Naver native feature.
         */
        errorCode: string;
        /**
         * Naver native feature result message from native layer when failed.
         */
        message: string;
      };
      /**
       * Naver result from native layer
       * @since 1.9.0
       */
      export declare type NaverResult = NaverSuccessResult | NaverErrorResult;

      /**
       * Naver login data from native layer
       * @since 1.9.0
       */
      export declare type NaverLoginData = {
        expiresAt: string;
        accessToken: string;
        refreshToken: string;
      };

      /**
       * Naver user data from native layer
       * @since 1.9.0
       * @example
       * // User Data Example
       * {
       *    id: "ABCDEF123456_GHIJKLMN12345_OPQERST1234567",
       *    gender: "F",
       *    name: "김나쵸",
       *    nickname: "nachocode",
       *    email: "nachocode@naver.com",
       *    mobile: "010-1234-5678",
       *    mobile_e164: "+821012345678",
       *    age: "20-29",
       *    birthyear: "2000",
       *    birthday: "12-31"
       *    profile_image: "https://phinf.pstatic.net/contact/20241227_20/1735275960557XUHqT_PNG/image.png",
       * }
       */
      export declare type NaverUserData = {
        id: string;
        gender?: 'F' | 'M';
        name?: string;
        nickName?: string;
        email?: string;
        mobile?: string;
        mobile_e164?: string;
        age?: string;
        birthyear?: string;
        birthday?: string;
        profile_image?: string;
      };

      /**
       * @description
       * Function to authenticate with native Naver social login.
       *
       * Calls callback function with the login data value.
       * @since 1.9.0
       */
      function login(
        callback: (result: NaverResult, loginData?: NaverLoginData) => void
      ): void;

      /**
       * @description
       * Function to check whether authenticated with native Naver social login.
       *
       * Calls callback function with the value whether the user is logged in or not.
       * @since 1.9.0
       */
      function isLoggedIn(
        callback: (
          result: NaverResult,
          isLoggedIn: boolean,
          accessToken?: string
        ) => void
      ): void;

      /**
       * @description
       * Function to get Naver user data from native layer.
       *
       * Calls callback function with the user data.
       * @since 1.9.0
       */
      function getUserData(
        callback: (result: NaverResult, userData?: NaverUserData) => void
      ): void;

      /**
       * @description
       * Function to logout with Naver native social features.
       * @since 1.9.0
       */
      function logout(callback?: (result: NaverResult) => void): void;

      /**
       * @description
       * Function to disconnect with Naver native social features.
       * @since 1.9.0
       */
      function disconnect(callback?: (result: NaverResult) => void): void;
    }

    /**
     * Namespace for navigation related features
     * @since 1.8.0
     */
    namespace navigation {
      /**
       * @description
       * Clears the navigation history stack, leaving only the root view. _Only supported on Android._
       *
       * Supported Platforms
       * - Android
       * @since 1.8.0
       */
      function clearHistory(): void;

      /**
       * @description
       * Enables or disables the swipe gesture for navigating back to the previous screen. _Only supported on iOS._
       *
       * Supported Platforms
       * - iOS
       * @param enabled - A boolean value indicating whether to enable (`true`) or disable (`false`) the swipe gesture.
       * @since 1.8.0
       */
      function setSwipeGesture(enabled: boolean): void;

      /**
       * @description
       * Resets the navigation stack to the root view with an optional URL.
       * @param url - The URL to load in the root view after resetting the navigation stack.
       * Uses the default root app URL if not provided.
       * @since 1.8.0
       */
      function resetToRoot(url?: string): void;
    }

    /**
     * Namespace for permission handling
     * @since 1.2.0
     * @lastupdated 1.4.2
     */
    namespace permission {
      /**
       * Native device permission types
       * @since 1.4.2
       * @lastupdated 1.5.0
       */
      export declare const PERMISSION_TYPES = {
        /**
         * Camera usage permission
         * @since 1.4.2
         */
        CAMERA: 'camera',
        /**
         * Location access permission
         * @since 1.4.2
         */
        LOCATION: 'location',
        /**
         * Microphone usage permission
         * @since 1.4.2
         */
        MICROPHONE: 'microphone',
        /**
         * Photo usage permission
         * @since 1.5.0
         */
        PHOTO: 'photo',
        /**
         * Push notification permission
         * @since 1.4.2
         */
        PUSH: 'push',
      } as const;

      /**
       * Type for native device permission types
       * @since 1.2.0
       * @lastupdated 1.4.2
       */
      export declare type PermissionType =
        (typeof PERMISSION_TYPES)[keyof typeof PERMISSION_TYPES];

      /**
       * @description
       * Checks whether the app user grants the specified permission or not.
       *
       * Asks if optional parameter `ask` is set `true`.
       * @since 1.2.0
       */
      function checkPermission(
        option: {
          type: PermissionType;
          ask?: boolean;
        },
        callback?: (granted: boolean) => void
      ): void;
    }

    /**
     * Namespace for preference app storage functions
     * @since 1.2.0
     * @lastupdated 1.4.2
     */
    namespace preference {
      /**
       * @description
       * Deletes the data from native layer's preference area
       * with the specified key.
       * @since 1.3.0
       */
      function deleteData(key: string): void;

      /**
       * @description
       * Retrieves the data with the specified key
       * from native layer's preference area.
       *
       * Calls callback function with selected data.
       * @since 1.2.0
       */
      function getData(key: string, callback: (data: string) => void): void;

      /**
       * @description
       * Sets the data with the specified key
       * into native layer's preference area.
       * @since 1.2.0
       */
      function setData(key: string, data: string): void;
    }

    /**
     * Namespace for push notification functions
     * @since 1.0.0
     * @lastupdated 1.6.0
     */
    namespace push {
      /**
       * @since 1.6.3
       */
      export declare type PushTokenResult =
        | {
            /**
             * Registration success status.
             */
            status: 'success';
            /**
             * Registration success status code.
             */
            statusCode: 201;
            /**
             * Registration success message.
             */
            message: string;
          }
        | {
            /**
             * Whether registering push token was successful or not
             */
            status: 'error';
            /**
             * If the registration fails, returns error status code.
             */
            statusCode: number;
            /**
             * If the registration fails, returns the reason why.
             */
            message: string;
            /**
             * If the registration fails, describes the detailed issue.
             */
            desc: string;
            /**
             * If the registration fails, returns error code.
             */
            code: string;
          };

      /**
       * Options for local push notification
       * @since 1.4.1
       */
      export declare type LocalPushPayload = {
        /**
         * Push notification title
         */
        title: string;
        /**
         * Push notification contents
         */
        content?: string;
        /**
         * Opens up the provided url when clicked
         */
        link?: string;
        /**
         * Uses the app icon as a push icon as default.
         * If `false` provided, uses push icon instead.
         */
        usingAppIcon?: boolean;
        /**
         * Reserves time willing to send the local push notification.
         * If not provided, instantly sends the push notification.
         */
        scheduledTime?: Date;
        /**
         * If provided, sets provided `id` to the local push notification
         */
        id?: number;
      };

      /**
       * Local push result from native layer
       * @since 1.4.1
       */
      export declare type LocalPushResult = {
        /**
         * Whether local push notification reservation was successful or not
         */
        status: 'success' | 'error';
        /**
         * If the reservation fails, returns error code.
         */
        statusCode?: string;
        /**
         * If the reservation fails, returns the reason why.
         */
        message?: string;
        /**
         * If the reservation was successful, returns local notification id.
         * `id` is used for cancel.
         */
        id?: number;
      };

      /**
       * Push subscription result from native layer
       * @since 1.6.0
       * @lastupdated 1.6.1
       */
      export declare type PushTopicResult =
        | {
            /**
             * Status which shows success of push subscription request
             */
            status: 'success';
            /**
             * Status code of the subscription result
             * - `200` : all process was successful
             * - `201` : already subscribed
             * - `202` : already unsubscribed
             * - `203` : FCM subscription was successful but failed in nachocode server
             */
            statusCode: 200 | 201 | 202 | 203;
            /**
             * Result message from native layer.
             *
             * If the subscription failed, returns the reason why.
             */
            message: string;
          }
        | {
            /**
             * Status which shows failure of push subscription request
             */
            status: 'error';
            /**
             * Error status code of the subscription result
             * - `400` : bad request
             * - `401` : subscribe failed
             * - `402` : unsubscribe failed
             * - `500` : internal error
             */
            statusCode: 400 | 401 | 402 | 500;
            /**
             * If the subscription failed, returns error code.
             */
            errorCode: string;
            /**
             * Result message from native layer.
             *
             * The reason why it failed.
             */
            message: string;
          };

      /**
       * Asks for the permission for push notifications.
       *
       * If already granted, nothing happens.
       * @since 1.2.0
       */
      function askPushPermission(): void;

      /**
       * Retrieves the push token.
       *
       * Only works in native environment.
       * @returns FCM device token. empty string if failed
       * @since 1.0.0
       * @lastupdated 1.6.3 - Set return type to string
       */
      function getPushToken(): string;

      /**
       * Registers the push token with provided `userId` to the nachocode server.
       * @param userId - Client user identifier
       * @server Calls nachocode server api internally
       * @since 1.0.0
       * @lastupdated 1.6.3 - Set return type, logic improved
       */
      function registerPushToken(userId: string): Promise<PushTokenResult>;

      /**
       * Deletes the push token with provided user identifier.
       *
       * *If `userId` not provided deletes current device token*
       * @param userId - Client user identifier
       * @server Calls nachocode server api internally
       * @since 1.0.0
       * @lastupdated 1.6.3 - Set return type, userId set optional
       */
      function deletePushToken(userId?: string): Promise<PushTokenResult>;

      /**
       * Function to reserve local push from native layer.
       * @example
       * Nachocode.push.sendLocalPush({
       *  title: '깜짝 쿠폰 발송!',
       *  content: '지금 바로 앱에서 확인하세요!',
       *  link: 'https://nachocode.io/pricing',
       *  usingAppIcon: false,
       *  scheduleTime: new Date('2025-02-15T10:30:00Z'),
       *  id: 1,
       * });
       * @since 1.4.1
       */
      function sendLocalPush(
        payload: LocalPushPayload,
        callback?: (result: LocalPushResult) => void
      ): void;

      /**
       * Function to cancel scheduled local push from native layer.
       * @param {number} id - scheduled local push notification id
       * @example
       * Nachocode.push.cancelLocalPush(id);
       * @since 1.4.1
       */
      function cancelLocalPush(id: number): void;

      /**
       * Function to request native layer to subscribe push topic.
       *
       * Returns the result from native layer.
       * @param topic - Topic to subscribe
       * @server Calls nachocode server api internally
       * @since 1.6.0
       * @updated 1.6.1 - Updated from `callback` to `Promise`
       */
      function subscribePushTopic(topic: string): Promise<PushTopicResult>;

      /**
       * Function to request native layer to unsubscribe push topic.
       *
       * Returns the result from native layer.
       * @param topic - Topic to unsubscribe
       * @server Calls nachocode server api internally
       * @since 1.6.0
       * @updated 1.6.1 - Updated from `callback` to `Promise`
       */
      function unsubscribePushTopic(topic: string): Promise<PushTopicResult>;

      /**
       * Function to get push topic subscription list.
       *
       * Calls `callback` function with the list data.
       * @param callback - Callback called with the response from native layer.
       * @since 1.6.0
       */
      function getSubscriptionList(
        callback: (subscriptionList: Array<string>) => void
      ): void;
    }

    /**
     * Namespace for refresh related functions
     * @since 1.3.0
     * @deprecated This namespace would be removed in `SDK version 1.5.0`
     */
    namespace refresh {
      /**
       * Set whether pull to refresh feature is enabled or not.
       * @since 1.3.0
       * @deprecated This method has been moved to `setting` namespace since `SDK version 1.4.0`
       * Use `Nachocode.setting.setPullToRefresh(enable)` instead.
       */
      function setPullToRefresh(enable: boolean): void;
    }

    /**
     * Namespace for scanner related features
     * @since 1.4.0
     */
    namespace scanner {
      /**
       * Opens QR code scanner.
       * @since 1.4.0
       */
      function openQRCodeScanner(
        option: {
          openDirect: boolean;
          openType?: 'internal' | 'external' | 'main';
        },
        callback?: (
          data: string | undefined,
          error?: SDKError | undefined
        ) => void
      ): void;
    }

    /**
     * Namespace for settings related functions
     * @since 1.4.0
     * @lastupdated 1.4.2
     */
    namespace setting {
      /**
       * Function to open up OS application settings.
       * @since 1.4.2
       */
      function openSetting(): void;

      /**
       * Set whether pull to refresh feature is enabled or not.
       * @since 1.4.0
       */
      function setPullToRefresh(enable: boolean): void;

      /**
       * Set whether zoom support feature is enabled or not.
       * @since 1.4.0
       */
      function setSupportZoom(enable: boolean): void;
    }

    /**
     * Namespace for share functions
     * @since 1.1.0
     * @lastupdated 1.6.0
     */
    namespace share {
      /**
       * Opens the native UI with the provided share data.
       *
       * Supported Platforms
       * - **Android** : Uses native interface
       * - **iOS** : Uses Web Share API
       * - **Web** : Uses Web Share API
       * @param {string | {title?:string, url:string, text?:string} | {title?:string, url?:string, text:string}} shareData
       * @param {string} shareData.title - _(optional)_ title of the sharing.
       * @param {string} shareData.url - _(optional)_ url willing to be shared.
       * @param {string} shareData.text - _(optional)_ text willing to be shared.
       * @since 1.1.0
       * @lastupdated 1.6.0
       */
      function openSharing(
        shareData:
          | {
              title?: string;
              url: string;
              text?: string;
            }
          | {
              title?: string;
              url?: string;
              text: string;
            }
      ): void;

      /**
       * Native Kakao sharing type
       * @deprecated This has been moved to `kakao` namespace since `SDK version 1.5.0`
       */
      export declare enum KakaoShareType {
        CUSTOM = 'custom',
        SCRAP = 'scrap',
      }

      /**
       * Native Kakao custom data to send
       * @deprecated This has been moved to `kakao` namespace since `SDK version 1.5.0`
       */
      export declare type KakaoShareCustom = {
        templateId: number;
        templateArgs?: {
          [key: string]: string;
        };
        serverCallbackArgs?: {
          [key: string]: string;
        };
      };

      /**
       * Native Kakao scrap data to send
       * @deprecated This has been moved to `kakao` namespace since `SDK version 1.5.0`
       */
      export declare type KakaoShareScrap = {
        requestUrl: string;
        templateId?: number;
        templateArgs?: {
          [key: string]: string;
        };
        serverCallbackArgs?: {
          [key: string]: string;
        };
      };

      /**
       * Kakao share result status code
       * @deprecated This has been moved to `kakao` namespace since `SDK version 1.5.0`
       */
      export declare enum KakaoShareResultStatusCode {
        ERROR_JSON_FAILED = 102,
        ERROR_JSON_FAILED_TO_MODEL = 103,
        ERROR_JSON_FAILED_TO_KAKAO_MODEL = 104,
        ERROR_JSON_WRONG_SHARE_TYPE = 105,
        ERROR_JSON_EMPTY_REQUEST_URL = 106,
        ERROR_JSON_EMPTY_TEMPLATE_ID = 108,
        ERROR_KAKAO_FAILED = 199,
        SUCCESS_KAKAO = 200,
        SUCCESS_SAFARI = 201,
      }

      /**
       * Kakao share result
       * @deprecated This has been moved to `kakao` namespace since `SDK version 1.5.0`
       */
      export declare type KakaoShareResult = {
        status: 'success' | 'error';
        statusCode: KakaoShareStatusCode;
        message?: string;
      };

      /**
       * Send Kakao sharing
       * @param type - Kakao sharing type
       * @param data - Data to send kakao
       * @param callback - Callback function called after sharing kakao
       * @since 1.2.0
       * @deprecated This method has been moved to `kakao` namespace since `SDK version 1.5.0`
       */
      function sendKakao(
        type: KakaoShareType,
        data: KakaoShareCustom | KakaoShareScrap,
        callback?: (result: KakaoShareResult) => void
      ): void;
    }

    /**
     * Namespace for store related functions
     * @since 1.6.0
     */
    namespace store {
      /**
       * Type for the app's store information.
       * - Package name represents Android app id.
       * - iOS Apple app id can be found in Apple App Store Connect.
       * @since 1.6.0
       */
      export declare type StoreInfo =
        | {
            /**
             * package name for Android app
             * - Used in Android platform
             */
            androidAppId: string;
            /**
             * iOS Apple app id.
             * - Used in iOS platform
             * - Can be found in Apple App Store Connect.
             */
            iOSAppId?: string;
          }
        | {
            /**
             * package name for Android app
             * - Used in Android platform
             */
            androidAppId?: string;
            /**
             * iOS Apple app id.
             * - Used in iOS platform
             * - Can be found in Apple App Store Connect.
             */
            iOSAppId: string;
          };

      /**
       * Opens Apple App Store or Google Play Store.
       *
       * Automatically checks current OS and opens target store.
       *
       * Should provide one of parameters `androidAppId` or `iOSAppId`.
       *
       * Supported Platforms
       * - Android
       * - iOS
       * - Web
       * @param {string} storeInfo.androidAppId - package name for android app
       * - Used in Android platform
       * @param {string} storeInfo.iOSAppId - iOS app id. Can be found in apple app store connect.
       * - Used in iOS platform
       * @since 1.6.0
       */
      function openStore(storeInfo: StoreInfo): void;

      /**
       * Opens Apple App Store or Google Play Store.
       *
       * Automatically checks current OS and opens target store.
       *
       * Only shows write review page in Apple App Store. (Android not supported.)
       *
       * Should provide one of parameters `androidAppId` or `iOSAppId`.
       *
       * Supported Platforms
       * - iOS
       *   - only iOS app works as expected
       * - Android
       *   - just opens Google Play Store
       * - Web (Mobile)
       *   - only Apple App Store works as expected.
       * - Web (PC)
       *   - just opens Apple App Store or Google Play Store
       * @param {string} storeInfo.androidAppId - package name for android app
       * - Used in Android platform
       * @param {string} storeInfo.iOSAppId - iOS app id. Can be found in apple app store connect.
       * - Used in iOS platform
       * @since 1.6.0
       */
      function openReviewInStore(storeInfo: StoreInfo): void;

      /**
       * Opens the native request review popup UI.
       *
       * Only works in native environment. (iOS, Android app)
       * @since 1.6.0
       */
      function requestReview(): void;
    }

    /**
     * Namespace for tabbar functions
     * @since 1.0.3
     */
    namespace tabbar {
      /**
       * Move to specific index of the tab.
       * @param {number} index - specified index of the tab willing to move
       * @since 1.0.3
       */
      function moveTo(index: number): void;

      /**
       * Shows the tabbar.
       * @since 1.0.3
       */
      function show(): void;

      /**
       * Hides the tabbar.
       * @since 1.0.3
       */
      function hide(): void;
    }

    /**
     * Namespace for vibration features
     * @since 1.1.0
     * @lastupdated 1.8.0 - added iOS and Android specific haptics types and functions
     */
    namespace vibration {
      /**
       * Haptics feedback types
       * @since 1.4.2
       * @lastupdated 1.8.0 -  modified haptics type descriptions
       */
      export declare const HAPTICS_TYPES = {
        LIGHT: 0,
        MEDIUM: 1,
        HEAVY: 2,
      } as const;

      /**
       * Type for haptics feedback types
       * @since 1.1.0
       * @lastupdated 1.8.0
       */
      export declare type HapticsType =
        (typeof HAPTICS_TYPES)[keyof typeof HAPTICS_TYPES];

      /**
       * iOS Haptics impact feedback types
       * - iOS Only
       * @since 1.8.0
       */
      export declare const HAPTICS_IMPACT_TYPES = {
        /**
         * _(iOS 10.0+)_
         * A collision between small, light user interface elements.
         */
        LIGHT: 0,
        /**
         * _(iOS 10.0+)_
         * A collision between moderately sized user interface elements.
         */
        MEDIUM: 1,
        /**
         * _(iOS 10.0+)_
         * A collision between large, heavy user interface elements.
         */
        HEAVY: 2,
        /**
         * _(iOS 13.0+)_
         * A collision between user interface elements that are soft,
         * exhibiting a large amount of compression or elasticity.
         */
        SOFT: 3,
        /**
         * _(iOS 13.0+)_
         * A collision between user interface elements that are rigid,
         * exhibiting a small amount of compression or elasticity.
         */
        RIGID: 4,
      } as const;

      /**
       * Type for iOS haptics impact feedback types
       * - iOS Only
       * @since 1.8.0
       */
      export declare type HapticsImpactType =
        (typeof HAPTICS_IMPACT_TYPES)[keyof typeof HAPTICS_IMPACT_TYPES];

      /**
       * iOS Haptics notification feedback types
       * - iOS Only
       * @since 1.8.0
       */
      export declare const HAPTICS_NOTIFICATION_TYPES = {
        /**
         * _(iOS 10.0+)_
         * A notification feedback type that indicates a task has completed successfully.
         */
        SUCCESS: 0,
        /**
         * _(iOS 10.0+)_
         * A notification feedback type that indicates a task has produced a warning.
         */
        WARNING: 1,
        /**
         * _(iOS 10.0+)_
         * A notification feedback type that indicates a task has failed.
         */
        ERROR: 2,
      } as const;

      /**
       * Type for iOS haptics notification feedback types
       * - iOS Only
       * @since 1.8.0
       */
      export declare type HapticsNotificationType =
        (typeof HAPTICS_NOTIFICATION_TYPES)[keyof typeof HAPTICS_NOTIFICATION_TYPES];

      /**
       * Android Haptics effect feedback types
       * - Android Only
       * @since 1.8.0
       */
      export declare const HAPTICS_EFFECT_TYPES = {
        /**
         * _(Android API Level 29+)_
         * A click effect. Use this effect as a baseline, as it's the most common type of click effect.
         */
        EFFECT_CLICK: 0,
        /**
         * _(Android API Level 29+)_
         * A double click effect.
         */
        EFFECT_DOUBLE_CLICK: 1,
        /**
         * _(Android API Level 29+)_
         * A tick effect. This effect is less strong compared to `EFFECT_CLICK`.
         */
        EFFECT_TICK: 2,
        /**
         * _(Android API Level 29+)_
         * A heavy click effect. This effect is stronger than `EFFECT_CLICK`.
         */
        EFFECT_HEAVY_CLICK: 5,
      } as const;

      /**
       * Type for Android haptics effect feedback
       * - Android Only
       * @since 1.8.0
       */
      export declare type HapticsEffectType =
        (typeof HAPTICS_EFFECT_TYPES)[keyof typeof HAPTICS_EFFECT_TYPES];

      /**
       * Set whether haptics feedback is used or not.
       * @since 1.1.0
       */
      function setHaptics(enable: boolean): void;

      /**
       * Set whether vibration is used or not.
       * @since 1.1.0
       */
      function setVibration(enable: boolean): void;

      /**
       * Get whether haptics feedback is used or not from native.
       * @since 1.1.0
       */
      function getHaptics(callback: (enable: boolean) => void): void;

      /**
       * Get whether vibration is used or not from native.
       * @since 1.1.0
       */
      function getVibration(callback: (enable: boolean) => void): void;

      /**
       * @description
       * Triggers haptics feedback.
       * - Default : `0` (LIGHT)
       * - `0` : LIGHT
       * - `1` : MEDIUM
       * - `2` : HEAVY
       * @since 1.1.0
       * @lastupdated 1.8.0 - modified haptics types
       */
      function haptics(hapticsType?: HapticsType): void;

      /**
       * @description
       * Triggers iOS haptics impact feedback.
       * - iOS Only
       * - Default : `0` (LIGHT)
       * - `0` : LIGHT // iOS 10.0+
       * - `1` : MEDIUM // iOS 10.0+
       * - `2` : HEAVY // iOS 10.0+
       * - `3` : SOFT // iOS 13.0+
       * - `4` : RIGID // iOS 13.0+
       * @since 1.8.0
       */
      function hapticsImpact(hapticsType?: HapticsImpactType): void;

      /**
       * @description
       * Triggers iOS haptics notification feedback.
       * Used to communicate successes, failures and warnings.
       * - iOS Only
       * - Default : `0` (SUCCESS)
       * - `0` : SUCCESS
       * - `1` : WARNING
       * - `2` : ERROR
       * @since 1.8.0
       */
      function hapticsNotification(hapticsType?: HapticsImpactType): void;

      /**
       * @description
       * Triggers iOS haptics selection feedback.
       * Used to indicate a change in selection.
       * - iOS Only
       * @since 1.8.0
       */
      function hapticsSelection(): void;

      /**
       * @description
       * Triggers Android haptics effect.
       * - Android Only
       * - Default : `0` (SUCCESS)
       * - `0` : EFFECT_CLICK
       * - `1` : EFFECT_DOUBLE_CLICK
       * - `2` : EFFECT_TICK
       * - `5` : EFFECT_HEAVY_CLICK
       * @since 1.8.0
       */
      function hapticsEffect(hapticsType?: HapticsEffectType): void;

      /**
       * Triggers vibration.
       * @since 1.1.0
       */
      function vibrate(): void;
    }
  }
}

var Nachocode$1 = Nachocode;

type NachocodeContextType = {
    isLoading: true;
    isError: false;
    error: null;
    Nachocode: null;
} | {
    isLoading: false;
    isError: true;
    error: Error;
    Nachocode: null;
} | {
    isLoading: false;
    isError: false;
    error: null;
    Nachocode: typeof Nachocode$1;
};
declare function NachoProvider({ apiKey, options, version, onInitialized, children, }: {
    apiKey: string;
    options?: Nachocode$1.InitializeOptions;
    version?: Nachocode$1.VersionString;
    onInitialized?: (response?: {
        appKey?: string;
        appName?: string;
        appSourceVersion?: Nachocode$1.VersionString;
        appVersion?: Nachocode$1.VersionString;
        deviceModel?: string;
        os?: 'iOS' | 'Android';
        osVersion?: string;
        packageName?: string;
        pushToken?: string;
    }) => void;
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useNachocodeContext(): NachocodeContextType;

type UseNachocodeReturn = {
    isLoading: true;
    isError: false;
    error: null;
    Nachocode: null;
} | {
    isLoading: false;
    isError: true;
    error: Error;
    Nachocode: null;
} | {
    isLoading: false;
    isError: false;
    error: null;
    Nachocode: typeof Nachocode$1;
};
declare function useNachocode(apiKey: string, options?: Nachocode$1.InitializeOptions, version?: Nachocode$1.VersionString, onInitialized?: (response?: {
    appKey?: string;
    appName?: string;
    appSourceVersion?: Nachocode$1.VersionString;
    appVersion?: Nachocode$1.VersionString;
    deviceModel?: string;
    os?: 'iOS' | 'Android';
    osVersion?: string;
    packageName?: string;
    pushToken?: string;
}) => void): UseNachocodeReturn;

export { NachoProvider, loadNachocode, useNachocode, useNachocodeContext };
