document.addEventListener('DOMContentLoaded', function() {
    const actionRoomButton = document.getElementsByClassName('action_room_button')[0];
    const SM_pass_input = document.getElementsByClassName('SM_pass_input')[0];
    // const content = document.getElementsByClassName('start_menu_wr')[0];
    const target = actionRoomButton.getAttribute('data-target');
    const body = document.body;
    const newScript = '/static/script.js';
    
    actionRoomButton.addEventListener('click', function() {
        checkPass();
        // const response = await fetch(target);
        // const newContent = await response.text();
        // const tempDiv = document.createElement('div');
        // tempDiv.innerHTML = newContent;
        // const newHeaderContent = tempDiv.getElementsByClassName('header')[0].outerHTML;
        // const newBodyContent = tempDiv.getElementsByClassName('main')[0].cloneNode(true);
        // post(SM_pass_input.value);
        // body.innerHTML = newHeaderContent;
        // const getHeader = document.getElementsByClassName('header')[0];
        // getHeader.insertAdjacentElement('afterend', newBodyContent);
        // loadScript(newScript);
    })

    function loadScript(url) {
        const script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }
    
    function createUserRoom() {
        fetch('/action_with_room/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                'room_status': 'create_user_room',
                'room_password': SM_pass_input.value,
             })
        }).then(response => {
            if (response.ok) {
            }
        });  
    }

    function checkPass() {
        fetch('/check_room_with_pass/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'password': SM_pass_input.value })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let message = '';
            if (data.message == 'Комната не найдена'){
                connectRoom();
            }
            else if (data.message === 'Комната найдена'){
                message = 'Комната с данным паролем уже существует';
                createMessage(message);
            }
            else{
                message = 'Произошла ошибка, пожалуйста, повторите ещё раз';
                createMessage(message);
            }
            
        })
        .catch(error => {
            message = 'Произошла ошибка, пожалуйста, повторите ещё раз';
            createMessage(message);
        }); 
    }

    function createMessage(message) {
        let messageSm = document.getElementsByClassName('message_SM')[0];
        if (!messageSm){
            messageSm = document.createElement('div');
            messageSm.classList.add('message_SM');
            messageSm.textContent = message;
            SM_pass_input.insertAdjacentElement('afterend', messageSm);
        }
        else{
            messageSm.textContent = message;
        }
    }

    async function connectRoom() {
        createUserRoom();
        const response = await fetch(target);
        const newContent = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newContent;
        const newHeaderContent = tempDiv.getElementsByClassName('header')[0].outerHTML;
        const newBodyContent = tempDiv.getElementsByClassName('main')[0].cloneNode(true);
        body.innerHTML = newHeaderContent;
        const getHeader = document.getElementsByClassName('header')[0];
        getHeader.insertAdjacentElement('afterend', newBodyContent);
        loadScript(newScript);
    }
});

