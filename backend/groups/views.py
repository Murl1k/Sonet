from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import viewsets, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter

from users.serializers import CustomUserSerializer

from . import permissions
from . import serializers
from .models import Group

User = get_user_model()


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all(
    ).prefetch_related(
        'members'
    ).select_related(
        'owner'
    ).annotate(
        members_count=Count('members')
    )

    permission_classes = [permissions.IsGroupOwnerOrReadOnly, IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['name', 'description']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return serializers.CreateGroupSerializer
        else:
            return serializers.GroupSerializer

    @action(detail=True)
    def members(self, request, pk=None):
        """
        Получение пользователей группы
        """

        group = self.get_object()
        members = group.members.all()

        serializer = CustomUserSerializer(members, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def follow_unfollow(self, request, pk=None):
        """
        Подписаться/отписаться от группы
        """
        group = self.get_object()
        user = request.user
        if user in group.members.all():
            group.members.remove(user)
            return Response({'status': 'unfollowed'})
        else:
            group.members.add(user)
            return Response({'status': 'followed'})


class GroupsByUser(views.APIView):
    """
    Получение групп пользователя
    """
    http_method_names = ['get']

    def get(self, request, pk):
        try:
            is_owner = bool(int(request.query_params.get('is-owner', 0)))
        except ValueError:
            is_owner = False

        user = get_object_or_404(User, pk=pk)

        groups = Group.objects.get_groups_by_user(
            user, owner=is_owner
        ).prefetch_related(
            'members'
        ).select_related(
            'owner'
        ).annotate(
            members_count=Count('members')
        )

        serializer = serializers.GroupSerializer(groups, many=True, context={'request': request})

        return Response(serializer.data)
