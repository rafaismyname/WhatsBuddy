import { onClick } from '../helpers/events';
import { save as saveChat } from './chat/macros';
import { save as saveList } from './list/chats';

const OPTIONS_SUCCESS_POPUP_SELECTOR = '#whatsbuddy-options-success';
const OPTIONS_SUCCESS_POPUP_CLASSNAME = 'whatsbuddy-options-success toast toast-success text-center';
const OPTIONS_SAVE_BUTTON_SELECTOR = '#whatsbuddy-options-save';

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

onClick(OPTIONS_SAVE_BUTTON_SELECTOR, () => {
  saveChat()
    .then(() => saveList())
    .then(() => successPopup());
});
