const MESSAGE_INPUT_PATH = '#main footer div[contenteditable]';
const SEND_BUTTON_CHILD_PATH = '#main footer button span[data-icon=send]';
const CHAT_CONTAINER_PATH = '#main div[data-asset-chat-background]';
const CHAT_FOOTER_PATH = '#main div[data-asset-chat-background] ~ footer';

const TOOLS_CONTAINER_ID = 'whatsbuddy-tools-container';
const MACROS_CONTAINER_ID = 'whatsbuddy-macros-container';
const MACRO_BUTTON_CLASSNAME = 'whatsbuddy-macros-button';

const chatMacros = {
  ola: 'opa! bao?',
  test: 'testando umas paradas aqui',
};

const sendMessage = () => {
  setTimeout(() => {
    const sendButtonSpan = document.querySelector(SEND_BUTTON_CHILD_PATH);
    if (!sendButtonSpan) return true;

    const sendButton = sendButtonSpan.parentNode;

    const clickEvent = new MouseEvent('click', { bubbles: true });
    sendButton.dispatchEvent(clickEvent);

    return true;
  }, 0);
};

const insertMessageText = (text, autoSend = false) => {
  const messageInput = document.querySelector(MESSAGE_INPUT_PATH);
  if (!messageInput) return true;

  return setTimeout(() => {
    messageInput.innerHTML = text; // eslint-disable-line

    const focusEvent = new FocusEvent('focus', { bubbles: true });
    messageInput.dispatchEvent(focusEvent);

    const inputEvent = new InputEvent('input', { bubbles: true });
    messageInput.dispatchEvent(inputEvent);

    if (autoSend) sendMessage();
  }, 0);
};

const onChatOpen = () => {
  const toolsContainer = document.createElement('div');
  toolsContainer.id = TOOLS_CONTAINER_ID;
  toolsContainer.style.width = '100%';
  toolsContainer.style.height = 'auto';

  const macrosContainer = document.createElement('div');
  macrosContainer.id = MACROS_CONTAINER_ID;

  Object.keys(chatMacros).forEach((macro) => {
    const message = chatMacros[macro];

    const macroButton = document.createElement('button');
    macroButton.className = MACRO_BUTTON_CLASSNAME;
    macroButton.innerHTML = macro;
    macroButton.dataset.message = message;

    macroButton.addEventListener('click', (event) => {
      const buttonMessage = event.target.dataset.message;
      insertMessageText(buttonMessage);
    });

    macrosContainer.appendChild(macroButton);
  });

  toolsContainer.appendChild(macrosContainer);

  const footerContainer = document.querySelector(CHAT_FOOTER_PATH);
  footerContainer.insertBefore(toolsContainer, footerContainer.firstChild);
};

const onNodeInserted = (element) => {
  if (element.target.id !== 'main') return true;

  const chatContainer = document.querySelector(CHAT_CONTAINER_PATH);
  if (!chatContainer) return true;

  onChatOpen();

  return true;
};

document.addEventListener('DOMNodeInserted', onNodeInserted, false);
