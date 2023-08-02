from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from djoser.views import UserViewSet
from django.db.models import Count
from rest_framework import permissions, status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.response import Response

from notifications.models import FriendRequestNotification, FriendRequestAcceptedNotification
from .models import FriendRequest
from .permissions import IsFriendRequestParticipant
from .serializers import CustomUserSerializer, FriendRequestSerializer, FriendshipCreateSerializer, \
    FriendRequestCreateSerializer

User = get_user_model()


class CustomUserViewSet(UserViewSet):
    """
    Viewset, расширяющий дефолтный UserViewSet из Djoser
    """

    filter_backends = [SearchFilter]
    queryset = User.objects.all(
    ).annotate(
        friends_count=Count('friends', distinct=True),
        followers_count=Count('received_friend_requests', distinct=True),
        following_count=Count('sent_friend_requests', distinct=True)
    )
    search_fields = ['username', 'first_name', 'last_name']

    @action(detail=False, methods=['get'])
    def by_username(self, request, username):
        """Получение пользователя по нику"""
        user = get_object_or_404(self.get_queryset(), username=username)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def relationship(self, request, id=None):
        """
        Получение отношений пользователей (request.user и пользователя по id)

        MY_ACCOUNT - request.user и пользователь по id одинаковы
        FRIEND - пользователи дружат между собой
        FOLLOWING - если у request.user отправлен FriendRequest к другому пользователю
        FOLLOWER - если у другого пользователя отправлен FriendRequest к текущему пользователю
        STRANGER - никаких связей между пользователями нет
        """
        user = get_object_or_404(User, pk=id)
        current_user = request.user
        following_friend_request = FriendRequest.objects.filter(from_user=current_user, to_user=user).first()
        follower_friend_request = FriendRequest.objects.filter(from_user=user, to_user=current_user).first()
        obj = None

        if user == current_user:
            relationship = 'MY_ACCOUNT'
        elif user in current_user.friends.all():
            relationship = 'FRIEND'
        elif following_friend_request:
            relationship = 'FOLLOWING'
            obj = FriendRequestSerializer(following_friend_request).data
        elif follower_friend_request:
            relationship = 'FOLLOWER'
            obj = FriendRequestSerializer(follower_friend_request).data
        else:
            relationship = 'STRANGER'

        if not obj:
            obj = CustomUserSerializer(user).data

        return Response({'RELATIONSHIP_TYPE': relationship, 'object': obj})


class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all(
    ).select_related(
        'from_user',
        'to_user'
    )
    serializer_class = FriendRequestSerializer
    permission_classes = [IsFriendRequestParticipant, permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']

    def list(self, request, *args, **kwargs):
        user_pk = request.query_params.get('user_pk')
        user = get_object_or_404(User, pk=user_pk)
        friend_request_type = request.query_params.get('type')

        match friend_request_type:
            case 'sent':
                results = FriendRequest.objects.sent(user)
            case 'recieved':
                results = FriendRequest.objects.recieved(user)
            case _:
                results = FriendRequest.objects.by_user(user)

        results = results.select_related('from_user', 'to_user')

        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        from_user = request.user
        to_user_id = request.data.get('to_user')
        to_user = get_object_or_404(User, pk=to_user_id)

        data = {
            'from_user': from_user.id,
            'to_user': to_user_id
        }

        serializer = FriendRequestCreateSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        friend_request = serializer.create()

        # Создание нотификации о новом FriendRequest
        FriendRequestNotification.objects.create(
            type='friend_request',
            from_user=from_user,
            to_user=to_user,
            item=friend_request
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FriendshipViewSet(viewsets.ViewSet):
    http_method_names = ['get', 'post', 'delete']

    def list(self, request):
        """Получение всех друзей пользователя"""
        user_pk = request.query_params.get('user_pk')

        if user_pk:
            user = get_object_or_404(User, pk=user_pk)
        else:
            user = request.user

        friends = user.friends.all()
        serializer = CustomUserSerializer(friends, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        """Добавление друг друга в друзья (при услвии, если есть FriendRequest)"""
        data = {
            'user': request.user,
            'friend_id': request.data.get('friend_id')
        }

        serializer = FriendshipCreateSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        friend = serializer.create()

        # Создание уведомления, что пользователь принял заявку
        FriendRequestAcceptedNotification.objects.create(
            type='friend_request_accepted',
            from_user=request.user,
            to_user=friend,
            item=request.user
        )

        serializer = CustomUserSerializer(friend, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Получение друга пользователя по id"""
        user_pk = request.query_params.get('user_pk')
        user = get_object_or_404(User, pk=user_pk)

        friend = user.friends.filter(pk=pk).first()

        if not friend:
            return Response({'detail': 'Friend not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomUserSerializer(friend, context={'request': request})
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        """Удаление пользователя из друзей"""
        user = request.user
        friend = user.friends.filter(pk=pk).first()

        if not friend:
            return Response({'detail': 'Friend not found'}, status=status.HTTP_404_NOT_FOUND)

        user.friends.remove(friend)
        user.save()

        serializer = CustomUserSerializer(user.friends.all(), many=True, context={'request': request})
        return Response(serializer.data)
