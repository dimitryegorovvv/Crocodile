const url = 'wss://' + '28b5-178-120-50-214.ngrok-free.app';
// const url = 'ws://' + '127.0.0.1:8001';

// document.addEventListener('DOMContentLoaded', function() {    
    // let metaTag = document.querySelector('meta[name="viewport"]');

    // if (metaTag) {
    //     metaTag.setAttribute('content', 'width=1300, initial-scale=1.0, maximum-scale=1.0');
    // } else {
    //     console.log('мета-тег не найден');
        
    // }

    function updateViewport() {
        const existingMeta = document.querySelector('meta[name="viewport"]');
        if (existingMeta) {
            existingMeta.parentNode.removeChild(existingMeta);
        }
    
        const metaTag = document.createElement('meta');
        metaTag.name = 'viewport';
        metaTag.content = 'width=1300, initial-scale=1.0, maximum-scale=1.0';
    
        document.head.appendChild(metaTag);
    
        console.log('Viewport meta updated!');
    }
    
    updateViewport();

    const socket = new WebSocket(url + '/ws/draw/');
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
    const chatWr = document.getElementsByClassName('chat_wr')[0];
    const labelLeaderAndWhatWasWord = document.getElementsByClassName('label_leader_and_what_was_word')[0];
    const gameTimerAndGameStatus = document.getElementsByClassName('game_timer')[0];
    const userTools = document.getElementsByClassName('user_tools')[0];
    const whatWasWordWr = document.getElementsByClassName('what_was_word_wr')[0];
    const whatWasWord = document.getElementsByClassName('what_was_word')[0];
    const timerBeforeNewGame = document.getElementsByClassName('timer_before_new_game')[0];
    const nicknameLabel = document.getElementsByClassName('nickname')[0];
    const kickPlayer = document.getElementsByClassName('kick_player')[0];
    const kickUsersList = document.getElementsByClassName('kick_users_list')[0];
    var currentCanvasColor = 'not_set';
    var standartCanvasColor = '#000000';
    var standartBruhColor = '#f1f1f1';
    var standartBrushWidth = 2.5;
    var word;
    let chooseWordTimer;
    let gameTimer;
    let drawing = false;
    var actions = [];
    canvas.style.pointerEvents = 'none';
    if (userTools.getAttribute('data-color') == ''){
        canvas.style.backgroundColor = standartCanvasColor;
    } else {
        canvas.style.backgroundColor = userTools.getAttribute('data-color');
    }
    userTools.setAttribute('data-brush-color', standartBruhColor);
    if (userTools.getAttribute('data-brush-color') == ''){
        ctx.strokeStyle = standartBruhColor;
    } else {
        ctx.strokeStyle = userTools.getAttribute('data-brush-color');
    }

    kickPlayer.addEventListener('click', () => {
        kickUsersList.classList.toggle('show');
    });
    



    // const words = ['Лошадь', 'Собака', 'Луна']

    // socket.onclose = function (event) {
    //     alert('ошибка');
    //     console.log(event);
        
    // }
    
    // socket.onerror = (error) => console.error('Ошибка WebSocket:', error);
    // var wordsForPresenter = document.createElement('div');
    // wordsForPresenter.classList.add('words_for_presenter');

    // var chooseWord = document.createElement('div');
    // chooseWord.classList.add('choose_word');
    // chooseWord.textContent = 'Выберите слово:';

    // var selectableWordWr = document.createElement('div');
    // selectableWordWr.classList.add('selectable_word_wr');

    // words.forEach(element => {
    //     var selectableWord = document.createElement('button');
    //     selectableWord.classList.add('selectable_word');
    //     selectableWord.textContent = element;
    //     selectableWordWr.appendChild(selectableWord);
    // });

    // var timerChooseWord = document.createElement('div');
    // timerChooseWord.textContent = '10';
    // timerChooseWord.classList.add('timer_choose_word');

    // wordsForPresenter.appendChild(chooseWord);
    // wordsForPresenter.appendChild(selectableWordWr);
    // wordsForPresenter.appendChild(timerChooseWord);
    // canvas.insertAdjacentElement('afterend', wordsForPresenter);


    function saveState() {
        actions.push(canvas.toDataURL());
        // const jsonString = JSON.stringify(actions);

        // // Получаем длину строки в байтах
        // const sizeInBytes = new Blob([jsonString]).size;

        // // Преобразуем в килобайты
        // const sizeInKB = sizeInBytes / 1024;

        // console.log(`Размер массива: ${sizeInKB.toFixed(2)} KB`);
        // console.log(actions);
        if (actions.length >= 10) {
            actions.shift(); 
        }
    }
    
    // Восстановление последнего состояния
    // function undo() {
    //     if (actions.length > 0) {
    //         const lastAction = actions.pop();
    //         const img = new Image();
    //         img.src = lastAction;
    //         img.onload = () => {
    //             ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
    //             ctx.drawImage(img, 0, 0); // Отрисовка предыдущего состояния
    //         };
    //     }
    // }

    // presenter_choosed_word('1');

    // if (userTools.getAttribute('data-brush-width') == ''){
    //     ctx.lineWidth = standartBrushWidth;
    // } else {
    //     ctx.lineWidth = userTools.getAttribute('data-brush-width');
    // }
    // ctx.strokeStyle = '#f1f1f1';
    // ctx.lineWidth = 100;

    // window.addEventListener('click', () => {
    //     const music = document.getElementsByClassName('audio')[0];
    //     music.play().catch(error => console.log('Автовоспроизведение заблокировано:', error));
    // });


    userTools.addEventListener('click', function (event) {
        if (event.target === userTools){
            if (!document.getElementsByClassName('canvas_BC_choose')[0]){
                let canvasBCchoose = document.createElement('div');
                canvasBCchoose.classList.add('canvas_BC_choose');
    
                let canvasBCchooseLabel = document.createElement('div');
                canvasBCchooseLabel.classList.add('canvas_BC_choose_label');
                canvasBCchooseLabel.textContent = 'Выбор цвета доски';
    
                let colorPicker = document.createElement('div');
                colorPicker.id = 'colorpicker';

                let colorPickerInput = document.createElement('input');
                colorPickerInput.type = 'text';
                colorPickerInput.id = 'color';
                colorPickerInput.name = 'color';
                colorPickerInput.value = '#123456';

                let labelStandartColor = document.createElement('button');
                labelStandartColor.classList.add('button_standart_color');
                labelStandartColor.textContent = 'По умолчанию';
    
                canvasBCchoose.appendChild(canvasBCchooseLabel);
                canvasBCchoose.appendChild(colorPickerInput);
                canvasBCchoose.appendChild(colorPicker);
                canvasBCchoose.appendChild(labelStandartColor);
                userTools.appendChild(canvasBCchoose);
                
                let farbtastic = $.farbtastic('#colorpicker').linkTo(function(color) {
                    canvas.style.backgroundColor = color;
                    currentCanvasColor = color;
                });
                // farbtastic.setColor(colorPickerInput.value);
                farbtastic.setColor(userTools.getAttribute('data-color'));
            } else {
                socket.send(JSON.stringify({
                    'type': 'save_color_canvas',
                    'color': currentCanvasColor
                }));
                userTools.setAttribute('data-color', currentCanvasColor)
                let canvasBCchoose = document.getElementsByClassName('canvas_BC_choose')[0];
                canvasBCchoose.remove();
                // fetch('/save_color_canvas/', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({ 'color': currentCanvasColor })
                // }).then(response => {
                //     if (response.ok) {
                //         console.log('ok');
                //     }
                // }); 
            }
        }
    });
    // $('#colorpicker').farbtastic('#color');

    userTools.addEventListener('click', function(event){
        if (event.target && event.target.classList.contains('button_standart_color')) {
            let farbtastic = $.farbtastic('#colorpicker');
            farbtastic.setColor(standartCanvasColor);
            userTools.setAttribute('data-color', standartCanvasColor);
            socket.send(JSON.stringify({
                'type': 'save_color_canvas',
                'color': standartCanvasColor
            }));
        }
    });

    

    // const colorPicker = document.getElementById('colorpicker');
    // colorPicker.addEventListener('click', function () {
    //     canvas.style.backgroundColor = $.farbtastic('#colorpicker').color;
    // })

    function getTouchPos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    }

    // Начало рисования
    function startDrawing(event) {
        saveState();
        drawing = true;
        let x = event.offsetX || getTouchPos(event).x;
        let y = event.offsetY || getTouchPos(event).y;

        // ctx.beginPath();
        // ctx.moveTo(x, y);
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

            // ctx.beginPath();
            // ctx.moveTo(x, y);
            // ctx.lineTo(x, y);
            // ctx.stroke();
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


    // ведущий нажал на слово
    mainDiv.addEventListener('click', function(event){
        if (event.target && event.target.classList.contains('selectable_word')) {
            const choosedWord = event.target.textContent;  // Или event.target.innerText
            // clearInterval(chooseWordTimer);
            socket.send(JSON.stringify({
                'type': 'leader_choosed_word',
                'word': choosedWord
            }));
            // presenter_choosed_word(choosedWord);
        }
    });

    // ведущий нажал на кнопку инструмента
    chatWr.addEventListener('click', function(event){
        if (event.target && event.target.classList.contains('clear_button')) {
            // const clearButton = document.getElementsByClassName('clear_button')[0];
            // clearButton.addEventListener('click', function() {
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            socket.send(JSON.stringify({
                'type': 'clear'
            }));
        // });
        }
        if (event.target && event.target.classList.contains('eraser')) {
            let eraser = document.getElementsByClassName('eraser')[0];
            // eraser.addEventListener('click', function () {
            console.log(eraser.textContent);
            
            if (eraser.textContent == 'Стёрка'){
                eraser.textContent = 'Кисть';
                socket.send(JSON.stringify({
                    'type': 'change_drawing_tool',
                    'drawing_tool': 'eraser'
                }));
            } else if (eraser.textContent == 'Кисть'){
                eraser.textContent = 'Стёрка';
                socket.send(JSON.stringify({
                    'type': 'change_drawing_tool',
                    'drawing_tool': 'brush'
                }));
            }
            // });
        }
        if (event.target && event.target.classList.contains('change_brush_color')) {
            if (!document.getElementsByClassName('brush_color_choose')[0]) {
                let brushColorChoose = document.createElement('div');
                brushColorChoose.classList.add('brush_color_choose');
        
                let colorPickerBrush = document.createElement('div');
                colorPickerBrush.id = 'colorpicker_brush';
        
                let colorPickerInputBrush = document.createElement('input');
                colorPickerInputBrush.type = 'text';
                colorPickerInputBrush.id = 'color_brush';
                colorPickerInputBrush.name = 'color_brush';
                colorPickerInputBrush.value = '#123456';
        
                brushColorChoose.appendChild(colorPickerInputBrush);
                brushColorChoose.appendChild(colorPickerBrush);
        
                let changebrushColor = document.getElementsByClassName('change_brush_color')[0];
                changebrushColor.appendChild(brushColorChoose);

                // farbtastic.setColor(userTools.getAttribute('data-color'));
                
                let farbtastic_for_brush = $.farbtastic('#colorpicker_brush').linkTo(function(color) {
                    userTools.setAttribute('data-brush-color', color);
                    socket.send(JSON.stringify({
                        'type': 'change_brush_color',
                        'color': color
                    }));
                });
                // if userTools.getAttribute('data-brush-color')
                if (userTools.getAttribute('data-brush-color') == ''){
                    farbtastic_for_brush.setColor(standartBruhColor);
                } else {
                    farbtastic_for_brush.setColor(userTools.getAttribute('data-brush-color'));
                }
                // farbtastic_for_brush.setColor(userTools.getAttribute('data-brush-color'));
                
            } else {
                let brushColorChoose = document.getElementsByClassName('brush_color_choose')[0];
                brushColorChoose.remove();
                
            }
        }
        if (event.target && event.target.classList.contains('button_back')) {
            if (actions.length != 0){
                socket.send(JSON.stringify({
                    'type': 'move_back',
                    'last_action': actions.pop(),
                }));
            }
        }
    });

    chatWr.addEventListener('input', function(event){
        if (event.target && event.target.classList.contains('brush_width')) {
            const brushWidth = document.getElementsByClassName('brush_width')[0];
            userTools.setAttribute('data-brush-width', brushWidth.value);
            socket.send(JSON.stringify({
                'type': 'set_brush_width',
                'width': brushWidth.value
            }));
            console.log('устанавливаем ширину: ', brushWidth.value);
        }
    });

    // presenter_choosed_word('hui')

    function presenter_choosed_word(choosedWord) {
        const wordsForPresenter = document.getElementsByClassName('words_for_presenter')[0];
        wordsForPresenter.remove();

        const wordForPresenter = document.createElement("div");

        let imgForWordLeft = document.createElement('img');
        imgForWordLeft.classList.add('img_for_word', 'left_img_for_word');
        imgForWordLeft.src = '/static/images/for_word.png';
        wordForPresenter.append(imgForWordLeft);
        
        wordForPresenter.classList.add('word_for_presenter');
        let tempWords = 'Ваше слово: ' + choosedWord.toUpperCase();
        wordForPresenter.append(tempWords);

        let imgForWordRight = document.createElement('img');
        imgForWordRight.classList.add('img_for_word', 'right_img_for_word');
        imgForWordRight.src = '/static/images/for_word.png';
        wordForPresenter.append(imgForWordRight);
        
        gameTimerAndGameStatus.insertAdjacentElement('afterend', wordForPresenter);
        let brushColor;
        if (userTools.getAttribute('data-brush-color') == ''){
            brushColor = standartBruhColor;
        } else {
            brushColor = userTools.getAttribute('data-brush-color');
        }


        socket.send(JSON.stringify({
            'type': 'set_brush_color_for_all',
            'color': brushColor
        }));
        
        let eraser = document.createElement('button');
        eraser.classList.add('eraser', 'leader_tool');
        eraser.textContent = 'Стёрка';
        
        socket.send(JSON.stringify({
            'type': 'change_drawing_tool',
            'drawing_tool': 'brush'
        }));
        
        canvas.style.pointerEvents = 'auto';

        let changeBrushColor = document.createElement('button');
        changeBrushColor.classList.add('change_brush_color', 'leader_tool');
        changeBrushColor.textContent = 'Цвет';

        const buttonClearCanvas = document.createElement('button');
        buttonClearCanvas.classList.add('clear_button', 'leader_tool');
        buttonClearCanvas.textContent = 'Очистить';


        // const buttonClearCanvas = document.createElement('button');
        // buttonClearCanvas.classList.add('clear_button', 'leader_tool');
        // buttonClearCanvas.textContent = 'Очистить';

        let brushWidthSend;
        if (userTools.getAttribute('data-brush-width') == ''){
            brushWidthSend = standartBrushWidth;
        } else {
            brushWidthSend = parseFloat(userTools.getAttribute('data-brush-width'));
        }

        const brushWidth = document.createElement('input');
        brushWidth.classList.add('brush_width', 'leader_tool');
        brushWidth.type = 'range';
        brushWidth.min = '1';
        brushWidth.max = '10';
        brushWidth.step = '0.1';
        brushWidth.value = brushWidthSend;

        const buttonBack = document.createElement('button');
        buttonBack.classList.add('button_back');

        const imgButtonBack = document.createElement('img');
        imgButtonBack.classList.add('img_button_back');
        imgButtonBack.src = '/static/images/back.png';
        imgButtonBack.alt = 'Назад';
        buttonBack.appendChild(imgButtonBack);

        let lineForWord = document.createElement('div');
        lineForWord.classList.add('line_word_presenter');

        const chatSendMessage = document.getElementsByClassName('chat_write_and_btn_send')[0];
        chatSendMessage.style.display = 'none';
        labelLeaderAndWhatWasWord.style.display = 'none';

        labelLeaderAndWhatWasWord.insertAdjacentElement('afterend', eraser);
        eraser.insertAdjacentElement('afterend', changeBrushColor);
        changeBrushColor.insertAdjacentElement('afterend', buttonClearCanvas);
        buttonClearCanvas.insertAdjacentElement('afterend', brushWidth);
        brushWidth.insertAdjacentElement('afterend', buttonBack);
        buttonBack.insertAdjacentElement('afterend', lineForWord);
        lineForWord.insertAdjacentElement('afterend', wordForPresenter);

        socket.send(JSON.stringify({
                'type': 'presenter_choosed_word',
                'word': choosedWord
            }));
    }

    

    // function startTimerChooseWord(words) {
    //     let timeLeft = 9;
    //     const timerElement = document.getElementsByClassName("timer_choose_word")[0];

    //     chooseWordTimer = setInterval(function() {
    //         if (timeLeft <= 0) {
    //             clearInterval(chooseWordTimer);
    //             const chooseRandomWord = words[Math.floor(Math.random() * words.length)];
    //             presenter_choosed_word(chooseRandomWord);
    //         } else {
    //             timerElement.textContent = timeLeft;
    //             timeLeft -= 1;
    //         }
    //     }, 1000);
    // }

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
                socket.send(JSON.stringify({
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
        let cirleFigure = document.getElementsByClassName('circle_header')[0];
        if (buttonReady.textContent == 'Нажмите для готовности'){
            cirleFigure.style.backgroundColor = 'green';
            buttonReady.style.color = 'green';
            buttonReady.textContent = 'Нажмите, если не готовы';
            send_socket_readiness('ready');
        } else {
            buttonReady.style.color = 'red';
            cirleFigure.style.backgroundColor = 'red';
            buttonReady.textContent = 'Нажмите для готовности';
            send_socket_readiness('not_ready');
        }
        function send_socket_readiness(are_ready) {
            socket.send(JSON.stringify({
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
        if (inpUsername.value.indexOf(' ') != -1 || inpUsername.value.length > 20 || inpUsername.value == ''){
            let usernameIsIncorrect = document.createElement('div');
            usernameIsIncorrect.classList.add('username_is_incorrect');
            usernameIsIncorrect.textContent = 'Допускается не более 20 символов и отсутствие пробелов';
            usernameIsIncorrect.style.width = `${inpUsername.offsetWidth}px`;
            inpUsername.insertAdjacentElement('afterend', usernameIsIncorrect);
            setTimeout(() => {
                usernameIsIncorrect.remove();
            }, 7000);
        } else {
            let userFound = false;
            let allUsernames = document.querySelectorAll('.current_user');
            for (let i = 0; i < allUsernames.length; i++) {
                let username = allUsernames[i];
                if (username.textContent.trim() == inpUsername.value) {
                    let usernameIsIncorrect = document.createElement('div');
                    usernameIsIncorrect.classList.add('username_is_incorrect');
                    usernameIsIncorrect.textContent = 'Пользователь с данным никнеймом уже находится в игре';
                    usernameIsIncorrect.style.width = `${inpUsername.offsetWidth}px`;
                    inpUsername.insertAdjacentElement('afterend', usernameIsIncorrect);
                    setTimeout(() => {
                        usernameIsIncorrect.remove();
                    }, 7000);
                    userFound = true;
                    break; 
                }
            } 
            if (!userFound){
                socket.send(JSON.stringify({
                    'type': 'change_username',
                    'message': inpUsername.value
                }));
                fetch('/change_username/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'username': inpUsername.value })
                }).then(response => {
                    if (response.ok) {
                        // let welcomeText = document.getElementsByClassName('welcome_header')[0];
                        nicknameLabel.textContent = inpUsername.value;
                        inpUsername.value = ''; 
                    }
                });  
            }
        };

        // if (inpUsername.value != ''){
        //     socket.send(JSON.stringify({
        //         'type': 'change_username',
        //         'message': inpUsername.value
        //     }));   
        //     fetch('/change_username/', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ 'username': inpUsername.value })
        //     }).then(response => {
        //         if (response.ok) {
        //             let welcomeText = document.getElementsByClassName('welcome_header')[0];
        //             welcomeText.textContent = 'Добро пожаловать, ' + inpUsername.value;
        //             inpUsername.value = ''; 
        //         }
        //     });  
        // }
        
        // fetch('/change_username/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ 'username': inpUsername.value })
        // }).then(response => {
        //     if (response.ok) {
        //         let welcomeText = document.getElementsByClassName('welcome_header')[0];
        //         welcomeText.textContent = 'Добро пожаловать, ' + inpUsername.value;
        //         inpUsername.value = ''; 
        //     }
        // });
    });

    chatInput.addEventListener('keydown', function(event) {
       if (event.key === 'Enter'){
          event.preventDefault();
          btnSend.click(); 
       } 
    });

    btnSend.addEventListener('click', function() {
        if (chatInput.value != ''){
            socket.send(JSON.stringify({
                'type': 'send_message',
                'message': chatInput.value
            }));
            chatInput.value = ''; 
        };
    });

    // const eraser = document.getElementsByClassName('eraser')[0];
    // eraser.addEventListener('click', function () {
    //     if (eraser.textContent == 'Стёрка'){
    //         eraser.textContent = 'Кисть';
    //         ctx.lineWidth = 15;
    //         ctx.globalCompositeOperation = "destination-out";
    //     } else {
    //         eraser.textContent = 'Стёрка';
    //         ctx.lineWidth = 1;
    //         ctx.globalCompositeOperation = "source-over";
    //     }
    // });

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.type == 'start') {
            // Начинаем новый путь
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
        } else if (data.type == 'draw') {
            // ctx.globalCompositeOperation = "destination-out";
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        } else if (data.type == 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else if (data.type == 'change_drawing_tool'){
            if (data.drawing_tool == 'eraser'){
                console.log('сейчас стёрка');
                ctx.lineWidth = 15;
                ctx.globalCompositeOperation = "destination-out";
            } else if (data.drawing_tool == 'brush') {
                let brushWidthSend;
                if (userTools.getAttribute('data-brush-width') == ''){
                    brushWidthSend = standartBrushWidth;
                } else {
                    brushWidthSend = parseFloat(userTools.getAttribute('data-brush-width'));
                }
                console.log('отправляем ширину: ', brushWidthSend);
                
                socket.send(JSON.stringify({
                    'type': 'set_brush_width',
                    'width': brushWidthSend
                }));
                ctx.globalCompositeOperation = "source-over";
            }
        } else if (data.type == 'change_brush_color') {
            ctx.strokeStyle = data.color;
        } else if (data.type == 'set_brush_color_for_all') {
            ctx.strokeStyle = data.color;
        } else if (data.type == 'set_brush_width') {
            console.log('принимаем ширину: ', data.width);
            ctx.lineWidth = Number(data.width);
            console.log('теперь ширина: ', ctx.lineWidth);
        } else if (data.type == 'move_back') {
            console.log('back', data.last_action);
            const img = new Image();
            img.src = data.last_action;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
                ctx.drawImage(img, 0, 0); // Отрисовка предыдущего 
            }
        } 

        else if (data.type == 'leader_chooses_word_timer'){
            let timerChooseWord = document.getElementsByClassName('timer_choose_word')[0];
            timerChooseWord.textContent = data.time_left
        } else if (data.type == 'show_word_for_leader'){
            presenter_choosed_word(data.word_for_guessing)
        } else if (data.type == 'start_game_timer'){
            // gameTimerAndGameStatus.textContent = '';

            // let imgForWordLeft = document.createElement('img');
            // imgForWordLeft.classList.add('icon_status');
            // imgForWordLeft.src = '/static/images/icon.png';
            // gameTimerAndGameStatus.append(imgForWordLeft);

            // gameTimerAndGameStatus.classList.add('word_for_presenter');
            // let tempWords = data.time_left_start_game_timer + ' сек.';
            // gameTimerAndGameStatus.append(tempWords);

            // let imgForWordRight = document.createElement('img');
            // imgForWordRight.classList.add('icon_status');
            // imgForWordRight.src = '/static/images/icon.png';
            // imgForWordRight.style.transform = 'scaleX(-1)';
            // gameTimerAndGameStatus.append(imgForWordRight);
            // // whatWasWordWr.style.display = 'block';
            // // timerBeforeNewGame.textContent = data.time_left_start_game_timer + ' сек.';
            timerBeforeNewGame.textContent = data.time_left_start_game_timer + ' сек.';
            gameTimerAndGameStatus.textContent = data.time_left_start_game_timer + ' сек.';
        } else if (data.type == 'clear_leader_tools'){
            canvas.style.pointerEvents = 'none';
            const word_for_presenter = document.getElementsByClassName('word_for_presenter')[0];
            const clear_button = document.getElementsByClassName('clear_button')[0];
            const eraser = document.getElementsByClassName('eraser')[0];
            const changeBrushColor  = document.getElementsByClassName('change_brush_color')[0];
            const brushWidth  = document.getElementsByClassName('brush_width')[0];
            const buttonBack  = document.getElementsByClassName('button_back')[0];
            const chatSendMessage = document.getElementsByClassName('chat_write_and_btn_send')[0];
            word_for_presenter.remove();
            clear_button.remove();
            eraser.remove();
            changeBrushColor.remove();
            brushWidth.remove();
            buttonBack.remove();
            chatSendMessage.style.display = 'flex';
            // labelLeaderAndWhatWasWord.style.display = 'block';
        } else if (data.type == 'send_message'){
            var chatMsgWr = document.createElement('div');
            chatMsgWr.classList.add('chat_msg_wr');
    
            var chatUser = document.createElement('span');
            chatUser.classList.add('chat_user');
            if (data.guess_word == 'yes'){
                chatUser.style.color = 'green';
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
        } else if (data.type == 'del_current_user'){
            let all_usernames = document.querySelectorAll('.current_user');
            all_usernames.forEach(username => {
                if (username.textContent.trim() == data.username){
                    username.nextElementSibling.remove();
                    username.remove();
                }
            });
            let allUsernamesKick = document.querySelectorAll('.username_kick');
            allUsernamesKick.forEach(username => {
                if (username.textContent.trim() == data.username){
                    username.parentElement.remove();
                }
            });
            var chatMsgWr = document.createElement('div');
            chatMsgWr.classList.add('chat_msg_wr');
    
            var chatMessage = document.createElement('span');
            chatMessage.classList.add('official_message');
            chatMessage.textContent = 'К сожалению, ';

            var username = document.createElement('span');
            username.classList.add('welcome_chat_username');
            username.textContent = data.username;

            let label = ' вынужден покинуть нас =(';

            chatMessage.append(username);
            chatMessage.append(label);

    
            chatMsgWr.appendChild(chatMessage);

    
            chatWatch.appendChild(chatMsgWr);
            chatWatch.scrollTop = chatWatch.scrollHeight;
        } else if (data.type == 'add_new_user'){
            let all_usernames = document.querySelectorAll('.current_user');
            all_usernames.forEach(username => {
                username.nextElementSibling.remove();
                username.remove();
            });
            let allUsernamesKick = document.querySelectorAll('.player_nick_kick');
            allUsernamesKick.forEach(username => {
                username.remove();
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
                let userPoints = document.createElement('span');
                userPoints.textContent = data.current_users[currentUserKey]['points'] + ' ';
                if (currentUser.textContent.trim() == data.leader_nickname) {
                    let imgIconLeader = document.createElement('img');
                    imgIconLeader.classList.add('leader_icon');
                    imgIconLeader.setAttribute('src', '/static/images/leader.png');
                    currentUser.prepend(imgIconLeader);
                }
                currentUsers.appendChild(currentUser);
                currentUsers.appendChild(userPoints);

                let buttonKickPlayer = document.createElement('button');
                buttonKickPlayer.classList.add('player_nick_kick');
 
                let usernameKick = document.createElement('span');
                usernameKick.classList.add('username_kick');
                usernameKick.textContent = currentUserKey;

                let imgPlayerKick = document.createElement('img');
                imgPlayerKick.classList.add('img_kick_player');
                imgPlayerKick.setAttribute('src', '/static/images/kick_player.png');

                buttonKickPlayer.append(usernameKick);
                buttonKickPlayer.append(imgPlayerKick);
                kickUsersList.append(buttonKickPlayer);
            }
            // const kickPlayer = document.getElementsByClassName('kick_player')[0];
            // const kickUsersList = document.getElementsByClassName('kick_users_list')[0];



            if (data.old_username){
                var chatMsgWr = document.createElement('div');
                chatMsgWr.classList.add('chat_msg_wr');
        
                var chatMessage = document.createElement('span');
                chatMessage.classList.add('official_message');
                chatMessage.textContent = data.old_username;

                var tempWord = document.createElement('span');
                tempWord.classList.add('add_word');
                tempWord.textContent =  " теперь ";

                chatMessage.append(tempWord);
                chatMessage.append(data.new_username);
    
        
                chatMsgWr.appendChild(chatMessage);

        
                chatWatch.appendChild(chatMsgWr);
                chatWatch.scrollTop = chatWatch.scrollHeight;
            }
            if (data.new_user){
                var chatMsgWr = document.createElement('div');
                chatMsgWr.classList.add('chat_msg_wr');
        
                // var chatUser = document.createElement('span');
                // chatUser.classList.add('chat_user');
                // chatUser.textContent = data.username;
        
                var chatMessage = document.createElement('span');
                chatMessage.classList.add('official_message');
                chatMessage.textContent = 'Добро пожаловать, ';
                var username = document.createElement('span');
                username.classList.add('welcome_chat_username');
                username.textContent =  data.new_user;
                chatMessage.append(username);
                chatMsgWr.appendChild(chatMessage);
                chatWatch.appendChild(chatMsgWr);
                chatWatch.scrollTop = chatWatch.scrollHeight;
            }
            
            


        } else if (data.type == 'add_points'){
            let change_points_user = document.querySelectorAll('.current_user');
            for (let i = 0; i < change_points_user.length; i++) {
                let username = change_points_user[i];
                if (username.textContent.trim() == data.username) {
                    username.nextElementSibling.textContent = data.points + ' ';
                    break; 
                }
            };
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
            // let welcomeText = document.getElementsByClassName('welcome_header')[0];
            nicknameLabel.textContent = data.username;
        } else if (data.type == 'make_leader'){
            chatInput.disabled = true;
            chatInput.placeholder = 'Вы ведущий';

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
            canvas.insertAdjacentElement('afterend', wordsForPresenter);

            // startTimerChooseWord(data.words);
        // } else if (data.type == 'guess_word') {
        //     word = data.word
        //     gameTimerAndGameStatus.textContent = 'Осталось времени: 90 сек.';
        //     if (document.getElementsByClassName('word_for_presenter')[0]){
        //         let wordForPresenter = document.getElementsByClassName('word_for_presenter')[0];
        //         // startGameTimer.style.marginTop = '20px';
        //         // wordForPresenter.insertAdjacentElement('afterend', startGameTimer);
        //     } else {
        //         // currentUsers.insertAdjacentElement('afterend', startGameTimer);
        //     }
        //     startGameTimerFun();
        } else if (data.type == 'user_guessed_word'){
            const messages = document.querySelectorAll('.chat_message');
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
            if (lastMessage) {
                lastMessage.textContent = data.word;
            }
            if (!data.is_leader){
                chatInput.placeholder = 'Поздравляем, вы угадали слово';
                chatInput.disabled = true;
            }
        } else if (data.type == 'change_status_label'){

            gameTimerAndGameStatus.textContent = '';

            let imgForWordLeft = document.createElement('img');
            imgForWordLeft.classList.add('icon_status');
            imgForWordLeft.src = '/static/images/icon.png';
            gameTimerAndGameStatus.append(imgForWordLeft);
            
            gameTimerAndGameStatus.append(data.message_status);

            let imgForWordRight = document.createElement('img');
            imgForWordRight.classList.add('icon_status');
            imgForWordRight.src = '/static/images/icon.png';
            imgForWordRight.style.transform = 'scaleX(-1)';
            gameTimerAndGameStatus.append(imgForWordRight);

            labelLeaderAndWhatWasWord.textContent = data.message_status_2;
            
            chatInput.disabled = false;
            chatInput.placeholder = 'Угадайте слово';

            // var img_chat_check_mark = document.createElement('img');
            //     img_chat_check_mark.classList.add('img_check_mark');
            //     img_chat_check_mark.setAttribute('src', '/static/images/check_mark.png');
            //     chatMsgWr.appendChild(img_chat_check_mark);
            if (data.message_status_2.includes('Угадываемое слово')){
                const leaderIcon = document.getElementsByClassName('leader_icon')[0];
                leaderIcon.remove();
                whatWasWord.textContent = data.message_status_2.replace('Угадываемое слово: ', '');
                if (data.message_status == 'Статус: ожидание готовности игроков'){
                    timerBeforeNewGame.textContent = 'Ожидание готовности игроков';
                }
                whatWasWordWr.style.display = 'block';
            } else {
                whatWasWordWr.style.display = 'none';
                let allUsers = document.querySelectorAll('.current_user');
                let imgIconLeader = document.createElement('img');
                imgIconLeader.classList.add('leader_icon');
                imgIconLeader.setAttribute('src', '/static/images/leader.png');
                for (let i = 0; i < allUsers.length; i++) {
                    let username = allUsers[i];
                    if (username.textContent.trim() == data.message_status_2) {
                        username.prepend(imgIconLeader);
                        break; 
                    }
                };
            }

            
        } 
    };

    canvas.addEventListener('touchstart', function(event) { 
        event.preventDefault(); 
    }, { passive: false });
    
    canvas.addEventListener('touchmove', function(event) { 
        event.preventDefault(); 
    }, { passive: false });
    
// });




