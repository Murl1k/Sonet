"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
import chat.consumers.routing
import notifications.consumers.routing
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from backend.middleware import CustomTokenAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': CustomTokenAuthMiddleware(
        URLRouter(
            chat.consumers.routing.websocket_urlpatterns + notifications.consumers.routing.websocket_urlpatterns
        )
    )
})
