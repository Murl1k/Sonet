from rest_framework import permissions


class IsGroupOwnerOrReadOnly(permissions.BasePermission):
    """
    Проверка является ли пользователь овнером или view.action не делает каких-либо манипуляций с группой.
    """

    def has_object_permission(self, request, view, obj):
        # Разрешаем SAFE_METHODS и follow_unfollow action
        if request.method in permissions.SAFE_METHODS or view.action in ['follow_unfollow']:
            return True

        return obj.owner == request.user
