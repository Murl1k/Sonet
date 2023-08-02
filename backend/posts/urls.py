from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'posts'

router = DefaultRouter()
router.register('posts', viewset=views.PostViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('posts-by-user/<int:pk>/', views.PostsByUser.as_view()),
    path('posts-by-group/<int:pk>/', views.PostsByGroup.as_view()),
    path('userfeed/', views.UserFeed.as_view()),
]