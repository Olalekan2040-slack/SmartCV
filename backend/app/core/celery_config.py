from celery import Celery
from app.core.config import settings

# Create Celery app
celery_app = Celery(
    "smartcv",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.pdf_tasks",
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_routes={
        "app.tasks.pdf_tasks.generate_cv_pdf": {"queue": "pdf_generation"},
        "app.tasks.pdf_tasks.cleanup_old_pdfs": {"queue": "maintenance"},
    },
    beat_schedule={
        "cleanup-old-pdfs": {
            "task": "app.tasks.pdf_tasks.cleanup_old_pdfs",
            "schedule": 86400.0,  # Run daily
        },
    },
)

if __name__ == "__main__":
    celery_app.start()
