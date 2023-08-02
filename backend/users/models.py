from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Q


def user_avatar_path(instance, filename):
    return f"avatars/{instance.username}/{filename}"


class CustomUser(AbstractUser):
    """
    Расширение дефолтного User.

    first_name - имя
    last_name - фамилия
    status - статус пользователя (текстовое поле)
    avatar - аватар пользователя
    friends - друзья пользователя

    """
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    status = models.CharField(max_length=256, blank=True)
    avatar = models.ImageField(upload_to=user_avatar_path, default='avatars/default-avatar.png')
    friends = models.ManyToManyField('self', blank=True)

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return f'{self.username}'


class FriendRequestManager(models.Manager):
    def sent(self, user):
        return self.filter(from_user=user).distinct()

    def recieved(self, user):
        return self.filter(to_user=user).distinct()

    def by_user(self, user):
        return self.filter(Q(to_user=user) | Q(from_user=user))


class FriendRequest(models.Model):
    """
    Модель заявки в друзья.

    from_user - пользователь, отправивший заявку
    to_user - пользователь, получивший заявку
    created_at - дата создания заявки
    """
    from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_friend_requests')
    to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_friend_requests')
    created_at = models.DateTimeField(auto_now_add=True)

    objects = FriendRequestManager()

    class Meta:
        ordering = ['-created_at']
        unique_together = ['from_user', 'to_user']
