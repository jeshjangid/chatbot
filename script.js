let apikey = 'your_api_key';
let input = document.getElementById('input');
let inputIcon = document.getElementById('inputIcon');
let footer = document.getElementsByClassName('footer');
let button = document.querySelectorAll('.button')

inputIcon.addEventListener('click', () => {
    if (input.value == '') {
        input.placeholder = 'type something...'
        setTimeout(() => {
            input.placeholder = 'search...'
        }, 2000);
    } else {
        document.getElementsByClassName('loader')[0].style.display = 'flex';
        runMessage(input.value);
    }
})

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (input.value == '') {
            input.placeholder = 'type something...'
            setTimeout(() => {
                input.placeholder = 'search...'
            }, 2000);
        } else {
            document.getElementsByClassName('loader')[0].style.display = 'flex';
            runMessage(input.value);
        }
    }
})

let selectLang = () => {
    Array.from(button).forEach((el) => {
        el.classList.remove('lan')
    })
}

Array.from(button).forEach((el) => {
    el.addEventListener('click', () => {
        selectLang();
        el.classList.add('lan')
    })
})
let runMessage = (msg) => {
    let len = document.getElementsByClassName('lan')[0].innerText;
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apikey}`,
        },
        body: JSON.stringify({
            // model: 'text-davinci-003',
            model: 'gpt-3.5-turbo',
            // prompt: msg + 'in' + len,
            messages: [{ role: 'user', content: msg + 'in' + len }],
            // max_tokens: 3000,
            temperature: 1,
        })
    }).then((Response) => Response.json())

        .then((result) => {
            console.log(msg)
            console.log(result)
            messageBx(msg, result.choices[0].message.content)
            document.getElementsByClassName('loader')[0].style.display = 'none';
        }).catch((err) => {
            document.getElementsByClassName('loader')[0].innerHTML = 'Not Found';
        }).finally((done) => {
            input.value = '';
        })
}

let count = 0
let messageBx = (mess, res) => {
    let myMessageBx = document.createElement('div');
    myMessageBx.classList.add('user');
    let myMessage = document.createElement('p');
    myMessage.innerText = mess;
    myMessageBx.append(myMessage);
    document.getElementById('chatBody').append(myMessageBx);


    let ansMessageBx = document.createElement('div');
    ansMessageBx.classList.add('ans');
    let ansMessage = document.createElement('p');
    ansMessage.innerText = res;
    ansMessage.id = 'ans' + count;
    let copyIcon = document.createElement('iconify-icon');

    copyIcon.classList.add('icon')
    ansMessageBx.append(ansMessage)
    ansMessage.append(copyIcon)
    copyIcon.icon = 'solar:copy-linear'
    copyIcon.id = 'copy' + count
    ansMessageBx.append(ansMessage);
    document.getElementById('chatBody').append(ansMessageBx);


    copyIcon.onclick = () => {
        inputCopy(ansMessage.id);
        copyIcon.icon = 'solar:copy-bold';
        setTimeout(() => {
            copyIcon.icon = 'solar:copy-linear';
        }, 2500);
    }

    count++;
}

let inputCopy = (id) => {
    let message = document.getElementById(id).innerText;
    navigator.clipboard.writeText(message)
}