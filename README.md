# 2026 KMRTS 춘계학술대회 논문 열람 사이트

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

GitHub에 비어 있는 공개 저장소를 만든 후 이 폴더에서 다음 명령을 실행합니다.

```powershell
git init -b main
git add .
git commit -m "Initial conference website"
git remote add origin https://github.com/깃허브아이디/kmrts-2026.git
git push -u origin main
```

GitHub 저장소의 `Settings > Pages`에서 `Deploy from a branch`, `main`, `/(root)`를 선택합니다. 이후 수정 사항은 `git add .`, `git commit`, `git push` 순서로 반영합니다.

`.gitignore`는 홈페이지에서 사용하지 않는 Word 원본과 광고 PDF 원본을 제외하며, 팝업에 사용하는 JPG 이미지는 배포에 포함합니다.
