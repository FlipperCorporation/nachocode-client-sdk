# 📦 nachocode Client SDK

![npm](https://img.shields.io/npm/v/nachocode-client-sdk)
![npm bundle size](https://img.shields.io/bundlephobia/min/nachocode-client-sdk)
![npm downloads](https://img.shields.io/npm/dm/nachocode-client-sdk)
![GitHub stars](https://img.shields.io/github/stars/FlipperCorporation/nachocode-client-sdk)
![License](https://img.shields.io/npm/l/nachocode-client-sdk)

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="https://cdn.nachocode.io/common/assets/images/logo.png" width="130" alt="Nachocode Logo" style="margin-top: 50px; margin-left: 150px" />
</p>
<p align="center">
  <img src="https://cdn.nachocode.io/common/assets/images/character.png" width="170" alt="Nachocode Character" style="margin-bottom: 30px;"/>
</p>
<!-- markdownlint-enable MD033 -->

> 🔔 **최신화 일자:** _2025-10-01_

## 목차

- [📦 nachocode Client SDK](#-nachocode-client-sdk)
  - [목차](#목차)
  - [개요](#개요)
  - [설치](#설치)
  - [사용법](#사용법)
    - [1️⃣ `NachoProvider`, `useNachocodeContext` (React Context 방식)](#1️⃣-nachoprovider-usenachocodecontext-react-context-방식)
    - [2️⃣ `useNachocode` (React Hook 방식)](#2️⃣-usenachocode-react-hook-방식)
      - [`useNachocode()` 반환값](#usenachocode-반환값)
    - [3️⃣ `loadNachocode` 직접 사용](#3️⃣-loadnachocode-직접-사용)
  - [SDK 초기화 옵션 (`InitializeOptions`)](#sdk-초기화-옵션-initializeoptions)
  - [SDK 버전 관리](#sdk-버전-관리)
  - [SDK 기능 사용](#sdk-기능-사용)
  - [네임스페이스 소개](#네임스페이스-소개)
  - [네임스페이스 (외부연동) 소개](#네임스페이스-외부연동-소개)
  - [기여자](#기여자)
  - [기여하기](#기여하기)
  - [라이선스](#라이선스)

---

## 개요

**nachocode Client SDK**는 **웹 개발자들이 네이티브 앱의 고유 기능을 손쉽게 활용할 수 있도록 돕는 SDK**입니다.

이 문서는 **SDK의 설치, 초기화, 주요 기능 및 사용 방법** 등을 안내합니다.

- [공식 문서 바로가기](https://developer.nachocode.io/docs/sdk/intro)

---

## 설치

```bash
npm install nachocode-client-sdk
```

또는

```bash
yarn add nachocode-client-sdk
```

---

## 사용법

nachocode Client SDK는 세 가지 방법으로 사용할 수 있습니다.

### 1️⃣ `NachoProvider`, `useNachocodeContext` (React Context 방식)

- 애플리케이션 전체에서 `Nachocode`를 사용할 수 있도록 `Provider` 패턴을 제공합니다.
- `useNachocodeContext` 훅을 사용하여 `Nachocode` 객체에 접근할 수 있습니다.

```jsx
import { NachoProvider, useNachocodeContext } from 'nachocode-client-sdk';

function MyComponent() {
  const { Nachocode, isLoading, isError, error } = useNachocodeContext();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return <p>Nachocode SDK 사용 가능!</p>;
}

export default function App() {
  return (
    <NachoProvider apiKey="your-api-key-here">
      <MyComponent />
    </NachoProvider>
  );
}
```

### 2️⃣ `useNachocode` (React Hook 방식)

- 특정 `Component`에서만 `Nachocode`를 사용하고 싶다면 `useNachocode` 훅을 사용하여 `Nachocode` 객체에 접근할 수 있습니다.

```jsx
import { useNachocode } from 'nachocode-client-sdk';

export default function MyComponent2() {
  const { Nachocode, isLoading, isError, error } = useNachocode('test-key');

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return <p>Nachocode SDK 사용 가능!</p>;
}
```

#### `useNachocode()` 반환값

| 반환값      | 설명                                          |
| ----------- | --------------------------------------------- |
| `Nachocode` | Nachocode SDK 객체                            |
| `isLoading` | SDK 로딩 상태 (`true` 또는 `false`)           |
| `isError`   | SDK 에러 여부 (`true` 또는 `false`)           |
| `error`     | SDK 로드 중 발생한 에러 (`Error` 또는 `null`) |

### 3️⃣ `loadNachocode` 직접 사용

- React 외부에서도 `loadNachocode` 함수를 직접 호출하여 사용 가능합니다.

```jsx
import { loadNachocode } from 'nachocode-client-sdk';

async function initSDK() {
  try {
    const Nachocode = await loadNachocode('your-api-key-here');
    console.log('Nachocode SDK 로드 완료:', Nachocode);
  } catch (error) {
    console.error('Nachocode SDK 로드 실패:', error);
  }
}

initSDK();
```

---

## SDK 초기화 옵션 (`InitializeOptions`)

nachocode Client SDK는 초기화 시 선택적으로 옵션을 설정할 수 있습니다.

초기화 옵션은 `NachoProvider`, `loadNachocode` 두 방식에서 모두 사용할 수 있습니다.

1. `NachoProvider` 방식에서 `options` 사용

   - `NachoProvider`에 `apiKey`와 함께 `options`를 전달할 수 있습니다:

   ```jsx
   <NachoProvider
     apiKey="your-api-key"
     options={{ sandbox: true, logger: true }}
   >
     <YourComponent />
   </NachoProvider>
   ```

2. `loadNachocode` 직접 호출 시 `options` 사용

   - 비 React 환경 또는 수동으로 초기화하고 싶을 때 사용합니다:

   ```jsx
   loadNachocode('your-api-key', {
     sandbox: true,
     logger: true,
   });
   ```

| 옵션 이름 | 타입    | 설명                                                                 |
| --------- | ------- | -------------------------------------------------------------------- |
| `sandbox` | boolean | ✅ 샌드박스 환경에서 테스트 시 `true`로 설정                         |
| `logger`  | boolean | ✅ 콘솔 로그를 통해 SDK 내부 동작을 디버깅하고 싶을 때 `true`로 설정 |

- `logger`는 기본적으로 true로 설정되어 있으며, 개발 중 디버깅에 유용합니다.
- `sandbox`는 실제 운영 API가 아닌 테스트 서버를 사용하는 경우 유용합니다.

---

## SDK 버전 관리

최신 버전 로드 (기본)

- 최신 버전의 SDK를 항상 유지하려면 아래 코드를 사용하세요
- 현재 최신 버전 v.1.7.0

```jsx
loadNachocode('your-api-key'); // 최신 버전이 자동으로 로드됨
```

특정 버전 지정

- 특정 버전으로 고정하려면 다음과 같이 사용합니다

```jsx
loadNachocode('your-api-key', options, '1.7.0');
```

> 📢 최신 버전 사용이 권장되며, 특정 버전 고정은 호환성이 중요한 경우에만 사용하세요.

---

## SDK 기능 사용

- nachocode Client SDK가 초기화가 완료되면, `Nachocode` 네임스페이스 아래에 정의된 다양한 네이티브 기능을 사용할 수 있습니다.

- 아래 예시는 SDK의 일부 기능을 사용하는 방법을 보여줍니다.

  - **앱 정보 가져오기**

  ```jsx
  const appName = Nachocode.app.getAppName();
  console.log(`앱 이름: ${appName}`); // ex. "Nachocode Developer"
  ```

  - **디바이스 정보 확인**

  ```jsx
  Nachocode.device.getDeviceModel(model => {
    console.log(`디바이스 모델: ${model}`);
  });
  ```

- 대부분의 기능은 웹 실행환경에선 무시되고, 앱 실행환경에서 정상 작동합니다.

---

## 네임스페이스 소개

nachocode SDK는 각 기능별로 **네임스페이스(namespace)** 로 구분되어 있습니다.  
아래는 주요 네임스페이스의 목록과 설명입니다. 각 네임스페이스에 대한 상세한 문서는 **문서 링크**에서 확인하세요.

| **네임스페이스** | **설명**                                                                         | **문서 링크**                                                                             |
| ---------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `app`            | 앱 이름, 버전, 패키지 이름 등의 정보를 제공합니다.                               | [앱 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/app)                 |
| `authentication` | 생체 인증(Fingerprint/Face ID) 등의 기능을 제공합니다.                           | [인증 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/authentication)    |
| `backkey`        | Android 디바이스의 네이티브 백 키 이벤트를 제어할 수 있습니다.                   | [백 키 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/backkey)          |
| `browser`        | 외부 또는 내부 브라우저로 URL을 열 수 있습니다.                                  | [브라우저 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/browser)       |
| `clipboard`      | 텍스트를 클립보드에 복사하거나 읽을 수 있습니다.                                 | [클립보드 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/clipboard)     |
| `device`         | 디바이스 모델, OS 버전, 배터리 및 네트워크 상태 등을 확인합니다.                 | [디바이스 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/device)        |
| `env`            | SDK 초기화 상태, 실행 환경(웹/앱) 등을 확인할 수 있습니다.                       | [환경 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/env)               |
| `event`          | 초기화, 포그라운드/백그라운드 전환, 네트워크 상태 변경 등의 이벤트를 처리합니다. | [이벤트 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/event)           |
| `iap`            | Google Play 및 Apple App Store 인앱 결제 기능을 제공합니다.                      | [인앱 결제 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/iap)          |
| `location`       | 현재 디바이스 위치의 경도, 위도를 확인할 수 있습니다.                            | [Location 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/location)      |
| `permission`     | 카메라, 위치, 푸시 알림 등 디바이스 권한을 요청하고 상태를 확인할 수 있습니다.   | [권한 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/permission)        |
| `preference`     | 애플리케이션 내부 저장소를 통해 데이터를 저장 및 관리합니다.                     | [내부 저장소 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/preference) |
| `push`           | 푸시 알림 토큰을 관리하고 Nachocode 서버에 등록할 수 있습니다.                   | [푸시 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/push)              |
| `scanner`        | QR 코드 스캔 및 기타 스캔 기능을 제공합니다.                                     | [스캐너 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/scanner)         |
| `setting`        | Pull to Refresh와 같은 설정 기능을 제공합니다.                                   | [설정 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/setting)           |
| `share`          | 네이티브 공유 UI를 통해 URL을 공유할 수 있습니다.                                | [공유 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/share)             |
| `store`          | 앱스토어 및 플레이스토어 상호작용 기능을 제공합니다.                             | [공유 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/store)             |
| `tabbar`         | 앱 내부 탭바의 표시 여부 및 이동을 제어할 수 있습니다.                           | [탭 바 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/tabbar)           |
| `vibration`      | 디바이스 진동 및 햅틱 피드백을 제어합니다.                                       | [진동 네임스페이스](https://developer.nachocode.io/docs/sdk/namespaces/vibration)         |

더 많은 네임스페이스와 사용법은 [공식 문서](https://developer.nachocode.io/docs/sdk/intro)를 확인하세요.

---

## 네임스페이스 (외부연동) 소개

nachocode SDK는 연동된 외부 솔루션의 기능들도 **네임스페이스(namespace)** 로 구분되어 있습니다.  
아래는 주요 네임스페이스의 목록과 설명입니다. 각 네임스페이스에 대한 상세한 문서는 **문서 링크**에서 확인하세요.

| **네임스페이스** | **설명**                                                           | **문서 링크**                                                                                      |
| ---------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `apple`          | Apple 계정을 통한 소셜 로그인 기능 등을 제공합니다.                | [Apple 네임스페이스](https://developer.nachocode.io/docs/sdk/integrations/apple/reference)         |
| `appsflyer`      | AppsFlyer 마케팅 애트리뷰션 및 사용자 트래킹 기능 등을 제공합니다. | [AppsFlyer 네임스페이스](https://developer.nachocode.io/docs/sdk/integrations/appsflyer/reference) |
| `facebook`       | Facebook 소셜 로그인 기능을 제공합니다.                            | [Facebook 네임스페이스](https://developer.nachocode.io/docs/sdk/integrations/facebook/reference)   |
| `google`         | Google 소셜 로그인 기능을 제공합니다.                              | [Google 네임스페이스](https://developer.nachocode.io/docs/sdk/integrations/google/reference)       |
| `kakao`          | Kakao 소셜 로그인 기능을 제공합니다.                               | [Kakao 네임스페이스](https://developer.nachocode.io/docs/sdk/integrations/kakao/reference)         |

더 많은 네임스페이스와 사용법은 [공식 문서](https://developer.nachocode.io/docs/sdk/intro)를 확인하세요.

---

## 기여자

<!-- markdownlint-disable MD033 -->
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/kyu6e2" target="_blank">
        <img src="https://avatars.githubusercontent.com/kyu6e2" width="100px;" alt="Your GitHub Profile Picture"/><br>
        <sub>
          <b>Taekyu Park</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/johnhjh" target="_blank">
        <img src="https://avatars.githubusercontent.com/johnhjh" width="100px;" alt="GitHub Profile Picture"/><br>
        <sub>
          <b>John An</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/lazy-sky" target="_blank">
        <img src="https://avatars.githubusercontent.com/lazy-sky" width="100px;" alt="GitHub Profile Picture"/><br>
        <sub>
          <b>Ratel Kim</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
<!-- markdownlint-enable MD033 -->

---

## 기여하기

nachocode Client SDK를 사용해주셔서 감사합니다! 🚀

궁금한 점이나 개선 사항이 있다면 [Issues](https://github.com/FlipperCorporation/nachocode-client-sdk/issues) 또는 [Pull Requests](https://github.com/FlipperCorporation/nachocode-client-sdk/pulls)를 통해 남겨주시거나,

언제든지 [support@nachocode.io](mailto:support@nachocode.io)로 문의를 보내주세요. 🙌

---

## 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 제공됩니다.
