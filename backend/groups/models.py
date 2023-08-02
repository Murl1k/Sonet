from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class GroupManager(models.Manager):
    def get_groups_by_user(self, user, owner=False):
        if owner:
            return self.filter(owner=user)
        else:
            return self.filter(members__pk=user.id)


class Group(models.Model):
    """
    Модель группы

    name - название группы
    avatar - аватарка группы
    description - описание
    owner - владелец группы
    members - подписчики группы
    """
    name = models.CharField(max_length=50, verbose_name='Name')
    avatar = models.ImageField(upload_to='groups/', default='avatars/default-avatar.png')
    description = models.CharField(max_length=255, verbose_name='Description', blank=True)
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    members = models.ManyToManyField(User, related_name='user_groups')

    objects = GroupManager()

    def __str__(self):
        return f"Group {self.name}"
