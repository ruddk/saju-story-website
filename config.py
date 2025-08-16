import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # OpenAI API 설정
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your_openai_api_key_here')
    
    # 사주 도서관 설정
    SAJU_LIBRARY_NAME = os.getenv('SAJU_LIBRARY_NAME', '수목선생의 사주이야기')
    SAJU_LIBRARY_ADDRESS = os.getenv('SAJU_LIBRARY_ADDRESS', '서울시 강남구 테헤란로 123')
    SAJU_LIBRARY_PHONE = os.getenv('SAJU_LIBRARY_PHONE', '010-1234-5678')
    SAJU_LIBRARY_EMAIL = os.getenv('SAJU_LIBRARY_EMAIL', 'saju@library.com')
    
    # 영업시간 설정
    BUSINESS_HOURS_START = os.getenv('BUSINESS_HOURS_START', '10:00')
    BUSINESS_HOURS_END = os.getenv('BUSINESS_HOURS_END', '19:00')
    BUSINESS_DAYS = os.getenv('BUSINESS_DAYS', '화,수,목,금,토,일').split(',')
    CLOSED_DAY = os.getenv('CLOSED_DAY', '월요일')
    
    # 상담 설정
    CONSULTATION_DURATION = int(os.getenv('CONSULTATION_DURATION', '60'))
    CONSULTATION_PRICE = int(os.getenv('CONSULTATION_PRICE', '50000'))
    MAX_DAILY_CONSULTATIONS = int(os.getenv('MAX_DAILY_CONSULTATIONS', '8'))
    
    # 챗봇 설정
    CHATBOT_MODEL = "gpt-3.5-turbo"
    CHATBOT_TEMPERATURE = 0.7
    CHATBOT_MAX_TOKENS = 1000
