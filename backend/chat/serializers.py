from django.contrib.auth import get_user_model
from rest_framework import serializers

from users.serializers import CustomUserSerializer
from .models import Chat, Message

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer()

    class Meta:
        model = Message
        fields = '__all__'


class ChatSerializer(serializers.ModelSerializer):
    latest_message = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    unread_messages = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ('id', 'latest_message', 'user', 'unread_messages', 'updated', 'created_at')

    def get_latest_message(self, obj):
        latest_messages = getattr(obj, 'latest_messages', None)

        # Получаем latest_message из prefetch_related из queryset во view (n+1 fix)
        if latest_messages:
            try:
                last_message = latest_messages[0]
            except IndexError:
                last_message = None
        else:
            last_message = obj.get_latest_message()

        if last_message:
            serializer = MessageSerializer(last_message, context=self.context)
            return serializer.data
        return None

    def get_user(self, obj):
        request = self.context.get('request')
        user = request.user if request else self.context.get('user')

        if obj.user1 == user:
            user = obj.user2
        else:
            user = obj.user1

        serializer = CustomUserSerializer(user, context=self.context)
        return serializer.data

    def get_unread_messages(self, obj):
        if hasattr(obj, 'unread_messages'):
            return obj.unread_messages

        request = self.context.get('request')
        user = request.user if request else self.context.get('user')

        return obj.unread_message_count(user)


class ChatCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'user2']

    def validate(self, data):
        user2 = data.get('user2')
        request = self.context.get('request')

        if not User.objects.get(user2):
            raise serializers.ValidationError("User2 is incorrect")

        if Chat.objects.get_chat_between_users(user1=request.user, user2=user2):
            raise serializers.ValidationError("Chat already exists between these users.")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user1 = request.user
        user2 = validated_data['user2']

        chat = Chat.objects.create(user1=user1, user2=user2)
        chat.save()

        return chat

    def to_representation(self, instance):
        serializer = ChatSerializer(instance, context=self.context)
        return serializer.data
