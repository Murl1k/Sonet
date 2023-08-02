from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

from chat.models import Message, Chat
from chat.serializers import MessageSerializer, ChatSerializer
from notifications.models import MessageNotification
from users.serializers import CustomUserSerializer

User = get_user_model()


@database_sync_to_async
def join_chat(user, chat):
    if user not in chat.active_users.all():
        chat.active_users.add(user)


@database_sync_to_async
def leave_chat(user, chat):
    if user in chat.active_users.all():
        chat.active_users.remove(user)


@database_sync_to_async
def is_user_in_chat(user, chat):
    return user in chat.active_users.all()


@database_sync_to_async
def message_notify(message, to_user):
    MessageNotification.objects.create(
        type='message',
        from_user=message.author,
        to_user=to_user,
        item=message
    )


@database_sync_to_async
def get_user_by_id(pk):
    user = User.objects.get(pk=pk)
    return user


@database_sync_to_async
def create_message(chat, author, content):
    message = Message.objects.create(chat=chat, author=author, content=content)
    return message


@database_sync_to_async
def read_chat_messages(chat, self_user):
    messages = chat.messages.exclude(author=self_user)
    if messages:
        messages.update(is_readed=True)


@database_sync_to_async
def get_chat_between_users(user1, user2):
    return Chat.objects.get_chat_between_users(user1, user2)


@database_sync_to_async
def get_or_create_chat_between_users(user1, user2):
    chat = Chat.objects.get_chat_between_users(user1, user2)
    if chat is None:
        chat = Chat.objects.create(user1=user1, user2=user2)
    return chat


@database_sync_to_async
def serialize_chat(chat, current_user):
    serializer = ChatSerializer(chat, context={'user': current_user})
    return serializer.data


@database_sync_to_async
def serialize_message(message):
    serializer = MessageSerializer(message)
    return serializer.data


@database_sync_to_async
def serialize_user(user):
    serializer = CustomUserSerializer(user)
    return serializer.data
