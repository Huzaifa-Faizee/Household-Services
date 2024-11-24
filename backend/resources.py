from datetime import datetime
from flask import jsonify, request
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import Services,User ,Role, db,Serviceproviders,Customers,ServiceRequests


api = Api(prefix='/api')

service_fields={
    'id':fields.Integer,
    'name':fields.String,
    'description':fields.String,
    'base_price':fields.Integer
}
customer_fields={
     'id':fields.Integer,
     'user_id':fields.Integer,
     'status':fields.String,
}
user_fields={
    'id':fields.Integer,
    'name':fields.String,
    'email':fields.String,
    'customer':fields.Nested(customer_fields)
}

professional_fields={
    'id':fields.Integer,
    'user_id':fields.Integer,
    'service_id':fields.Integer,
    'user':fields.Nested(user_fields),
    'service':fields.Nested(service_fields),
    'business_name':fields.String,
    'experience':fields.String,
    'address':fields.String,
    'uploaded_file':fields.String,
    'status':fields.String,
    'date_created':fields.String,
    'price':fields.Integer,
    'service_description':fields.String
}

request_fields={
     'id':fields.Integer,
     'user_id':fields.Integer,
     'service_id':fields.Integer,
     'date_requested':fields.String,
     'user_address':fields.String,
     'status':fields.String,
     'user':fields.Nested(user_fields),
     'service_provider':fields.Nested(professional_fields),
     'service':fields.Nested(service_fields)
}
class Service(Resource):
    @marshal_with(service_fields)
    def get(self):
        services=Services.query.all()
        return services

    @auth_required('token')
    def post(self):
        data=request.get_json()
        name=data.get('name')
        desc=data.get('desc')
        base_price=data.get('base_price')
        service=Services(name=name, description=desc,base_price=base_price)
        db.session.add(service)
        db.session.commit()
        return jsonify({'message' : 'blog created'})
    
    @auth_required('token')
    def delete(self):
        data=request.get_json()
        service_id=data.get('id')
        if not service_id:
            return {"message":"Service Id not been provided"},400
        
        service=Services.query.get(service_id)
        db.session.delete(service)
        db.session.commit()

        return {"message": "Service deleted successfully"}, 200

api.add_resource(Service,'/services')

class Users(Resource):
    @marshal_with(user_fields)
    @auth_required('token')
    def get(self):
        users = User.query.join(User.roles).filter(Role.name == 'user').all()
        return users
    
    @auth_required('token')
    def post(self):
         data=request.get_json()
         customer=Customers.query.filter_by(user_id=data.get('user_id')).first()
         customer.status=data.get('status')
         db.session.commit()
    
api.add_resource(Users,'/users')

# This class deals with admin actions
class Professionals(Resource):
    @marshal_with(professional_fields)
    @auth_required('token')
    def get(self):
        professionals = Serviceproviders.query.all()
        return professionals
    
    @auth_required('token')
    def post(self):
        data=request.get_json()
        professional_id=data.get('id')
        status=data.get('status')
        professional = Serviceproviders.query.filter_by(id=professional_id).first()
        professional.status=status
        db.session.commit()

api.add_resource(Professionals,'/professionals')

# This class deals with user actions do fetch via service id
class ProfessionalList(Resource):
        @marshal_with(professional_fields)
        @auth_required('token')
        def get(self, service_id):
            professionals = Serviceproviders.query.filter_by(service_id=service_id,status="accepted").all()
            return professionals
        
api.add_resource(ProfessionalList,'/professionals/<int:service_id>')

# This class deals with professional actions to perform actions limited to the professional
class IndividualProfessional(Resource):
        @marshal_with(professional_fields)
        @auth_required('token')
        def get(self, user_id):
             return Serviceproviders.query.filter_by(user_id=user_id).first()

        @auth_required('token')
        def post(self, user_id):
             data=request.get_json()
             prof=Serviceproviders.query.filter_by(user_id=user_id).first()
             prof.business_name = data.get("business_name")
             prof.experience = data.get("experience")
             prof.address = data.get("address")
             prof.service_description = data.get("service_description")
             prof.price = data.get("price")
             db.session.commit()
api.add_resource(IndividualProfessional,'/invidualProfessional/<int:user_id>')

class NewRequests(Resource):
     @auth_required('token')
     def post(self):
        data=request.get_json()
        new_request=ServiceRequests(
               user_id=data.get('user_id'),
               service_provider_id=data.get('service_provider_id'),
               service_id=data.get('service_id'),
               date_requested=datetime.strptime(data.get('date_requested'), "%Y-%m-%d").date(),
               user_address=data.get('user_address'),
        )
        db.session.add(new_request)
        db.session.commit()
        return 200
     
api.add_resource(NewRequests,'/requests')

class RequestsForService(Resource):
    @marshal_with(request_fields)
    @auth_required('token')
    def get(self,service_id,user_id):
        requests=ServiceRequests.query.filter_by(user_id=user_id,service_id=service_id).all()
        return requests

api.add_resource(RequestsForService,'/service-requests/<int:service_id>/<int:user_id>')

class RequestsForProfessional(Resource):
     @marshal_with(request_fields)
     @auth_required('token')
     def get(self,professional_id):
           prof=Serviceproviders.query.filter_by(user_id=professional_id).first()
           return ServiceRequests.query.filter_by(service_provider_id=prof.id).all()

     def post(self,professional_id):
          data=request.get_json()
          s_req=ServiceRequests.query.filter_by(id=data.get('id')).first()
          s_req.status=data.get('status')
          db.session.commit()

api.add_resource(RequestsForProfessional,'/professional-requests/<int:professional_id>')

class RequestsForUser(Resource):
     @marshal_with(request_fields)
     @auth_required('token')
     def get(self,user_id):
          return ServiceRequests.query.filter_by(user_id=user_id).all()

api.add_resource(RequestsForUser,'/user-requests/<int:user_id>')
