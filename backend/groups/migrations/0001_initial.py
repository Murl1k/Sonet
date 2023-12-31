# Generated by Django 4.1.7 on 2023-05-02 14:22

from django.conf import settings
from django.db import migrations, models
import groups.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Name')),
                ('avatar', models.ImageField(default='avatars/default-avatar.png', upload_to='')),
                ('description', models.CharField(max_length=255, verbose_name='Description')),
                ('members', models.ManyToManyField(related_name='members', to=settings.AUTH_USER_MODEL)),
                ('owners', models.ManyToManyField(related_name='owners', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
