import json
import random
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


# class DrawingConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # Имя группы для всех пользователей
#         self.group_name = 'drawing_group'

#         # Присоединяемся к группе
#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )

#         # Принимаем WebSocket соединение
#         await self.accept() 


#     async def disconnect(self, close_code):
#         # Отключаемся от группы
#         await self.channel_layer.group_discard(
#             self.group_name,
#             self.channel_name
#         )
#         print(f"Client disconnected with close code {close_code}")

#     # Получаем сообщение от клиента
#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         type = data['type']

#         if type == 'clear':
#             await self.channel_layer.group_send(self.group_name, {
#                 'type': 'broadcast_message',
#                 'msg_type': 'clear'
#             })
#         elif type == 'draw':   
#             x = data['x']
#             y = data['y']
#             await self.channel_layer.group_send(self.group_name, {
#                 'type': 'broadcast_message',
#                 'x': x,
#                 'y': y,
#                 'msg_type': 'draw'
#             })


#     # Обрабатываем событие рисования
#     async def broadcast_message(self, event):
#         msg_type = event['msg_type']
#         if msg_type == 'clear':
#             await self.send(text_data=json.dumps({
#                 'type': msg_type
#             }))
#         else:
#             x = event['x']
#             y = event['y']
#             await self.send(text_data=json.dumps({
#                 'x': x,
#                 'y': y,
#                 'type': msg_type  # Передаем тип ('start' или 'draw')
#             }))


current_users = {}
words_2 = [
    "автомобиль", "бабочка", "песочница", "карандаш", "корабль",
    "гриб", "слон", "мороженое", "компьютер", "зонтик", "река", 
    "телефон", "фрукты", "банан", "велосипед", "медведь", "снеговик",
    "музыка", "деньги", "рыба", "апельсин", "кафе", "праздник",
    "парикмахер", "снег", "кубик", "самолет", "время", "вокзал",
    "лес", "бабушка", "кафедра", "тетрадь", "акула", "костюм",
    "картина", "пляж", "замок", "груша", "окно", "артист", 
    "море", "блокнот", "пылесос", "пицца", "ручка", "кит", 
    "часы", "лист", "лифт", "акробат", "клавиатура", "лампа",
    "окунь", "подарок", "клоун", "чайник", "ананас", "гвоздь",
    "лошадь", "такси", "лодка", "перчатка", "телескоп", "стакан",
    "автобус", "шар", "самокат", "платье", "облако", "дождь",
    "трактор", "юрист", "кинотеатр", "огурец", "торт", "чайка",
    "ракета", "пингвин", "ковер", "тарелка", "кактус", "ежик",
    "газета", "фотоаппарат", "ветер", "парк", "мышь", "кувшин",
    "скатерть", "картофель", "чемодан", "батарея", "фотоальбом",
    "подушка", "газировка", "шарф", "ящерица", "бутылка", "поезд",
    "лыжи", "прыжок", "суп", "скворечник", "галстук", "фонарь",
    "огонь", "птица", "карантин", "дракон", "доллар", "стол",
    "конфета", "туалет", "черепаха", "птица", "звезда", "цирк",
    "кошка", "тигр", "озеро", "рак", "луна", "цветок", "шапка",
    "часы", "ключ", "берег", "пальма", "чай", "ёлка"
]

words_1 = [
    "книга", "стол", "кот", "машина", "телефон", "космос", "дерево", 
    "река", "гора", "зонт", "чашка", "рыба", "птица", "собака", "дом", 
    "велосипед", "самолёт", "цветок", "компьютер", "ручка", "океан", 
    "сон", "ночь", "звезда", "игра", "пицца", "еда", "часы", "пляж", 
    "карандаш", "снег", "хлеб", "мост", "город", "парк", "луна", 
    "трава", "сад", "ветер", "бабочка", "стекло", "кино", "робот", 
    "мороженое", "кофе", "радуга", "дождь", "море", "кактус", "лист"
]

crocodile_words = [
    "абажур", "авокадо", "айсберг", "акробат", "антилопа", "бабочка", "балет", "банан",
    "барабан", "бассейн", "безе", "бензин", "бетон", "бильярд", "бита", "блюдце", "богатырь",
    "болото", "борода", "бублик", "ваза", "валенки", "варенье", "вертолет", "виноград",
    "волшебник", "воробей", "воск", "гвоздь", "гладильная", "глобус", "гном", "голубь", 
    "горчица", "дедушка", "джунгли", "динозавр", "диск", "диван", "дождь", "дракон", 
    "ёжик", "жаба", "забор", "зеркало", "иглу", "инопланетянин", "йогурт", "кактус", 
    "камбала", "канат", "картофель", "карусель", "киви", "колесо", "компьютер", 
    "космонавт", "котенок", "краб", "кресло", "кукуруза", "лампа", "лебедь", "лента", 
    "лимон", "лобстер", "лошадь", "лото", "лук", "маска", "медведь", "метла", "микрофон", 
    "морковка", "мороз", "муравей", "мыло", "носорог", "облако", "огонь", "озеро", 
    "орел", "осьминог", "папа", "папоротник", "перо", "пингвин", "пистолет", "пицца", 
    "пожар", "подводная лодка", "помидор", "пончик", "попугай", "принцесса", "пуля", 
    "радио", "ракета", "радуга", "русалка", "рыцарь", "сапог", "сауна", "свинья", 
    "семечки", "скейтборд", "скелет", "слон", "солнце", "спутник", "стул", "сумка", 
    "суши", "татуировка", "телевизор", "трактор", "тыковка", "флаг", "фонарик", "хлеб", 
    "чайник", "черепаха", "шар", "шашки", "шоколад", "экскаватор", "эльф", "юмор", 
    "яблоко", "якорь"
]


words = crocodile_words
# words = ['кофе', 'ноутбук', 'мел', 'ручка', 'нефть']
random_words_for_leader = []
word_for_guessing = None
leader = None
need_stop_timer = False
stop_event = asyncio.Event()
all_are_ready = False
test = False
need_stop_game = False
is_now_game = False
data = None
users_count = 0

class DrawingConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        # if len(current_users) >= 2:
        #     self.group_name = 'new'
        # else:
        #     self.group_name = 'chat_group'
        global users_count
        users_count += 1


        # self.group_name = 'chat_group'
        self.group_name = 'chat_group' + str(users_count)

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
        global all_are_ready
        all_are_ready = False
        print('chan_name: ', self.channel_name)
        print('текущий никнейм:', (self.scope['session'].get('username')))
        if (self.scope['session'].get('username')) == None or (self.scope['session'].get('username')) in current_users:
            get_username()

        current_users[(self.scope['session'].get('username'))] = {
            'status': 'not_ready',
            'channel_name': self.channel_name,
            'guess_word': 'no',
            'points': 0,
            'was_leader': False
        }
        print(current_users)
        
        await self.send(text_data=json.dumps({
                'type': 'set_username',
                'username': self.scope['session'].get('username')
            }))

        await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'add_new_user',
                    'current_users': current_users,
                    # 'username': self.scope['session'].get('username'),
                    # 'points': current_users[self.scope['session'].get('username')]['points']
                }
            )


    async def disconnect(self, close_code):
        # Отключаемся от группы
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        del current_users[self.scope['session'].get('username')]
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'del_current_user',
                'username': self.scope['session'].get('username'),
            }
        )
        print(current_users)
        if len(current_users) < 2:
            if len(current_users) == 1:
                for was_leader in current_users.values():
                    was_leader['was_leader'] = False
            stop_event.set()
        else:
            await self.handle_game_start()


    # Получаем сообщение от клиента
    async def receive(self, text_data):
        global data
        data = json.loads(text_data)
        type = data['type']

        if type == 'clear':
            await self.channel_layer.group_send(self.group_name, {
                'type': 'broadcast_message',
                'msg_type': 'clear'
            })
        elif type == 'draw':   
            x = data['x']
            y = data['y']
            await self.channel_layer.group_send(self.group_name, {
                'type': 'broadcast_message',
                'x': x,
                'y': y,
                'msg_type': 'draw'
            })
        elif type == 'start':   
            x = data['x']
            y = data['y']
            await self.channel_layer.group_send(self.group_name, {
                'type': 'broadcast_message',
                'x': x,
                'y': y,
                'msg_type': 'start'
            })
        elif type == 'change_drawing_tool':   
            await self.channel_layer.group_send(self.group_name, {
                'type': 'change_drawing_tool',
                'drawing_tool': data['drawing_tool']
            })
        
        elif type == 'save_color_canvas':
            print(data['color'])
            await self.save_canvas_color(data['color'])

        elif type == 'change_username':
            message = data['message']
            old_username = self.scope['session'].get('username')
            print('old_username', old_username)
            await self.change_username_in_session(message)
            current_users[self.scope['session'].get('username')] = current_users.pop(old_username)
            print(current_users)

            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'add_new_user',
                    'current_users': current_users,
                }
            )
        elif type == 'send_message':
            message = data['message']
            username = self.scope['session'].get('username')
            global word_for_guessing
            if message.lower().strip() == word_for_guessing:
                current_users[username]['guess_word'] = 'yes'
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
            if message.lower().strip() == word_for_guessing:
                await self.channel_layer.send(current_users[username]['channel_name'], {
                    'type': 'user_guessed_word',
                    'word': message,
                    'is_leader': False
                })
                await self.channel_layer.send(current_users[leader]['channel_name'], {
                    'type': 'user_guessed_word',
                    'word': message,
                    'is_leader': True
                })
                print('слово угадано')
                current_users[username]['points'] += 1
                await self.channel_layer.group_send(
                    self.group_name,
                        {
                            'type': 'add_points',
                            'username': username,
                            'points': current_users[username]['points']
                        }
                    )   
                print(current_users)
                if sum(guess_word['guess_word'] == 'yes' for guess_word in current_users.values()) == len(current_users) - 1:
                    stop_event.set()
                

        elif type == 'are_ready':
            await self.handle_game_start()

        elif type == 'leader_choosed_word':
            word_for_guessing = data['word']
            stop_event.set()
            print('Таймер остановлен лидером')

        elif type == 'presenter_choosed_word':
            word_for_guessing = data['word']
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'guess_word',
                    'word': data['word']
                }
            )

    async def handle_game_start(self):
        try:
            if data['skip_send_ready'] == 'no':
                username = self.scope['session'].get('username')
                current_users[username]['status'] = data['are_ready']
                if current_users[username]['status'] == 'not_ready':
                    global need_stop_game
                    need_stop_game = True
                else:
                    global all_are_ready
                    all_are_ready = True
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        'type': 'are_ready',
                        'are_ready': data['are_ready'],
                        'username': username
                    }
                )
        except:
            pass

        if all(readiness['status'] == 'ready' for readiness in current_users.values()) and len(current_users) > 1 and is_now_game == False:
            global word_for_guessing
            if word_for_guessing != None:
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        'type': 'change_status_label',
                        'message_status': 'Ведущий выбирает слово',
                        'message_status_2': 'Угадываемое слово: ' + word_for_guessing,
                    }
                )
            for guess_word_status in current_users.values():
                guess_word_status['guess_word'] = 'no'
            word_for_guessing = None
        
            all_are_ready = True
            need_stop_game = False
            time_left_before_start = 5
            async def waiting_before_start():
                global is_now_game
                is_now_game = True
                nonlocal time_left_before_start
                while time_left_before_start > 0:
                    await self.channel_layer.group_send(
                        self.group_name,
                        { 
                            'type': 'start_game_timer',
                            'time_left_start_game_timer': 'До начала игры осталось: ' + str(time_left_before_start)
                        }
                    )
                    await asyncio.sleep(1)
                    time_left_before_start -= 1
                    if not all_are_ready:
                        await self.channel_layer.group_send(
                            self.group_name,
                            {
                                'type': 'change_status_label',
                                'message_status': 'Статус: ожидание готовности игроков',
                                'message_status_2': 'Ведущий:'
                            }
                        )
                        is_now_game = False   
                        break
                global leader
                print(leader)
                leader = None
                # for guess_word_status in current_users.values():
                #     guess_word_status['guess_word'] = 'no'
                if not leader and all_are_ready:
                    print('начало игры')
                    possible_leaders = []
                    if all(was_leader['was_leader'] == True for was_leader in current_users.values()):
                        for was_leader in current_users.values():
                            was_leader['was_leader'] = False
                    for username, was_leader in current_users.items():
                        if not was_leader['was_leader']:
                            possible_leaders.append(username)
                    leader = random.choice(possible_leaders)
                    current_users[leader]['was_leader'] = True
                    # leader = random.choice(list(current_users.keys()))
                    random_words_for_leader = random.sample(words, 3)
                    await self.channel_layer.group_send(
                        self.group_name,
                        {
                            'type': 'change_status_label',
                            'message_status': 'Ведущий выбирает слово',
                            'message_status_2': 'Ведущий: ' + leader,
                        }
                    )
                    
                    await self.channel_layer.send(current_users[leader]['channel_name'], {
                        'type': 'send_leader',
                        'words': random_words_for_leader
                    })

                    
                    time_left = 10
                    
                    async def leader_chooses_word_timer():

                        nonlocal time_left
                        print('Старт таймера для выбора слова лидером')
                        
                        # Таймер лидера
                        while time_left > 0:
                            print('таймер ведущего')
                            await self.channel_layer.send(current_users[leader]['channel_name'], {
                                'type': 'leader_chooses_word_timer_fs',
                                'time_left': time_left
                            })
                            await asyncio.sleep(1)
                            time_left -= 1
                            if stop_event.is_set():
                                print("Таймер остановлен")
                                stop_event.clear()
                                break

                        global word_for_guessing
                        if not stop_event.is_set() and word_for_guessing == None:
                            word_for_guessing = random.choice(random_words_for_leader)

                        await self.channel_layer.send(current_users[leader]['channel_name'], {
                            'type': 'show_word_for_leader',
                        })

                        time_left_start_game_timer = 90

                        await self.channel_layer.group_send(
                            self.group_name,
                            {
                                'type': 'broadcast_message',
                                'msg_type': 'clear'
                            }
                        )
                                            
                        async def start_game_timer():
                            nonlocal time_left_start_game_timer
                            while time_left_start_game_timer > 0:
                                print('таймер игры')
                                await self.channel_layer.group_send(
                                    self.group_name,
                                    {
                                        'type': 'start_game_timer',
                                        'time_left_start_game_timer': 'Осталось времени: ' + str(time_left_start_game_timer)
                                    }
                                )
                                await asyncio.sleep(1)
                                time_left_start_game_timer -= 1
                                if stop_event.is_set():
                                    print("Таймер остановлен")
                                    break

                            stop_event.clear()
                            if leader in current_users and current_users[leader]:
                                await self.channel_layer.send(current_users[leader]['channel_name'], {
                                    'type': 'clear_leader_tools',
                                })
                            global is_now_game
                            is_now_game = False
                            if all_are_ready == True and len(current_users) > 1:
                                await self.handle_game_start()
                            else:
                                await self.channel_layer.group_send(
                                    self.group_name,
                                    {
                                        'type': 'change_status_label',
                                        'message_status': 'Статус: ожидание готовности игроков',
                                        'message_status_2': 'Угадываемое слово: ' + word_for_guessing
                                    }
                                )
                            
                                
                        asyncio.create_task(start_game_timer())
                    
                    if all_are_ready:
                        asyncio.create_task(leader_chooses_word_timer())

            asyncio.create_task(waiting_before_start())

        else:
            if not all(readiness['status'] == 'ready' for readiness in current_users.values()):
                all_are_ready = False

    @database_sync_to_async
    def change_username_in_session(self, username):
        # Сохраняем никнейм в HTTP-сессии
        self.scope['session']['username'] = username
        self.scope['session'].save()

    @database_sync_to_async
    def save_canvas_color(self, color):
        # Сохраняем никнейм в HTTP-сессии
        self.scope['session']['color'] = color
        self.scope['session'].save()

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

    # type: send_message
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': event['message_type'],
            'message': event['message'],
            'username': event['username'],
            'guess_word': event['guess_word']
        }))

    async def add_new_user(self, event):
        await self.send(text_data=json.dumps({
            'type': 'add_new_user',
            'current_users': event['current_users']
        }))

    async def del_current_user(self, event):
        await self.send(text_data=json.dumps({
            'type': 'del_current_user',
            'username': event['username'],
        }))

    async def add_points(self, event):
        await self.send(text_data=json.dumps({
            'type': 'add_points',
            'username': event['username'],
            'points': event['points'],
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
            'message': event['message'],
            'need_clear_drawing': event['need_clear_drawing']
        }))

    async def guess_word(self, event):
        await self.send(text_data=json.dumps({
            'type': 'guess_word',
            'word': word_for_guessing
        }))

    async def user_guessed_word(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_guessed_word',
            'word': event['word'],
            'is_leader': event['is_leader']
        }))

    async def leader_chooses_word_timer_fs(self, event):
        await self.send(text_data=json.dumps({
            'type': 'leader_chooses_word_timer',
            'time_left': event['time_left']
        }))

    async def show_word_for_leader(self, event):
        await self.send(text_data=json.dumps({
            'type': 'show_word_for_leader',
            'word_for_guessing': word_for_guessing
        }))

    async def start_game_timer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_game_timer',
            'time_left_start_game_timer': event['time_left_start_game_timer'],
        }))

    async def clear_leader_tools(self, event):
        await self.send(text_data=json.dumps({
            'type': 'clear_leader_tools',
        }))

    async def change_status_label(self, event):
        await self.send(text_data=json.dumps({
            'type': 'change_status_label',
            'message_status': event['message_status'],
            'message_status_2': event['message_status_2']
        }))

    async def change_drawing_tool(self, event):
        await self.send(text_data=json.dumps({
            'type': 'change_drawing_tool',
            'drawing_tool': event['drawing_tool']
        }))
        