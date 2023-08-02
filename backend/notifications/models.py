from django.db import models
from django.contrib.auth import get_user_model
from polymorphic.models import PolymorphicModel

from chat.models import Message
from posts.models import Post
from users.models import FriendRequest

User = get_user_model()


class Notification(PolymorphicModel):
    """
    Полиморфная модель Notification.

    from_user - Пользователь, отправивший уведомление.
    to_user - Пользователь, которому отправлено уведомление.
    created_at - дата создания нотификации.
    is_read - Статус нотификации(прочитано или нет)
    type - Тип нотификации из TYPE_CHOICES

    """

    TYPE_CHOICES = (
        ('like', 'Лайк'),
        ('message', 'Сообщение'),
        ('friend_request', 'Заявка в друзья'),
        ('friend_request_accepted', 'Заявка в друзья принята')
    )

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications')
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    type = models.CharField(max_length=32, choices=TYPE_CHOICES)

    class Meta:
        ordering = ('-created_at',)


class LikeNotification(Notification):
    """
    Модель, наследуемая от полиморфной модели Notification.
    Создана для уведомления пользователя о том, что кто-то поставил лайк на его пост.

    item - Пост, на который был поставлен лайк.
    """
    item = models.ForeignKey(Post, on_delete=models.CASCADE)


class MessageNotification(Notification):
    """
    Модель, наследуемая от полиморфной модели Notification.
    Создана для уведомления пользователя о новом сообщении.

    item - Сообщение, отправленное пользователю.
    """
    item = models.ForeignKey(Message, on_delete=models.CASCADE)


class FriendRequestNotification(Notification):
    """
    Модель, наследуемая от полиморфной модели Notification.
    Создана для уведомления пользователя о новой заявке в друзья.

    item - объект заявки в друзья.
    """
    item = models.ForeignKey(FriendRequest, on_delete=models.CASCADE)


class FriendRequestAcceptedNotification(Notification):
    """
    Модель, наследуемая от полиморфной модели Notification.
    Создана для уведомления пользователя о том, что его заявку в друзья приняли.

    item - Пользователь, принявший заявку в друзья.
    """
    item = models.ForeignKey(User, on_delete=models.CASCADE)
