from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .consumers import technical_info
import json


def home(request):
    username = request.session.get('username', 'no_name')
    print(username)
    return render(request, 'start_menu.html', {'username': username})
    # return render(request, 'home.html', {'username': username})


def play(request):
    return render(request, 'home.html')


def create_room(request):
    return render(request, 'create_room.html')


def join_room(request):
    return render(request, 'join_room.html')


@csrf_exempt
@require_POST
def check_room_with_pass(request):
    data = json.loads(request.body)
    password = data.get('password')
    for values in technical_info.values():
        if values.get('room_password') == password:
            return JsonResponse({'message': 'Комната найдена'}, status=200)
    return JsonResponse({'message': 'Комната не найдена'}, status=200)


@csrf_exempt
@require_POST
def change_username(request):
    data = json.loads(request.body)
    username = data.get('username')
    if len(username) > 20 or username.find(' ') != -1:
        return JsonResponse({'message': 'Некорректный никнейм'}, status=422)
    else:
        request.session['username'] = username
        request.session.save()
        return JsonResponse({}, status=200)


@csrf_exempt
@require_POST
def action_with_room(request):
    data = json.loads(request.body)
    room_status = data.get('room_status')
    print(room_status)
    room_password = data.get('room_password')
    request.session['room_status'] = room_status
    request.session['room_password'] = room_password
    request.session.save()
    return JsonResponse({}, status=200)
    

# @csrf_exempt
# @require_POST
# def save_color_canvas(request):
#     data = json.loads(request.body)
#     color = data.get('color')
#     request.session['current_canvas_color'] = color
#     print(color)
#     return JsonResponse({}, status=200)
    