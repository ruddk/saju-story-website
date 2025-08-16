from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime
import random

# 챗봇 기능 임시 비활성화 (배포 문제 해결을 위해)
CHATBOT_AVAILABLE = False
print("Chatbot functionality temporarily disabled for deployment.")

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

@app.route('/api/reservation', methods=['POST'])
def create_reservation():
    """예약 생성 API"""
    data = request.get_json()
    
    # 실제로는 데이터베이스에 저장해야 함
    # 여기서는 간단히 성공 응답만 반환
    return jsonify({
        'success': True,
        'message': '예약이 성공적으로 완료되었습니다.',
        'reservation_id': f'R{random.randint(10000, 99999)}'
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """챗봇 API"""
    if not CHATBOT_AVAILABLE:
        return jsonify({
            'success': False,
            'message': '챗봇 기능이 현재 사용할 수 없습니다.'
        })
    
    try:
        data = request.get_json()
        message = data.get('message', '')
        user_info = data.get('user_info', {})
        
        if not message:
            return jsonify({
                'success': False,
                'message': '메시지를 입력해주세요.'
            })
        
        # 챗봇 응답 생성
        response = chatbot.chat(message, user_info)
        
        return jsonify({
            'success': True,
            'message': response
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'오류가 발생했습니다: {str(e)}'
        })

@app.route('/api/available-times')
def get_available_times():
    """예약 가능한 시간 조회 API"""
    if not CHATBOT_AVAILABLE:
        return jsonify({
            'success': False,
            'message': '챗봇 기능이 현재 사용할 수 없습니다.'
        })
    
    try:
        date = request.args.get('date')
        available_times = chatbot.get_available_times(date)
        
        return jsonify({
            'success': True,
            'available_times': available_times
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'오류가 발생했습니다: {str(e)}'
        })

@app.route('/api/make-reservation', methods=['POST'])
def make_reservation():
    """챗봇을 통한 예약 생성 API"""
    if not CHATBOT_AVAILABLE:
        return jsonify({
            'success': False,
            'message': '챗봇 기능이 현재 사용할 수 없습니다.'
        })
    
    try:
        data = request.get_json()
        name = data.get('name', '')
        phone = data.get('phone', '')
        date = data.get('date', '')
        time = data.get('time', '')
        consultation_type = data.get('consultation_type', '방문 상담')
        
        if not all([name, phone, date, time]):
            return jsonify({
                'success': False,
                'message': '모든 필수 정보를 입력해주세요.'
            })
        
        # 챗봇을 통한 예약 생성
        result = chatbot.make_reservation(name, phone, date, time, consultation_type)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'예약 처리 중 오류가 발생했습니다: {str(e)}'
        })

@app.route('/api/learning-data')
def get_learning_data():
    """챗봇 학습 데이터 조회 API"""
    if not CHATBOT_AVAILABLE:
        return jsonify({
            'success': False,
            'message': '챗봇 기능이 현재 사용할 수 없습니다.'
        })
    
    try:
        # 학습 데이터 반환
        learning_data = {
            'total_users': len(chatbot.user_profiles["users"]),
            'total_conversations': len(chatbot.user_profiles["conversation_history"]),
            'common_questions': chatbot.user_profiles["learning_data"]["common_questions"],
            'user_preferences': chatbot.user_profiles["learning_data"]["user_preferences"]
        }
        
        return jsonify({
            'success': True,
            'data': learning_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'학습 데이터 조회 중 오류가 발생했습니다: {str(e)}'
        })

if __name__ == '__main__':
    # 환경변수에서 포트 가져오기 (배포 환경용)
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)
