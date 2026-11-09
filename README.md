# 2026 KMRTS 춘계·추계학술대회 홈페이지

- 춘계: https://globaljoe.github.io/KMRTS2026/
- 추계: https://globaljoe.github.io/KMRTS2026/autumn/

기존 춘계 홈페이지는 루트에 유지하고 추계 홈페이지는 `autumn/` 폴더에 배치했습니다. 춘계 첫 화면의 안내 링크로 추계 홈페이지에 이동할 수 있습니다.

## 추계 홈페이지

2026년 11월 13일 부산 BPEX에서 개최되는 한국해양로봇기술연구회 추계학술대회의 일정, 초청강연 2건, 발표자료 16편, 후원사 광고 3종과 전체 프로시딩 152쪽을 제공합니다. 새 명칭과 로고를 반영했으며 모바일 화면과 제목·저자·소속·키워드 검색을 지원합니다.

`autumn/index.html`을 브라우저로 열거나 위 추계 주소로 접속하세요. 웹용 프로시딩은 `autumn/downloads/proceedings.pdf`입니다. 인쇄용 원본과 제작 중간 자료는 저장소에 포함하지 않습니다.

추계 발표 목록은 `autumn/papers.json`과 HTML 내부의 `paper-data`를 함께 수정해야 로컬 파일 열기와 웹 서버에서 같은 내용이 표시됩니다. 일정·장소 등의 고정 안내는 HTML에도 있습니다.

GitHub Pages는 기존 `main` 브랜치의 루트 배포를 그대로 사용합니다. 별도의 빌드나 외부 서비스 연결이 필요하지 않습니다.

## 춘계 홈페이지

학회 프로그램과 제출 논문 PDF를 프로그램 순서대로 열람하는 정적 웹사이트입니다. HTML/CSS/JavaScript만 사용하며 별도 빌드 과정이나 서버가 필요하지 않습니다.

## 실행

`index.html`을 더블클릭해 브라우저에서 엽니다. 초청강연 또는 논문 제목을 누르면 해당 PDF가 새 탭에서 열립니다.

인터넷 연결 없이도 모든 핵심 기능이 동작합니다. Google Fonts 연결이 되지 않을 때는 시스템 글꼴로 자동 대체됩니다.

## 논문 데이터 관리

논문과 초청강연 정보의 원본은 `papers.json`입니다. 항목 구조는 다음과 같습니다.

```json
{
  "code": "A-P1",
  "session": "A",
  "title": "논문 제목",
  "authors": "저자",
  "affiliation": "소속",
  "file": "04_papers/파일명.pdf",
  "keywords": ["키워드"]
}
```

웹 서버에서 열면 `papers.json`을 자동으로 불러옵니다. 브라우저 보안 정책상 `file://` 페이지에서는 외부 JSON 로딩이 차단되므로, `index.html` 안에도 동일한 백업 데이터가 포함되어 있습니다. JSON 내용을 수정할 때는 서버 없이 여는 환경을 위해 `fallbackPapers`도 함께 갱신해 주세요.

## 폴더 구성

- `index.html` — 사이트 전체 UI와 동작
- `papers.json` — 학회·초청강연·논문 데이터
- `02_program/program.pdf` — 전체 프로그램
- `03_plenary/` — 초청강연 PDF
- `04_papers/` — 발표 논문 PDF

세션 A 8편과 세션 B 7편을 표시합니다. `B-P4`는 다른 논문과 같은 형태의 카드로 표시되지만 PDF 링크는 연결되어 있지 않습니다.

## GitHub Pages 배포

기존 `globaljoe/KMRTS2026` 저장소의 `main` 브랜치와 루트 폴더에서 배포합니다. 수정한 파일을 확인한 뒤 필요한 파일만 커밋하고 푸시합니다.

```powershell
git add autumn index.html README.md .gitignore
git commit -m "Update conference website"
git push origin main
```

GitHub 저장소의 `Settings > Pages`에서 기존 `Deploy from a branch`, `main`, `/(root)` 설정을 유지합니다. 추계 PDF와 이미지는 `autumn/` 내부 상대경로로 연결되어 있습니다.

`.gitignore`는 홈페이지에서 사용하지 않는 Word 원본과 광고 PDF 원본을 제외하며, 팝업에 사용하는 JPG 이미지는 배포에 포함합니다.
