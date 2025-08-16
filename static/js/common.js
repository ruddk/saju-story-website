// 공통 색상 관리 시스템
// 모든 페이지에서 이 파일을 로드하여 색상 시스템을 사용할 수 있습니다.

// 색상 관리 시스템 - CSS 변수 중앙 제어
const ColorManager = {
    // 현재 적용된 색상 팔레트
    currentPalette: 'option5', // 기본값
    
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
            primary: "#B8860B",    /* 더 진한 황금색 */
            secondary: "#DAA520",  /* 더 진한 골든로드 */
            accent: "#8B6914",     /* 더 진한 갈색 */
            description: "고대 이집트 피라미드의 신비로운 색채 (진한 버전)"
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
        
        // 그라데이션 업데이트 (방향 반대로 변경)
        root.style.setProperty('--gradient-primary', `linear-gradient(315deg, ${palette.primary} 0%, ${palette.secondary} 100%)`);
        root.style.setProperty('--gradient-secondary', `linear-gradient(315deg, ${palette.secondary} 0%, ${this.lightenColor(palette.secondary, 20)} 100%)`);
        root.style.setProperty('--gradient-accent', `linear-gradient(315deg, ${palette.accent} 0%, ${this.darkenColor(palette.accent, 20)} 100%)`);
        
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

// 페이지 로드 시 색상 팔레트 복원
document.addEventListener('DOMContentLoaded', function() {
    ColorManager.restoreSavedPalette();
});

// 전역에서 사용할 수 있도록 window 객체에 추가
window.ColorManager = ColorManager;
