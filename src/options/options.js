import * as storage from '../helpers/storage';
import { onDocumentReady, onClick } from '../helpers/events';

const MACROS_CONTAINER_SELECTOR = '#whatsbuddy-options-macros';
const ADD_MACRO_BUTTON_SELECTOR = '#whatsbuddy-options-add-macro';
const MACRO_CONTAINER_CLASSNAME = 'whatsbuddy-options-macro';
const MACRO_NAME_INPUT_CLASSNAME = 'whatsbuddy-options-macro-name form-input input-lg';
const MACRO_NAME_INPUT_SELECTOR = 'input.whatsbuddy-options-macro-name';
const MACRO_MESSAGE_INPUT_CLASSNAME = 'whatsbuddy-options-macro-message form-input input-lg';
const MACRO_MESSAGE_INPUT_SELECTOR = 'input.whatsbuddy-options-macro-message';
const MACRO_DELETE_BUTTON_CLASSNAME = 'whatsbuddy-options-macro-delete btn btn-error';
const OPTIONS_SUCCESS_POPUP_SELECTOR = '#whatsbuddy-options-success';
const OPTIONS_SUCCESS_POPUP_CLASSNAME = 'whatsbuddy-options-success toast toast-success text-center';
const OPTIONS_SAVE_BUTTON_SELECTOR = '#whatsbuddy-options-save';
const CHATS_CONTAINER_SELECTOR = '#whatsbuddy-chats';
const HIDDEN_CHATS_CONTAINER_SELECTOR = '#whatsbuddy-hidden-chats';

const insertMacro = (name = null, message = null) => {
  const macrosContainer = document.querySelector(MACROS_CONTAINER_SELECTOR);

  const macroContainer = document.createElement('tr');
  macroContainer.className = MACRO_CONTAINER_CLASSNAME;

  const macroNameContainer = document.createElement('td');
  const macroNameInput = document.createElement('input');
  macroNameInput.className = MACRO_NAME_INPUT_CLASSNAME;
  if (name !== null) {
    macroNameInput.value = name;
  }
  macroNameContainer.appendChild(macroNameInput);

  macroContainer.appendChild(macroNameContainer);

  const macroMessageContainer = document.createElement('td');
  const macroMessageInput = document.createElement('input');
  macroMessageInput.className = MACRO_MESSAGE_INPUT_CLASSNAME;
  if (message !== null) {
    macroMessageInput.value = message;
  }
  macroMessageContainer.appendChild(macroMessageInput);

  macroContainer.appendChild(macroMessageContainer);

  const macroDeleteContainer = document.createElement('td');
  const macroDeleteButton = document.createElement('button');
  macroDeleteButton.className = MACRO_DELETE_BUTTON_CLASSNAME;
  macroDeleteButton.innerHTML = '<i class="icon icon-cross"></i>';
  onClick(macroDeleteButton, () => {
    macrosContainer.removeChild(macroContainer);
  });
  macroDeleteContainer.appendChild(macroDeleteButton);

  macroContainer.appendChild(macroDeleteContainer);

  macrosContainer.appendChild(macroContainer);
};

const renderMacros = (macros) => {
  macros.forEach(({ name, message }) => insertMacro(name, message));
};

const insertChat = (chatName) => {
  const chatsContainer = document.querySelector(CHATS_CONTAINER_SELECTOR);

  const chatContainer = document.createElement('tr');

  const nameContainer = document.createElement('td');
  nameContainer.innerHTML = chatName;

  chatContainer.appendChild(nameContainer);

  const hideContainer = document.createElement('td');
  const hideButton = document.createElement('button');
  hideButton.innerHTML = '<i class="icon icon-arrow-right"></i>';
  hideButton.className = 'btn btn-error';
  onClick(hideButton, () => {
    chatsContainer.removeChild(chatContainer);
    insertHiddenChat(chatName); // eslint-disable-line
  });
  hideContainer.appendChild(hideButton);

  chatContainer.appendChild(hideContainer);

  chatsContainer.appendChild(chatContainer);
};

const insertHiddenChat = (chatName) => {
  const chatsContainer = document.querySelector(HIDDEN_CHATS_CONTAINER_SELECTOR);

  const chatContainer = document.createElement('tr');

  const showContainer = document.createElement('td');
  const showButton = document.createElement('button');
  showButton.innerHTML = '<i class="icon icon-arrow-left"></i>';
  showButton.className = 'btn btn-success';
  onClick(showButton, () => {
    chatsContainer.removeChild(chatContainer);
    insertChat(chatName);
  });
  showContainer.appendChild(showButton);

  chatContainer.appendChild(showContainer);

  const nameContainer = document.createElement('td');
  nameContainer.className = 'text-right';
  nameContainer.innerHTML = chatName;

  chatContainer.appendChild(nameContainer);

  chatsContainer.appendChild(chatContainer);
};

const renderChats = (chats, hiddenChats) => {
  const chatNames = chats.map(chat => chat.name);

  const filteredChats = chatNames.filter(chatName => !hiddenChats.includes(chatName));
  filteredChats.forEach(insertChat);

  hiddenChats.forEach(insertHiddenChat);
};

const serializeMacros = () => {
  const macrosContainers = document.querySelectorAll(`${MACROS_CONTAINER_SELECTOR} .${MACRO_CONTAINER_CLASSNAME}`);

  const rawMacros = ([...macrosContainers]).map((macroContainer) => {
    const macroNameInput = macroContainer.querySelector(MACRO_NAME_INPUT_SELECTOR);
    const name = macroNameInput.value;

    const macroMessageInput = macroContainer.querySelector(MACRO_MESSAGE_INPUT_SELECTOR);
    const message = macroMessageInput.value;

    return { name, message };
  });

  const macros = rawMacros.filter((macro) => {
    const { name, message } = macro;

    return (name.trim() !== '' && message.trim() !== '');
  });

  return macros;
};

const serializeHiddenChats = () => {
  const chatsContainer = document.querySelector(HIDDEN_CHATS_CONTAINER_SELECTOR);
  const hiddenList = chatsContainer.querySelectorAll('tr td:last-child');

  return ([...hiddenList]).map(node => node.innerText);
};

const serializeOptions = () => {
  const macros = serializeMacros();
  const hiddenChats = serializeHiddenChats();

  return { macros, hiddenChats };
};

const successPopup = () => {
  const footer = document.querySelector(OPTIONS_SUCCESS_POPUP_SELECTOR);

  const previousMessage = footer.getElementsByClassName(OPTIONS_SUCCESS_POPUP_CLASSNAME);
  if (previousMessage && previousMessage[0]) {
    footer.removeChild(previousMessage[0]);
  }

  const successMessage = document.createElement('div');
  successMessage.className = OPTIONS_SUCCESS_POPUP_CLASSNAME;
  successMessage.innerHTML = 'Options saved!';

  setTimeout(() => successMessage && footer.removeChild(successMessage), 10000);

  footer.appendChild(successMessage);
};

const saveOptions = () => {
  const options = serializeOptions();

  storage.save(options).then(() => successPopup());
};

onClick(ADD_MACRO_BUTTON_SELECTOR, () => insertMacro());

onClick(OPTIONS_SAVE_BUTTON_SELECTOR, () => saveOptions());

onDocumentReady(() => {
  const storageParams = { macros: [], chats: [], hiddenChats: [] };
  storage.get(storageParams).then(({ macros, chats, hiddenChats }) => {
    renderMacros(macros);
    renderChats(chats, hiddenChats);
  });
});
