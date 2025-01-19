from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from adafruit_servokit import ServoKit
import numpy as np
import RPi.GPIO as GPIO
import board
import busio
import adafruit_vl53l0x

app = Flask(__name__)
CORS(app)

# Initialize servo controller
kit = ServoKit(channels=8)

# Initial position functions
def initial_s0():
    kit.servo[0].angle = 90
    time.sleep(1)

def initial_s1():
    kit.servo[1].angle = 180
    time.sleep(1)

def initial_s2():
    kit.servo[2].angle = 180
    time.sleep(1)

def initial_s3():
    kit.servo[3].angle = 120
    time.sleep(1)

def initial_s4():
    kit.servo[4].angle = 0
    time.sleep(1)

def initial_s5():
    kit.servo[5].angle = 0
    time.sleep(1)

def all_initial_position():
    initial_s0()
    initial_s1()
    initial_s2()
    initial_s3()
    initial_s4()
    initial_s5()

def move_servo(servo_num, angle):
    kit.servo[servo_num].angle = angle
    time.sleep(1)

def pick_box():
    move_servo(5, 180)
    time.sleep(1.5)
    move_servo(5, 0)
    time.sleep(1)

def move_forward():
    move_servo(1, 130)
    move_servo(4, 170)
    move_servo(1, 120)
    move_servo(5, 180)
    move_servo(1, 110)
    move_servo(1, 100)
    move_servo(1, 90)
    move_servo(2, 165)
    move_servo(1, 85)
    move_servo(1, 80)
    move_servo(1, 75)
    move_servo(1, 70)
    move_servo(5, 0)

def circle_movement():
    move_servo(1, 130)
    move_servo(4, 130)
    move_servo(1, 130)
    move_servo(1, 145)
    move_servo(2, 180)
    move_servo(0, 180)
    move_servo(5, 180)

def triangle_movement():
    move_servo(1, 110)
    move_servo(4, 130)
    move_servo(1, 130)
    move_servo(1, 145)
    move_servo(1, 180)
    move_servo(2, 180)
    move_servo(4, 70)
    move_servo(5, 0)

def square_movement():
    move_forward()
    move_servo(1, 110)
    move_servo(4, 130)
    move_servo(1, 130)
    move_servo(1, 145)
    move_servo(2, 180)
    move_servo(0, 0)
    move_servo(5, 0)
    all_initial_position()

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

@app.route('/api/initial-position', methods=['POST'])
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
        
        # Execute the appropriate movement sequence
        if shape == 'circle':
            move_forward()
            circle_movement()
        elif shape == 'triangle':
            move_forward()
            triangle_movement()
        elif shape == 'square':
            square_movement()
        else:
            return jsonify({'status': 'error', 'message': 'Invalid shape specified'}), 400
        
        return jsonify({
            'status': 'success',
            'message': f'Successfully picked and placed {shape} package'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    try:
        # Return current servo positions
        positions = [kit.servo[i].angle for i in range(6)]
        return jsonify({
            'status': 'success',
            'servo_positions': positions
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    try:
        # Initialize to starting position
        all_initial_position()
        # Run the server
        app.run(host='0.0.0.0', port=3000)
    finally:
        GPIO.cleanup()


s