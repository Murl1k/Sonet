from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'users'

router = DefaultRouter()
router.register('friend-requests', views.FriendRequestViewSet, basename='friend_requests')
router.register(r'friends', views.FriendshipViewSet, basename='friends')
router.register('auth/users', views.CustomUserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/users/by-username/<str:username>/', views.CustomUserViewSet.as_view({'get': 'by_username'}),
         name='user-by-username'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
]
