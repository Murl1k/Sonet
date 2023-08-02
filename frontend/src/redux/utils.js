export const unreadCount = (notificationList) => {
    const unreadNotifications = notificationList.filter((notification) => !notification.is_read);
    return unreadNotifications.length;
};