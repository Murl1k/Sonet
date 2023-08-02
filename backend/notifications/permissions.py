from rest_framework import permissions


class IsNotificationReceiver(permissions.BasePermission):
    """
    Проверка, является ли пользователь получателем уведомления
    """
    def has_permission(self, request, view):
        if request.method == 'GET' and view.action == 'retrieve':
            notification = view.get_object()
            if request.user != notification.to_user:
                return False
        return True
