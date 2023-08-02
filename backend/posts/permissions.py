from rest_framework import permissions


class IsPostOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or view.action in ['like_unlike']:
            return True

        return request.user == obj.author
