from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import email_reminder

celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    html_file = 'reminder.html'
    with open(html_file, 'r') as file:
        html_content = file.read()
    # every 10 seconds
    sender.add_periodic_task(10.0, email_reminder.s('students@gmail.com', 'reminder to login', html_content) )

    # daily message at 6:55 pm, everyday
    # sender.add_periodic_task(crontab(hour=22, minute=37), email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>'), name='daily reminder' )

    # weekly messages
    # sender.add_periodic_task(crontab(hour=18, minute=55, day_of_week='monday'), email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>'), name = 'weekly reminder' )


