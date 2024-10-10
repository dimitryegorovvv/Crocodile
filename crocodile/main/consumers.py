import json
import random
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class DrawingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Имя группы для всех пользователей
        self.group_name = 'drawing_group'

        # Присоединяемся к группе
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        # Принимаем WebSocket соединение
        await self.accept() 


    async def disconnect(self, close_code):
        # Отключаемся от группы
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        print(f"Client disconnected with close code {close_code}")

    # Получаем сообщение от клиента
    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data['type']

        if msg_type == 'clear':
            await self.channel_layer.group_send(self.group_name, {
                'type': 'broadcast_message',
                'msg_type': 'clear'
            })
        else:   
            x = data['x']
            y = data['y']
            await self.channel_layer.group_send(self.group_name, {
                'type': 'broadcast_message',
                'x': x,
                'y': y,
                'msg_type': msg_type
            })


    # Обрабатываем событие рисования
    async def broadcast_message(self, event):
        msg_type = event['msg_type']
        if msg_type == 'clear':
            await self.send(text_data=json.dumps({
                'type': msg_type
            }))
        else:
            x = event['x']
            y = event['y']
            await self.send(text_data=json.dumps({
                'x': x,
                'y': y,
                'type': msg_type  # Передаем тип ('start' или 'draw')
            }))


# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # Название группы чата
#         self.group_name = 'chat_group'

#         # Присоединяем пользователя к группе
#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )

#         # Принимаем соединение WebSocket
#         await self.accept()
#         print("Current session username: ", self.scope['session'].get('username'))



#     async def disconnect(self, close_code):
#         # Отключаемся от группы
#         await self.channel_layer.group_discard(
#             self.group_name,
#             self.channel_name
#         )

#     # Получаем сообщение от клиента
#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         type = data['type']
#         message = data['message']
#         if data['type'] == 'change_username':
#             await self.change_username_in_session(data['message'])
#             await self.send(text_data=json.dumps({
#                 'message': f'Username changed to {data['message']}',
#                 'username': data['message']
#             }))

#         await self.channel_layer.group_send(
#                 self.group_name,
#                 {
#                     'type': 'chat_message',
#                     'message': message,
#                     'message_type': type,
#                 }
#             )
#     @database_sync_to_async
#     def change_username_in_session(self, username):
#         self.scope['session']['username'] = username
#         self.scope['session'].save()

#     # Обрабатываем сообщение и отправляем его клиентам
#     async def chat_message(self, event):
#         type = event['message_type']
#         message = event['message']
#         await self.send(text_data=json.dumps({
#             'message': message,
#             'type': type,
#             'username': self.scope['session'].get('username', 'user')
#         }))
current_users = {}
words = ['шляпа', 'конфета', 'банка', 'лампа', 'стол', 'ножницы']

class ChatConsumer(AsyncWebsocketConsumer):
    leader = None
    async def connect(self):
        # Название группы чата
        self.group_name = 'chat_group'

        # Присоединяем пользователя к группе
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        # Принимаем соединение WebSocket

        def get_username():
            for i in range(1, 9999): 
                if ('user' + str(i)) not in current_users:
                    self.scope['session']['username'] = ('user' + str(i))
                    self.scope['session'].save()
                    print('никнейм устарновился в функции')
                    return ('user' + str(i))
        
        await self.accept()
        print('chan_name: ', self.channel_name)
        print('текщий никнейм:', (self.scope['session'].get('username')))
        if (self.scope['session'].get('username')) == None:
            get_username()
        current_users[(self.scope['session'].get('username'))] = {
            'status': 'not_ready',
            'channel_name': self.channel_name
        }
        print(current_users)
        
        await self.send(text_data=json.dumps({
                'type': 'set_username',
                'username': self.scope['session'].get('username')
            }))

        await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'update_current_users',
                    'current_users': current_users,
                }
            )


        # print("Current session username: ", self.scope['session'].get('username'))

    async def disconnect(self, close_code):
        # Отключаемся от группы
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        del current_users[self.scope['session'].get('username')]
        print(current_users)

    # Получаем сообщение от клиента
    async def receive(self, text_data):
        data = json.loads(text_data)
        type = data['type']
        

        # Обработка изменения никнейма
        if type == 'change_username':
            message = data['message']
            old_username = self.scope['session'].get('username')
            print('old_username', old_username)
            await self.change_username_in_session(message)
            # for i in range(len(current_users)):
            # for i in current_users:
            #     if current_users[i] == old_username:
            #         current_users[i] = self.scope['session'].get('username', 'user')
            #         break
            current_users[self.scope['session'].get('username')] = current_users.pop(old_username)
            print(current_users)

            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'update_current_users',
                    'current_users': current_users,
                }
            )
            # Отправляем подтверждение текущему пользователю
            # await self.send(text_data=json.dumps({
            #     'message': f'Username changed to {message}',
            #     'username': message
            # }))
        elif type == 'send_message':
            message = data['message']
            username = self.scope['session'].get('username')
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'message_type': type,
                    'username': username
                }
            )

        elif type == 'are_ready':
            username = self.scope['session'].get('username')
            current_users[(self.scope['session'].get('username'))]['status'] = data['are_ready']
            print(current_users)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'are_ready',
                    'are_ready': data['are_ready'],
                    'username': username
                }
            )
            # user_readiness_counter = 0
            # number_of_users = len(current_users)
            # for readiness in current_users.values():
            #     if number_of_users == 1:
            #         break
            #     if readiness == 'ready':
            #         user_readiness_counter += 1
            #     if user_readiness_counter == number_of_users:
            if all(readiness['status'] == 'ready' for readiness in current_users.values()) and len(current_users) != 1:
                print('начало игры')
                if not self.leader:
                    self.leader = random.choice(list(current_users.keys()))
                    await self.make_leader(self.leader)


    @database_sync_to_async
    def change_username_in_session(self, username):
        # Сохраняем никнейм в HTTP-сессии
        self.scope['session']['username'] = username
        self.scope['session'].save()

    async def chat_message(self, event):
        type = event['message_type']
        message = event['message']
        username = event['username']  # Получаем никнейм из события

        # Отправляем сообщение клиентам
        await self.send(text_data=json.dumps({
            'type': type,
            'message': message,
            'username': username  # Отправляем никнейм отправителя
        }))

    async def update_current_users(self, event):
        current_users = event['current_users']
        await self.send(text_data=json.dumps({
            'type': 'update_current_users',
            'current_users': current_users,
        }))

    async def are_ready(self, event):
        await self.send(text_data=json.dumps({
            'type': 'are_ready',
            'username': event['username'],
            'are_ready': event['are_ready'],
        }))

    async def make_leader(self, leader):
        print(f'лидер - {leader}')
        await self.channel_layer.send(current_users[leader]['channel_name'], {
            'type': 'send_leader',
            'words': random.sample(words, 3)  
        })
        
    async def send_leader(self, event):
        print('lead_2')
        await self.send(text_data=json.dumps({
            'type': 'make_leader',
            'words': event['words'],
        }))
        

        
