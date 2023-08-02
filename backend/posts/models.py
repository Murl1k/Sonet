from django.contrib.auth import get_user_model
from django.db import models

from groups.models import Group

User = get_user_model()


class Post(models.Model):
    """
    Модель поста

    image - картинка в посте
    content - текстовый контент поста
    created_at - дата создания поста
    authr - автор поста (пользователь)
    group - группа, к которой относится пост
    likes - пользователи, лайкнувшие пост.

    """
    image = models.ImageField(upload_to='post_images', blank=True, null=True)
    content = models.TextField(max_length=2048)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='group_posts', blank=True, null=True)
    likes = models.ManyToManyField(User, blank=True, related_name='liked_posts')

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f"{self.author.username}'s post"

