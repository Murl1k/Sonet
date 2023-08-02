from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from .consumer_utils import create_message, get_or_create_chat_between_users, get_chat_between_users, serialize_chat, \
    serialize_message, serialize_user, read_chat_messages, get_user_by_id, message_notify, join_chat, leave_chat, \
    is_user_in_chat


class ChatConsumer(AsyncJsonWebsocketConsumer):
    chat_name = None
    other_user = None

    async def connect(self):
        other_user_id = self.scope['url_route']['kwargs'].get('user_id')
        self.other_user = await get_user_by_id(pk=other_user_id)

        if not self.other_user or isinstance(self.scope['user'], AnonymousUser):
            await self.close()

        chat = await get_chat_between_users(self.scope['user'], self.other_user)

        if chat:
            await self.configure_groups(chat)
            await join_chat(self.scope['user'], chat)
            await self.send_event_to_chat(message_type='read_messages', user=self.scope['user'])

        await self.accept()

    async def disconnect(self, code):
        chat = await get_chat_between_users(self.scope['user'], self.other_user)

        await leave_chat(self.scope['user'], chat)
        await self.channel_layer.group_discard(self.chat_name, self.channel_name)

    async def receive_json(self, data, **kwargs):
        command = data.get('command')

        match command:
            case 'create_message':
                chat = await get_or_create_chat_between_users(self.scope['user'], self.other_user)
                message = await create_message(chat, self.scope['user'], data['message'])

                if not self.chat_name:
                    await join_chat(self.scope['user'], chat)
                    await self.configure_groups(chat)

                if not await is_user_in_chat(self.other_user, chat):
                    await message_notify(message, self.other_user)

                await self.send_event_to_chat(message_type='chat_message', message=message)
                await self.send_event_to_chat_list(message_type='chat_list_message', user=self.scope['user'], chat=chat)
                await self.send_event_to_chat_list(message_type='chat_list_message', user=self.other_user, chat=chat)

            case 'typing':
                if not self.chat_name:
                    return
                chat = await get_chat_between_users(self.scope['user'], self.other_user)

                await self.send_event_to_chat(message_type='typing', user=self.scope['user'])
                await self.send_event_to_chat_list(message_type='chat_list_typing', user=self.other_user, chat=chat)

            case 'read_messages':
                chat = await get_chat_between_users(self.scope['user'], self.other_user)
                await read_chat_messages(chat, self.scope['user'])

                await self.send_event_to_chat(message_type='read_messages', user=self.scope['user'])

    async def configure_groups(self, chat):
        self.chat_name = f"chat_{chat.id}"
        await self.channel_layer.group_add(self.chat_name, self.channel_name)

    async def send_event_to_chat(self, message_type, **kwargs):
        await self.channel_layer.group_send(
            self.chat_name,
            {
                'type': message_type,
                **kwargs
            }
        )

    async def send_event_to_chat_list(self, message_type, user, **kwargs):
        await self.channel_layer.group_send(
            f"chat_list_{user.id}",
            {
                'type': message_type,
                **kwargs
            }
        )

    async def chat_message(self, event):
        serialized_message = await serialize_message(event['message'])
        await self.send_json({'command': 'receive_message', 'message': serialized_message})

    async def typing(self, event):
        serialized_user = await serialize_user(event['user'])
        await self.send_json({'command': 'typing', 'user': serialized_user})

    async def read_messages(self, event):
        serialized_user = await serialize_user(event['user'])
        await self.send_json({'command': 'read_messages', 'user': serialized_user})


class ChatListConsumer(AsyncJsonWebsocketConsumer):
    group_name = None

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close()

        self.group_name = f"chat_list_{self.scope['user'].id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def chat_list_message(self, event):
        serialized_chat = await serialize_chat(event['chat'], self.scope['user'])
        await self.send_json({'command': 'chat_list_message', 'chat': serialized_chat})

    async def chat_list_typing(self, event):
        serialized_chat = await serialize_chat(event['chat'], self.scope['user'])
        await self.send_json({'command': 'chat_list_typing', 'chat': serialized_chat})
