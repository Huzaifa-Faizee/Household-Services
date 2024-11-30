from datetime import datetime
import os
from flask import jsonify, request,current_app as app, send_file
from flask_restful import Api, Resource, fields, marshal, marshal_with
from flask_security import auth_required, current_user
from sqlalchemy import func
from backend.models import Services,User ,Role, UserRoles, db,Serviceproviders,Customers,ServiceRequests,Ratings
import matplotlib.pyplot as plt

api = Api(prefix='/api')

cache=app.cache

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

rating_fields={
     'review':fields.String,
     'user':fields.Nested(user_fields)
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
    'service_description':fields.String,
    'ratings':fields.Nested(rating_fields)
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
    @cache.cached(key_prefix="services_list")
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
        cache.delete("services_list")

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
        cache.delete("services_list")

        return {"message": "Service deleted successfully"}, 200
    
    @auth_required('token')
    def put(self):
         data=request.get_json()
         service_id=data.get('id')
         service=Services.query.get(service_id)
         if not service_id:
            return {"message":"Service Id not been provided"},400
         service.name=data.get('name')
         service.description=data.get('desc')
         service.base_price=data.get('base_price')
         db.session.commit()
         cache.delete("services_list")
         return {"message": "Service Updated successfully"}, 200
    
api.add_resource(Service,'/services')

class UsersData(Resource):
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
    
api.add_resource(UsersData,'/users')

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
     
     @auth_required('token')
     def post(self,user_id):
          data=request.get_json()
          s_req=ServiceRequests.query.filter_by(id=data.get('request_id')).first()
          s_req.status=data.get('status')
          review=Ratings(user_id=user_id,service_provider_id=s_req.service_provider_id,review=data.get('review'))
          db.session.add(review)
          db.session.commit()

api.add_resource(RequestsForUser,'/user-requests/<int:user_id>')

class RequestsForAdmin(Resource):
     @marshal_with(request_fields)
     @auth_required('token')
     def get(self):
          return ServiceRequests.query.all()

api.add_resource(RequestsForAdmin,'/all-requests')

class ProfessionalDetailsForUser(Resource):
     @marshal_with(professional_fields)
     @auth_required('token')
     def get(self, id):
          return Serviceproviders.query.filter_by(id=id).first()
api.add_resource(ProfessionalDetailsForUser,'/professional-details/<int:id>')

class AdminSearch(Resource):
     @auth_required('token')
     def get(self, search_value):
         search_value="%"+search_value+"%"
         users = User.query.join(User.roles).filter(Role.name == 'user',User.name.like(search_value)).all()
         professionals = Serviceproviders.query.filter(Serviceproviders.business_name.like(search_value)).all()
         users_1 = [marshal(user, user_fields) for user in users]
         professionals_1 = [marshal(professional, professional_fields) for professional in professionals]
         print(users_1,professionals_1)   
         return {'users':users_1,"professionals":professionals_1},200            
api.add_resource(AdminSearch,'/admin-search/<search_value>')

class UserSearch(Resource):
     @auth_required('token')
     def get(self, search_value):
         search_value="%"+search_value+"%"
         services = Services.query.filter(Services.name.like(search_value)).all()
         professionals = Serviceproviders.query.filter(Serviceproviders.status == "accepted",Serviceproviders.business_name.like(search_value)).all()
         services_1 = [marshal(service, service_fields) for service in services]
         professionals_1 = [marshal(professional, professional_fields) for professional in professionals]
         return {'services':services_1,"professionals":professionals_1},200
     
api.add_resource(UserSearch,'/user-search/<search_value>')

class AdminStats(Resource):
     @auth_required('token')
     def get(self):
            bar_data = db.session.query(ServiceRequests.status,func.count(ServiceRequests.id).label('count')).group_by(ServiceRequests.status).all()
            bar_labels = [status for status, count in bar_data]
            bar_values = [count for status, count in bar_data]
            plt.figure(figsize=(10, 6))
            plt.bar(bar_labels, bar_values, color=['#f87979', '#7fc97f', '#beaed4', '#fdc086'])
            plt.xlabel("Status")
            plt.ylabel("Number of Requests")
            plt.title("Service Requests by Status")
            plt.tight_layout()
            bar_chart_path = "./backend/charts/admin_service_requests_status.png"
            os.makedirs(os.path.dirname(bar_chart_path), exist_ok=True)
            plt.savefig(bar_chart_path)
            plt.close()

            role_data = db.session.query(Role.name,func.count(UserRoles.id).label('count')).join(UserRoles, Role.id == UserRoles.role_id).group_by(Role.name).all()
            pie_labels = [role for role, count in role_data]
            pie_values = [count for role, count in role_data]
            
            plt.figure(figsize=(8, 8))
            plt.pie(
                pie_values,
                labels=pie_labels,
                autopct=lambda pct: AdminStats.absolute_value(pct,pie_values),
                # autopct='%1.1f%%',
                startangle=140,
                colors=['#ff9999', '#66b3ff', '#99ff99', '#ffcc99']
            )
            plt.title("Distribution of User Roles")
            pie_chart_path = "./backend/charts/admin_roles_pie_chart.png"
            plt.savefig(pie_chart_path)
            plt.close()

            # Return the paths (names) of the generated charts
            return jsonify({
                "bar_chart": os.path.basename(bar_chart_path),
                "pie_chart": os.path.basename(pie_chart_path)
            })

     def absolute_value(val,pie_values):
        total = sum(pie_values)
        idx = int(val / 100.0 * len(pie_values))
        return f"{pie_values[idx]}"

            

api.add_resource(AdminStats,'/admin-stats')

class ProfessionalStats(Resource):
        @auth_required('token')
        def get(self,id):
            print(id)
            prof=Serviceproviders.query.filter_by(user_id=id).first()
            bar_data = db.session.query(ServiceRequests.status,func.count(ServiceRequests.id).label('count')).filter(ServiceRequests.service_provider_id == prof.id).group_by(ServiceRequests.status).all()
            bar_labels = [status for status, count in bar_data]
            bar_values = [count for status, count in bar_data]
            print(bar_labels,bar_values)
            plt.figure(figsize=(10, 6))
            plt.bar(bar_labels, bar_values, color=['#f87979', '#7fc97f', '#beaed4', '#fdc086'])
            plt.xlabel("Status")
            plt.ylabel("Number of Requests")
            plt.title("Service Requests by Status")
            plt.tight_layout()
            bar_chart_path = "./backend/charts/prof_service_requests_status.png"
            os.makedirs(os.path.dirname(bar_chart_path), exist_ok=True)
            plt.savefig(bar_chart_path)
            plt.close()
            return jsonify({
                "bar_chart": os.path.basename(bar_chart_path),
            })

api.add_resource(ProfessionalStats,'/professional-stats/<int:id>')
class UserStats(Resource):
        @auth_required('token')
        def get(self,id):
            bar_data = db.session.query(ServiceRequests.status,func.count(ServiceRequests.id).label('count')).filter(ServiceRequests.user_id == id).group_by(ServiceRequests.status).all()
            bar_labels = [status for status, count in bar_data]
            bar_values = [count for status, count in bar_data]
            print(bar_labels,bar_values)
            plt.figure(figsize=(10, 6))
            plt.bar(bar_labels, bar_values, color=['#f87979', '#7fc97f', '#beaed4', '#fdc086'])
            plt.xlabel("Status")
            plt.ylabel("Number of Requests")
            plt.title("Service Requests by Status")
            plt.tight_layout()
            bar_chart_path = "./backend/charts/user_service_requests_status.png"
            os.makedirs(os.path.dirname(bar_chart_path), exist_ok=True)
            plt.savefig(bar_chart_path)
            plt.close()
            return jsonify({
                "bar_chart": os.path.basename(bar_chart_path),
            })

api.add_resource(UserStats,'/user-stats/<int:id>')

class AdminHomeData(Resource):
     @auth_required('token')
     def get(self):
          users = User.query.join(User.roles).filter(Role.name == 'user').count()
          professionals = User.query.join(User.roles).filter(Role.name == 'service_provider').count()
          active_requests=ServiceRequests.query.filter(ServiceRequests.status=='accepted').count()
          closed_requests=ServiceRequests.query.filter(ServiceRequests.status=='closed').count()
          print(users,professionals,active_requests,closed_requests)
          return jsonify({"users":users,"professionals":professionals,"active_requests":active_requests,"closed_requests":closed_requests})
     
api.add_resource(AdminHomeData,'/admin-home-data')