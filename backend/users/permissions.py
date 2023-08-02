from rest_framework import permissions


class IsFriendRequestParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        friend_request = obj
        return friend_request.from_user == user or friend_request.to_user == user

    
