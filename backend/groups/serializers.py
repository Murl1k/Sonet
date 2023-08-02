from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Group
from users.serializers import CustomUserSerializer


User = get_user_model()


class GroupSerializer(serializers.ModelSerializer):
    owner = CustomUserSerializer()
    members_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'avatar', 'description', 'owner', 'members_count', 'status']

    def get_members_count(self, obj):
        if hasattr(obj, 'members_count'):
            return obj.members_count

        return obj.members.count()

    def get_status(self, obj):
        """
        Получение статуса (подписан пользователь или нет)
        """
        request = self.context.get('request')

        if request and obj.members.contains(request.user):
            return 'followed'

        return 'unfollowed'


class GroupShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'avatar', 'description']


class CreateGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'avatar', 'description']

    def create(self, validated_data):
        request = self.context.get('request')
        owner = request.user
        group = Group(**validated_data, owner=owner)
        group.save()
        return group

    def to_representation(self, instance):
        serializer = GroupSerializer(instance, context=self.context)
        return serializer.data
