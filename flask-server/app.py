import re
import secrets
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, current_app, session, flash
from flask_login import LoginManager, UserMixin, login_required, login_user, current_user
import bcrypt
from flask_cors import CORS  # Import CORS
from flask import Flask, request, redirect, url_for, jsonify


app = Flask(__name__)
app.secret_key = secrets.token_hex()
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
app.app_context().push()

CORS(app)  # Enable CORS for the entire app

class User(UserMixin):
    def __init__(self, id, username, phone, email, password):   
        self.id = id
        self.username = username
        self.phone = phone
        self.email = email
        self.password = password

def get_user_by_id(user_id):
    conn = sqlite3.connect('database3.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (int(user_id),))
    user_data = cursor.fetchone()
    conn.close()
    if user_data:
        return User(user_data[0], user_data[1], user_data[2], user_data[3], user_data[4])
    return None

@login_manager.user_loader
def load_user(user_id):
    return get_user_by_id(user_id)

@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['POST'])
def login():
    error = None
    if request.method == 'POST':
        data = request.json  # Access the JSON data
        email = data.get('email')
        password = data.get('password')
        
        conn = sqlite3.connect('database3.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user_data = cursor.fetchone()
        conn.close()
        
        if user_data and bcrypt.checkpw(password.encode('utf-8'), user_data[4]):
            user = User(user_data[0], user_data[1], user_data[2], user_data[3], user_data[4])
            login_user(user)
            # Return a response indicating a successful login
            return {'success': True, 'redirect': '/'}  # Redirect to root route of frontend
        error = 'Invalid email or password'
    
    return {'success': False, 'error': error}

@app.route('/register', methods=['POST'])
def register():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        phone = request.form['phone']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        valid_phone, phone_msg = validate_phone(phone)
        valid_password, password_msg = validate_password(password)
        valid_email, email_msg = validate_email(email)

        if not valid_phone:
            error = phone_msg
        elif not valid_email:
            error = email_msg
        elif not valid_password:
            error = password_msg
        elif password != confirm_password:
            error = 'The password and confirmation password do not match.'
        else:
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            conn = sqlite3.connect('database3.db')
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (username, phone, email, password) VALUES (?, ?, ?, ?)', 
                           (username, phone, email, hashed_password))
            conn.commit()
            conn.close()
            return jsonify({'success': True})

    return jsonify({'success': False, 'error': error})
@app.route('/dashboard')
@login_required
def dashboard():
    return f'Bonjour, {current_user.username}'

@app.route('/index')  # Ensure there is a route for the root path
def index():
    return 'Welcome to the home page'

def validate_email(email):
    conn = sqlite3.connect('database3.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return False, 'Email already exists. Try to log in!'   
    return True, ''

def validate_phone(phone):
    if not phone.startswith('+'):
        return False, 'Phone number must start with "+ international code".'
    digits_only = phone[1:]  # Exclude "+" to keep only digits
    if not digits_only.isdigit():
        return False, 'Phone number must contain only digits.'
    if len(digits_only) < 9 or len(digits_only) > 14:
        return False, 'Phone number must contain between 9 and 14 digits.'
    
    conn = sqlite3.connect('database3.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE phone = ?", (phone,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return False, 'Phone number already exists. Please use a different one!'
    
    return True, ''

def validate_password(password):
    if len(password) < 8:
        return False, 'Password must be longer than 8 characters'
    if not re.search(r'[A-Z]', password):
        return False, 'Password must contain at least one uppercase letter'
    if not re.search(r'[a-z]', password):
        return False, 'Password must contain at least one lowercase letter'
    if not re.search(r'[0-9]', password):
        return False, 'Password must contain at least one number'
    return True, ''

def create_tables():
    conn = sqlite3.connect('database3.db')
    c = conn.cursor()
    with current_app.open_resource("schema.sql") as f:
        c.executescript(f.read().decode("utf8"))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)
