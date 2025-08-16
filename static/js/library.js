// 사주 도서관 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 카테고리 필터 기능
    initCategoryFilter();
    
    // 모달 컨트롤
    initArticleModal();
    
    // 페이지네이션
    initPagination();
});

// 카테고리 필터 기능
function initCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const contentCards = document.querySelectorAll('.content-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // 활성 버튼 변경
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 카드 필터링
            contentCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 글 읽기 모달 컨트롤
function initArticleModal() {
    const modal = document.getElementById('articleModal');
    const closeBtn = modal.querySelector('.close');
    
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

// 페이지네이션 기능
function initPagination() {
    const pageBtns = document.querySelectorAll('.page-btn');
    
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // 활성 페이지 변경
            pageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 페이지 변경 로직 (나중에 구현)
            console.log('페이지 변경:', this.textContent);
        });
    });
}

// 글 읽기 함수
function readArticle(articleId) {
    const modal = document.getElementById('articleModal');
    const content = document.getElementById('articleContent');
    
    // 로딩 표시
    content.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #8b7d6b;"></i><p>글을 불러오는 중...</p></div>';
    
    // 모달 표시
    modal.style.display = 'block';
    
    // 글 내용 가져오기 (실제로는 API 호출)
    setTimeout(() => {
        const articleContent = getArticleContent(articleId);
        content.innerHTML = articleContent;
    }, 1000);
}

// 글 내용 반환 함수
function getArticleContent(articleId) {
    const articles = {
        'saju-basic': `
            <h1>사주란 무엇인가?</h1>
            <p>사주(四柱)는 사람이 태어난 년(年), 월(月), 일(日), 시(時)를 기준으로 하여 그 사람의 운명을 알아보는 동양철학의 한 분야입니다.</p>
            
            <h2>사주의 기본 구성</h2>
            <p>사주는 네 개의 기둥으로 구성되어 있습니다:</p>
            <ul>
                <li><strong>년주(年柱)</strong>: 태어난 해의 천간과 지지</li>
                <li><strong>월주(月柱)</strong>: 태어난 달의 천간과 지지</li>
                <li><strong>일주(日柱)</strong>: 태어난 날의 천간과 지지</li>
                <li><strong>시주(時柱)</strong>: 태어난 시간의 천간과 지지</li>
            </ul>
            
            <h2>천간과 지지</h2>
            <p>천간(天干)은 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸의 10개이고, 지지(地支)는 子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥의 12개입니다.</p>
            
            <blockquote>
                "사주는 운명을 예측하는 도구가 아니라, 자신을 이해하고 발전시키는 거울입니다."
            </blockquote>
            
            <h2>사주의 의미</h2>
            <p>사주는 단순히 미래를 예측하는 것이 아니라, 현재의 상황을 이해하고 더 나은 선택을 할 수 있도록 도와주는 지혜의 학문입니다. 자신의 강점과 약점을 파악하여 인생의 방향을 설정하는 데 도움을 줍니다.</p>
        `,
        
        'yin-yang': `
            <h1>음양오행의 이해</h1>
            <p>음양오행은 동양철학의 근본이 되는 개념으로, 사주 해석의 기초가 됩니다.</p>
            
            <h2>음양(陰陽)</h2>
            <p>음양은 모든 현상의 두 가지 대립되는 성질을 나타냅니다:</p>
            <ul>
                <li><strong>양(陽)</strong>: 밝음, 뜨거움, 움직임, 강함</li>
                <li><strong>음(陰)</strong>: 어둠, 차가움, 정지, 약함</li>
            </ul>
            
            <h2>오행(五行)</h2>
            <p>오행은 자연계의 다섯 가지 기본 요소입니다:</p>
            <ul>
                <li><strong>목(木)</strong>: 나무, 성장, 확장</li>
                <li><strong>화(火)</strong>: 불, 열, 상승</li>
                <li><strong>토(土)</strong>: 흙, 중앙, 안정</li>
                <li><strong>금(金)</strong>: 쇠, 수렴, 정리</li>
                <li><strong>수(水)</strong>: 물, 흐름, 지혜</li>
            </ul>
            
            <blockquote>
                "음양의 조화와 오행의 균형이 곧 건강하고 행복한 삶의 비결입니다."
            </blockquote>
        `,
        
        '2024-fortune': `
            <h1>2024년 운세 총정리</h1>
            <p>2024년은 변화와 새로운 시작의 해입니다. 각 띠별로 어떤 운세가 기다리고 있을까요?</p>
            
            <h2>쥐띠 (1960, 1972, 1984, 1996, 2008)</h2>
            <p>올해는 새로운 도전과 기회가 많은 해입니다. 특히 직장에서의 변화나 새로운 사업 기회를 만날 수 있습니다.</p>
            
            <h2>소띠 (1961, 1973, 1985, 1997, 2009)</h2>
            <p>안정적인 발전의 해입니다. 기존에 해오던 일에서 성과를 거둘 수 있으며, 건강에도 특별히 신경 쓰면 좋은 해입니다.</p>
            
            <h2>호랑이띠 (1962, 1974, 1986, 1998, 2010)</h2>
            <p>리더십을 발휘할 수 있는 해입니다. 팀 프로젝트나 새로운 역할에서 빛을 발할 수 있습니다.</p>
            
            <blockquote>
                "2024년은 변화를 두려워하지 말고 새로운 기회를 잡는 해가 될 것입니다."
            </blockquote>
        `,
        
        'joseon-saju': `
            <h1>조선시대 사주 이야기</h1>
            <p>조선시대에는 사주가 왕실과 양반가에서 중요한 역할을 했습니다.</p>
            
            <h2>왕실의 사주</h2>
            <p>조선 왕실에서는 왕의 사주를 통해 국가의 운명을 점치고, 중요한 정책을 결정하는 데 참고했습니다. 특히 세종대왕은 사주에 깊은 관심을 가져 천문학과 역학 연구를 적극적으로 지원했습니다.</p>
            
            <h2>유명한 사주가들</h2>
            <p>조선시대에는 많은 유명한 사주가들이 있었습니다. 그 중에서도 이순신 장군의 사주는 특히 유명한데, 그의 사주에서 보이는 강한 금(金)의 기운이 바다와 관련된 운명을 예시했다고 합니다.</p>
            
            <blockquote>
                "조선시대 사주는 단순한 점술이 아니라, 국가와 개인의 운명을 이해하는 학문이었습니다."
            </blockquote>
        `,
        
        'case-study-1': `
            <h1>직장인 A씨의 사주 상담</h1>
            <p>30대 중반의 직장인 A씨는 최근 직장에서의 인간관계와 승진에 대한 고민을 가지고 상담을 받았습니다.</p>
            
            <h2>상담 내용</h2>
            <p>A씨는 능력은 뛰어나지만 소극적인 성격으로 인해 상사에게 인정받지 못하고 있다고 생각했습니다. 사주를 보니 목(木)의 기운이 강하지만 화(火)의 기운이 부족한 구조였습니다.</p>
            
            <h2>조언</h2>
            <p>화(火)의 기운을 보강하기 위해 다음과 같은 조언을 드렸습니다:</p>
            <ul>
                <li>적극적인 의사표현 연습</li>
                <li>팀 프로젝트에서 리더 역할 도전</li>
                <li>빨간색 계열의 소품 활용</li>
                <li>명상과 자기계발에 투자</li>
            </ul>
            
            <blockquote>
                "사주는 고정된 운명이 아니라, 자신을 발전시킬 수 있는 지도도입니다."
            </blockquote>
        `,
        
        'destiny-freewill': `
            <h1>운명과 자유의지</h1>
            <p>사주에서 말하는 운명과 인간의 자유의지에 대한 철학적 고찰을 해보겠습니다.</p>
            
            <h2>운명이란?</h2>
            <p>사주에서 말하는 운명은 완전히 고정된 것이 아닙니다. 태어날 때의 천체 위치가 우리에게 일정한 성향과 가능성을 제공하는 것이지, 모든 것이 정해진 것은 아닙니다.</p>
            
            <h2>자유의지의 역할</h2>
            <p>인간은 자유의지를 통해 운명을 바꿀 수 있습니다. 사주에서 불리한 기운이 있다고 해도, 노력과 의지로 이를 극복할 수 있습니다.</p>
            
            <h2>사주의 진정한 의미</h2>
            <p>사주는 운명을 예측하는 도구가 아니라, 자신을 이해하고 발전시키는 거울입니다. 자신의 강점과 약점을 파악하여 더 나은 선택을 할 수 있도록 도와주는 지혜의 학문입니다.</p>
            
            <blockquote>
                "운명은 우리에게 주어진 카드이고, 자유의지는 그 카드를 어떻게 사용할지 결정하는 것입니다."
            </blockquote>
        `
    };
    
    return articles[articleId] || '<p>글을 찾을 수 없습니다.</p>';
}

// 검색 기능 (추후 구현)
function searchArticles(query) {
    console.log('검색:', query);
    // 검색 로직 구현
}

// 북마크 기능 (추후 구현)
function bookmarkArticle(articleId) {
    console.log('북마크:', articleId);
    // 북마크 로직 구현
}

// 공유 기능 (추후 구현)
function shareArticle(articleId) {
    console.log('공유:', articleId);
    // 공유 로직 구현
}

