from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from datetime import date

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable = False)
    email = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False)
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False) # flask-security specific
    active = db.Column(db.Boolean, default = True) # flask-security specific
    roles = db.Relationship('Role', backref = 'bearers', secondary='user_roles')
    service_providers = db.relationship('Serviceproviders', backref='user')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable  = False)
    description = db.Column(db.String, nullable = False)

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Services(db.Model):
    id=db.Column(db.Integer, primary_key = True)
    name=db.Column(db.String,unique=True,nullable = False)
    description=db.Column(db.String,nullable = False)
    base_price=db.Column(db.Integer,nullable = False)
    service_providers = db.relationship('Serviceproviders', backref='service')

class Serviceproviders(db.Model):
    id=db.Column(db.Integer, primary_key = True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    service_id=db.Column(db.Integer,db.ForeignKey('services.id'))
    business_name=db.Column(db.String,nullable = False)
    experience=db.Column(db.String,nullable = False)
    address=db.Column(db.String,nullable = False)
    uploaded_file=db.Column(db.String,nullable = False)
    service_description=db.Column(db.String,nullable=False,default="We Provide Services")
    price=db.Column(db.Integer,default=0)
    status=db.Column(db.String,nullable = False,default="waiting")
    date_created=db.Column(db.Date, default=date.today)

class ServiceRequests(db.Model):
    id=db.Column(db.Integer, primary_key = True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    service_provider_id=db.Column(db.Integer,db.ForeignKey('serviceproviders.id'))
    date_requested=db.Column(db.Date)
    status=db.Column(db.String,nullable = False,default="requested")

class Ratings(db.Model):
    id=db.Column(db.Integer, primary_key = True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    service_provider_id=db.Column(db.Integer,db.ForeignKey('serviceproviders.id'))
    review=db.Column(db.String,nullable = False)