const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessagesForm = document.querySelector('#add-messages-form');
const userNameInput = loginForm.querySelector('#username');
const messageContentInput = addMessagesForm.querySelector('#message-content');
const socket = io();
let userName; 

socket.on('message', ({author, content}) => addMessage(author, content));

const login = (e) => {
  e.preventDefault();
  if(userNameInput.value.length) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('login', userName);
  } else {
    window.alert('Please enter your name');
  }
}

const sendMessage = (e) => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if(messageContent.length) {
    addMessage(userName, messageContent);
    socket.emit('message', {author: userName, content: messageContent});
    messageContentInput.value = '';
  } else {
    window.alert('Add message to send');
  }
}

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName)
    message.classList.add('message--self');

  if(author === 'Chat Bot')
    message.classList.add('message--system');
  
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;

  messagesList.appendChild(message);
}

loginForm.addEventListener('submit', (e) => {
  login(e);
});

addMessagesForm.addEventListener('submit', (e) => {
  sendMessage(e);
});
