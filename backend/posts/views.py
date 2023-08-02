from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from django.db.models import Q, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from backend.paginators import SmallResultsCursorPagination
from groups.models import Group
from notifications.models import LikeNotification
from users.models import FriendRequest
from .models import Post
from .permissions import IsPostOwnerOrReadOnly
from .serializers import PostSerializer, PostCreateSerializer, PostEditSerializer

User = get_user_model()


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all(
    ).prefetch_related(
        Prefetch('likes'),
    ).select_related(
        'author',
        'group'
    )
    permission_classes = [permissions.IsAuthenticated, IsPostOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create']:
            return PostCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PostEditSerializer
        return PostSerializer

    @action(detail=True, methods=['post'])
    def like_unlike(self, request, pk=None):
        """
        Поставить/убрать лайк с поста
        """
        post = self.get_object()
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
        else:
            post.likes.add(user)

            if post.author != user:
                LikeNotification.objects.create(
                    type='like',
                    from_user=user,
                    to_user=post.author,
                    item=post
                )

        serializer = self.get_serializer(post)

        return Response(serializer.data)


class PostsByUser(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = SmallResultsCursorPagination

    def get_queryset(self):
        user = get_object_or_404(User, id=self.kwargs['pk'])
        return Post.objects.filter(author=user, group=None).prefetch_related(
            Prefetch('likes'),
        ).select_related(
            'author',
            'group'
        )


class PostsByGroup(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = SmallResultsCursorPagination

    def get_queryset(self):
        group = get_object_or_404(Group, id=self.kwargs['pk'])
        return Post.objects.filter(group=group).prefetch_related(
            Prefetch('likes'),
        ).select_related(
            'author',
            'group'
        )


class UserFeed(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = SmallResultsCursorPagination

    def get_queryset(self):
        """
            Получение новостей пользователя.

            Новости формируются из указанных ниже типов постов(сделанных не позже 30 дней назад):
            - постов друзей
            - постов людей, на которых подписан пользователь
            - постов групп, на которых подписан пользователь
            - постов пользователя
        """
        user = self.request.user
        groups = Group.objects.get_groups_by_user(user)
        friends = user.friends.all()
        following_users = (FriendRequest.objects.sent(user)).values_list('to_user', flat=True)
        week_ago = datetime.now() - timedelta(days=30)

        return Post.objects.filter((
                                           Q(author__in=friends, group=None) |
                                           Q(author__in=following_users, group=None) |
                                           Q(group__in=groups) | Q(author=user)) &
                                   Q(created_at__gte=week_ago)
                                   ).order_by('-created_at').prefetch_related(
            Prefetch('likes'),
        ).select_related(
            'author',
            'group'
        )
