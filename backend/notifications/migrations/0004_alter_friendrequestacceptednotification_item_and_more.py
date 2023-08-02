# Generated by Django 4.1.7 on 2023-07-10 16:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_friendrequest_options_and_more'),
        ('chat', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0003_alter_post_options_alter_post_content'),
        ('notifications', '0003_alter_friendrequestacceptednotification_item_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendrequestacceptednotification',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='friendrequestnotification',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.friendrequest'),
        ),
        migrations.AlterField(
            model_name='likenotification',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.post'),
        ),
        migrations.AlterField(
            model_name='messagenotification',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.message'),
        ),
    ]
