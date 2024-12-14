from django.urls import path
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('play/', play, name='play'),
    path('create_room/', create_room, name='create_room'),
    path('change_username/', change_username, name='change_username'),
    path('action_with_room/', action_with_room, name='action_with_room'),
    path('join_room/', join_room, name='join_room'),
    path('check_room_with_pass/', check_room_with_pass, name='check_room_with_pass'),
]