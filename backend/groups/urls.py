from django.urls import include, path
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'groups'

router = DefaultRouter()
router.register('groups', viewset=views.GroupViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('groups-by-user/<int:pk>/', views.GroupsByUser.as_view())
]