// 챗봇 JavaScript
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.userInfo = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserInfo();
    }

    bindEvents() {
        // 챗봇 토글 버튼
        const toggleBtn = document.getElementById('chatbot-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleChatbot());
        }

        // 챗봇 닫기 버튼
        const closeBtn = document.getElementById('chatbot-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChatbot());
        }

        // 메시지 전송
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        
        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            const container = document.getElementById('chatbot-container');
            if (container && !container.contains(e.target) && this.isOpen) {
                this.closeChatbot();
            }
        });
    }

    loadUserInfo() {
        // 로컬 스토리지에서 사용자 정보 로드
        const savedInfo = localStorage.getItem('chatbot_user_info');
        if (savedInfo) {
            this.userInfo = JSON.parse(savedInfo);
        }
    }

    saveUserInfo() {
        // 사용자 정보를 로컬 스토리지에 저장
        localStorage.setItem('chatbot_user_info', JSON.stringify(this.userInfo));
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const panel = document.getElementById('chatbot-panel');
        if (panel) {
            panel.classList.add('active');
            this.isOpen = true;
            
            // 입력 필드에 포커스
            const input = document.getElementById('chatbot-input');
            if (input) {
                setTimeout(() => input.focus(), 300);
            }
        }
    }

    closeChatbot() {
        const panel = document.getElementById('chatbot-panel');
        if (panel) {
            panel.classList.remove('active');
            this.isOpen = false;
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');
        const messagesContainer = document.getElementById('chatbot-messages');
        
        if (!input || !sendBtn || !messagesContainer) return;

        const message = input.value.trim();
        if (!message) return;

        // 사용자 메시지 표시
        this.addMessage(message, 'user');
        input.value = '';
        sendBtn.disabled = true;

        try {
            // 챗봇 API 호출
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_info: this.userInfo
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.addMessage(data.message, 'bot');
                
                // 예약 관련 메시지인지 확인하고 사용자 정보 수집
                if (this.shouldCollectUserInfo(message)) {
                    this.collectUserInfo();
                }
            } else {
                this.addMessage('죄송합니다. 일시적인 오류가 발생했습니다.', 'bot');
            }
        } catch (error) {
            console.error('챗봇 API 오류:', error);
            this.addMessage('죄송합니다. 네트워크 오류가 발생했습니다.', 'bot');
        } finally {
            sendBtn.disabled = false;
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        
        // 스크롤을 맨 아래로
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 애니메이션 효과
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    shouldCollectUserInfo(message) {
        // 예약 관련 키워드가 있는지 확인
        const reservationKeywords = ['예약', '상담', '예약하고', '상담받고', '예약할', '상담받을'];
        return reservationKeywords.some(keyword => message.includes(keyword));
    }

    collectUserInfo() {
        // 사용자 정보가 없으면 수집
        if (!this.userInfo.name || !this.userInfo.phone) {
            setTimeout(() => {
                this.addMessage('예약을 도와드리기 위해 몇 가지 정보가 필요합니다. 이름과 연락처를 알려주세요.', 'bot');
            }, 1000);
        }
    }

    async makeReservation(name, phone, date, time, consultationType = '방문 상담') {
        try {
            const response = await fetch('/api/make-reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    date: date,
                    time: time,
                    consultation_type: consultationType
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('예약 API 오류:', error);
            return {
                success: false,
                message: '예약 처리 중 오류가 발생했습니다.'
            };
        }
    }

    async getAvailableTimes(date = null) {
        try {
            const url = date ? `/api/available-times?date=${date}` : '/api/available-times';
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                return data.available_times;
            } else {
                return [];
            }
        } catch (error) {
            console.error('예약 가능 시간 조회 오류:', error);
            return [];
        }
    }
}

// 챗봇 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new Chatbot();
});

// 전역 함수로 노출 (다른 스크립트에서 사용 가능)
window.Chatbot = Chatbot;
