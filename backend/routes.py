from flask import current_app as app, jsonify, render_template,  request, send_from_directory
from flask_security import auth_required, verify_password, hash_password
from backend.models import db,User,Serviceproviders,Customers
import os
datastore = app.security.datastore

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.get('/protected')
@auth_required('token')
def protected():
    return '<h1> only accessible by auth user</h1>'

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if not user:
        return jsonify({"message" : "invalid email"}), 404
    
    if verify_password(password, user.password):
        if user.roles[0].name == "service_provider":
            return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id,'name':user.name,'status':user.service_providers[0].status})
        elif user.roles[0].name == "user":
            return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id,'name':user.name,'status':user.customer[0].status})
        else:
            return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id,'name':user.name})
    
    return jsonify({'message' : 'password wrong'}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name=data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or role not in ['admin', 'user']:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if user:
        return jsonify({"message" : "user already exists"}), 404

    try :
        datastore.create_user(email = email, password = hash_password(password), roles = [role], active = True, name = name)
        db.session.commit()
        user_data=User.query.filter_by(email=email).first()
        customer=Customers(user_id=user_data.id)
        db.session.add(customer)
        db.session.commit()
        return jsonify({"message" : "user created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400
    
@app.route('/registerProfessional', methods=['POST'])
def registerProfessional():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role')
    service_id = request.form.get('service_id')
    business_name = request.form.get('business_name')
    experience = request.form.get('experience')
    address = request.form.get('address')
    price = request.form.get('price')
    if not email or not password or role not in ['service_provider']:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if user:
        return jsonify({"message" : "user already exists"}), 404
    
    try :
        datastore.create_user(email = email, password = hash_password(password), roles = [role], active = True, name = name)
        db.session.commit()
        file = request.files.get('file')
        if file:
            filename = file.filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
        print(f"File saved at: {file_path}")
        user_data=User.query.filter_by(email=email).first()
        provider_new=Serviceproviders(service_id=service_id,user_id=user_data.id,address=address,experience=experience,business_name=business_name,uploaded_file=filename,price=price)
        db.session.add(provider_new)
        db.session.commit()
        return jsonify({"message" : "user created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)