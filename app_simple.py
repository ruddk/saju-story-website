from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime
import random

app = Flask(__name__)
app.secret_key = 'saju_library_secret_key'

# 오늘의 사주 한 구절 데이터
daily_saju_quotes = [
    "오늘은 새로운 시작의 날입니다. 마음을 열고 기회를 잡으세요.",
    "차분한 마음으로 하루를 시작하면 좋은 일이 찾아올 것입니다.",
    "주변 사람들과의 소통이 중요한 하루입니다.",
    "창의적인 아이디어가 떠오르는 날입니다. 기록해두세요.",
    "건강에 특별히 신경 쓰면 좋은 하루가 될 것입니다.",
    "학습과 성장에 도움이 되는 하루입니다.",
    "가족과의 시간이 특별히 소중한 날입니다.",
    "자연과 함께하는 시간이 마음을 치유해줄 것입니다."
]

@app.route('/')
def main():
    # 오늘의 사주 한 구절 (날짜별로 고정)
    today = datetime.now().day
    daily_quote = daily_saju_quotes[today % len(daily_saju_quotes)]
    
    # 공지사항 데이터
    notices = [
        {
            'title': '오늘 예약 가능',
            'content': '오후 2시, 4시, 6시 예약 가능합니다.',
            'type': 'success'
        },
        {
            'title': '휴무일 안내',
            'content': '매주 월요일은 휴무입니다.',
            'type': 'info'
        },
        {
            'title': '특강 안내',
            'content': '이번 주 토요일 오후 2시 사주 기초 특강이 있습니다.',
            'type': 'event'
        }
    ]
    
    return render_template('main.html', 
                         daily_quote=daily_quote,
                         notices=notices)

@app.route('/library')
def library():
    return render_template('library.html')

@app.route('/reservation')
def reservation():
    return render_template('reservation.html')

@app.route('/visit')
def visit():
    return render_template('visit.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/waiting')
def waiting():
    return render_template('waiting.html')

@app.route('/color')
def color():
    return render_template('color.html')

@app.route('/api/daily-fortune')
def daily_fortune():
    """오늘의 운세 뽑기 API"""
    colors = ['빨간색', '파란색', '노란색', '초록색', '보라색', '주황색']
    numbers = [1, 3, 5, 7, 9, 11, 13, 15]
    advices = [
        "긍정적인 마음가짐이 좋은 일을 부릅니다.",
        "새로운 도전을 해보세요.",
        "주변 사람들과의 소통을 중시하세요.",
        "자연과 함께하는 시간을 가지세요.",
        "학습과 성장에 집중하세요."
    ]
    
    return jsonify({
        'color': random.choice(colors),
        'number': random.choice(numbers),
        'advice': random.choice(advices)
    })

if __name__ == '__main__':
    # 환경변수에서 포트 가져오기 (배포 환경용)
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)
