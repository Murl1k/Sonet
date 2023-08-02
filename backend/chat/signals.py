from django.db.models.signals import post_save
from django.dispatch import receiver

from chat.models import Message


@receiver(post_save, sender=Message)
def update_updated_at(sender, instance, created, **kwargs):
    """
    Обновление поле updated_at у чата при создании сообщения
    """
    if created:
        instance.chat.updated = instance.created_at
        instance.chat.save()
