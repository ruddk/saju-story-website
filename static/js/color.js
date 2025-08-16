// 색상 관리 시스템 - CSS 변수 중앙 제어
const ColorManager = {
    // 현재 적용된 색상 팔레트
    currentPalette: 'option9', // 기본값
    
    // 색상 팔레트 정의
    palettes: {
        option1: {
            name: "모로코 사막",
            primary: "#D2691E",
            secondary: "#F4A460", 
            accent: "#8B4513",
            description: "사하라 사막의 황금빛 모래와 붉은 일몰"
        },
        option2: {
            name: "터키 보석",
            primary: "#4B0082",
            secondary: "#FF1493",
            accent: "#00CED1", 
            description: "터키 보석시장의 화려한 보석들"
        },
        option3: {
            name: "인도 황금",
            primary: "#FFD700",
            secondary: "#FF4500",
            accent: "#8A2BE2",
            description: "인도 황금사원의 화려한 색채"
        },
        option4: {
            name: "라벤더 + 세이지 + 베이지",
            primary: "#8B7D6B",
            secondary: "#A89B8A",
            accent: "#9B7EDE",
            description: "조화로운 느낌"
        },
        option5: {
            name: "이집트 피라미드",
            primary: "#CD853F",
            secondary: "#F0E68C",
            accent: "#B8860B",
            description: "고대 이집트 피라미드의 신비로운 색채"
        },
        option6: {
            name: "페르시아 카펫",
            primary: "#DC143C",
            secondary: "#FFD700",
            accent: "#006400",
            description: "페르시아 카펫의 화려한 문양"
        },
        option7: {
            name: "티베트 불교",
            primary: "#FF4500",
            secondary: "#FFD700",
            accent: "#8B0000",
            description: "티베트 불교 사원의 신성한 색채"
        },
        option8: {
            name: "마야 문명",
            primary: "#228B22",
            secondary: "#FFD700",
            accent: "#8B0000",
            description: "고대 마야 문명의 신비로운 색채"
        },
        option9: {
            name: "옵션3 + 옵션5 각각 적용",
            primary: "#87A96B",
            secondary: "#F5E6D3",
            accent: "#8B7D6B",
            description: "세이지+크림 + 이미지 색감 - 각각 다른 페이지에 적용"
        }
    },
    
    // CSS 변수 업데이트
    updateCSSVariables(paletteName) {
        const palette = this.palettes[paletteName];
        if (!palette) return;
        
        const root = document.documentElement;
        
        // 기본 색상 업데이트
        root.style.setProperty('--primary-color', palette.primary);
        root.style.setProperty('--secondary-color', palette.secondary);
        root.style.setProperty('--accent-color', palette.accent);
        
        // 그라데이션 업데이트
        root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`);
        root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${palette.secondary} 0%, ${this.lightenColor(palette.secondary, 20)} 100%)`);
        root.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${palette.accent} 0%, ${this.darkenColor(palette.accent, 20)} 100%)`);
        
        // 버튼 호버 색상 업데이트
        root.style.setProperty('--btn-hover', this.darkenColor(palette.accent, 20));
        
        this.currentPalette = paletteName;
        
        // 로컬 스토리지에 저장
        localStorage.setItem('selectedColorPalette', paletteName);
        
        console.log(`색상 팔레트가 ${palette.name}으로 업데이트되었습니다.`);
    },
    
    // 색상을 밝게 만드는 함수
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    },
    
    // 색상을 어둡게 만드는 함수
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    },
    
    // 저장된 색상 팔레트 복원
    restoreSavedPalette() {
        const savedPalette = localStorage.getItem('selectedColorPalette');
        if (savedPalette && this.palettes[savedPalette]) {
            this.updateCSSVariables(savedPalette);
        }
    }
};

// 색상 옵션 데이터
const colorOptions = {
    1: {
        name: "민트 + 살구톤",
        main: "#7FB069",
        secondary: "#F4A261", 
        accent: "#E76F51",
        description: "상큼한 느낌"
    },
    2: {
        name: "라벤더 + 피치톤",
        main: "#9B7EDE",
        secondary: "#F7CAC9",
        accent: "#E8A87C", 
        description: "부드러운 느낌"
    },
    3: {
        name: "세이지 + 크림톤",
        main: "#87A96B",
        secondary: "#F5E6D3",
        accent: "#D2691E",
        description: "자연스러운 느낌"
    },
    4: {
        name: "라벤더 + 세이지 + 베이지",
        main: "#8B7D6B",
        secondary: "#A89B8A",
        accent: "#9B7EDE",
        description: "조화로운 느낌"
    },
    5: {
        name: "라벤더-피치 + 세이지-크림 + 베이지",
        main: "linear-gradient(135deg, #9B7EDE 0%, #F7CAC9 100%)",
        secondary: "linear-gradient(135deg, #87A96B 0%, #F5E6D3 100%)",
        accent: "#8B7D6B",
        description: "이미지 색감 - 다채로운 그라데이션"
    },
    6: {
        name: "페이지/섹션별 색상 적용",
        main: "#9B7EDE",
        secondary: "#87A96B",
        accent: "#8B7D6B",
        description: "이미지 톤 - 페이지별 다른 색상"
    },
    7: {
        name: "한 페이지 내 3톤 통합",
        main: "linear-gradient(135deg, #9B7EDE 0%, #8A6FD1 100%)",
        secondary: "linear-gradient(135deg, #87A96B 0%, #7A9A5E 100%)",
        accent: "linear-gradient(135deg, #8B7D6B 0%, #7A6D5A 100%)",
        description: "이미지 톤 - 한 페이지 내 3톤 통합"
    },
    8: {
        name: "세이지+크림 + 페이지별 적용",
        main: "#87A96B",
        secondary: "#F5E6D3",
        accent: "#D2691E",
        description: "자연스러운 느낌 - 페이지별 세이지+크림 톤"
    },
    9: {
        name: "옵션3 + 옵션5 각각 적용",
        main: "#87A96B",
        secondary: "#F5E6D3",
        accent: "#8B7D6B",
        description: "세이지+크림 + 이미지 색감 - 각각 다른 페이지에 적용"
    }
};

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    initColorPage();
});

// 색상 페이지 초기화
function initColorPage() {
    // 저장된 색상 팔레트 복원
    ColorManager.restoreSavedPalette();
    
    // 색상 박스 클릭 시 색상 코드 복사
    initColorCopy();
    
    // 색상 박스 호버 효과
    initColorHover();
    
    // 키보드 단축키
    initKeyboardShortcuts();
}

// 색상 복사 기능
function initColorCopy() {
    const colorBoxes = document.querySelectorAll('.color-box');
    
    colorBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const colorCode = this.style.backgroundColor;
            const hexColor = rgbToHex(colorCode);
            
            // 클립보드에 복사
            navigator.clipboard.writeText(hexColor).then(() => {
                showToast(`색상 코드 ${hexColor}가 복사되었습니다!`);
            }).catch(() => {
                // 폴백: 텍스트 선택 방식
                const textArea = document.createElement('textarea');
                textArea.value = hexColor;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast(`색상 코드 ${hexColor}가 복사되었습니다!`);
            });
        });
        
        // 툴팁 추가
        box.title = '클릭하여 색상 코드 복사';
    });
}

// 색상 박스 호버 효과
function initColorHover() {
    const colorBoxes = document.querySelectorAll('.color-box');
    
    colorBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// 키보드 단축키
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // 숫자 키로 옵션 선택
        if (e.key >= '1' && e.key <= '9') {
            selectOption(parseInt(e.key));
        }
        
        // ESC 키로 선택 해제
        if (e.key === 'Escape') {
            clearSelection();
        }
        
        // Enter 키로 선택 확인
        if (e.key === 'Enter') {
            const selectedOption = document.querySelector('.color-option.selected');
            if (selectedOption) {
                confirmSelection();
            }
        }
    });
}

// 색상 옵션 선택
function selectOption(optionNumber) {
    // 기존 선택 해제
    clearSelection();
    
    // 새 옵션 선택
    const selectedOption = document.getElementById(`option${optionNumber}`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        
        // 선택된 색상 정보 표시
        const colorData = colorOptions[optionNumber];
        showSelectionInfo(colorData);
        
        // 스크롤하여 선택된 옵션으로 이동
        selectedOption.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

// 선택 해제
function clearSelection() {
    const selectedOptions = document.querySelectorAll('.color-option.selected');
    selectedOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // 선택 정보 숨기기
    hideSelectionInfo();
}

// 선택 정보 표시
function showSelectionInfo(colorData) {
    // 기존 정보 제거
    hideSelectionInfo();
    
    // 새 정보 생성
    const infoDiv = document.createElement('div');
    infoDiv.id = 'selection-info';
    infoDiv.className = 'selection-info';
    infoDiv.innerHTML = `
        <div class="info-content">
            <h3>선택된 색상: ${colorData.name}</h3>
            <p>${colorData.description}</p>
            <div class="color-preview">
                <div class="preview-color" style="background: ${colorData.main}"></div>
                <div class="preview-color" style="background: ${colorData.secondary}"></div>
                <div class="preview-color" style="background: ${colorData.accent}"></div>
            </div>
            <div class="info-actions">
                <button onclick="confirmSelection()" class="confirm-btn">이 색상으로 적용</button>
                <button onclick="clearSelection()" class="cancel-btn">취소</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(infoDiv);
    
    // 애니메이션 추가
    setTimeout(() => {
        infoDiv.style.opacity = '1';
        infoDiv.style.transform = 'translateY(0)';
    }, 10);
}

// 선택 정보 숨기기
function hideSelectionInfo() {
    const existingInfo = document.getElementById('selection-info');
    if (existingInfo) {
        existingInfo.remove();
    }
}

// 선택 확인
function confirmSelection() {
    const selectedOption = document.querySelector('.color-option.selected');
    if (selectedOption) {
        const optionNumber = selectedOption.id.replace('option', '');
        const colorData = colorOptions[optionNumber];
        
        // 색상 팔레트 적용
        ColorManager.updateCSSVariables(optionNumber);
        
        showToast(`${colorData.name} 색상이 선택되었습니다!`);
        
        // 3초 후 메인 페이지로 이동
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }
}

// RGB를 HEX로 변환
function rgbToHex(rgb) {
    if (!rgb) return '';
    
    // rgb(r, g, b) 형태를 파싱
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return rgb;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// 토스트 메시지 표시
function showToast(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 애니메이션
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 색상 적용 함수 (향후 구현)
function applyColorScheme(colorData) {
    // 여기에 실제 색상 적용 로직을 구현할 예정
    console.log('색상 적용:', colorData);
}

// CSS 스타일 동적 추가
const style = document.createElement('style');
style.textContent = `
    .selection-info {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        border: 2px solid #4CAF50;
        z-index: 1000;
        max-width: 300px;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    }
    
    .info-content h3 {
        color: #4CAF50;
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }
    
    .info-content p {
        color: #666;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }
    
    .color-preview {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .preview-color {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .info-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .confirm-btn, .cancel-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .confirm-btn {
        background: #4CAF50;
        color: white;
    }
    
    .cancel-btn {
        background: #f5f5f5;
        color: #666;
    }
    
    .confirm-btn:hover {
        background: #45a049;
    }
    
    .cancel-btn:hover {
        background: #e0e0e0;
    }
    
    .toast-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-size: 0.9rem;
        z-index: 1001;
        opacity: 0;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
