from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# Mock servo positions for development
servo_positions = [90, 180, 180, 120, 0, 0]

def move_servo(servo_num, angle):
    global servo_positions
    servo_positions[servo_num] = angle
    time.sleep(0.1)  # Reduced sleep time for testing

def all_initial_position():
    global servo_positions
    servo_positions = [90, 180, 180, 120, 0, 0]
    time.sleep(0.1)

# API Routes
@app.route('/api/servo', methods=['POST'])
def control_servo():
    try:
        data = request.json
        servo_id = data.get('servo_id')
        position = data.get('position')
        
        if servo_id is None or position is None:
            return jsonify({'status': 'error', 'message': 'Missing servo_id or position'}), 400
        
        move_servo(servo_id, position)
        return jsonify({
            'status': 'success',
            'message': f'Servo {servo_id} moved to {position}°'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/reset', methods=['POST'])
def set_initial_position():
    try:
        all_initial_position()
        return jsonify({
            'status': 'success',
            'message': 'Robot returned to initial position'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/pick-package', methods=['POST'])
def pick_package():
    try:
        data = request.json
        shape = data.get('shape')
        
        if not shape:
            return jsonify({'status': 'error', 'message': 'Shape not specified'}), 400
        
        # Mock movement sequence
        time.sleep(0.5)
        
        return jsonify({
            'status': 'success',
            'message': f'Successfully picked and placed {shape} package'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)