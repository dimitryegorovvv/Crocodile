document.addEventListener('DOMContentLoaded', function() {   
    // const url = 'ws://' + '127.0.0.1:8001';
    // const socket = new WebSocket(url + '/ws/draw/');
    const buttonConnect = document.getElementsByClassName('room_button')[0];
    const target = buttonConnect.getAttribute('data-target');
    const body = document.body;
    const inpUsernameSM = document.getElementsByClassName('SM_username_input')[0];
    // const newScript_jquerry = '/static/jquery-3.7.1.min.js';
    const newScript_jquerry = 'https://code.jquery.com/jquery-3.6.0.min.js';
    const newScript_farbtastic = '/static/farbtastic.js';
    const newScript = '/static/script.js';
    const cssUrl = 'static/farbtastic.css';
    const newPages = document.querySelectorAll('.room_button');

    newPages.forEach(newPage => {
        newPage.addEventListener('click', function(event) {
            const target = event.target;
            event.preventDefault();
            fetch('/change_username/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     'username': inpUsernameSM.value,
                })
            }).then(response => {
                if (response.ok) {
                    if (target.classList.contains('begin_game')){
                        randomGameConnect();
                    } else if (target.classList.contains('create_room')){
                        window.location.href = target.href;
                    } else if (target.classList.contains('join_room')){
                        window.location.href = target.href;
                    }   
                }
                else{
                    createMessage('Никнейм содержит более 20 символов и/или пробел(ы)');
                }
            });  
        })
    });

    async function randomGameConnect() {
        joinRandomRoom();
        const response = await fetch(target);
        const newContent = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newContent;
        const newHeaderContent = tempDiv.getElementsByClassName('header')[0].outerHTML;
        const newBodyContent = tempDiv.getElementsByClassName('main')[0].cloneNode(true);
        body.innerHTML = newHeaderContent;
        const getHeader = document.getElementsByClassName('header')[0];
        getHeader.insertAdjacentElement('afterend', newBodyContent);
        addCSSFile(cssUrl);
        // loadScripts()
        try {
            await loadScript(newScript);
            await loadScript(newScript_jquerry);

            await loadScript(newScript_farbtastic);
    
            // $('#colorpicker').farbtastic('#color'); // Пример использования Farbtastic
        } catch (error) {
            console.error('Ошибка:', error); // Обработка ошибок загрузки
        }
    }

    function loadScript(url) {
        // return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            // script.onload = () => resolve();  // Скрипт успешно загружен
            // script.onerror = () => reject(new Error(`Ошибка загрузки скрипта: ${url}`));
            document.head.appendChild(script);
        // });
    }

    function loadScripts() {
        loadScript(newScript);
        loadScript_2(newScript_jquerry);
        loadScript_3(newScript_farbtastic);
    }

    buttonConnect.addEventListener('click', async function () {
        // joinRandomRoom();
        // const response = await fetch(target);
        // const newContent = await response.text();
        // const tempDiv = document.createElement('div');
        // tempDiv.innerHTML = newContent;
        // const newHeaderContent = tempDiv.getElementsByClassName('header')[0].outerHTML;
        // const newBodyContent = tempDiv.getElementsByClassName('main')[0].cloneNode(true);
        // body.innerHTML = newHeaderContent;
        // const getHeader = document.getElementsByClassName('header')[0];
        // getHeader.insertAdjacentElement('afterend', newBodyContent);
        // addCSSFile(cssUrl);
        // loadScript(newScript);
        // loadScript_2(newScript_jquerry);
        // loadScript_3(newScript_farbtastic);
    })

    function addCSSFile(cssUrl) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssUrl;
        document.head.appendChild(link);
    }

    function loadScript(url) {
        const script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }
    function loadScript_2(url) {
        const script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }
    function loadScript_3(url) {
        const script = document.createElement('script');
        script.src = url;
        // script.defer = true;
        document.head.appendChild(script);
    }
    
    
    function joinRandomRoom(){
        fetch('/action_with_room/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                 'room_status': 'join_random_room',
            })
        }).then(response => {
            if (response.ok) {
            }
        });  
    };

    function createMessage(message) {
        let messageSm = document.getElementsByClassName('message_SM')[0];
        if (!messageSm){
            messageSm = document.createElement('div');
            messageSm.classList.add('message_SM');
            messageSm.textContent = message;
            inpUsernameSM.insertAdjacentElement('afterend', messageSm);
        }
        else{
            messageSm.textContent = message;
        }
    }
});

