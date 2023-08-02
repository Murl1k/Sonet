from django.urls import include, path
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'chat'

router = DefaultRouter()
router.register('chats', viewset=views.ChatViewSet, basename='chats')


urlpatterns = [
    path('', include(router.urls)),
]
