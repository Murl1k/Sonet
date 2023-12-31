# Generated by Django 4.1.7 on 2023-07-06 14:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('users', '0006_alter_friendrequest_options_and_more'),
        ('posts', '0003_alter_post_options_alter_post_content'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('type', models.CharField(choices=[('like', 'Лайк'), ('message', 'Сообщение'), ('friend_request', 'Заявка в друзья'), ('friend_request_accepted', 'Заявка в друзья принята')], max_length=32)),
                ('from_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_notifications', to=settings.AUTH_USER_MODEL)),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
                ('to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='MessageNotification',
            fields=[
                ('notification_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='notifications.notification')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.message')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('notifications.notification',),
        ),
        migrations.CreateModel(
            name='LikeNotification',
            fields=[
                ('notification_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='notifications.notification')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.post')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('notifications.notification',),
        ),
        migrations.CreateModel(
            name='FriendRequestNotification',
            fields=[
                ('notification_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='notifications.notification')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.friendrequest')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('notifications.notification',),
        ),
        migrations.CreateModel(
            name='FriendRequestAcceptedNotification',
            fields=[
                ('notification_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='notifications.notification')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('notifications.notification',),
        ),
    ]
