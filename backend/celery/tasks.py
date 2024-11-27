from celery import shared_task
import flask_excel
from backend.models import Services,Customers,User,Role,Serviceproviders,ServiceRequests


@shared_task(bind = True, ignore_result = False)
def create_service_csv(self):
    resource = Services.query.all()

    task_id = self.request.id
    filename = f'service_data_{task_id}.csv'
    column_names = [column.name for column in Services.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user_downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(bind = True, ignore_result = False)
def create_customer_csv(self):
    resource =  User.query.join(Role, User.roles).filter(Role.name == 'user').all()

    task_id = self.request.id
    filename = f'customer_data_{task_id}.csv'
    column_names = [column.name for column in User.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user_downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(bind = True, ignore_result = False)
def create_professionals_csv(self):
    resource =  Serviceproviders.query.all()

    task_id = self.request.id
    filename = f'professional_data_{task_id}.csv'
    column_names = [column.name for column in Serviceproviders.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user_downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(bind = True, ignore_result = False)
def create_request_csv(self):
    resource =  ServiceRequests.query.all()

    task_id = self.request.id
    filename = f'request_data_{task_id}.csv'
    column_names = [column.name for column in ServiceRequests.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user_downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename