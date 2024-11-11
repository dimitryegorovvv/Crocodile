from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json


def home(request):
    username = request.session.get('username', 'no_name')
    print(username)
    return render(request, 'home.html', {'username': username})


@csrf_exempt
@require_POST
def change_username(request):
    data = json.loads(request.body)
    username = data.get('username')
    print('имя: ', username)
    request.session['username'] = username
    return JsonResponse({}, status=200)
    
# @csrf_exempt
# @require_POST
# def save_color_canvas(request):
#     data = json.loads(request.body)
#     color = data.get('color')
#     request.session['current_canvas_color'] = color
#     print(color)
#     return JsonResponse({}, status=200)
    