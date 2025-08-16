# 수목선생의 사주이야기 - 설치 가이드

## 🚀 빠른 시작

### 1. 기본 설치 (챗봇 없이)
```bash
# conda 환경 활성화
conda activate k1

# 기본 패키지만 설치
pip install flask==2.3.3

# 서버 실행
python app.py
```

### 2. 챗봇 기능 포함 설치 (선택사항)

#### 2-1. 기본 챗봇 (LangChain 없이)
```bash
# 기본 패키지 설치
pip install flask==2.3.3 python-dotenv==1.0.0

# 서버 실행
python app.py
```

#### 2-2. 고급 챗봇 (LangChain 포함)
```bash
# 모든 패키지 설치
pip install -r requirements.txt

# 환경 변수 설정
# .env 파일 생성 후 OpenAI API 키 추가

# 서버 실행
python app.py
```

## 🔧 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하세요:

```env
# OpenAI API 설정 (LangChain 사용 시 필요)
OPENAI_API_KEY=your_openai_api_key_here

# Flask 설정
FLASK_ENV=development
FLASK_DEBUG=True
```

## 🌐 접속 방법

서버 실행 후 브라우저에서 `http://localhost:5002`로 접속하세요.

## 📋 기능별 가용성

### 기본 기능 (항상 사용 가능)
- ✅ 메인 페이지
- ✅ 사주 도서관
- ✅ 예약 페이지
- ✅ 방문 안내
- ✅ 소개 페이지
- ✅ 대기실

### 챗봇 기능
- ✅ 기본 챗봇 (LangChain 없이도 작동)
- 🔄 고급 챗봇 (LangChain 필요)

## 🆘 문제 해결

### 패키지 설치 오류
```bash
# 기존 패키지 제거 후 재설치
pip uninstall langchain langchain-openai langchain-community
pip install -r requirements.txt
```

### Import 오류
- 챗봇 모듈이 없어도 기본 웹사이트는 정상 작동합니다
- 콘솔에 경고 메시지가 표시되지만 무시하고 사용 가능합니다

### OpenAI API 키 오류
- API 키가 없어도 기본 챗봇 기능은 사용 가능합니다
- 고급 AI 기능만 제한됩니다

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. Python 버전 (3.8 이상 권장)
2. conda 환경 활성화 상태
3. 패키지 설치 상태
4. 포트 5002 사용 가능 여부
