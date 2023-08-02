from django.contrib import admin
from .models import Notification, LikeNotification, MessageNotification, FriendRequestNotification,\
    FriendRequestAcceptedNotification

admin.site.register(Notification)
admin.site.register(LikeNotification)
admin.site.register(MessageNotification)
admin.site.register(FriendRequestNotification)
admin.site.register(FriendRequestAcceptedNotification)
