# BOJ-Committer

이 프로젝트는 [백준 온라인 저지](https://www.acmicpc.net/) 문제를 푼 후 [Visual Studio Code](https://code.visualstudio.com/)내에서 소스 Staging과 Commit을 단축키를 통해 한 번에 할 수 있도록 하는 Extension입니다.

## 특징 및 주의사항

1. 해당 Extension을 사용시 현재 에디터에 있는 소스파일이 자동적으로 저장되며 (`.\unsolved`) 폴더에서 (`.\solved`) 폴더로 이동됩니다. 그 후 Staging과 Commit 과정이 이루어집니다. (Push는 되지 않습니다.)

2. Commit 메시지는 자동적으로 소스파일명에 적혀있는 문제번호로 웹 파싱을 진행하여 해당 문제의 이름으로 작성됩니다. 이를 위해서 파일명이 `BOJ문제번호.확장자`로 이루어져야합니다.

3. Commit시 현재 Repository의 Stage에 올라와있는 모든 파일들이 동시에 Commit되므로 주의해주세요.

4. 이 Extension은 `Window OS` 환경에서만 테스트되었습니다.

## 사용법 For Window OS

1. Extension을 설치한 후 Visual Studio Code내에서
`File > Preferences > Keyboard ShortCuts`에 들어가서
검색창에 `extension.BOJ-Committer`를 검색하여 이 Extension을 사용하기 위한 단축키로 키 바인딩 설정을 해주세요.

2. 본인이 문제를 저장해둘 폴더에 Repository를 생성해주시고, `solved` 폴더와
`unsolved` 폴더를 생성해주세요.

3. `unsolved` 폴더에 자신이 풀 문제의 소스파일을 `BOJ문제번호.확장자`의 형태로 생성해주세요.

4. 문제를 푼 후 자신이 설정했던 단축키를 실행하면
자동적으로 `solved` 폴더에 문제가 이동되고 커밋이 완료됩니다.

**Enjoy!**
