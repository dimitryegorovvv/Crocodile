# main/routing.py
from django.urls import re_path
from main.consumers import *

websocket_urlpatterns = [
    re_path(r'ws/draw/$', DrawingConsumer.as_asgi()),
    re_path(r'ws/chat/$', ChatConsumer.as_asgi()), 
]
