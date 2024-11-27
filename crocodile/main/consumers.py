import json
import random
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async



# words_2 = [
#     "автомобиль", "бабочка", "песочница", "карандаш", "корабль",
#     "гриб", "слон", "мороженое", "компьютер", "зонтик", "река", 
#     "телефон", "фрукты", "банан", "велосипед", "медведь", "снеговик",
#     "музыка", "деньги", "рыба", "апельсин", "кафе", "праздник",
#     "парикмахер", "снег", "кубик", "самолет", "время", "вокзал",
#     "лес", "бабушка", "кафедра", "тетрадь", "акула", "костюм",
#     "картина", "пляж", "замок", "груша", "окно", "артист", 
#     "море", "блокнот", "пылесос", "пицца", "ручка", "кит", 
#     "часы", "лист", "лифт", "акробат", "клавиатура", "лампа",
#     "окунь", "подарок", "клоун", "чайник", "ананас", "гвоздь",
#     "лошадь", "такси", "лодка", "перчатка", "телескоп", "стакан",
#     "автобус", "шар", "самокат", "платье", "облако", "дождь",
#     "трактор", "юрист", "кинотеатр", "огурец", "торт", "чайка",
#     "ракета", "пингвин", "ковер", "тарелка", "кактус", "ежик",
#     "газета", "фотоаппарат", "ветер", "парк", "мышь", "кувшин",
#     "скатерть", "картофель", "чемодан", "батарея", "фотоальбом",
#     "подушка", "газировка", "шарф", "ящерица", "бутылка", "поезд",
#     "лыжи", "прыжок", "суп", "скворечник", "галстук", "фонарь",
#     "огонь", "птица", "карантин", "дракон", "доллар", "стол",
#     "конфета", "туалет", "черепаха", "птица", "звезда", "цирк",
#     "кошка", "тигр", "озеро", "рак", "луна", "цветок", "шапка",
#     "часы", "ключ", "берег", "пальма", "чай", "ёлка"
# ]

words_1 = [
    "книга", "стол", "кот", "машина", "телефон", "космос", "дерево", 
    "река", "гора", "зонт", "чашка", "рыба", "птица", "собака", "дом", 
    "велосипед", "самолёт", "цветок", "компьютер", "ручка", "океан", 
    "сон", "ночь", "звезда", "игра", "пицца", "еда", "часы", "пляж", 
    "карандаш", "снег", "хлеб", "мост", "город", "парк", "луна", 
    "трава", "сад", "ветер", "бабочка", "стекло", "кино", "робот", 
    "мороженое", "кофе", "радуга", "дождь", "море", "кактус", "лист"
]

# words_3 = [
#     "акробат", "балерина", "вагон", "глобус", "дельфин", "ежик", "жонглер", "замок", 
#     "икона", "йогурт", "кактус", "лампа", "мышь", "носорог", "облако", "паровоз", 
#     "ракета", "слон", "трамвай", "утка", "фонарь", "хомяк", "цирк", "черепаха", 
#     "шкаф", "экскаватор", "эльф", "якорь", "яблоко", "ангел", "бабочка", "вулкан", 
#     "гитара", "дом", "ежедневник", "жаба", "зебра", "корзина", "линейка", "луна", 
#     "микрофон", "морковка", "небо", "олень", "пылесос", "пицца", "рыцарь", "рыба", 
#     "собака", "солнце", "танк", "телевизор", "трактор", "улыбка", "чайник", "шарик"
# ]

# words_4 = [
#     "телефон", "ноутбук", "компьютер", "микросхема", "экран", "микрофон", "пульт", 
#     "динамик", "робот", "модем", "планшет", "принтер", "лампа", "процессор", 
#     "аккумулятор", "камера", "часы", "магнитофон", "гаджет", "термостат", 
#     "электрод", "резистор", "конденсатор", "телевизор", "трансформатор", 
#     "зарядка", "микроконтроллер", "наушники", "видеокарта", "жесткий диск", 
#     "флешка", "клавиатура", "мышь", "паяльник", "схема", "разъем", "усилитель", 
#     "плата", "сенсор", "интегральная схема", "осциллограф", "терминал", 
#     "джойстик", "сканер", "микрофон", "батарея", "смарт-часы", "дисплей", 
#     "проектор", "лазер", "микронаушник", "кулон", "термометр", "утюг"
# ]


# words_5 = [
#     "старинный", "пыль", "антиквариат", "лампа", "картина", "вещи", "часы", 
#     "коробка", "посуда", "мебель", "монеты", "книги", "винтаж", "продавец", 
#     "покупатель", "торг", "коллекция", "плакат", "сувенир", "граммофон", 
#     "шкатулка", "рюкзак", "стол", "стул", "полка", "ткань", "одежда", 
#     "ботинки", "зеркало", "шляпа", "чемодан", "письма", "радио", "фотоаппарат", 
#     "пепельница", "чайник", "швейная машина", "подсвечник", "кукла", 
#     "телефон", "фотография", "ковёр", "гитара", "игрушка", "рукопись", 
#     "монополь", "пластинка", "сервант"
# ]
gachi_muchi_words = [
    "шляпа", "кожанка", "очки", "усики", "друзья", "спортзал", 
    "бицепс", "музыка", "пот", "танец", "грусть", "радость", 
    "пресс", "силовая тренировка", "бодибилдинг", "энергия", 
    "дружба", "кардио", "командная работа", "ринг", "борьба", 
    "коврик", "гантели", "штанга", "фитнес", "юмор", "мем", 
    "сцена", "видеоролик", "сила", "игра"
]

death_words = [
    "кладбище", "надгробие", "костюм", "траур", "венок", "память", 
    "гроб", "свеча", "сумрак", "призрак", "ангел", "кремация", 
    "крест", "прах", "могила", "хор", "панихида", "вечность", 
    "скорбь", "потусторонний", "темнота", "финал", "прощание", 
    "судьба", "тишина", "мрак", "жизнь", "потеря", "традиция"
]

prison_words = [
    "камера", "решетка", "надзиратель", "побег", "заключенный", "суд", "замок", 
    "цепь", "тюремщик", "арест", "приговор", "свидание", "срок", "побег", 
    "переодевание", "тюремная форма", "обед", "столовая", "одиночка", 
    "охрана", "собака", "закон", "трибунал", "тюремные ворота", 
    "карцер", "надзор", "отчуждение", "строгий режим", "срок", 
    "решетка", "прогулка", "письмо", "посылка", "тюремный двор"
]

drug_words = [
    "наркотики", "зависимость", "доза", "передозировка", "реабилитация", 
    "героин", "кокаин", "марихуана", "каннабис", "амфетамины", 
    "метамфетамин", "экстази", "опиаты", "спайс", "крек", 
    "метадон", "таблетки", "абстиненция", "лечебница", 
    "детокс", "трафик", "контрабанда", "синтетика", 
    "рецидив", "препарат", "запрет", "препарат", 
    "тест", "куратор", "вещество", "психоз"
]




# words = gachi_muchi_words + death_words + prison_words + drug_words
words = words_1
rooms_date = {}
technical_info = {}
    # 'technical_info[self.group_name]['random_words_for_leader']': [],
    # 'technical_info[self.group_name]['word_for_guessing']': None,
    # 'technical_info[self.group_name]['leader'] ': None,
    # 'need_stop_timer': False,
    # 'technical_info[self.group_name]['stop_event']': asyncio.Event(),
    # 'technical_info[self.group_name]['all_are_ready']': False,
    # 'technical_info[self.group_name]['need_stop_game']': False,
    # 'technical_info[self.group_name]['is_now_game']': False,
    # 'technical_info[self.group_name]['data']': None,
# }

# words = ['кофе', 'ноутбук', 'мел', 'ручка', 'нефть']
# technical_info[self.group_name]['technical_info[self.group_name]['word_for_guessing']'] = []
# technical_info[self.group_name]['technical_info[self.group_name]['is_now_game']'] '] = None
# technical_info[self.group_name]['technical_info[self.group_name]['all_are_ready']']  = None
# need_stop_timer = False
# technical_info[self.group_name]['stop_event'] = asyncio.Event()
# technical_info[self.group_name]['technical_info[self.group_name]['stop_event']'] = False
# technical_info[self.group_name]['technical_info[self.group_name]['data']'] = False
# technical_info[self.group_name]['technical_info[self.group_name]['need_stop_game']'] = False
# technical_info[self.group_name]['data'] = None



class DrawingConsumer(AsyncWebsocketConsumer):
    joined_room = False
    async def connect(self):
        for room_number in rooms_date:
            if len(rooms_date[room_number]) < 5:
                self.group_name = room_number
                self.joined_room = True
                break

        if self.joined_room == False:
            for room_number in range(0, 999):
                if ('room_' + str(room_number)) not in rooms_date:
                    self.group_name = 'room_' + str(room_number)
                    break

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        if self.group_name not in rooms_date:
            rooms_date[self.group_name] = {}
            technical_info[self.group_name] = {
                'random_words_for_leader': [],
                'word_for_guessing': None,
                'leader': None,
                'stop_event': asyncio.Event(),
                'all_are_ready': False,
                'need_stop_game': False,
                'is_now_game': False,
                'data': None,
            }


        def get_username():
            for i in range(1, 9999):
                if ('user' + str(i)) not in rooms_date[self.group_name]:
                    self.scope['session']['username'] = ('user' + str(i))
                    self.scope['session'].save()
                    return ('user' + str(i))
        
        # global technical_info[self.group_name]['all_are_ready']
        technical_info[self.group_name]['all_are_ready'] = False
        if (self.scope['session'].get('username')) == None or (self.scope['session'].get('username')) in rooms_date[self.group_name]:
            get_username()

        rooms_date[self.group_name][(self.scope['session'].get('username'))] = {
            'status': 'not_ready',
            'channel_name': self.channel_name,
            'guess_word': 'no',
            'points': 0,
            'was_leader': False
        }


        # rooms_date[self.group_name]['techical_info'] = {
        #     'test': 1,
        #     'test_2': 2
        # }

        # rooms_date[self.group_name][(self.scope['session'].get('username'))] = {
        #     'status': 'not_ready',
        #     'channel_name': self.channel_name,
        #     'guess_word': 'no',
        #     'points': 0,
        #     'was_leader': False
        # }

        
        # rooms_date[self.group_name].update(rooms_date[self.group_name]) 
        print(rooms_date)
        # print(technical_info)
        # print('11: ', len(rooms_date['room_0']))
        # print('11: ', len(rooms_date[next(reversed(rooms_date))]))

        await self.send(text_data=json.dumps({
                'type': 'set_username',
                'username': self.scope['session'].get('username')
            }))

        await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'add_new_user',
                    'current_users': rooms_date[self.group_name],
                }
            )


    async def disconnect(self, close_code):
        # Отключаемся от группы
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        del rooms_date[self.group_name][self.scope['session'].get('username')]
        if len(rooms_date[self.group_name]) == 0:
            del rooms_date[self.group_name]
        else:
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'del_current_user',
                    'username': self.scope['session'].get('username'),
                }
            )
            if len(rooms_date[self.group_name]) < 2:
                if len(rooms_date[self.group_name]) == 1:
                    for was_leader in rooms_date[self.group_name].values():
                        was_leader['was_leader'] = False
                technical_info[self.group_name]['stop_event'].set()
            else:
                await self.handle_game_start()
        print(rooms_date)


    # Получаем сообщение от клиента
    async def receive(self, text_data):
        # global technical_info[self.group_name]['data']
        technical_info[self.group_name]['data'] = json.loads(text_data)
        type = technical_info[self.group_name]['data']['type']

        if type == 'clear':
            await self.channel_layer.group_send(self.group_name, {
                'type': 'broadcast_message',
                'msg_type': 'clear'
            })
        elif type == 'draw':   
            x = technical_info[self.group_name]['data']['x']
            y = technical_info[self.group_name]['data']['y']
            await self.channel_layer.group_send(self.group_name, {
                'type': 'broadcast_message',
                'x': x,
                'y': y,
                'msg_type': 'draw'
            })
        elif type == 'start':   
            x = technical_info[self.group_name]['data']['x']
            y = technical_info[self.group_name]['data']['y']
            await self.channel_layer.group_send(self.group_name, {
                'type': 'broadcast_message',
                'x': x,
                'y': y,
                'msg_type': 'start'
            })
        elif type == 'change_drawing_tool':   
            await self.channel_layer.group_send(self.group_name, {
                'type': 'change_drawing_tool',
                'drawing_tool': technical_info[self.group_name]['data']['drawing_tool']
            })
        
        elif type == 'save_color_canvas':
            await self.save_canvas_color(technical_info[self.group_name]['data']['color'])
        elif type == 'change_brush_color':
            await self.save_brush_color(technical_info[self.group_name]['data']['color'])
            await self.channel_layer.group_send(self.group_name, {
                'type': 'change_brush_color',
                'color': technical_info[self.group_name]['data']['color']
            })
        elif type == 'set_brush_color_for_all':
            await self.channel_layer.group_send(self.group_name, {
                'type': 'set_brush_color_for_all',
                'color': technical_info[self.group_name]['data']['color']
            })
        elif type == 'set_brush_width':
            await self.save_brush_width(technical_info[self.group_name]['data']['width'])
            await self.channel_layer.group_send(self.group_name, {
                'type': 'set_brush_width',
                'width': technical_info[self.group_name]['data']['width']
            })
        elif type == 'move_back':
            await self.channel_layer.group_send(self.group_name, {
                'type': 'move_back',
                'last_action': technical_info[self.group_name]['data']['last_action']
            })

        elif type == 'change_username':
            message = technical_info[self.group_name]['data']['message']
            old_username = self.scope['session'].get('username')
            await self.change_username_in_session(message)
            rooms_date[self.group_name][self.scope['session'].get('username')] = rooms_date[self.group_name].pop(old_username)

            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'add_new_user',
                    'current_users': rooms_date[self.group_name],
                }
            )
        elif type == 'send_message':
            message = technical_info[self.group_name]['data']['message']
            username = self.scope['session'].get('username')
            # global technical_info[self.group_name]['word_for_guessing']
            if message.lower().strip() == technical_info[self.group_name]['word_for_guessing']:
                rooms_date[self.group_name][username]['guess_word'] = 'yes'
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'message_type': type,
                    'username': username,
                    'guess_word': rooms_date[self.group_name][(self.scope['session'].get('username'))]['guess_word']
                }
            )
            if message.lower().strip() == technical_info[self.group_name]['word_for_guessing']:
                await self.channel_layer.send(rooms_date[self.group_name][username]['channel_name'], {
                    'type': 'user_guessed_word',
                    'word': message,
                    'is_leader': False
                })
                await self.channel_layer.send(rooms_date[self.group_name][technical_info[self.group_name]['leader'] ]['channel_name'], {
                    'type': 'user_guessed_word',
                    'word': message,
                    'is_leader': True
                })
                rooms_date[self.group_name][username]['points'] += 1
                await self.channel_layer.group_send(
                    self.group_name,
                        {
                            'type': 'add_points',
                            'username': username,
                            'points': rooms_date[self.group_name][username]['points']
                        }
                    )   
                if sum(guess_word['guess_word'] == 'yes' for guess_word in rooms_date[self.group_name].values()) == len(rooms_date[self.group_name]) - 1:
                    technical_info[self.group_name]['stop_event'].set()
                

        elif type == 'are_ready':
            await self.handle_game_start()

        elif type == 'leader_choosed_word':
            technical_info[self.group_name]['word_for_guessing'] = technical_info[self.group_name]['data']['word']
            technical_info[self.group_name]['stop_event'].set()

        elif type == 'presenter_choosed_word':
            technical_info[self.group_name]['word_for_guessing'] = technical_info[self.group_name]['data']['word']
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'guess_word',
                    'word': technical_info[self.group_name]['data']['word']
                }
            )

    async def handle_game_start(self):
        try:
            if technical_info[self.group_name]['data']['skip_send_ready'] == 'no':
                username = self.scope['session'].get('username')
                rooms_date[self.group_name][username]['status'] = technical_info[self.group_name]['data']['are_ready']
                if rooms_date[self.group_name][username]['status'] == 'not_ready':
                    # global technical_info[self.group_name]['need_stop_game']
                    technical_info[self.group_name]['need_stop_game'] = True
                else:
                    # global technical_info[self.group_name]['all_are_ready']
                    technical_info[self.group_name]['all_are_ready'] = True
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        'type': 'are_ready',
                        'are_ready': technical_info[self.group_name]['data']['are_ready'],
                        'username': username
                    }
                )
        except:
            pass

        if all(readiness['status'] == 'ready' for readiness in rooms_date[self.group_name].values()) and len(rooms_date[self.group_name]) > 1 and technical_info[self.group_name]['is_now_game'] == False:
            # global technical_info[self.group_name]['word_for_guessing']
            if technical_info[self.group_name]['word_for_guessing'] != None:
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        'type': 'change_status_label',
                        'message_status': 'Ведущий выбирает слово',
                        'message_status_2': 'Угадываемое слово: ' + technical_info[self.group_name]['word_for_guessing'],
                    }
                )
            for guess_word_status in rooms_date[self.group_name].values():
                guess_word_status['guess_word'] = 'no'
            technical_info[self.group_name]['word_for_guessing'] = None
        
            technical_info[self.group_name]['all_are_ready'] = True
            technical_info[self.group_name]['need_stop_game'] = False
            time_left_before_start = 5
            async def waiting_before_start():
                # global technical_info[self.group_name]['is_now_game']
                technical_info[self.group_name]['is_now_game'] = True
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
                    if not technical_info[self.group_name]['all_are_ready']:
                        await self.channel_layer.group_send(
                            self.group_name,
                            {
                                'type': 'change_status_label',
                                'message_status': 'Статус: ожидание готовности игроков',
                                'message_status_2': 'Ведущий:'
                            }
                        )
                        technical_info[self.group_name]['is_now_game'] = False   
                        break
                # global technical_info[self.group_name]['leader'] 
                technical_info[self.group_name]['leader']  = None
                if not technical_info[self.group_name]['leader'] and technical_info[self.group_name]['all_are_ready']:
                    possible_leaders = []
                    if all(was_leader['was_leader'] == True for was_leader in rooms_date[self.group_name].values()):
                        for was_leader in rooms_date[self.group_name].values():
                            was_leader['was_leader'] = False
                    for username, was_leader in rooms_date[self.group_name].items():
                        if not was_leader['was_leader']:
                            possible_leaders.append(username)
                    technical_info[self.group_name]['leader']  = random.choice(possible_leaders)
                    rooms_date[self.group_name][technical_info[self.group_name]['leader'] ]['was_leader'] = True
                    # technical_info[self.group_name]['leader']  = random.choice(list(rooms_date[self.group_name].keys()))
                    technical_info[self.group_name]['random_words_for_leader'] = random.sample(words, 3)
                    await self.channel_layer.group_send(
                        self.group_name,
                        {
                            'type': 'change_status_label',
                            'message_status': 'Ведущий выбирает слово',
                            'message_status_2': 'Ведущий: ' + technical_info[self.group_name]['leader'] ,
                        }
                    )
                    
                    await self.channel_layer.send(rooms_date[self.group_name][technical_info[self.group_name]['leader'] ]['channel_name'], {
                        'type': 'send_leader',
                        'words': technical_info[self.group_name]['random_words_for_leader']
                    })

                    
                    time_left = 10
                    
                    async def leader_chooses_word_timer():

                        nonlocal time_left
                        
                        # Таймер лидера
                        while time_left > 0:
                            await self.channel_layer.send(rooms_date[self.group_name][technical_info[self.group_name]['leader'] ]['channel_name'], {
                                'type': 'leader_chooses_word_timer_fs',
                                'time_left': time_left
                            })
                            await asyncio.sleep(1)
                            time_left -= 1
                            if technical_info[self.group_name]['stop_event'].is_set():
                                technical_info[self.group_name]['stop_event'].clear()
                                break

                        # global technical_info[self.group_name]['word_for_guessing']
                        if not technical_info[self.group_name]['stop_event'].is_set() and technical_info[self.group_name]['word_for_guessing'] == None:
                            technical_info[self.group_name]['word_for_guessing'] = random.choice(technical_info[self.group_name]['random_words_for_leader'])

                        await self.channel_layer.send(rooms_date[self.group_name][technical_info[self.group_name]['leader'] ]['channel_name'], {
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
                                await self.channel_layer.group_send(
                                    self.group_name,
                                    {
                                        'type': 'start_game_timer',
                                        'time_left_start_game_timer': 'Осталось времени: ' + str(time_left_start_game_timer)
                                    }
                                )
                                await asyncio.sleep(1)
                                time_left_start_game_timer -= 1
                                if technical_info[self.group_name]['stop_event'].is_set():
                                    break

                            technical_info[self.group_name]['stop_event'].clear()
                            if technical_info[self.group_name]['leader']  in rooms_date[self.group_name] and rooms_date[self.group_name][technical_info[self.group_name]['leader'] ]:
                                await self.channel_layer.send(rooms_date[self.group_name][technical_info[self.group_name]['leader'] ]['channel_name'], {
                                    'type': 'clear_leader_tools',
                                })
                            # global technical_info[self.group_name]['is_now_game']
                            technical_info[self.group_name]['is_now_game'] = False
                            if technical_info[self.group_name]['all_are_ready'] == True and len(rooms_date[self.group_name]) > 1:
                                await self.handle_game_start()
                            else:
                                await self.channel_layer.group_send(
                                    self.group_name,
                                    {
                                        'type': 'change_status_label',
                                        'message_status': 'Статус: ожидание готовности игроков',
                                        'message_status_2': 'Угадываемое слово: ' + technical_info[self.group_name]['word_for_guessing']
                                    }
                                )
                            
                                
                        asyncio.create_task(start_game_timer())
                    
                    if technical_info[self.group_name]['all_are_ready']:
                        asyncio.create_task(leader_chooses_word_timer())

            asyncio.create_task(waiting_before_start())

        else:
            if not all(readiness['status'] == 'ready' for readiness in rooms_date[self.group_name].values()):
                technical_info[self.group_name]['all_are_ready'] = False

    @database_sync_to_async
    def change_username_in_session(self, username):
        # Сохраняем никнейм в HTTP-сессии
        self.scope['session']['username'] = username
        self.scope['session'].save()

    @database_sync_to_async
    def save_canvas_color(self, color):
        self.scope['session']['color'] = color
        self.scope['session'].save()

    @database_sync_to_async
    def save_brush_color(self, color):
        self.scope['session']['brush_color'] = color
        self.scope['session'].save()

    @database_sync_to_async
    def save_brush_width(self, width):
        self.scope['session']['brush_width'] = width
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
            'word': technical_info[self.group_name]['word_for_guessing']
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
            'word_for_guessing': technical_info[self.group_name]['word_for_guessing']
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

    async def change_brush_color(self, event):
        await self.send(text_data=json.dumps({
            'type': 'change_brush_color',
            'color': event['color']
        }))

    async def set_brush_color_for_all(self, event):
        await self.send(text_data=json.dumps({
            'type': 'set_brush_color_for_all',
            'color': event['color']
        }))

    async def set_brush_width(self, event):
        await self.send(text_data=json.dumps({
            'type': 'set_brush_width',
            'width': event['width']
        }))

    async def move_back(self, event):
        await self.send(text_data=json.dumps({
            'type': 'move_back',
            'last_action': event['last_action']
        }))
        