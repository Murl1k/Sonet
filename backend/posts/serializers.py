from rest_framework import serializers

from groups.serializers import GroupShortSerializer
from users.serializers import CustomUserSerializer
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer()
    group = GroupShortSerializer()
    liked_by_current_user = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'image', 'content', 'created_at', 'author', 'group', 'likes_count', 'liked_by_current_user']

    def get_liked_by_current_user(self, obj):
        if self.context.get('request'):
            user = self.context['request'].user
            return user in obj.likes.all()

        return None

    def get_likes_count(self, obj):
        return len(obj.likes.all())


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['image', 'content', 'group']

    def validate(self, data):
        group = data.get('group')
        author = self.context['request'].user

        if group and group.owner.id != author.id:
            raise serializers.ValidationError("User is not the owner of this group.")

        return data

    def create(self, validated_data):
        author = self.context['request'].user
        post = Post.objects.create(author=author, **validated_data)
        return post

    def to_representation(self, instance):
        post_serializer = PostSerializer(instance, context=self.context)
        return post_serializer.data


class PostEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['image', 'content']
