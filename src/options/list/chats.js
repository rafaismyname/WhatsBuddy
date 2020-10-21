import * as storage from '../../helpers/storage';
import { onDocumentReady, onClick, onChange } from '../../helpers/events';

const HIDE_CHAT_SWITCH_SELECTOR = 'input#whatsbuddy-hide-chat-enabled';
const HIDE_CHAT_STATUS_SELECTOR = 'span#whatsbuddy-hide-chat-status';
const CHATS_CONTAINER_SELECTOR = '#whatsbuddy-chats';
const HIDDEN_CHATS_CONTAINER_SELECTOR = '#whatsbuddy-hidden-chats';

let state = {
  chats: [],
  enableHideChats: true,
  hiddenChats: [],
};

const renderHideChatEnableSwitch = () => {
  const enableSwitch = document.querySelector(HIDE_CHAT_SWITCH_SELECTOR);
  enableSwitch.checked = state.enableHideChats;

  const enableStatus = document.querySelector(HIDE_CHAT_STATUS_SELECTOR);
  enableStatus.innerHTML = state.enableHideChats ? 'Enabled' : 'Disabled';
};

const toggleHideChatEnableSwitch = () => {
  const enabled = state.enableHideChats;
  state = { ...state, enableHideChats: !enabled };

  renderHideChatEnableSwitch();
};

onChange(HIDE_CHAT_SWITCH_SELECTOR, () => toggleHideChatEnableSwitch());

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

const renderChatList = () => {
  const { chats, hiddenChats } = state;
  const filteredChats = chats.filter((chat) => !hiddenChats.includes(chat.id));
  filteredChats.forEach((chat) => insertChat(chat, chats));
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

const renderHiddenChatList = () => {
  const { chats, hiddenChats } = state;
  hiddenChats.forEach((chatId) => {
    const chat = chats.find((c) => c.id === chatId) || { id: chatId };
    insertHiddenChat(chat, chats);
  });
};

const serializeHiddenChatList = () => {
  const chatsContainer = document.querySelector(HIDDEN_CHATS_CONTAINER_SELECTOR);
  const hiddenList = chatsContainer.querySelectorAll('tr td:last-child');

  return ([...hiddenList]).map((node) => node.dataset.chatId);
};

export const save = () => {
  const hiddenChats = serializeHiddenChatList();

  state = { ...state, hiddenChats };

  return storage.save(state);
};

onDocumentReady(() => {
  storage.get(state)
    .then((response) => {
      state = { ...state, ...response };
    })
    .then(() => renderHideChatEnableSwitch())
    .then(() => renderChatList())
    .then(() => renderHiddenChatList());
});

export default {};
