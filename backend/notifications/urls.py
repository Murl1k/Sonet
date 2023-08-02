from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'notifications'

router = DefaultRouter()
router.register('notifications', viewset=views.NotificationViewSet, basename='chats')


urlpatterns = [
    path('', include(router.urls)),
]
