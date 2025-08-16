import os
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

# 환경 변수 로드 (dotenv가 없을 경우를 대비)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("Warning: python-dotenv not installed. Using system environment variables.")

# LangChain 관련 import (선택적)
try:
    from langchain_openai import ChatOpenAI
    from langchain_community.vectorstores import FAISS
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.chains import ConversationalRetrievalChain
    from langchain.memory import ConversationBufferMemory
    from langchain.prompts import PromptTemplate
    LANGCHAIN_AVAILABLE = True
except ImportError:
    print("Warning: LangChain packages not available. Using simple chatbot mode.")
    LANGCHAIN_AVAILABLE = False

class SajuChatbot:
    def __init__(self):
        # 예약 데이터 (실제로는 데이터베이스 사용)
        self.reservations = self._load_reservations()
        
        # 사용자 정보 및 대화 기록 (학습 데이터)
        self.user_profiles = self._load_user_profiles()
        
        # 상담 가능 시간
        self.available_hours = {
            "월요일": [],
            "화요일": ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            "수요일": ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            "목요일": ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            "금요일": ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            "토요일": ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            "일요일": ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
        }
        
        # LangChain이 사용 가능한 경우에만 초기화
        if LANGCHAIN_AVAILABLE:
            try:
                self.llm = ChatOpenAI(
                    model_name="gpt-3.5-turbo",
                    temperature=0.7,
                    api_key=os.getenv("OPENAI_API_KEY")
                )
                
                # 임베딩 모델 초기화
                self.embeddings = HuggingFaceEmbeddings(
                    model_name="sentence-transformers/all-MiniLM-L6-v2",
                    model_kwargs={'device': 'cpu'}
                )
                
                # 대화 메모리
                self.memory = ConversationBufferMemory(
                    memory_key="chat_history",
                    return_messages=True
                )
                
                # 벡터 스토어 초기화
                self.vectorstore = self._initialize_vectorstore()
                
                # 챗봇 체인 초기화
                self.qa_chain = self._initialize_qa_chain()
                
                self.use_langchain = True
            except Exception as e:
                print(f"Warning: LangChain initialization failed: {e}")
                self.use_langchain = False
        else:
            self.use_langchain = False
    
    def _load_reservations(self) -> Dict[str, Any]:
        """예약 데이터 로드 (실제로는 데이터베이스에서 로드)"""
        try:
            with open('data/reservations.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "reservations": [],
                "next_id": 1
            }
    
    def _save_reservations(self):
        """예약 데이터 저장"""
        os.makedirs('data', exist_ok=True)
        with open('data/reservations.json', 'w', encoding='utf-8') as f:
            json.dump(self.reservations, f, ensure_ascii=False, indent=2)
    
    def _load_user_profiles(self) -> Dict[str, Any]:
        """사용자 프로필 데이터 로드"""
        try:
            with open('data/user_profiles.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "users": {},
                "conversation_history": [],
                "learning_data": {
                    "common_questions": {},
                    "user_preferences": {},
                    "consultation_patterns": {}
                }
            }
    
    def _save_user_profiles(self):
        """사용자 프로필 데이터 저장"""
        os.makedirs('data', exist_ok=True)
        with open('data/user_profiles.json', 'w', encoding='utf-8') as f:
            json.dump(self.user_profiles, f, ensure_ascii=False, indent=2)
    
    def _initialize_vectorstore(self):
        """벡터 스토어 초기화"""
        if not LANGCHAIN_AVAILABLE:
            return None
            
        try:
            # 사주 상담 관련 지식 베이스
            knowledge_base = """
            수목선생의 사주이야기는 전문 사주 상담 서비스입니다.
            
            상담 서비스:
            - 60분 상담: 50,000원
            - 상담 방법: 방문 상담, 전화 상담, 영상 상담
            - 상담 시간: 화요일-일요일 10:00-19:00 (월요일 휴무)
            - 점심시간: 12:00-13:00
            
            예약 안내:
            - 사전 예약 필수
            - 예약은 전화, 이메일, 웹사이트를 통해 가능
            - 예약 변경은 상담 24시간 전까지 가능
            - 취소는 상담 24시간 전까지 무료
            
            상담 준비사항:
            - 생년월일, 태어난 시간, 태어난 곳 정보 준비
            - 상담하고 싶은 내용 미리 정리
            - 신분증 지참 (방문 상담 시)
            
            위치 안내:
            - 주소: 서울시 강남구 테헤란로 123 사주도서관 빌딩 2층
            - 지하철: 2호선, 신분당선 강남역 3번 출구 도보 5분
            - 주차: 건물 내 지하주차장 (1시간 무료)
            
            연락처:
            - 전화: 010-1234-5678
            - 이메일: saju@library.com
            - 카카오톡: @수목선생사주도서관
            """
            
            # 텍스트 분할
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            texts = text_splitter.split_text(knowledge_base)
            
            # 벡터 스토어 생성
            vectorstore = FAISS.from_texts(texts, self.embeddings)
            return vectorstore
        except Exception as e:
            print(f"Warning: Vector store initialization failed: {e}")
            return None
    
    def _initialize_qa_chain(self):
        """QA 체인 초기화"""
        if not LANGCHAIN_AVAILABLE or not self.vectorstore:
            return None
            
        try:
            prompt_template = """
            당신은 수목선생의 사주이야기의 친절한 상담 도우미입니다.
            
            다음 정보를 바탕으로 질문에 답변해주세요:
            {context}
            
            현재 예약 가능한 시간:
            {available_times}
            
            사용자 질문: {question}
            
            답변은 친근하고 도움이 되도록 해주세요. 예약 관련 질문이면 구체적인 날짜와 시간을 제안해주세요.
            """
            
            prompt = PromptTemplate(
                template=prompt_template,
                input_variables=["context", "available_times", "question"]
            )
            
            qa_chain = ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=self.vectorstore.as_retriever(),
                memory=self.memory,
                combine_docs_chain_kwargs={"prompt": prompt}
            )
            
            return qa_chain
        except Exception as e:
            print(f"Warning: QA chain initialization failed: {e}")
            return None
    
    def get_available_times(self, date_str: str = None) -> List[str]:
        """특정 날짜의 예약 가능한 시간 반환"""
        if not date_str:
            # 오늘부터 7일간의 가능한 시간 반환
            available_times = []
            for i in range(7):
                date = datetime.now() + timedelta(days=i)
                day_name = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"][date.weekday()]
                if day_name != "월요일":  # 월요일 휴무
                    date_str = date.strftime("%Y-%m-%d")
                    times = self._get_available_times_for_date(date_str, day_name)
                    if times:
                        available_times.append(f"{date_str} ({day_name}): {', '.join(times)}")
            return available_times
        
        # 특정 날짜의 가능한 시간
        date = datetime.strptime(date_str, "%Y-%m-%d")
        day_name = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"][date.weekday()]
        return self._get_available_times_for_date(date_str, day_name)
    
    def _get_available_times_for_date(self, date_str: str, day_name: str) -> List[str]:
        """특정 날짜의 예약 가능한 시간 계산"""
        if day_name == "월요일":
            return []
        
        # 해당 날짜의 기존 예약 확인
        existing_reservations = [
            r for r in self.reservations["reservations"]
            if r["date"] == date_str
        ]
        
        booked_times = [r["time"] for r in existing_reservations]
        available_times = [
            time for time in self.available_hours[day_name]
            if time not in booked_times
        ]
        
        return available_times
    
    def make_reservation(self, name: str, phone: str, date: str, time: str, consultation_type: str = "방문 상담") -> Dict[str, Any]:
        """예약 생성"""
        # 예약 가능 여부 확인
        available_times = self.get_available_times(date)
        if time not in available_times:
            return {
                "success": False,
                "message": f"죄송합니다. {date} {time}은 이미 예약된 시간입니다."
            }
        
        # 새 예약 생성
        reservation = {
            "id": self.reservations["next_id"],
            "name": name,
            "phone": phone,
            "date": date,
            "time": time,
            "consultation_type": consultation_type,
            "status": "confirmed",
            "created_at": datetime.now().isoformat()
        }
        
        self.reservations["reservations"].append(reservation)
        self.reservations["next_id"] += 1
        self._save_reservations()
        
        return {
            "success": True,
            "message": f"예약이 완료되었습니다! {date} {time}에 {consultation_type}으로 상담을 진행하겠습니다.",
            "reservation": reservation
        }
    
    def chat(self, message: str, user_info: Dict[str, Any] = None) -> str:
        """챗봇 응답 생성"""
        # 사용자 인식 및 학습
        user_id = self._identify_user(user_info)
        self._learn_from_conversation(user_id, message, user_info)
        
        # 예약 가능한 시간 정보 추가
        available_times = self.get_available_times()
        available_times_text = "\n".join(available_times[:3])  # 최근 3일만 표시
        
        # 사용자 정보가 있으면 예약 처리
        if user_info and "예약" in message:
            try:
                # 메시지에서 날짜와 시간 추출 (간단한 예시)
                if "예약" in message and user_info.get("name") and user_info.get("phone"):
                    # 실제로는 더 정교한 날짜/시간 파싱 필요
                    return self._handle_reservation_request(message, user_info)
            except Exception as e:
                return f"예약 처리 중 오류가 발생했습니다: {str(e)}"
        
        # LangChain이 사용 가능한 경우
        if self.use_langchain:
            try:
                response = self.qa_chain.invoke({
                    "question": message,
                    "available_times": available_times_text
                })
                return response["answer"]
            except Exception as e:
                return self._simple_response(message, user_id)
        else:
            # 간단한 응답 시스템
            return self._simple_response(message, user_id)
    
    def _identify_user(self, user_info: Dict[str, Any] = None) -> str:
        """사용자 식별 (전화번호 또는 이름 기반)"""
        if not user_info:
            return "anonymous"
        
        # 전화번호로 식별 (가장 정확)
        if user_info.get("phone"):
            return f"phone_{user_info['phone']}"
        
        # 이름으로 식별
        if user_info.get("name"):
            return f"name_{user_info['name']}"
        
        return "anonymous"
    
    def _learn_from_conversation(self, user_id: str, message: str, user_info: Dict[str, Any] = None):
        """대화에서 학습"""
        # 사용자 정보 저장
        if user_info and user_id != "anonymous":
            if user_id not in self.user_profiles["users"]:
                self.user_profiles["users"][user_id] = {
                    "info": user_info,
                    "first_visit": datetime.now().isoformat(),
                    "visit_count": 0,
                    "last_visit": datetime.now().isoformat(),
                    "preferences": {},
                    "conversation_topics": []
                }
            else:
                self.user_profiles["users"][user_id]["visit_count"] += 1
                self.user_profiles["users"][user_id]["last_visit"] = datetime.now().isoformat()
                if user_info:
                    self.user_profiles["users"][user_id]["info"].update(user_info)
        
        # 대화 기록 저장
        conversation_entry = {
            "user_id": user_id,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "user_info": user_info
        }
        self.user_profiles["conversation_history"].append(conversation_entry)
        
        # 학습 데이터 업데이트
        self._update_learning_data(message, user_id)
        
        # 데이터 저장
        self._save_user_profiles()
    
    def _update_learning_data(self, message: str, user_id: str):
        """학습 데이터 업데이트"""
        message_lower = message.lower()
        
        # 자주 묻는 질문 카운트
        for keyword in ['비용', '가격', '얼마', '요금', '영업시간', '운영시간', '시간', '휴무', 
                       '위치', '주소', '어디', '찾아가', '연락처', '전화', '번호', '카카오', 
                       '예약', '상담받고', '예약하고']:
            if keyword in message_lower:
                if keyword not in self.user_profiles["learning_data"]["common_questions"]:
                    self.user_profiles["learning_data"]["common_questions"][keyword] = 0
                self.user_profiles["learning_data"]["common_questions"][keyword] += 1
                break
        
        # 사용자별 관심사 추적
        if user_id != "anonymous":
            if user_id not in self.user_profiles["learning_data"]["user_preferences"]:
                self.user_profiles["learning_data"]["user_preferences"][user_id] = {
                    "topics": [],
                    "visit_frequency": 0
                }
            
            # 관심 주제 추출
            topics = []
            if any(word in message_lower for word in ['비용', '가격', '얼마']):
                topics.append("가격 문의")
            if any(word in message_lower for word in ['예약', '상담']):
                topics.append("예약 문의")
            if any(word in message_lower for word in ['위치', '주소', '찾아가']):
                topics.append("위치 문의")
            
            for topic in topics:
                if topic not in self.user_profiles["learning_data"]["user_preferences"][user_id]["topics"]:
                    self.user_profiles["learning_data"]["user_preferences"][user_id]["topics"].append(topic)
    
    def _simple_response(self, message: str, user_id: str = "anonymous") -> str:
        """LangChain이 없을 때 사용하는 간단한 응답 시스템 (개인화 포함)"""
        message_lower = message.lower()
        
        # 사용자 맞춤 인사
        greeting = self._get_personalized_greeting(user_id)
        
        # 상담 비용 관련
        if any(keyword in message_lower for keyword in ['비용', '가격', '얼마', '요금']):
            return f"{greeting} 60분 상담은 50,000원입니다. 상담 방법은 방문 상담, 전화 상담, 영상 상담이 가능합니다."
        
        # 영업시간 관련
        if any(keyword in message_lower for keyword in ['영업시간', '운영시간', '시간', '휴무']):
            return f"{greeting} 화요일-일요일 10:00-19:00에 운영하며, 월요일은 휴무입니다. 점심시간은 12:00-13:00입니다."
        
        # 위치 관련
        if any(keyword in message_lower for keyword in ['위치', '주소', '어디', '찾아가']):
            return f"{greeting} 서울시 강남구 테헤란로 123 사주도서관 빌딩 2층에 위치해 있습니다. 2호선, 신분당선 강남역 3번 출구에서 도보 5분 거리입니다."
        
        # 연락처 관련
        if any(keyword in message_lower for keyword in ['연락처', '전화', '번호', '카카오']):
            return f"{greeting} 전화: 010-1234-5678, 이메일: saju@library.com, 카카오톡: @수목선생사주도서관으로 연락주세요."
        
        # 예약 관련
        if any(keyword in message_lower for keyword in ['예약', '상담받고', '예약하고']):
            available_times = self.get_available_times()
            if available_times:
                return f"{greeting} 예약을 도와드리겠습니다! 현재 예약 가능한 시간은 다음과 같습니다:\n\n{chr(10).join(available_times[:5])}\n\n원하시는 날짜와 시간을 알려주세요."
            else:
                return f"{greeting} 죄송합니다. 현재 예약 가능한 시간이 없습니다. 다른 날짜를 문의해주세요."
        
        # 기본 응답
        return f"{greeting} 수목선생의 사주이야기 상담도우미입니다. 상담 예약, 비용, 위치, 영업시간 등에 대해 문의해주세요."
    
    def _get_personalized_greeting(self, user_id: str) -> str:
        """개인화된 인사말 생성"""
        if user_id == "anonymous":
            return "안녕하세요!"
        
        user_data = self.user_profiles["users"].get(user_id, {})
        if not user_data:
            return "안녕하세요!"
        
        name = user_data.get("info", {}).get("name", "")
        visit_count = user_data.get("visit_count", 0)
        
        if name:
            if visit_count == 1:
                return f"안녕하세요 {name}님! 처음 뵙겠습니다."
            elif visit_count > 1:
                return f"안녕하세요 {name}님! 또 뵙게 되어 반갑습니다."
            else:
                return f"안녕하세요 {name}님!"
        
        return "안녕하세요!"
    
    def _handle_reservation_request(self, message: str, user_info: Dict[str, Any]) -> str:
        """예약 요청 처리"""
        # 간단한 예약 처리 (실제로는 더 정교한 NLP 필요)
        if "예약" in message:
            available_times = self.get_available_times()
            if available_times:
                return f"""
안녕하세요 {user_info['name']}님!

현재 예약 가능한 시간은 다음과 같습니다:

{chr(10).join(available_times[:5])}

원하시는 날짜와 시간을 알려주시면 예약을 도와드리겠습니다.
예시: "내일 오후 2시에 예약하고 싶어요"
"""
            else:
                return "죄송합니다. 현재 예약 가능한 시간이 없습니다. 다른 날짜를 문의해주세요."
        
        return "예약 관련 문의사항이 있으시면 언제든 말씀해주세요!"

# 챗봇 인스턴스 생성
chatbot = SajuChatbot()
