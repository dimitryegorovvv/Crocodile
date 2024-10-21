import json
import random
import pdb
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


current_users = {}
words = ['шляпа', 'конфета', 'банка', 'лампа', 'стол', 'ножницы']
word_for_guessing = None
leader = None


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'chat_group'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        def get_username():
            for i in range(1, 9999): 
                if ('user' + str(i)) not in current_users:
                    self.scope['session']['username'] = ('user' + str(i))
                    self.scope['session'].save()
                    print('никнейм установился в функции')
                    return ('user' + str(i))
        
        await self.accept()
        print('chan_name: ', self.channel_name)
        print('текщий никнейм:', (self.scope['session'].get('username')))
        if (self.scope['session'].get('username')) == None:
            get_username()

        current_users[(self.scope['session'].get('username'))] = {
            'status': 'not_ready',
            'channel_name': self.channel_name,
            'guess_word': 'no',
            'points': 0
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
            current_users[self.scope['session'].get('username')] = current_users.pop(old_username)
            print(current_users)

            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'update_current_users',
                    'current_users': current_users,
                }
            )
        elif type == 'send_message':
            message = data['message']
            username = self.scope['session'].get('username')
            global word_for_guessing
            if message.lower() == word_for_guessing:
                current_users[username]['guess_word'] = 'yes'
                await self.channel_layer.send(current_users[username]['channel_name'], {
                    'type': 'user_guessed_word',
                })
                print('слово угадано')
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'message_type': type,
                    'username': username,
                    'guess_word': current_users[(self.scope['session'].get('username'))]['guess_word']
                }
            )
            
        elif type == 'are_ready':
            if data['skip_send_ready'] == 'no':
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
            if all(readiness['status'] == 'ready' for readiness in current_users.values()) and len(current_users) != 1:
                global leader
                print(leader)
                leader = None
                if not leader:
                    print('начало игры')
                    leader = random.choice(list(current_users.keys()))
                    await self.channel_layer.send(current_users[leader]['channel_name'], {
                        'type': 'send_leader',
                        'words': random.sample(words, 3),
                    })
                    await self.channel_layer.group_send(
                        self.group_name,
                        {
                            'type': 'label_who_is_leader',
                            'leader_nickname': leader  
                        }
                    )


        elif type == 'presenter_choosed_word':
            word_for_guessing = data['word']
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'guess_word',
                    'word': data['word']
                }
            )

    @database_sync_to_async
    def change_username_in_session(self, username):
        # Сохраняем никнейм в HTTP-сессии
        self.scope['session']['username'] = username
        self.scope['session'].save()

    # type: send_message
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': event['message_type'],
            'message': event['message'],
            'username': event['username'],
            'guess_word': event['guess_word']
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

    async def send_leader(self, event):
        await self.send(text_data=json.dumps({
            'type': 'make_leader',
            'words': event['words'],
        }))

    async def label_who_is_leader(self, event):
        await self.send(text_data=json.dumps({
            'type': 'label_who_is_leader',
            'leader_nickname': event['leader_nickname'],
        }))

    async def guess_word(self, event):
        await self.send(text_data=json.dumps({
            'type': 'guess_word',
            'word': word_for_guessing
        }))

    async def user_guessed_word(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_guessed_word',
        }))
        

        
