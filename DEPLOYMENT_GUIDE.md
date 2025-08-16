# 🌐 사주이야기 웹사이트 배포 가이드

## 🚀 Render 배포 방법 (추천 - 무료)

### 1단계: GitHub에 코드 업로드
1. GitHub 계정 생성 (없다면)
2. 새 저장소 생성: `saju-story-website`
3. 로컬 코드를 GitHub에 업로드:

#### Git 설정 (처음 한 번만)
```bash
git config --global user.name "ruddk"
git config --global user.email "tntwo1@gmail.com"
```

#### API 키 보안 문제 해결 (중요!)
만약 `.env` 파일에 API 키가 있다면:
```bash
# .env 파일 제거
git rm .env
git commit -m "Remove .env file with sensitive data"

# .gitignore 파일 생성
echo ".env" > .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
git add .gitignore
git commit -m "Add .gitignore file"
```

#### Git 히스토리 완전 초기화 (API 키 문제가 지속될 때)
```bash
# Windows 명령어
rmdir /s /q .git
git init
del .env
echo .env > .gitignore
echo __pycache__/ >> .gitignore
echo *.pyc >> .gitignore
git add .
git commit -m "Initial commit without sensitive data"
git branch -M main
git remote add origin https://github.com/ruddk/saju-story-website.git
git push -u origin main --force
```

#### 일반적인 업로드 (문제없을 때)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ruddk/saju-story-website.git
git push -u origin main
```

### 2단계: Render 설정
1. [Render.com](https://render.com) 가입
2. "New Web Service" 클릭
3. GitHub 저장소 연결:
   - GitHub 계정으로 로그인
   - **"All repositories" 선택** ✅ (이것이 중요!)
   - 연결 후 `saju-story-website` 저장소를 찾아서 선택
4. 프로젝트 생성:
   - "Create a project" 클릭
   - 프로젝트 이름: `saju-website` (또는 원하는 이름)
5. 서비스 설정:
   - **Name**: saju-story-website
   - **Language**: Python 3
   - **Branch**: main
   - **Region**: Singapore (또는 Oregon) - 한국에서 접속 시 더 빠름
   - **Root Directory**: (비워두기)
   - **Instance Type**: Free
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### 3단계: 환경변수 설정 (필요시)
- **OPENAI_API_KEY**: OpenAI API 키 (챗봇 기능 사용시)
- Render 대시보드 → Environment → Add Environment Variable
- Key: `OPENAI_API_KEY`, Value: 실제 API 키 입력

### 4단계: 배포 완료
- "Create Web Service" 클릭
- 배포가 완료되면 `https://saju-story-website.onrender.com` 형태의 URL 제공
- 배포 시간: 보통 3-5분 소요

---

## 🌐 Vercel 배포 방법 (대안)

### 1단계: Vercel CLI 설치
```bash
npm install -g vercel
```

### 2단계: vercel.json 생성
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.py"
    }
  ]
}
```

### 3단계: 배포
```bash
vercel
```

---

## 🌐 Railway 배포 방법 (대안)

### 1단계: Railway 가입
1. [Railway.app](https://railway.app) 가입
2. GitHub 계정 연결

### 2단계: 프로젝트 배포
1. "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 저장소 선택
4. 자동 배포 시작

---

## 🔧 로컬 테스트

배포 전 로컬에서 테스트:
```bash
# conda 환경 활성화
conda activate k1

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
python app.py

# 브라우저에서 확인
# http://localhost:5002
```

---

## 📝 주의사항

### 1. 무료 플랜 제한사항
- **Render**: 월 750시간 (약 31일)
  - 15분 비활성 시 자동 종료
  - 첫 접속 시 30초-1분 지연 가능
- **Vercel**: 월 100GB 대역폭
- **Railway**: 월 $5 크레딧

### 2. 성능 최적화
- 정적 파일 캐싱 설정
- 이미지 압축
- CSS/JS 최소화

### 3. 보안 설정
- **환경변수로 민감한 정보 관리** (API 키 등)
- HTTPS 강제 적용
- CORS 설정 확인
- `.env` 파일은 절대 GitHub에 업로드하지 않기

### 4. Git 관련 주의사항
- Windows에서는 Linux 명령어 대신 Windows 명령어 사용
- API 키가 포함된 파일은 반드시 `.gitignore`에 추가
- Git 히스토리에 민감한 정보가 들어가면 완전 초기화 필요

---

## 🆘 문제 해결

### GitHub 관련 오류
1. **"Repository is empty"**: GitHub에 코드 업로드 필요
2. **"Push cannot contain secrets"**: API 키가 포함된 파일 제거 필요
   - `.env` 파일 삭제
   - Git 히스토리 초기화 (위의 "Git 히스토리 완전 초기화" 참조)

### Render 관련 오류
1. **포트 오류**: `PORT` 환경변수 확인
2. **의존성 오류**: `requirements.txt` 업데이트
3. **메모리 부족**: 무료 플랜 제한 확인
4. **빌드 실패**: 로그에서 구체적인 오류 메시지 확인

### 로그 확인
- **Render**: Dashboard > Logs
- **Vercel**: Dashboard > Functions > Logs
- **Railway**: Project > Deployments > Logs

### Windows 명령어 참고
- `rm` → `del` (파일 삭제)
- `rm -rf` → `rmdir /s /q` (폴더 삭제)
- `ls` → `dir` (파일 목록)

---

## 📞 지원

문제가 발생하면:
1. 로그 확인
2. 로컬에서 재현 시도
3. GitHub Issues 등록
