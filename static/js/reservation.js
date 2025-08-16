// 예약 시스템 JavaScript

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

document.addEventListener('DOMContentLoaded', function() {
    // 캘린더 초기화
    initCalendar();
    
    // 시간 슬롯 초기화
    initTimeSlots();
    
    // 폼 제출 이벤트
    initFormSubmission();
    
    // 모달 컨트롤
    initConfirmationModal();
    
    // 상담 시간 변경 이벤트
    initDurationChange();
});

// 캘린더 초기화
function initCalendar() {
    renderCalendar();
    
    // 요일 헤더 추가
    const calendarGrid = document.getElementById('calendarGrid');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.cssText = `
            text-align: center;
            font-weight: 600;
            color: #8b7d6b;
            padding: 0.5rem;
            font-size: 0.9rem;
        `;
        calendarGrid.appendChild(dayHeader);
    });
}

// 캘린더 렌더링
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 월 표시 업데이트
    document.getElementById('currentMonth').textContent = 
        `${year}년 ${month + 1}월`;
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // 요일 헤더 다시 추가
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.cssText = `
            text-align: center;
            font-weight: 600;
            color: #8b7d6b;
            padding: 0.5rem;
            font-size: 0.9rem;
        `;
        calendarGrid.appendChild(dayHeader);
    });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // 이전 달의 날짜들
    for (let i = 0; i < firstDay.getDay(); i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = startDate.getDate();
        calendarGrid.appendChild(dayElement);
        startDate.setDate(startDate.getDate() + 1);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDayDate = new Date(year, month, day);
        
        // 오늘 날짜 표시
        if (isToday(currentDayDate)) {
            dayElement.classList.add('today');
            dayElement.style.cssText = `
                background: rgba(139, 125, 107, 0.2);
                font-weight: 600;
            `;
        }
        
        // 예약 가능한 날짜 표시 (월요일 제외, 오늘 이후)
        if (currentDayDate.getDay() !== 1 && currentDayDate > new Date()) {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(currentDayDate));
        } else {
            dayElement.classList.add('disabled');
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // 다음 달의 날짜들
    const remainingDays = 42 - (firstDay.getDay() + lastDay.getDate());
    for (let i = 0; i < remainingDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = startDate.getDate();
        calendarGrid.appendChild(dayElement);
        startDate.setDate(startDate.getDate() + 1);
    }
}

// 이전 달
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    updateTimeSlots();
}

// 다음 달
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    updateTimeSlots();
}

// 날짜 선택
function selectDate(date) {
    selectedDate = date;
    
    // 기존 선택 제거
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // 새 선택 표시
    event.target.classList.add('selected');
    
    // 시간 슬롯 업데이트
    updateTimeSlots();
}

// 시간 슬롯 초기화
function initTimeSlots() {
    updateTimeSlots();
}

// 시간 슬롯 업데이트
function updateTimeSlots() {
    const timeGrid = document.getElementById('timeGrid');
    timeGrid.innerHTML = '';
    
    if (!selectedDate) {
        timeGrid.innerHTML = '<p style="text-align: center; color: #666;">날짜를 선택해주세요</p>';
        return;
    }
    
    const timeSlots = [
        '10:00', '11:00', '12:00', '13:00', '14:00', 
        '15:00', '16:00', '17:00', '18:00'
    ];
    
    timeSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        
        // 이미 예약된 시간은 비활성화
        if (isTimeBooked(selectedDate, time)) {
            timeSlot.classList.add('disabled');
        } else {
            timeSlot.addEventListener('click', () => selectTime(time));
        }
        
        timeGrid.appendChild(timeSlot);
    });
}

// 시간 선택
function selectTime(time) {
    selectedTime = time;
    
    // 기존 선택 제거
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // 새 선택 표시
    event.target.classList.add('selected');
}

// 상담 시간 변경 이벤트
function initDurationChange() {
    const durationSelect = document.getElementById('consultationDuration');
    durationSelect.addEventListener('change', function() {
        updatePricing();
    });
}

// 가격 업데이트
function updatePricing() {
    const duration = document.getElementById('consultationDuration').value;
    const pricingInfo = document.querySelector('.pricing-info');
    
    // 선택된 시간에 따라 가격 강조
    pricingInfo.querySelectorAll('.price-item').forEach(item => {
        item.style.opacity = '0.5';
    });
    
    const selectedPriceItem = pricingInfo.querySelector(`[data-duration="${duration}"]`);
    if (selectedPriceItem) {
        selectedPriceItem.style.opacity = '1';
        selectedPriceItem.style.fontWeight = '600';
    }
}

// 폼 제출 이벤트
function initFormSubmission() {
    const form = document.getElementById('reservationForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedDate || !selectedTime) {
            alert('날짜와 시간을 선택해주세요.');
            return;
        }
        
        // 폼 데이터 수집
        const formData = new FormData(form);
        const reservationData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            gender: formData.get('gender'),
            birthDate: formData.get('birthDate'),
            birthTime: formData.get('birthTime'),
            calendarType: formData.get('calendarType'),
            birthPlace: formData.get('birthPlace'),
            consultationType: formData.get('consultationType'),
            consultationDuration: formData.get('consultationDuration'),
            topics: formData.getAll('topics'),
            questions: formData.get('questions'),
            paymentMethod: formData.get('paymentMethod'),
            selectedDate: selectedDate,
            selectedTime: selectedTime
        };
        
        // 예약 확인 모달 표시
        showConfirmation(reservationData);
    });
}

// 예약 확인 모달 표시
function showConfirmation(data) {
    const modal = document.getElementById('confirmationModal');
    const details = document.getElementById('reservationDetails');
    
    const dateStr = data.selectedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    details.innerHTML = `
        <h3>예약 정보</h3>
        <p><strong>이름:</strong> ${data.name}</p>
        <p><strong>연락처:</strong> ${data.phone}</p>
        <p><strong>상담 방법:</strong> ${getConsultationTypeText(data.consultationType)}</p>
        <p><strong>상담 시간:</strong> ${data.consultationDuration}분</p>
        <p><strong>예약 날짜:</strong> ${dateStr}</p>
        <p><strong>예약 시간:</strong> ${data.selectedTime}</p>
        <p><strong>결제 금액:</strong> ${getPrice(data.consultationDuration)}원</p>
    `;
    
    modal.style.display = 'block';
}

// 확인 모달 컨트롤
function initConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 모달 닫기
function closeConfirmation() {
    document.getElementById('confirmationModal').style.display = 'none';
}

// 인쇄 기능
function printConfirmation() {
    window.print();
}

// 유틸리티 함수들
function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function isTimeBooked(date, time) {
    // 실제로는 서버에서 예약된 시간을 확인해야 함
    // 여기서는 임시로 랜덤하게 설정
    return Math.random() < 0.3; // 30% 확률로 예약됨
}

function getConsultationTypeText(type) {
    const types = {
        'visit': '방문 상담',
        'phone': '전화 상담',
        'video': '영상 상담'
    };
    return types[type] || type;
}

function getPrice(duration) {
    const prices = {
        '30': '30,000',
        '60': '50,000',
        '90': '70,000',
        '120': '90,000'
    };
    return prices[duration] || '0';
}

// 폼 유효성 검사
function validateForm() {
    const requiredFields = ['name', 'phone', 'birthDate', 'consultationType'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            missingFields.push(element.previousElementSibling.textContent.replace(' *', ''));
        }
    });
    
    if (missingFields.length > 0) {
        alert(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
        return false;
    }
    
    if (!selectedDate || !selectedTime) {
        alert('날짜와 시간을 선택해주세요.');
        return false;
    }
    
    return true;
}

// 전화번호 형식 검증
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    if (value.length >= 3 && value.length <= 7) {
        value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    } else if (value.length >= 8) {
        value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
    }
    
    e.target.value = value;
});

// 이메일 형식 검증
document.getElementById('email').addEventListener('blur', function(e) {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        e.target.focus();
    }
});

