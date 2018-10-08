import * as storage from '../helpers/storage';
import { onClick } from '../helpers/events';
import { save as saveMacros } from './chat/macros';
import { serialize as serializeHiddenChats } from './list/chats';

const OPTIONS_SUCCESS_POPUP_SELECTOR = '#whatsbuddy-options-success';
const OPTIONS_SUCCESS_POPUP_CLASSNAME = 'whatsbuddy-options-success toast toast-success text-center';
const OPTIONS_SAVE_BUTTON_SELECTOR = '#whatsbuddy-options-save';

const serializeOptions = () => {
  const hiddenChats = serializeHiddenChats();

  return { hiddenChats };
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

  saveMacros()
    .then(() => storage.save(options))
    .then(() => successPopup());
};

onClick(OPTIONS_SAVE_BUTTON_SELECTOR, () => saveOptions());
