from celery import Celery
from app.core.config import settings

# Create Celery instance with fallback configuration
broker_url = settings.CELERY_BROKER_URL or "memory://"
result_backend = settings.CELERY_RESULT_BACKEND or "cache+memory://"

celery_app = Celery(
    "smartcv",
    broker=broker_url,
    backend=result_backend,
    include=['app.tasks.pdf_tasks', 'app.tasks.email_tasks']
)

# Celery configuration
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Task routing
celery_app.conf.task_routes = {
    'app.tasks.pdf_tasks.*': {'queue': 'pdf_generation'},
    'app.tasks.email_tasks.*': {'queue': 'email_sending'},
}

if __name__ == '__main__':
    celery_app.start()
