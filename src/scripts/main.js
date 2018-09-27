import * as storage from './utils/storage';
import { onDocumentReady, onChatOpen } from './utils/events';

import '../styles/main.scss';

const MESSAGE_INPUT_SELECTOR = '#main footer div[contenteditable]';
const SEND_BUTTON_CHILD_SELECTOR = '#main footer button span[data-icon=send]';
const CHAT_FOOTER_SELECTOR = '#main div[data-asset-chat-background] ~ footer';

const TOOLS_CONTAINER_ID = 'whatsbuddy-tools-container';
const MACROS_CONTAINER_ID = 'whatsbuddy-macros-container';
const MACRO_BUTTON_CLASSNAME = 'whatsbuddy-macros-button';

const chatMacros = [];

const sendMessage = () => {
  setTimeout(() => {
    const sendButtonSpan = document.querySelector(SEND_BUTTON_CHILD_SELECTOR);
    if (!sendButtonSpan) return true;

    const sendButton = sendButtonSpan.parentNode;

    const clickEvent = new MouseEvent('click', { bubbles: true });
    sendButton.dispatchEvent(clickEvent);

    return true;
  }, 0);
};

const insertMessageText = (text, autoSend = false) => {
  const messageInput = document.querySelector(MESSAGE_INPUT_SELECTOR);
  if (!messageInput) return true;

  return setTimeout(() => {
    messageInput.innerHTML = text;

    const focusEvent = new FocusEvent('focus', { bubbles: true });
    messageInput.dispatchEvent(focusEvent);

    const inputEvent = new InputEvent('input', { bubbles: true });
    messageInput.dispatchEvent(inputEvent);

    if (autoSend) sendMessage();
  }, 0);
};

onChatOpen(() => {
  const toolsContainer = document.createElement('div');
  toolsContainer.id = TOOLS_CONTAINER_ID;

  const macrosContainer = document.createElement('div');
  macrosContainer.id = MACROS_CONTAINER_ID;

  chatMacros.forEach(({ name, message }) => {
    const macroButton = document.createElement('button');
    macroButton.className = MACRO_BUTTON_CLASSNAME;
    macroButton.innerHTML = name;
    macroButton.dataset.message = message;

    macroButton.addEventListener('click', (event) => {
      const buttonMessage = event.target.dataset.message;
      insertMessageText(buttonMessage);
    });

    macrosContainer.appendChild(macroButton);
  });

  toolsContainer.appendChild(macrosContainer);

  const footerContainer = document.querySelector(CHAT_FOOTER_SELECTOR);
  footerContainer.insertBefore(toolsContainer, footerContainer.firstChild);
});

onDocumentReady(() => {
  const storageParams = { macros: [] };
  storage.get(storageParams).then(({ macros }) => chatMacros.push(...macros));
});
