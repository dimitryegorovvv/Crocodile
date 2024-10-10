from django.urls import path, include
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('change_username/', change_username, name='change_username')
]