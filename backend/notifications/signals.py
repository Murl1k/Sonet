from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from notifications.models import LikeNotification, MessageNotification, FriendRequestNotification, \
    FriendRequestAcceptedNotification


@receiver(post_save, sender=LikeNotification)
@receiver(post_save, sender=MessageNotification)
@receiver(post_save, sender=FriendRequestNotification)
@receiver(post_save, sender=FriendRequestAcceptedNotification)
def notify_user(sender, instance, **kwargs):
    """
    Сигнал, который отсылает в consumer сообщение о том, что нужно послать пользователю нотификацию
    """

    if kwargs.get('created'):
        user = instance.to_user

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{user.id}",
            {
                'type': 'notify_user',
                'notification': instance
            }
        )
