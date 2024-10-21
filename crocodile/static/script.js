const url = '127.0.0.1:8001'

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const socket = new WebSocket('ws://' + url + '/ws/draw/');
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
    const chatSocket = new WebSocket('ws://' + url + '/ws/chat/');
    const socket = new WebSocket('ws://' + url + '/ws/draw/');
    const chatInput = document.getElementsByClassName('chat_write')[0];
    const btnSend = document.getElementsByClassName('btn_send_mes')[0];
    const chatWatch = document.getElementsByClassName('chat_watch')[0];
    const btnConfUsername = document.getElementsByClassName('btn_conf_username')[0];
    const inpUsername = document.getElementsByClassName('inp_username')[0];
    const currentUsers = document.getElementsByClassName('current_users')[0];
    const buttonReady = document.getElementsByClassName('ready_button')[0];
    const mainDiv = document.getElementsByClassName('main')[0];
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const labelLeaderAndWhatWasWord = document.getElementsByClassName('label_leader_and_what_was_word')[0];
    const gameTimerAndGameStatus = document.getElementsByClassName('game_timer')[0];
    var word;
    let chooseWordTimer;
    let gameTimer;
    canvas.style.pointerEvents = 'none';

    function clearTimers() {
        if (chooseWordTimer) clearInterval(chooseWordTimer);
        if (gameTimer) clearInterval(gameTimer);
    }

    mainDiv.addEventListener('click', function(event){
        if (event.target && event.target.classList.contains('selectable_word')) {
            const choosedWord = event.target.textContent;  // Или event.target.innerText
            clearInterval(chooseWordTimer);
            presenter_choosed_word(choosedWord);
        }
    });

    mainDiv.addEventListener('click', function(event){
        if (event.target && event.target.classList.contains('clear_button')) {
            const clearButton = document.getElementsByClassName('clear_button')[0];
            clearButton.addEventListener('click', function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            socket.send(JSON.stringify({
                'type': 'clear'
            }));
        });
        }
    });

    function presenter_choosed_word(choosedWord) {
        const wordsForPresenter = document.getElementsByClassName('words_for_presenter')[0];
        wordsForPresenter.remove();

        const wordForPresenter = document.createElement("div");
        wordForPresenter.classList.add('word_for_presenter');
        wordForPresenter.textContent = 'Ваше слово: ' + choosedWord.toUpperCase();

        currentUsers.insertAdjacentElement('afterend', wordForPresenter);
        canvas.style.pointerEvents = 'auto';

        const buttonClearCanvas = document.createElement('button');
        buttonClearCanvas.classList.add('clear_button');
        buttonClearCanvas.textContent = 'Очистить';
        labelLeaderAndWhatWasWord.insertAdjacentElement('afterend', buttonClearCanvas);

        chatSocket.send(JSON.stringify({
                'type': 'presenter_choosed_word',
                'word': choosedWord
            }));
    }

    function startTimerChooseWord(words) {
        let timeLeft = 9;
        const timerElement = document.getElementsByClassName("timer_choose_word")[0];

        chooseWordTimer = setInterval(function() {
            if (timeLeft <= 0) {
                clearInterval(chooseWordTimer);
                const chooseRandomWord = words[Math.floor(Math.random() * words.length)];
                presenter_choosed_word(chooseRandomWord);
            } else {
                timerElement.textContent = timeLeft;
                timeLeft -= 1;
            }
        }, 1000);
    }

    function startGameTimerFun() {
        let timeLeft = 10;

        gameTimer = setInterval(function() {
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                gameTimerAndGameStatus.textContent = 'Время вышло';
                if (document.getElementsByClassName('word_for_presenter')[0])
                document.getElementsByClassName('word_for_presenter')[0].remove();
                endOfGame();
            } else {
                gameTimerAndGameStatus.textContent = 'Осталось времени: ' + timeLeft + ' сек.';
                timeLeft -= 1;
            }
        }, 1000);
    }

    function endOfGame() {
        labelLeaderAndWhatWasWord.textContent = 'Угадываемое слово: ' + word;
        if (document.getElementsByClassName('clear_button')[0]){
            document.getElementsByClassName('clear_button')[0].remove();
        }

        let timeLeft = 10;
        gameAfterGameTimer = setInterval(function() {
            if (timeLeft <= 0) {
                clearInterval(gameAfterGameTimer);
                gameTimerAndGameStatus.textContent = 'Ведущий выбирает слово 1';
                clearTimers();
                chatSocket.send(JSON.stringify({
                    'type': 'are_ready',
                    'skip_send_ready': 'yes'
                }));
            } else {
                gameTimerAndGameStatus.textContent = 'До начала игры: ' + timeLeft + ' сек.';
                timeLeft -= 1;
            }
        }, 1000);
    }
    
    buttonReady.addEventListener('click', function(){
        if (buttonReady.textContent == 'Не готов'){
            buttonReady.style.backgroundColor = 'green';
            buttonReady.textContent = 'Готов';
            send_socket_readiness('ready');
        } else {
            buttonReady.style.backgroundColor = 'red';
            buttonReady.textContent = 'Не готов';
            send_socket_readiness('not_ready');
        }
        function send_socket_readiness(are_ready) {
            chatSocket.send(JSON.stringify({
                'type': 'are_ready',
                'are_ready': are_ready,
                'skip_send_ready': 'no'
            }));
        }
        });

    inpUsername.addEventListener('keydown', function(event) {
        if (event.key === 'Enter'){
            event.preventDefault();
            btnConfUsername.click();
        } 
    });

    btnConfUsername.addEventListener('click', function(){
        if (inpUsername.value != ''){
            chatSocket.send(JSON.stringify({
                'type': 'change_username',
                'message': inpUsername.value
        }));     
        }
        
        fetch('/change_username/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'username': inpUsername.value })
        }).then(response => {
            if (response.ok) {
                let welcomeText = document.getElementsByClassName('welcome_header')[0];
                welcomeText.textContent = 'Добро пожаловать, ' + inpUsername.value;
                inpUsername.value = ''; 
            }
        });
    });

    chatInput.addEventListener('keydown', function(event) {
       if (event.key === 'Enter'){
          event.preventDefault();
          btnSend.click();
       } 
    });

    btnSend.addEventListener('click', function() {
        if (chatInput.value != ''){
            chatSocket.send(JSON.stringify({
                'type': 'send_message',
                'message': chatInput.value
            }));
            chatInput.value = ''; 
        };
    });

    chatSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.type == 'send_message'){
            var chatMsgWr = document.createElement('div');
            chatMsgWr.classList.add('chat_msg_wr');
    
            var chatUser = document.createElement('span');
            chatUser.classList.add('chat_user');
            if (data.guess_word == 'yes'){
                chatUser.style.color = 'green'
            }
            chatUser.textContent = data.username;
    
            var chatMessage = document.createElement('span');
            chatMessage.classList.add('chat_message');
            if (data.guess_word == 'yes'){
                chatMessage.textContent = 'Слово угадано!';
            } else {
                chatMessage.textContent = data.message;
            }
    
            chatMsgWr.appendChild(chatUser);
            chatMsgWr.appendChild(chatMessage);
            if (data.guess_word == 'yes'){
                var img_chat_check_mark = document.createElement('img');
                img_chat_check_mark.classList.add('img_check_mark');
                img_chat_check_mark.setAttribute('src', '/static/images/check_mark.png');
                chatMsgWr.appendChild(img_chat_check_mark);
            }
    
            chatWatch.appendChild(chatMsgWr);
            chatWatch.scrollTop = chatWatch.scrollHeight;
        } else if (data.type == 'update_current_users'){
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

            var timerChooseWord = document.createElement('div');
            timerChooseWord.textContent = '10';
            timerChooseWord.classList.add('timer_choose_word');

            wordsForPresenter.appendChild(chooseWord);
            wordsForPresenter.appendChild(selectableWordWr);
            wordsForPresenter.appendChild(timerChooseWord);
            mainDiv.appendChild(wordsForPresenter);

            startTimerChooseWord(data.words)
        } else if (data.type == 'guess_word') {
            word = data.word
            gameTimerAndGameStatus.textContent = 'Осталось времени: 90 сек.';
            if (document.getElementsByClassName('word_for_presenter')[0]){
                let wordForPresenter = document.getElementsByClassName('word_for_presenter')[0];
                // startGameTimer.style.marginTop = '20px';
                // wordForPresenter.insertAdjacentElement('afterend', startGameTimer);
            } else {
                // currentUsers.insertAdjacentElement('afterend', startGameTimer);
            }
            startGameTimerFun();
        } else if (data.type == 'user_guessed_word'){
            chatInput.disabled = true;
            chatInput.placeholder = 'Поздравляем, вы угадали слово'
        } else if (data.type == 'label_who_is_leader'){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            gameTimerAndGameStatus.textContent = 'Ведущий выбирает слово';
            labelLeaderAndWhatWasWord.textContent = 'Ведущий: ' + data.leader_nickname;
        }
    };
});




