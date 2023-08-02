from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers

from .models import CustomUser, FriendRequest

User = get_user_model()


class CustomUserCreateSerializer(UserCreateSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta(UserCreateSerializer.Meta):
        fields = ('username', 'first_name', 'last_name', 'password')


class CustomUserDetailSerializer(UserSerializer):
    friends_count = serializers.IntegerField()
    followers_count = serializers.IntegerField()
    following_count = serializers.IntegerField()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar', 'status', 'friends_count', 'followers_count',
                  'following_count')


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar', 'status')


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = CustomUserSerializer()
    to_user = CustomUserSerializer()

    class Meta:
        model = FriendRequest
        fields = ('id', 'from_user', 'to_user', 'created_at')


class FriendRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ('id', 'from_user', 'to_user')

    def validate(self, data):
        from_user = data.get('from_user')
        to_user = data.get('to_user')

        if not to_user:
            raise serializers.ValidationError('Invalid to_user')

        if from_user == to_user:
            raise serializers.ValidationError('You cannot send friend request to yourself')

        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists() or FriendRequest.objects.filter(
                from_user=to_user, to_user=from_user).exists():
            raise serializers.ValidationError('Friend request already exists')

        if from_user.friends.filter(id=to_user.id).exists():
            raise serializers.ValidationError('Friendship already exists')

        return data

    def create(self):
        from_user = self.validated_data.get('from_user')
        to_user = self.validated_data.get('to_user')

        friend_request = FriendRequest.objects.create(from_user=from_user, to_user=to_user)

        return friend_request

    def to_representation(self, instance):
        serializer = FriendRequestSerializer(instance, context=self.context)
        return serializer.data


class FriendshipCreateSerializer(serializers.Serializer):
    def validate(self, attrs):
        data = self.initial_data
        request = self.context['request']
        user = request.user
        friend_id = request.data.get('friend_id')

        if not friend_id:
            raise serializers.ValidationError('Missing friend_id')

        friend = User.objects.get(pk=friend_id)
        if not friend:
            raise serializers.ValidationError('Invalid friend_id')

        if friend == user:
            raise serializers.ValidationError('You cannot add yourself as a friend')

        if user.friends.filter(id=friend_id).exists():
            raise serializers.ValidationError('Friendship already exists')

        friend_request = FriendRequest.objects.filter(from_user=friend, to_user=user)
        if not friend_request:
            raise serializers.ValidationError('FriendRequest does not exist')

        friend_request.delete()

        return data

    def create(self):
        user = self.validated_data['user']
        friend = User.objects.get(id=self.validated_data['friend_id'])

        user.friends.add(friend)
        user.save()

        return friend
