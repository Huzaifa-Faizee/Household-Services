from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name = 'admin', description = 'Administrator')
    userdatastore.find_or_create_role(name = 'user', description = 'Makes use of services')
    userdatastore.find_or_create_role(name = 'service_provider', description = 'Provides Services')

    if (not userdatastore.find_user(email = 'admin@mail.com')):
        userdatastore.create_user(email = 'admin@mail.com', password = hash_password('admin123'), roles = ['admin'] )
    if (not userdatastore.find_user(email = 'user@mail.com')):
        userdatastore.create_user(email = 'user@mail.com', password = hash_password('user123'), roles = ['user'] ) 
    if (not userdatastore.find_user(email = 'provider@mail.com')):
        userdatastore.create_user(email = 'provider@mail.com', password = hash_password('provider123'), roles = ['service_provider'] ) 

    db.session.commit()