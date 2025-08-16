// 방문 안내 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 문의 폼 이벤트
    initContactForm();
    
    // 지도 기능 초기화
    initMapFeatures();
    
    // 애니메이션 효과
    initAnimations();
});

// 문의 폼 초기화
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = new FormData(form);
        const contactData = {
            name: formData.get('contactName') || document.getElementById('contactName').value,
            email: formData.get('contactEmail') || document.getElementById('contactEmail').value,
            phone: formData.get('contactPhone') || document.getElementById('contactPhone').value,
            type: formData.get('contactType') || document.getElementById('contactType').value,
            message: formData.get('contactMessage') || document.getElementById('contactMessage').value
        };
        
        // 유효성 검사
        if (!validateContactForm(contactData)) {
            return;
        }
        
        // 문의 제출
        submitContact(contactData);
    });
}

// 문의 폼 유효성 검사
function validateContactForm(data) {
    if (!data.name.trim()) {
        alert('이름을 입력해주세요.');
        document.getElementById('contactName').focus();
        return false;
    }
    
    if (!data.email.trim()) {
        alert('이메일을 입력해주세요.');
        document.getElementById('contactEmail').focus();
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        document.getElementById('contactEmail').focus();
        return false;
    }
    
    if (!data.type) {
        alert('문의 유형을 선택해주세요.');
        document.getElementById('contactType').focus();
        return false;
    }
    
    if (!data.message.trim()) {
        alert('문의 내용을 입력해주세요.');
        document.getElementById('contactMessage').focus();
        return false;
    }
    
    return true;
}

// 문의 제출
function submitContact(data) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // 버튼 상태 변경
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
    
    // 실제로는 서버로 데이터를 전송해야 함
    // 여기서는 시뮬레이션
    setTimeout(() => {
        // 성공 메시지 표시
        showSuccessMessage();
        
        // 폼 초기화
        document.getElementById('contactForm').reset();
        
        // 버튼 복원
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 2000);
}

// 성공 메시지 표시
function showSuccessMessage() {
    // 임시 알림 (실제로는 모달이나 토스트 메시지 사용)
    alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
}

// 지도 기능 초기화
function initMapFeatures() {
    // 지도 관련 기능들을 여기에 추가
    console.log('지도 기능 초기화 완료');
}

// 지도에서 보기
function openMap() {
    // 실제 지도 서비스로 연결
    const address = '서울시 강남구 테헤란로 123';
    const encodedAddress = encodeURIComponent(address);
    
    // 네이버 지도로 연결 (실제 구현 시)
    const mapUrl = `https://map.naver.com/v5/search/${encodedAddress}`;
    
    // 새 창에서 지도 열기
    window.open(mapUrl, '_blank');
    
    // 또는 카카오맵
    // const kakaoMapUrl = `https://map.kakao.com/link/search/${encodedAddress}`;
    // window.open(kakaoMapUrl, '_blank');
}

// 애니메이션 효과 초기화
function initAnimations() {
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll('.transport-card, .nearby-card, .tip-card, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 전화번호 형식 검증
document.getElementById('contactPhone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    if (value.length >= 3 && value.length <= 7) {
        value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    } else if (value.length >= 8) {
        value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
    }
    
    e.target.value = value;
});

// 이메일 형식 검증
document.getElementById('contactEmail').addEventListener('blur', function(e) {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#e74c3c';
        this.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
    } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
    }
});

// 문의 유형 변경 시 추가 필드 표시
document.getElementById('contactType').addEventListener('change', function(e) {
    const selectedType = e.target.value;
    
    // 선택된 유형에 따라 추가 안내 표시
    showTypeSpecificInfo(selectedType);
});

// 유형별 추가 안내 표시
function showTypeSpecificInfo(type) {
    const messageField = document.getElementById('contactMessage');
    const placeholder = messageField.placeholder;
    
    const typeInfo = {
        'reservation': '예약 관련 문의사항을 자세히 적어주세요. (희망 날짜, 시간, 상담 유형 등)',
        'location': '위치나 교통편에 대한 문의사항을 적어주세요.',
        'service': '서비스나 상담에 대한 문의사항을 적어주세요.',
        'other': '기타 문의사항을 자세히 적어주세요.'
    };
    
    if (typeInfo[type]) {
        messageField.placeholder = typeInfo[type];
    } else {
        messageField.placeholder = '문의 내용을 입력해주세요';
    }
}

// 복사 기능
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // 복사 성공 알림
        showToast('클립보드에 복사되었습니다.');
    }).catch(function(err) {
        console.error('복사 실패:', err);
        showToast('복사에 실패했습니다.');
    });
}

// 토스트 메시지 표시
function showToast(message) {
    // 간단한 토스트 메시지 구현
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(139, 125, 107, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1000;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 연락처 클릭 시 복사
document.addEventListener('click', function(e) {
    if (e.target.closest('.contact-item')) {
        const contactItem = e.target.closest('.contact-item');
        const contactText = contactItem.querySelector('p').textContent;
        
        // 클릭 시 복사
        copyToClipboard(contactText);
    }
});

// 지도 플레이스홀더 클릭 이벤트
document.querySelector('.map-placeholder').addEventListener('click', function() {
    openMap();
});

// 키보드 접근성
document.addEventListener('keydown', function(e) {
    // Enter 키로 폼 제출
    if (e.key === 'Enter' && e.target.closest('#contactForm')) {
        const form = document.getElementById('contactForm');
        if (e.target === form.querySelector('button[type="submit"]')) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // ESC 키로 폼 초기화
    if (e.key === 'Escape') {
        const form = document.getElementById('contactForm');
        if (document.activeElement.closest('#contactForm')) {
            form.reset();
            document.activeElement.blur();
        }
    }
});

// 반응형 지도 크기 조정
function resizeMap() {
    const mapContainer = document.querySelector('.map-container');
    if (window.innerWidth <= 768) {
        mapContainer.style.height = '300px';
    } else {
        mapContainer.style.height = '400px';
    }
}

// 윈도우 리사이즈 이벤트
window.addEventListener('resize', resizeMap);

// 초기 로드 시 지도 크기 설정
resizeMap();

