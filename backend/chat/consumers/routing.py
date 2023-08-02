from django.urls import path
from .consumers import ChatConsumer, ChatListConsumer

websocket_urlpatterns = [
    path('chat/<int:user_id>/', ChatConsumer.as_asgi()),
    path('chatlist/', ChatListConsumer.as_asgi())
]
