from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token


@database_sync_to_async
def get_user_by_token(token):
    try:
        token_obj = Token.objects.get(key=token)
        user = token_obj.user
        return user
    except Token.DoesNotExist:
        return AnonymousUser()


class CustomTokenAuthMiddleware(BaseMiddleware):
    """Кастомная аунтификация по токену в вебсокетах."""

    def __init__(self, app):
        super().__init__(app)

    async def __call__(self, scope, receive, send):
        try:
            # Получаем токен из строки по параметру token
            query_string = scope['query_string'].decode('utf-8')
            token = parse_qs(query_string).get('token', [None])[0]
        except ValueError:
            token = None

        if not Token:
            scope['user'] = AnonymousUser()
        else:
            scope['user'] = await get_user_by_token(token)

        return await super().__call__(scope, receive, send)
