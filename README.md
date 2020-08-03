# BOJ-Committer

해당 확장자는 [백준 온라인 저지](https://www.acmicpc.net/)에서 문제 Test Case 실행 결과 확인과 문제를 푼 후 소스 Staging과 Commit을 단축키를 통해 한 번에 할 수 있도록 도와주는 [Visual Studio Code](https://code.visualstudio.com/) Extension입니다.

## 특징 및 주의사항

1. 소스코드를 작성하고 나서 단축키를 통해 모든 테스트 케이스에 대한 결과를 확인할 수 있습니다.

2. 테스트 케이스 결과 확인시 코드 실행시간은 검사하지 않으며, 스폐셜 저지 문제는 테스트 케이스 결과 확인 기능을 지원하지 않습니다.

2. 문제를 풀고난 후 단축키를 통해 자동적으로 Git에 커밋할 수 있습니다. (커밋 메시지는 문제 이름으로 설정됩니다.)

2. Commit 메시지는 자동적으로 소스파일명에 적혀있는 문제번호로 웹 파싱을 진행하여 해당 문제의 이름으로 작성됩니다. 이를 위해서 파일명이 `BOJ문제번호.확장자`로 이루어져야합니다. e.g.) `BOJ1000.cpp`

3. Commit시 현재 Repository의 Stage에 올라와있는 모든 파일들이 동시에 Commit되므로 주의해주세요.

4. 이 Extension은 `Window OS` 환경에서만 테스트되었습니다.

5. 지원언어: C++14, C, Python3 

## 사용법 For Window OS

1. [Extension을 설치](https://marketplace.visualstudio.com/items?itemName=lolmc00.boj-committer)합니다.

2. 본인이 문제를 저장해둘 폴더에 Repository를 생성해주시고, `unsolved` 폴더를 생성해주세요.

3. `unsolved` 폴더에 자신이 풀 문제의 소스파일을 `BOJ문제번호.확장자`의 형태로 생성해주세요.

4. 소스코드를 작성한 후 `Ctrl+Alt+T` 단축키를 실행하면, 테스트케이스 실행 결과를 보여줍니다.

5. 문제를 푼 후 `Ctrl+Alt+G` 단축키를 실행하면, 자동적으로 `solved` 폴더에 문제가 이동되고 커밋이 완료됩니다.

**Enjoy!**
