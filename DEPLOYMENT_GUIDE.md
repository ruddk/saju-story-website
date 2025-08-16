# 🌐 사주이야기 웹사이트 배포 가이드

## 🚀 Render 배포 방법 (추천 - 무료)

### 1단계: GitHub에 코드 업로드
1. GitHub 계정 생성 (없다면)
2. 새 저장소 생성: `saju-story-website`
3. 로컬 코드를 GitHub에 업로드:
```bash
git init
git config --global user.name "ruddk"
git config --global user.email "tntwo1@gmail.com"
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
3. GitHub 저장소 연결 -GitHub 계정으로 로그인
                    "All repositories" 선택 ✅ (이것이 중요!)
                    연결 후 saju-story-website 저장소를 찾아서 선택
4. 설정:
    Name: saju-story-website
    Language: Python 3
    Branch: main
    Region: Singapore (또는 Oregon)
    Root Directory: (비워두기)
    Instance Type: Free
    Build Command: pip install -r requirements.txt
    Start Command: gunicorn app:app
    Instance type: Free

### 3단계: 환경변수 설정 (필요시)
- `OPENAI_API_KEY`: OpenAI API 키 (챗봇 기능 사용시)

### 4단계: 배포 완료
- 배포가 완료되면 `https://your-app-name.onrender.com` 형태의 URL 제공

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
- **Vercel**: 월 100GB 대역폭
- **Railway**: 월 $5 크레딧

### 2. 성능 최적화
- 정적 파일 캐싱 설정
- 이미지 압축
- CSS/JS 최소화

### 3. 보안 설정
- 환경변수로 민감한 정보 관리
- HTTPS 강제 적용
- CORS 설정 확인

---

## 🆘 문제 해결

### 일반적인 오류
1. **포트 오류**: `PORT` 환경변수 확인
2. **의존성 오류**: `requirements.txt` 업데이트
3. **메모리 부족**: 무료 플랜 제한 확인

### 로그 확인
- Render: Dashboard > Logs
- Vercel: Dashboard > Functions > Logs
- Railway: Project > Deployments > Logs

---

## 📞 지원

문제가 발생하면:
1. 로그 확인
2. 로컬에서 재현 시도
3. GitHub Issues 등록
