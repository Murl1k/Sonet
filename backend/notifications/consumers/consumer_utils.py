from channels.db import database_sync_to_async
from ..serializers import NotificationSerializer


@database_sync_to_async
def serialize_notification(notification):
    serializer = NotificationSerializer(notification)
    return serializer.data
