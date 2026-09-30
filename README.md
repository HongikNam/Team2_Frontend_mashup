# CEOS MashUp Team 02 Web

> [CEOS MashUp] Team 02 Web Frontend Repository

센트비(Sentbe)의 **받는 방법을 쉽게 비교하고 선택할 수 있도록** 송금 흐름을 개선하는 프론트엔드 프로젝트입니다.

---

# 👥 Frontend Team

| 이름   | 역할     |
| ------ | -------- |
| 안정규 | Frontend |
| 최승하 | Frontend |

---

# 🌿 Git Convention

## 1. Branch

### 브랜치 종류

| 브랜치                       | 용도      | 규칙                                                                                     |
| ---------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| `main`                       | 배포용    | 항상 안정적인 상태를 유지하며, 직접 작업하지 않습니다.                                   |
| `develop`                    | 개발 통합 | feature 브랜치를 PR + 코드 리뷰 후 merge합니다. 리뷰가 늦어지면 셀프 merge를 허용합니다. |
| `feature/{이슈번호}-{설명}`  | 기능 개발 | 새로운 기능 구현                                                                         |
| `fix/{이슈번호}-{설명}`      | 버그 수정 | 발견된 버그 수정                                                                         |
| `refactor/{이슈번호}-{설명}` | 리팩토링  | 로직 변경 없이 코드 구조 개선                                                            |
| `chore/{이슈번호}-{설명}`    | 설정      | 빌드 설정, 패키지 설치 등                                                                |

### 네이밍 예시

```
feature/#12-login-api
fix/#17-cors-error
chore/#20-env-setting
```

## 2. Commit

### 형식

```
# [type]: {이슈번호} 요약
```

### 예시

```
#[feat]: 12 로그인 API 구현
```

### 타입

| 타입         | 설명                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `[feat]`     | 새로운 기능 추가                                                                                  |
| `[fix]`      | 버그 수정 또는 typo                                                                               |
| `[hotfix]`   | 긴급 수정                                                                                         |
| `[refactor]` | 기능 변경 없는 코드 구조 개선                                                                     |
| `[design]`   | CSS 등 사용자 UI 디자인 변경                                                                      |
| `[style]`    | 코드 포맷팅, 세미콜론 누락 등 코드 변경이 없는 경우                                               |
| `[comment]`  | 필요한 주석 추가 및 변경                                                                          |
| `[test]`     | 테스트 코드 추가, 수정, 삭제 (비즈니스 로직에 변경이 없는 경우)                                   |
| `[docs]`     | 문서 작업 (README, Wiki 등)                                                                       |
| `[chore]`    | 위에 해당하지 않는 기타 변경사항 (환경 설정, 빌드 스크립트 수정, assets 이미지, 패키지 매니저 등) |
| `[init]`     | 프로젝트 초기 생성                                                                                |
| `[rename]`   | 파일, 폴더, 변수, 함수 이름 변경 또는 파일 위치 이동                                              |
| `[remove]`   | 파일을 삭제하는 작업만 수행하는 경우                                                              |

## 3. Issue

### 제목 형식

```
[type] 작업 내용 요약
```

예시: `[feat] 로그인 API 연동`, `[fix] 배포 환경 CORS 에러`

- type은 브랜치 타입과 동일하게 사용합니다. (`feat`, `fix`, `hotfix`, `refactor`, `chore` 등)

## 4. Workflow

1. 이슈를 생성합니다.
2. `develop`에서 이슈 번호로 브랜치를 생성합니다. (예: `feature/#12-login-api`)
3. 컨벤션에 맞춰 커밋합니다.
4. push 후 `develop`으로 PR을 생성합니다.
5. 코드 리뷰 후 merge합니다.

## 4. 파일 구조

```text
src/
├── pages/          화면 단위 (라우트 하나 = 파일 하나)
├── components/     화면을 구성하는 UI 조각
│   ├── common/         여러 화면에서 재사용 (헤더, 바텀시트, 하단 버튼 등)
│   ├── currency/       통화 선택, 금액 입력 관련
│   ├── receiveMethod/  받는 방법 목록, 카드, 상세 시트 관련
│   └── recipient/      수취인 정보 입력 폼 관련
├── stores/         Zustand 전역 상태 (화면을 넘어 이어지는 송금 정보)
├── apis/           서버 요청 함수, axios 설정
├── types/          공통 타입 (통화, 받는 방법, 수취인 등)
├── mocks/          API 전 목데이터
├── hooks/          여러 곳에서 쓰는 커스텀 훅 (필요해지면)
├── constants/      고정값 (통화 목록, 탭 종류 등)
└── utils/          포맷 함수 (금액 콤마, 날짜 등)
```

## 5. Naming Convention

### 컴포넌트

PascalCase를 사용합니다.

```text
ReceiveMethodCard.tsx
CurrencySelector.tsx
RecipientForm.tsx
```

### 변수 · 함수

camelCase를 사용합니다.

```text
selectedCurrency
receiveMethod
handleSubmit
```

### 상수

UPPER_SNAKE_CASE를 사용합니다.

```text
CURRENCY_LIST
MAX_AMOUNT
RECEIVE_METHOD_OPTIONS
```

### 커스텀 훅

`use`로 시작하고, 뒤에 PascalCase로 이름을 붙입니다.

```text
useBottomSheet.ts
useCurrency.ts
useDebounce.ts
```

### Zustand 스토어

`use`로 시작하고, PascalCase 이름 뒤에 `Store`를 붙입니다.

```text
useRemittanceStore.ts
useRecipientStore.ts
useCurrencyStore.ts
```

### 타입 · 인터페이스

PascalCase를 사용합니다.

```text
Currency
Recipient
ReceiveMethod
```

### 일반 폴더

camelCase를 사용합니다.

```text
receiveMethod
components
constants
```
