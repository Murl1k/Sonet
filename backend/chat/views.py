from django.contrib.auth import get_user_model
from django.db.models import Q, Count, F, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from backend.paginators import SmallResultsCursorPagination
from .models import Chat, Message
from .serializers import ChatSerializer, ChatCreateSerializer, MessageSerializer

User = get_user_model()


class ChatViewSet(mixins.RetrieveModelMixin,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  viewsets.GenericViewSet):
    serializer_class = ChatSerializer
    http_method_names = ['get', 'post']

    def get_serializer_class(self):
        if self.action in ['create']:
            return ChatCreateSerializer
        else:
            return ChatSerializer

    def retrieve(self, request, pk):
        chat = self.get_chat_object(pk)
        serializer = self.get_serializer(chat)
        return Response(serializer.data)

    def get_queryset(self):
        return Chat.objects.get_user_chats(self.request.user).select_related('user1', 'user2').prefetch_related(
            Prefetch('messages',
                     queryset=Message.objects.filter(chat=F('chat')).prefetch_related('author').order_by('-created_at'),
                     to_attr='latest_messages')
        ).annotate(
            unread_messages=Count('messages',
                                  filter=~Q(messages__author=self.request.user) & Q(messages__is_readed=False))
        ).order_by('-updated')

    @action(detail=True)
    def messages(self, request, pk=None):
        """
        Получение всех сообщений в чате
        """

        chat = self.get_chat_object(pk)
        messages = chat.messages.all().prefetch_related('author')

        messages_to_read = messages.exclude(author=request.user)
        messages_to_read.update(is_readed=True)

        paginator = SmallResultsCursorPagination()
        paginated_messages = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(paginated_messages, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)

    def get_chat_object(self, user_pk):
        """
        Получение чата по id пользователя
        """

        chat = Chat.objects.get_chat_between_users(self.request.user, user_pk)
        if not chat:
            raise NotFound

        return chat
