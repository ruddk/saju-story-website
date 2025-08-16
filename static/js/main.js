

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 배경 음악 컨트롤
    initMusicControl();
    
    // 책장 클릭 이벤트
    initBookshelf();
    
    // 모달 컨트롤
    initModal();
    
    // 페이지 로드 애니메이션
    initPageAnimations();
});

// 배경 음악 컨트롤
function initMusicControl() {
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;
    
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            isPlaying = false;
        } else {
            bgMusic.play().catch(function(error) {
                console.log('음악 재생 실패:', error);
            });
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
    });
}

// 책장 클릭 이벤트
function initBookshelf() {
    const books = document.querySelectorAll('.book');
    
    books.forEach(book => {
        book.addEventListener('click', function() {
            const category = this.dataset.category;
            const bookSpine = this.querySelector('.book-spine').textContent;
            
            // 책장 클릭 애니메이션
            this.style.transform = 'translateX(20px) scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'translateX(0) scale(1)';
            }, 300);
            
            // 해당 카테고리로 이동 (나중에 구현)
            console.log(`책장 클릭: ${bookSpine} (${category})`);
            
            // 임시로 알림 표시
            showNotification(`${bookSpine} 페이지로 이동합니다.`);
        });
    });
}

// 모달 컨트롤
function initModal() {
    const modal = document.getElementById('fortuneModal');
    const closeBtn = document.querySelector('.close');
    
    // 모달 닫기
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// 페이지 애니메이션 초기화
function initPageAnimations() {
    // 스크롤 시 요소들 페이드인
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
    
    // 관찰할 요소들
    const animatedElements = document.querySelectorAll('.menu-item, .quote-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 오늘의 운세 모달 표시
function showDailyFortune() {
    const modal = document.getElementById('fortuneModal');
    modal.style.display = 'block';
    getDailyFortune();
}

// 오늘의 운세 가져오기
function getDailyFortune() {
    const colorElement = document.getElementById('fortuneColor');
    const numberElement = document.getElementById('fortuneNumber');
    const adviceElement = document.getElementById('fortuneAdvice');
    
    // 로딩 표시
    colorElement.textContent = '뽑는 중...';
    numberElement.textContent = '뽑는 중...';
    adviceElement.textContent = '뽑는 중...';
    
    // API 호출
    fetch('/api/daily-fortune')
        .then(response => response.json())
        .then(data => {
            // 애니메이션과 함께 결과 표시
            setTimeout(() => {
                colorElement.textContent = data.color;
                colorElement.style.color = getColorHex(data.color);
            }, 500);
            
            setTimeout(() => {
                numberElement.textContent = data.number;
            }, 800);
            
            setTimeout(() => {
                adviceElement.textContent = data.advice;
            }, 1100);
        })
        .catch(error => {
            console.error('운세 가져오기 실패:', error);
            colorElement.textContent = '다시 시도해주세요';
            numberElement.textContent = '다시 시도해주세요';
            adviceElement.textContent = '다시 시도해주세요';
        });
}

// 색상 이름을 HEX 코드로 변환
function getColorHex(colorName) {
    const colorMap = {
        '빨간색': '#ff0000',
        '파란색': '#0000ff',
        '노란색': '#ffff00',
        '초록색': '#00ff00',
        '보라색': '#800080',
        '주황색': '#ffa500'
    };
    return colorMap[colorName] || '#000000';
}

// 알림 표시
function showNotification(message) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 스타일 적용
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(139, 125, 107, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 자동 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}



// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 페이지 로드 완료 시 로딩 애니메이션 제거
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// 키보드 단축키
document.addEventListener('keydown', function(event) {
    // Ctrl + M: 음악 토글
    if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        document.getElementById('musicToggle').click();
    }
    
    // Ctrl + F: 운세 모달
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        showDailyFortune();
    }
});

// 터치 디바이스 지원
if ('ontouchstart' in window) {
    // 터치 이벤트 최적화
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // 터치 시 호버 효과 제거
    const touchElements = document.querySelectorAll('.menu-item, .book');
    touchElements.forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.transform = 'none';
        });
    });
}
