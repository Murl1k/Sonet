from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from .consumer_utils import serialize_notification


class NotificationsConsumer(AsyncJsonWebsocketConsumer):
    notification_group_name = None

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close()

        self.notification_group_name = f"notifications_{self.scope['user'].id}"

        await self.channel_layer.group_add(self.notification_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.notification_group_name, self.channel_name)

    async def notify_user(self, event):
        """
        Уведомлеиние пользователя о появлении новой нотификации. (из сигнала в notifications.signals)
        """
        serialized_notification = await serialize_notification(event['notification'])

        await self.send_json({'command': 'notify_user', 'notification': serialized_notification})
