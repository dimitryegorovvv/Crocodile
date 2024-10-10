const url = '0175-176-60-34-224.ngrok-free.app'

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const socket = new WebSocket('wss://' + url + '/ws/draw/');
    let drawing = false;
    
    // Функция для получения координат касания на мобильных устройствах
    function getTouchPos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    }

    // Начало рисования
    function startDrawing(event) {
        drawing = true;
        let x = event.offsetX || getTouchPos(event).x;
        let y = event.offsetY || getTouchPos(event).y;

        // Начинаем новый путь
        // ctx.beginPath();
        // ctx.moveTo(x, y);
        
        // Отправляем начальные координаты на сервер
        socket.send(JSON.stringify({
            'x': x,
            'y': y,
            'type': 'start'  // Указываем тип сообщения
        }));
    }

    const clearButton = document.getElementsByClassName('clear_button')[0];
    clearButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Отправляем команду очистки на сервер
        socket.send(JSON.stringify({
            'type': 'clear'
        }));
    });

    // Рисование
    function draw(event) {
        if (drawing) {
            let x = event.offsetX || getTouchPos(event).x;
            let y = event.offsetY || getTouchPos(event).y;

            // Отправляем координаты на сервер
            socket.send(JSON.stringify({
                'x': x,
                'y': y,
                'type': 'draw'  // Указываем тип сообщения
            }));
        }
    }

    // Остановка рисования
    function stopDrawing() {
        drawing = false;
    }

    // События для мыши
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // События для касаний на мобильных устройствах
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    // Получаем данные от сервера
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'start') {
            // Начинаем новый путь
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
        } else if (data.type === 'draw') {
            // Продолжаем рисовать
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        } else if (data.type === 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
});


document.addEventListener('DOMContentLoaded', function() {
    const chatSocket = new WebSocket('wss://' + url + '/ws/chat/');
    const chatInput = document.getElementsByClassName('chat_write')[0];
    const btnSend = document.getElementsByClassName('btn_send_mes')[0];
    const chatWatch = document.getElementsByClassName('chat_watch')[0];
    const btnConfUsername = document.getElementsByClassName('btn_conf_username')[0];
    const inpUsername = document.getElementsByClassName('inp_username')[0];
    const currentUsers = document.getElementsByClassName('current_users')[0];
    const buttonReady = document.getElementsByClassName('ready_button')[0];
    const mainDiv = document.getElementsByClassName('main')[0];

    // const leaderChoosedWord = document.getElementsByClassName('selectable_word')[0];

    mainDiv.addEventListener('click', function(event){
        if (event.target && event.target.classList.contains('selectable_word')) {
            const choosedWord = event.target.textContent;  // Или event.target.innerText
            const wordsForPresenter = document.getElementsByClassName('words_for_presenter')[0];
            wordsForPresenter.remove();
        }
    });
    
    buttonReady.addEventListener('click', function(){
        if (buttonReady.textContent == 'Не готов'){
            buttonReady.style.backgroundColor = 'green';
            buttonReady.textContent = 'Готов';
            // chatSocket.send(JSON.stringify({
            //     'type': 'are_ready',
            //     'are_ready': 'ready'
            // }));
            send_socket_readiness('ready');
        } else {
            buttonReady.style.backgroundColor = 'red';
            buttonReady.textContent = 'Не готов';
            send_socket_readiness('not_ready');
        }
        function send_socket_readiness(are_ready) {
            chatSocket.send(JSON.stringify({
                'type': 'are_ready',
                'are_ready': are_ready
            }));
        }
        });

    btnConfUsername.addEventListener('click', function(){
        chatSocket.send(JSON.stringify({
            'type': 'change_username',
            'message': inpUsername.value
        }));
        // inpUsername.value = '';
        
        fetch('/change_username/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ 'username': inpUsername.value })
        }).then(response => {
            if (response.ok) {
                let welcomeText = document.getElementsByClassName('welcome_header')[0];
                welcomeText.textContent = 'Добро пожаловать, ' + inpUsername.value;
                inpUsername.value = '';  // Очищаем поле ввода
            }
        });
    });

    btnSend.addEventListener('click', function() {
        chatSocket.send(JSON.stringify({
            'type': 'send_message',
            'message': chatInput.value
        }));
        chatInput.value = '';  // Очищаем поле ввода
    });

    chatSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        // if (data.message != '' && data.type == 'send_message'){
        if (data.message != '' && data.type == 'send_message'){
            var chatMsgWr = document.createElement('div');
            chatMsgWr.classList.add('chat_msg_wr');
    
            // Создаем span для пользователя
            var chatUser = document.createElement('span');
            chatUser.classList.add('chat_user');
            chatUser.textContent = data.username;
    
            // Создаем span для сообщения
            var chatMessage = document.createElement('span');
            chatMessage.classList.add('chat_message');
            chatMessage.textContent = data.message;
    
            // Добавляем элементы в div с классом chat_msg_wr
            chatMsgWr.appendChild(chatUser);
            chatMsgWr.appendChild(chatMessage);
    
            chatWatch.appendChild(chatMsgWr);
            chatWatch.scrollTop = chatWatch.scrollHeight;
        } else if (data.type == 'update_current_users'){
            // let current_users_to_del = document.querySelectorAll('.current_user');
            // current_users_to_del.forEach(element => {
            //     element.remove();
            // });
            // data.current_users.forEach(element => {
            //     var currentUser = document.createElement('span');
            //     currentUser.classList.add('current_user');
            //     currentUser.textContent = element + ' ';
            //     currentUsers.appendChild(currentUser);
            // });
            // console.log(data.current_users);
            // console.log('test');
            let current_users_to_del = document.querySelectorAll('.current_user');
            current_users_to_del.forEach(element => {
                element.remove();
            });
            for (let currentUserKey in data.current_users){
                var currentUser = document.createElement('span');
                currentUser.classList.add('current_user');
                if (data.current_users[currentUserKey]['status'] == 'not_ready'){
                    currentUser.style.color = 'red';                    
                } else {
                    currentUser.style.color = 'green';
                }
                currentUser.textContent = currentUserKey + ' ';
                currentUsers.appendChild(currentUser);
            }
        } else if (data.type == 'are_ready'){
            let change_readiness_user = document.querySelectorAll('.current_user');
            for (let i = 0; i < change_readiness_user.length; i++) {
                let element = change_readiness_user[i];
                if (element.textContent.trim() == data.username) {
                    if (data.are_ready == 'ready') {
                        element.style.color = 'green';
                    } else {
                        element.style.color = 'red';
                    }
                    break; 
                }
            }
        } else if (data.type == 'set_username'){
            let welcomeText = document.getElementsByClassName('welcome_header')[0];
            welcomeText.textContent = 'Добро пожаловать, ' + data.username;
        } else if (data.type == 'make_leader'){

            var wordsForPresenter = document.createElement('div');
            wordsForPresenter.classList.add('words_for_presenter');

            var chooseWord = document.createElement('div');
            chooseWord.classList.add('choose_word');
            chooseWord.textContent = 'Выберите слово:';

            var selectableWordWr = document.createElement('div');
            selectableWordWr.classList.add('selectable_word_wr');
    
            data.words.forEach(element => {
                var selectableWord = document.createElement('button');
                selectableWord.classList.add('selectable_word');
                selectableWord.textContent = element;
                selectableWordWr.appendChild(selectableWord);
            });           
    
            wordsForPresenter.appendChild(chooseWord);
            wordsForPresenter.appendChild(selectableWordWr);
            mainDiv.appendChild(wordsForPresenter)
        }

        // else if (data.message != '' && data.type == 'change_username'){
        //     fetch('/change_username/', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             // 'X-CSRFToken': getCookie('csrftoken')
        //         },
        //         body: JSON.stringify({ 'username': data.message })
        //     }).then(response => {
        //         if (response.ok) {
        //         }
        //     });
        // }


        
    };

    
});



function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


