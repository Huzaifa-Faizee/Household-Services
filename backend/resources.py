from flask import jsonify, request
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import Services,User ,Role, db,Serviceproviders


api = Api(prefix='/api')

blog_fields = {
    'id' : fields.Integer,
    'title' : fields.String,
    'caption' : fields.String,
    'image_url' : fields.String,
    'user_id' : fields.Integer,
    'timestamp' : fields.DateTime,
}
service_fields={
    'id':fields.Integer,
    'name':fields.String,
    'description':fields.String,
    'base_price':fields.Integer
}
user_fields={
    'name':fields.String,
    'email':fields.String,
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
    
api.add_resource(Users,'/users')

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

class ProfessionalList(Resource):
        @marshal_with(professional_fields)
        @auth_required('token')
        def get(self, service_id):
            professionals = Serviceproviders.query.filter_by(service_id=service_id).all()
            return professionals
        
api.add_resource(ProfessionalList,'/professionals/<int:service_id>')
# class BlogAPI(Resource):

#     @marshal_with(blog_fields)
#     @auth_required('token')
#     def get(self, blog_id):
#         blog = Blog.query.get(blog_id)

#         if not blog:
#             return {"message" : "not found"}, 404
#         return blog
    
#     @auth_required('token')
#     def delete(self, blog_id):

#         blog = Blog.query.get(blog_id)

#         if not blog:
#             return {"message" : "not found"}, 404
        
#         if blog.user_id == current_user.id:

#             db.session.delete(blog)
#             db.session.commit()
#         else:
#             return {"message" : "not valid user"}, 403
        

# class BlogListAPI(Resource):

#     @marshal_with(blog_fields)
#     @auth_required('token')
#     def get(self ):
#         blogs = Blog.query.all()
#         return blogs
    
#     @auth_required('token')
#     def post(self):
#         data = request.get_json()
#         title = data.get('title')
#         caption = data.get('caption')
#         image_url = data.get('image_url')

#         blog = Blog(title = title, caption = caption, image_url = image_url, user_id = current_user.id)

#         db.session.add(blog)
#         db.session.commit()
#         return jsonify({'message' : 'blog created'})

    
# api.add_resource(BlogAPI, '/blogs/<int:blog_id>')
# api.add_resource(BlogListAPI,'/blogs')