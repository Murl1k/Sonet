from rest_framework import status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import Notification
from .permissions import IsNotificationReceiver
from .serializers import NotificationSerializer


class NotificationViewSet(mixins.RetrieveModelMixin,
                          mixins.DestroyModelMixin,
                          mixins.ListModelMixin,
                          GenericViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsNotificationReceiver]
    http_method_names = ['get', 'delete', 'post']

    def get_queryset(self):
        return Notification.objects.filter(to_user=self.request.user).select_related('from_user', 'to_user')

    @action(detail=True, methods=["POST"])
    def mark_as_read(self, request, pk=None):
        """
        Чтение одного уведомления
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)

        return Response(serializer.data)

    @action(detail=False, methods=["POST"])
    def read_all(self, request):
        """
        Чтение всех нотификаций пользователя
        """

        notifications = self.get_queryset()
        notifications.update(is_read=True)

        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["DELETE"])
    def delete_all(self, request):
        """
        Удаление всех нотификаций пользователя
        """

        notifications = self.get_queryset()

        # К полиморфным моделям не работает обычный notifications.delete()
        for notification in notifications:
            notification.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
