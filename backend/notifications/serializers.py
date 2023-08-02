from rest_framework import serializers

from chat.serializers import MessageSerializer
from posts.serializers import PostSerializer
from users.serializers import FriendRequestSerializer, CustomUserSerializer

from .models import Notification, LikeNotification, FriendRequestAcceptedNotification, FriendRequestNotification, \
    MessageNotification


class NotificationSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()
    from_user = CustomUserSerializer()
    to_user = CustomUserSerializer()

    class Meta:
        model = Notification
        fields = '__all__'

    def get_item(self, instance):
        # Получаем объект из полиморфной модели и сериализируем его
        if isinstance(instance, LikeNotification):
            serializer = PostSerializer(instance=instance.item, context=self.context)
        elif isinstance(instance, MessageNotification):
            serializer = MessageSerializer(instance=instance.item, context=self.context)
        elif isinstance(instance, FriendRequestNotification):
            serializer = FriendRequestSerializer(instance=instance.item, context=self.context)
        elif isinstance(instance, FriendRequestAcceptedNotification):
            serializer = CustomUserSerializer(instance=instance.item, context=self.context)
        else:
            serializer = None
        return serializer.data if serializer else None
