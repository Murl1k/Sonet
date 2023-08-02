from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q

User = get_user_model()


class ChatManager(models.Manager):
    def get_user_chats(self, user):
        qs = Q(user1=user) | Q(user2=user)
        return self.filter(qs)

    def get_chat_between_users(self, user1, user2):
        qs = Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)
        return self.filter(qs).first()


class Chat(models.Model):
    """
    Модель чата между двумя пользователями.

    user1, user2 - пользователи чата
    acitve_users - пользователи, которые сейчас находятся в чате (используются для нотификации пользователей)
    updated - последнее обновление чата
    created_at - дата создания чата
    """
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats_user2')
    active_users = models.ManyToManyField(User, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = ChatManager()

    def __str__(self):
        return f"Chat ({self.user1.username} and {self.user2.username})"

    class Meta:
        ordering = ('-updated',)
        unique_together = ['user1', 'user2']

    def unread_message_count(self, user):
        return self.messages.filter(~Q(author=user) & Q(is_readed=False)).count()

    def get_latest_message(self):
        return self.messages.order_by('-created_at').first()


class Message(models.Model):
    """
    Модель сообщения.

    author - автор сообщения
    chat - чат, в которое отправлено сообщение
    content - контент сообщения
    created_at - дата создания сообщения
    is_readed - прочитано ли сообщение
    """

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(max_length=2048)
    created_at = models.DateTimeField(auto_now_add=True)
    is_readed = models.BooleanField(default=False)

    def __str__(self):
        return f"Message {self.pk} - Chat {self.chat.pk}"
