import * as storage from '../../helpers/storage';
import { onDocumentReady, onClick } from '../../helpers/events';

const CHATS_CONTAINER_SELECTOR = '#whatsbuddy-chats';
const HIDDEN_CHATS_CONTAINER_SELECTOR = '#whatsbuddy-hidden-chats';

const insertChat = (chat, chats) => {
  const chatsContainer = document.querySelector(CHATS_CONTAINER_SELECTOR);

  const chatContainer = document.createElement('tr');

  const nameContainer = document.createElement('td');
  nameContainer.innerHTML = chat.name;
  nameContainer.dataset.chatId = chat.id;

  chatContainer.appendChild(nameContainer);

  const hideContainer = document.createElement('td');
  const hideButton = document.createElement('button');
  hideButton.innerHTML = '<i class="icon icon-arrow-right"></i>';
  hideButton.className = 'btn btn-error';
  onClick(hideButton, () => {
    chatsContainer.removeChild(chatContainer);
    insertHiddenChat(chat, chats); // eslint-disable-line
  });
  hideContainer.appendChild(hideButton);

  chatContainer.appendChild(hideContainer);

  chatsContainer.appendChild(chatContainer);
};

const insertHiddenChat = (chat, chats) => {
  const chatsContainer = document.querySelector(HIDDEN_CHATS_CONTAINER_SELECTOR);

  const chatContainer = document.createElement('tr');

  const showContainer = document.createElement('td');
  const showButton = document.createElement('button');
  showButton.innerHTML = '<i class="icon icon-arrow-left"></i>';
  showButton.className = 'btn btn-success';
  onClick(showButton, () => {
    chatsContainer.removeChild(chatContainer);
    insertChat(chat, chats);
  });
  showContainer.appendChild(showButton);

  chatContainer.appendChild(showContainer);

  const nameContainer = document.createElement('td');
  nameContainer.className = 'text-right';
  nameContainer.innerHTML = chat.name || chat.id;
  nameContainer.dataset.chatId = chat.id;

  chatContainer.appendChild(nameContainer);

  chatsContainer.appendChild(chatContainer);
};

export const render = (chats, hiddenChats) => {
  const filteredChats = chats.filter(chat => !hiddenChats.includes(chat.id));
  filteredChats.forEach(chat => insertChat(chat, chats));

  hiddenChats.forEach((chatId) => {
    const chat = chats.find(c => c.id === chatId) || { id: chatId };
    insertHiddenChat(chat, chats);
  });
};

export const serialize = () => {
  const chatsContainer = document.querySelector(HIDDEN_CHATS_CONTAINER_SELECTOR);
  const hiddenList = chatsContainer.querySelectorAll('tr td:last-child');

  return ([...hiddenList]).map(node => node.dataset.chatId);
};

onDocumentReady(() => {
  const storageParams = { chats: [], hiddenChats: [] };
  storage.get(storageParams).then(({ chats, hiddenChats }) => {
    render(chats, hiddenChats);
  });
});
