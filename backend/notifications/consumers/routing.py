from django.urls import path
from .consumers import NotificationsConsumer

websocket_urlpatterns = [
    path('notifications/', NotificationsConsumer.as_asgi())
]
