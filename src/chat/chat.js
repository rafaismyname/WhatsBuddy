import * as storage from '../helpers/storage';
import { onChatOpen } from '../helpers/events';

const MESSAGE_INPUT_SELECTOR = '#main footer div[contenteditable]';
const SEND_BUTTON_CHILD_SELECTOR = '#main footer button span[data-icon=send]';
const CHAT_FOOTER_SELECTOR = '#main div[data-asset-chat-background] ~ footer';

const TOOLS_CONTAINER_ID = 'whatsbuddy-tools-container';
const TOOLS_BUTTON_CLASSNAME = 'whatsbuddy-tools-button';
const MACROS_CONTAINER_ID = 'whatsbuddy-macros-container';
const MACRO_BUTTON_CLASSNAME = 'whatsbuddy-macros-button';
const BOLD_BUTTON_ID = 'whatsbuddy-bold-button';
const ITALIC_BUTTON_ID = 'whatsbuddy-italic-button';
const STRIKE_BUTTON_ID = 'whatsbuddy-strike-button';
const MONOSPACE_BUTTON_ID = 'whatsbuddy-monospace-button';

const chatMacros = [];

const sendMessage = () => {
  setTimeout(() => {
    const sendButtonSpan = document.querySelector(SEND_BUTTON_CHILD_SELECTOR);
    if (!sendButtonSpan) return false;

    const sendButton = sendButtonSpan.parentNode;

    const clickEvent = new MouseEvent('click', { bubbles: true });
    sendButton.dispatchEvent(clickEvent);

    return true;
  }, 0);
};

const insertMessageText = (text, autoSend = false) => {
  const messageInput = document.querySelector(MESSAGE_INPUT_SELECTOR);
  if (!messageInput) return false;

  return setTimeout(() => {
    messageInput.innerHTML = text;

    const focusEvent = new FocusEvent('focus', { bubbles: true });
    messageInput.dispatchEvent(focusEvent);

    const inputEvent = new InputEvent('input', { bubbles: true });
    messageInput.dispatchEvent(inputEvent);

    if (autoSend) sendMessage();
  }, 0);
};

const formatSelectedText = (wrapper) => {
  const selection = window.getSelection();
  if (!selection.rangeCount || !selection.anchorNode.data) return false;

  const content = selection.anchorNode.data;
  const contentLength = selection.anchorNode.length;
  const range = selection.getRangeAt(0);

  const preContent = content.substr(0, range.startOffset);
  const replacedContent = (wrapper + selection.toString() + wrapper);
  const postContent = content.substr(range.endOffset, contentLength);

  const replacementText = (preContent + replacedContent + postContent);

  return insertMessageText(replacementText);
};

const chatOpenCallback = () => {
  const toolsContainer = document.createElement('div');
  toolsContainer.id = TOOLS_CONTAINER_ID;

  const macrosContainer = document.createElement('div');
  macrosContainer.id = MACROS_CONTAINER_ID;

  chatMacros.forEach(({ name, message }) => {
    const macroButton = document.createElement('button');
    macroButton.className = `${TOOLS_BUTTON_CLASSNAME} ${MACRO_BUTTON_CLASSNAME}`;
    macroButton.innerHTML = name;
    macroButton.dataset.message = message;

    macroButton.addEventListener('click', (event) => {
      const buttonMessage = event.target.dataset.message;
      insertMessageText(buttonMessage);
    });

    macrosContainer.appendChild(macroButton);
  });

  const boldButton = document.createElement('button');
  boldButton.id = BOLD_BUTTON_ID;
  boldButton.className = TOOLS_BUTTON_CLASSNAME;
  boldButton.innerHTML = '<strong>B</strong>';
  boldButton.title = 'Bold';
  boldButton.addEventListener('click', () => formatSelectedText('*'));

  macrosContainer.appendChild(boldButton);

  const italicButton = document.createElement('button');
  italicButton.id = ITALIC_BUTTON_ID;
  italicButton.className = TOOLS_BUTTON_CLASSNAME;
  italicButton.innerHTML = '<em>I</em>';
  italicButton.title = 'Italic';
  italicButton.addEventListener('click', () => formatSelectedText('_'));

  macrosContainer.appendChild(italicButton);

  const strikeButton = document.createElement('button');
  strikeButton.id = STRIKE_BUTTON_ID;
  strikeButton.className = TOOLS_BUTTON_CLASSNAME;
  strikeButton.innerHTML = '<del>S</del>';
  strikeButton.title = 'Strikethrough';
  strikeButton.addEventListener('click', () => formatSelectedText('~'));

  macrosContainer.appendChild(strikeButton);

  const monospaceButton = document.createElement('button');
  monospaceButton.id = MONOSPACE_BUTTON_ID;
  monospaceButton.className = TOOLS_BUTTON_CLASSNAME;
  monospaceButton.innerHTML = '<code>M</code>';
  monospaceButton.title = 'Monospace';
  monospaceButton.addEventListener('click', () => formatSelectedText('```'));

  macrosContainer.appendChild(monospaceButton);

  toolsContainer.appendChild(macrosContainer);

  const footerContainer = document.querySelector(CHAT_FOOTER_SELECTOR);
  footerContainer.insertBefore(toolsContainer, footerContainer.firstChild);
};

const storageParams = { macrosEnabled: true, macros: [] };
storage.get(storageParams).then(({ macrosEnabled, macros }) => {
  if (!macrosEnabled) return;

  chatMacros.push(...macros);

  onChatOpen(() => chatOpenCallback());
});
