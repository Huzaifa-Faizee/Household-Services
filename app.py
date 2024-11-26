from flask import Flask
from backend.config import LocalDevelopmentConfig
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore
import os
from flask_caching import Cache

def createApp():
    app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')

    app.config.from_object(LocalDevelopmentConfig)

    UPLOAD_FOLDER='uploads'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    # model init
    db.init_app(app)
    
    # cache init
    cache = Cache(app)


    #flask security
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.cache = cache
    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.app_context().push()

    from backend.resources import api
    # flask-restful init
    api.init_app(app)

    return app

app = createApp()

import backend.create_initial_data

import backend.routes


if (__name__ == '__main__'):
    app.run()