# Founder report — 2026-10-07

- **오늘의 문제:** 웹에서 중요한 한 문장을 저장해도, 나중에 그 문장이 그대로인지 빠르게 알기 어렵다.
- **첫 사용자:** 학생, 기자, 정책 연구자, 웹 지침을 추적하는 사람.
- **해결 방법:** 선택한 한 문장을 로컬 digest pin으로 저장하고, 나중에 다시 선택해 `EXACT`, `CHANGED`, `MISSING`을 즉시 확인한다.
- **기존 방식과 다른 점:** quote library나 background monitor가 아니라, 한 passage만 다루는 portable local integrity primitive다.
- **만든 MVP:** Chrome MV3 extension, hash-only 기본 저장, opt-in quote 저장, tamper detection, offline CLI, local demo, tests, CI, docs.
- **실행 방법:** `npm install && npm run build && npm run demo`; 확장 프로그램은 `dist/`를 unpacked extension으로 로드한다.
- **사용자에게 줄 가치:** 스크린샷·북마크보다 작은 파일 하나로 나중의 문장 일치 여부를 확인한다.
- **수익 모델 가설:** 핵심 local 기능은 무료 오픈소스. 팀용 evidence workflow와 보관 정책은 유료가 될 수 있지만 검증되지 않았다.
- **확인된 사실:** Chrome은 명시적 사용자 action 뒤 `activeTab` 임시 접근을 제공하고, Web Crypto는 SHA-256 digest를 제공한다. 기존 quote clipper와 page monitor가 이미 있어 차별점을 좁혔다. 근거는 `docs/research/2026-10-passagepin-research.md`에 있다.
- **아직 검증되지 않은 가설:** 10명의 evidence 사용자 중 3명 이상이 screenshot/bookmark보다 PassagePin을 선호하고 결과를 설명 없이 이해한다.
- **오늘의 희망 근거:** 기능이 한 문장·한 파일·한 결과로 좁고, 기본 raw text를 저장하지 않으며, 즉시 확인 가능한 결과를 만든다.
- **내일의 단 하나의 실험:** 10명에게 같은 문장의 원본·수정본을 pin/verify하게 하고 EXACT/CHANGED/MISSING 이해율을 측정한다.
- **GitHub 공개 URL:** publication appendix에 기록.
- **commit·CI·release 결과:** publication appendix에 기록.
-
## Publication appendix

- **Public repository:** https://github.com/juwonllee2024-dotcom/passagepin
- **Commit:** `f2669be6c199687628975f8ea6c74c29dfc82a34`
- **CI:** [run 37557106923](https://github.com/juwonllee2024-dotcom/passagepin/actions/runs/37557106923) — success
- **Release:** [v0.1.0](https://github.com/juwonllee2024-dotcom/passagepin/releases/tag/v0.1.0)
- **Source archive:** `passagepin-v0.1.0-source.zip`, 51,390 bytes, SHA-256 `7eaa93853839e50b31e4cbb01cf6947a42986ceca3c66c6569009fbbde9bec99`, 0 downloads at verification time.
- **Remote snapshot:** 0 stars, 0 forks, 0 watchers, 0 open issues, 0 open pull requests; traffic 0 views / 0 clones in the available 14-day window.
- **Account snapshot:** 44 repositories after publication versus 43 before; aggregate stars 3, forks 0, watchers 1, open issues 0, open pull requests 1.
- **막힌 이유:** live browser connector 부재. 재개 조건은 connector를 연결한 뒤 실제 Chrome toolbar selection flow를 실행하는 것이다.
