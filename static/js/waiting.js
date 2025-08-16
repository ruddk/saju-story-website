// 대기실 페이지 JavaScript

let selectedColor = '#ff0000';
let isDrawing = false;
let canvas, ctx;

document.addEventListener('DOMContentLoaded', function() {
    // 캔버스 초기화
    initCanvas();
    
    // 대기 시간 업데이트
    updateWaitingTime();
    
    // 색칠놀이 이벤트
    initColoring();
    
    // 오늘의 명언 업데이트
    updateDailyQuote();
    
    // 오늘의 사주 상식 업데이트
    updateDailyTip();
});

// 캔버스 초기화
function initCanvas() {
    canvas = document.getElementById('coloringCanvas');
    ctx = canvas.getContext('2d');
    
    // 기본 문양 그리기 (간단한 꽃무늬)
    drawBasicPattern();
}

// 기본 문양 그리기
function drawBasicPattern() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경
    ctx.fillStyle = '#f8f6f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 꽃무늬 그리기
    ctx.strokeStyle = '#8b7d6b';
    ctx.lineWidth = 2;
    
    // 중앙 꽃
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 꽃잎
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const x1 = centerX + Math.cos(angle) * 30;
        const y1 = centerY + Math.sin(angle) * 30;
        const x2 = centerX + Math.cos(angle) * 60;
        const y2 = centerY + Math.sin(angle) * 60;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // 꽃잎 끝 부분
        ctx.beginPath();
        ctx.arc(x2, y2, 8, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // 중앙 원
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // 작은 꽃들
    const smallFlowers = [
        {x: 50, y: 50}, {x: 150, y: 50}, {x: 50, y: 150}, {x: 150, y: 150}
    ];
    
    smallFlowers.forEach(flower => {
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const x1 = flower.x + Math.cos(angle) * 15;
            const y1 = flower.y + Math.sin(angle) * 15;
            const x2 = flower.x + Math.cos(angle) * 25;
            const y2 = flower.y + Math.sin(angle) * 25;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(flower.x, flower.y, 8, 0, Math.PI * 2);
        ctx.stroke();
    });
}

// 색칠놀이 초기화
function initColoring() {
    // 색상 선택
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedColor = this.dataset.color;
            
            // 활성 색상 표시
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 캔버스 이벤트
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 터치 이벤트
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

// 그리기 시작
function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

// 그리기
function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
}

// 그리기 중지
function stopDrawing() {
    isDrawing = false;
}

// 터치 이벤트 처리
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                    e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

// 대기 시간 업데이트
function updateWaitingTime() {
    // 실제로는 서버에서 대기 시간을 가져와야 함
    const waitingTimeElement = document.getElementById('waitingTime');
    
    // 임시로 랜덤 대기 시간 생성
    const minutes = Math.floor(Math.random() * 30) + 5;
    waitingTimeElement.textContent = `약 ${minutes}분`;
    
    // 1분마다 업데이트
    setInterval(() => {
        const currentMinutes = parseInt(waitingTimeElement.textContent.match(/\d+/)[0]);
        if (currentMinutes > 1) {
            waitingTimeElement.textContent = `약 ${currentMinutes - 1}분`;
        } else {
            waitingTimeElement.textContent = '곧 상담 시작';
            waitingTimeElement.style.color = '#4caf50';
        }
    }, 60000);
}

// 운세 뽑기
function drawFortune() {
    const resultDiv = document.getElementById('fortuneResult');
    const btn = document.querySelector('.fortune-btn');
    
    // 버튼 비활성화
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 뽑는 중...';
    
    // 애니메이션 효과
    setTimeout(() => {
        const colors = ['빨간색', '파란색', '노란색', '초록색', '보라색', '주황색'];
        const numbers = [1, 3, 5, 7, 9, 11, 13, 15];
        const advices = [
            "긍정적인 마음가짐이 좋은 일을 부릅니다.",
            "새로운 도전을 해보세요.",
            "주변 사람들과의 소통을 중시하세요.",
            "자연과 함께하는 시간을 가지세요.",
            "학습과 성장에 집중하세요.",
            "가족과의 시간이 특별히 소중한 날입니다.",
            "창의적인 아이디어가 떠오르는 날입니다.",
            "건강에 특별히 신경 쓰면 좋은 하루가 될 것입니다."
        ];
        
        const selectedColor = colors[Math.floor(Math.random() * colors.length)];
        const selectedNumber = numbers[Math.floor(Math.random() * numbers.length)];
        const selectedAdvice = advices[Math.floor(Math.random() * advices.length)];
        
        resultDiv.innerHTML = `
            <h4>오늘의 운세</h4>
            <p><strong>행운의 색:</strong> <span style="color: ${getColorHex(selectedColor)};">${selectedColor}</span></p>
            <p><strong>행운의 숫자:</strong> ${selectedNumber}</p>
            <p><strong>오늘의 조언:</strong> ${selectedAdvice}</p>
        `;
        
        resultDiv.style.display = 'block';
        
        // 버튼 복원
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-dice"></i> 다시 뽑기';
    }, 2000);
}

// 궁합 확인
function checkCompatibility() {
    const name1 = document.getElementById('name1').value;
    const name2 = document.getElementById('name2').value;
    const birth1 = document.getElementById('birth1').value;
    const birth2 = document.getElementById('birth2').value;
    
    if (!name1 || !name2 || !birth1 || !birth2) {
        alert('모든 정보를 입력해주세요.');
        return;
    }
    
    const resultDiv = document.getElementById('compatibilityResult');
    const btn = document.querySelector('.compatibility-btn');
    
    // 버튼 비활성화
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 분석 중...';
    
    setTimeout(() => {
        // 간단한 궁합 계산 (실제로는 더 복잡한 알고리즘 사용)
        const score = Math.floor(Math.random() * 40) + 60; // 60-100점
        let compatibility = '';
        let description = '';
        
        if (score >= 90) {
            compatibility = '천생연분';
            description = '매우 좋은 궁합입니다. 서로를 이해하고 보완하는 관계가 될 것입니다.';
        } else if (score >= 80) {
            compatibility = '좋은 궁합';
            description = '서로 잘 맞는 궁합입니다. 노력하면 더욱 좋은 관계가 될 수 있습니다.';
        } else if (score >= 70) {
            compatibility = '보통 궁합';
            description = '평범한 궁합입니다. 서로의 차이를 이해하고 존중하면 좋은 관계가 될 것입니다.';
        } else {
            compatibility = '보완 필요';
            description = '서로의 차이를 이해하고 노력하면 좋은 관계가 될 수 있습니다.';
        }
        
        resultDiv.innerHTML = `
            <h4>궁합 분석 결과</h4>
            <p><strong>${name1} & ${name2}</strong></p>
            <p><strong>궁합 점수:</strong> ${score}점</p>
            <p><strong>궁합 등급:</strong> ${compatibility}</p>
            <p><strong>해석:</strong> ${description}</p>
        `;
        
        resultDiv.style.display = 'block';
        
        // 버튼 복원
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-magic"></i> 궁합 확인';
    }, 3000);
}

// 랜덤 사주 이야기
function getRandomStory() {
    const stories = [
        {
            title: "조선시대 사주가의 예언",
            content: "조선시대 유명한 사주가가 어느 젊은이의 사주를 보고 '너는 30년 후에 큰 공을 세울 것이다'라고 예언했습니다. 그 젊은이는 의아해했지만, 정말 30년 후에 큰 공을 세우게 되었습니다. 이는 사주의 시간적 의미를 보여주는 좋은 예시입니다."
        },
        {
            title: "음양의 조화",
            content: "사주에서 음양의 균형이 중요합니다. 너무 양이 강하면 성급하고 공격적이 될 수 있고, 너무 음이 강하면 소극적이고 우유부단할 수 있습니다. 적절한 균형이 가장 이상적인 상태입니다."
        },
        {
            title: "오행의 순환",
            content: "목(木)은 화(火)를 낳고, 화는 토(土)를 낳으며, 토는 금(金)을 낳고, 금은 수(水)를 낳으며, 수는 다시 목을 낳습니다. 이 순환 관계를 이해하면 사주 해석이 훨씬 쉬워집니다."
        },
        {
            title: "사주의 진정한 의미",
            content: "사주는 운명을 예측하는 도구가 아니라, 자신을 이해하고 발전시키는 거울입니다. 자신의 강점과 약점을 파악하여 더 나은 선택을 할 수 있도록 도와주는 지혜의 학문입니다."
        }
    ];
    
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    const resultDiv = document.getElementById('storyResult');
    const btn = document.querySelector('.story-btn');
    
    // 버튼 비활성화
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 불러오는 중...';
    
    setTimeout(() => {
        resultDiv.innerHTML = `
            <h4>${randomStory.title}</h4>
            <p>${randomStory.content}</p>
        `;
        
        resultDiv.style.display = 'block';
        
        // 버튼 복원
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-random"></i> 이야기 보기';
    }, 1500);
}

// 색칠 해석
function interpretColoring() {
    const resultDiv = document.getElementById('coloringResult');
    const interpretations = [
        "빨간색이 많이 사용되었다면, 활력과 열정이 넘치는 성격을 나타냅니다. 새로운 도전을 두려워하지 않는 용감한 마음을 가지고 있습니다.",
        "파란색이 많이 사용되었다면, 차분하고 지적인 성향을 나타냅니다. 깊이 있는 사고와 안정적인 성격을 가지고 있습니다.",
        "노란색이 많이 사용되었다면, 낙관적이고 밝은 성격을 나타냅니다. 긍정적인 마음가짐으로 주변 사람들에게 기쁨을 주는 사람입니다.",
        "초록색이 많이 사용되었다면, 자연을 사랑하고 평화로운 성향을 나타냅니다. 조화와 균형을 중시하는 마음을 가지고 있습니다.",
        "보라색이 많이 사용되었다면, 신비롭고 직관적인 성향을 나타냅니다. 예술적 감각과 영감이 풍부한 사람입니다.",
        "주황색이 많이 사용되었다면, 창의적이고 독창적인 성향을 나타냅니다. 새로운 아이디어를 잘 떠올리는 사람입니다."
    ];
    
    const randomInterpretation = interpretations[Math.floor(Math.random() * interpretations.length)];
    
    resultDiv.innerHTML = `
        <h4>색칠 기운 해석</h4>
        <p>${randomInterpretation}</p>
        <p><em>색깔은 우리의 마음 상태와 성향을 반영합니다. 자신의 색깔을 이해하고 활용하면 더 나은 삶을 살 수 있습니다.</em></p>
    `;
    
    resultDiv.style.display = 'block';
}

// 오늘의 명언 업데이트
function updateDailyQuote() {
    const quotes = [
        {
            text: "운명은 우리에게 주어진 카드이고, 자유의지는 그 카드를 어떻게 사용할지 결정하는 것입니다.",
            author: "수목선생"
        },
        {
            text: "사주는 미래를 예측하는 것이 아니라, 현재를 이해하는 거울입니다.",
            author: "수목선생"
        },
        {
            text: "음양의 조화와 오행의 균형이 곧 건강하고 행복한 삶의 비결입니다.",
            author: "수목선생"
        },
        {
            text: "자신을 이해하는 것이 모든 지혜의 시작입니다.",
            author: "수목선생"
        }
    ];
    
    const today = new Date().getDate();
    const selectedQuote = quotes[today % quotes.length];
    
    document.getElementById('dailyQuote').textContent = selectedQuote.text;
    document.querySelector('.wisdom-content cite').textContent = `- ${selectedQuote.author}`;
}

// 오늘의 사주 상식 업데이트
function updateDailyTip() {
    const tips = [
        {
            title: "오늘의 사주 상식",
            content: "사주에서 목(木)의 기운이 강한 사람은 성장과 확장을 추구하는 성향이 있습니다. 새로운 도전을 두려워하지 않고, 창의적인 아이디어를 잘 떠올리는 특징이 있습니다."
        },
        {
            title: "오늘의 사주 상식",
            content: "화(火)의 기운이 강한 사람은 열정적이고 활발한 성향을 가집니다. 리더십이 뛰어나고, 다른 사람들을 이끄는 능력이 있습니다."
        },
        {
            title: "오늘의 사주 상식",
            content: "토(土)의 기운이 강한 사람은 안정적이고 신뢰할 수 있는 성향을 가집니다. 책임감이 강하고, 다른 사람들을 돌보는 능력이 뛰어납니다."
        },
        {
            title: "오늘의 사주 상식",
            content: "금(金)의 기운이 강한 사람은 정리정돈을 잘하고, 규칙적인 성향을 가집니다. 분석적 사고가 뛰어나고, 효율적인 일처리를 선호합니다."
        },
        {
            title: "오늘의 사주 상식",
            content: "수(水)의 기운이 강한 사람은 지혜롭고 직관적인 성향을 가집니다. 깊이 있는 사고를 하며, 예술적 감각이 뛰어납니다."
        }
    ];
    
    const today = new Date().getDate();
    const selectedTip = tips[today % tips.length];
    
    document.querySelector('#dailyTip h4').textContent = selectedTip.title;
    document.querySelector('#dailyTip p').textContent = selectedTip.content;
}

// 유틸리티 함수
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

