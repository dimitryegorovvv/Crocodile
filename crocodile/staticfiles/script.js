// $(document).ready(function() {
//     var canvas = document.getElementById('drawingCanvas');
//     var ctx = canvas.getContext('2d');
//     var drawing = false;

//     // Функция для начала рисования
//     function startDrawing(x, y) {
//         drawing = true;
//         ctx.beginPath(); 
//         ctx.moveTo(x, y); 
//     }

//     // Функция для рисования
//     function draw(x, y) {
//         if (drawing) {
//             ctx.lineTo(x, y);
//             ctx.stroke();
//         }
//     }

//     // Завершение рисования
//     function stopDrawing() {
//         drawing = false;
//     }

//     // Обработка событий мыши
//     $('#drawingCanvas').on('mousedown', function(event) {
//         startDrawing(event.offsetX, event.offsetY);
//     });

//     $('#drawingCanvas').on('mousemove', function(event) {
//         draw(event.offsetX, event.offsetY);
//     });

//     $('#drawingCanvas').on('mouseup', stopDrawing);
//     $('#drawingCanvas').on('mouseleave', stopDrawing);

//     // Обработка сенсорных событий для мобильных устройств
//     $('#drawingCanvas').on('touchstart', function(event) {
//         var touch = event.touches[0];
//         var rect = canvas.getBoundingClientRect();
//         startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
//         event.preventDefault(); // Предотвращение скроллинга
//     });

//     $('#drawingCanvas').on('touchmove', function(event) {
//         var touch = event.touches[0];
//         var rect = canvas.getBoundingClientRect();
//         draw(touch.clientX - rect.left, touch.clientY - rect.top);
//         event.preventDefault(); // Предотвращение скроллинга
//     });

//     $('#drawingCanvas').on('touchend', stopDrawing);
// });

// $(document).ready(function() {
//     let isDrawing = false;

//     $(".board").mousedown(function(event) {
//         isDrawing = true;
//         drawPoint(event.pageX, event.pageY, $(this));
//     });

//     $(document).mousemove(function(event) {
//         if (isDrawing) {
//             drawPoint(event.pageX, event.pageY, $(".board"));
//         }
//     });

//     $(document).mouseup(function() {
//         isDrawing = false;
//     });

//     function drawPoint(x, y, container) {
//         // Создаем элемент точки
//         var point = $('<div class="point"></div>');

//         // Устанавливаем позицию точки
        
//         point.css({
//             left: x - 5 + 'px', // центрируем точку
//             top: y - 5 + 'px'
//         });
//         point.css({
//             left: x - 5 + 'px', // центрируем точку
//             top: y - 5 + 'px'
//         });

//         // var offset = container.offset();
//         // Добавляем точку на доску
//         container.append(point);
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const socket = new WebSocket('wss://238a-176-60-51-192.ngrok-free.app/ws/draw/');
    let drawing = false;

    // Начало рисования
    canvas.addEventListener('mousedown', function(event) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    });

    canvas.addEventListener('mousemove', function(event) {
        if (drawing) {
            let x = event.offsetX;
            let y = event.offsetY;
            ctx.lineTo(x, y);
            ctx.stroke();

            // Отправляем данные на сервер
            socket.send(JSON.stringify({
                'x': x,
                'y': y
            }));
        }
    });

    canvas.addEventListener('mouseup', function() {
        drawing = false;
    });

    canvas.addEventListener('mouseleave', function() {
        drawing = false;
    });

    // Получаем данные о рисовании от других пользователей
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
    };
});