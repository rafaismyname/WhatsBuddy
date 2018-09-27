import * as storage from './utils/storage';
import { onDocumentReady, onClick } from './utils/events';

import '../styles/options.scss';

const MACROS_CONTAINER_SELECTOR = '#whatsbuddy-options-macros';
const ADD_MACRO_BUTTON_SELECTOR = '#whatsbuddy-options-add-macro';
const MACRO_CONTAINER_CLASSNAME = 'whatsbuddy-options-macro';
const MACRO_NAME_INPUT_CLASSNAME = 'whatsbuddy-options-macro-name';
const MACRO_MESSAGE_INPUT_CLASSNAME = 'whatsbuddy-options-macro-message';
const MACRO_DELETE_BUTTON_CLASSNAME = 'whatsbuddy-options-macro-delete';
const OPTIONS_SUCCESS_POPUP_CLASSNAME = 'whatsbuddy-options-success';
const OPTIONS_SAVE_BUTTON_SELECTOR = '#whatsbuddy-options-save';

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
  macroDeleteButton.innerHTML = '- Remove';
  onClick(macroDeleteButton, () => {
    macrosContainer.removeChild(macroContainer);
  });
  macroDeleteContainer.appendChild(macroDeleteButton);

  macroContainer.appendChild(macroDeleteContainer);

  macrosContainer.appendChild(macroContainer);
};

const serializeMacros = () => {
  const macrosContainers = document.querySelectorAll(`${MACROS_CONTAINER_SELECTOR} .${MACRO_CONTAINER_CLASSNAME}`);

  const rawMacros = ([...macrosContainers]).map((macroContainer) => {
    const macroNameInput = macroContainer.querySelector(`input.${MACRO_NAME_INPUT_CLASSNAME}`);
    const name = macroNameInput.value;

    const macroMessageInput = macroContainer.querySelector(`input.${MACRO_MESSAGE_INPUT_CLASSNAME}`);
    const message = macroMessageInput.value;

    return { name, message };
  });

  const macros = rawMacros.filter((macro) => {
    const { name, message } = macro;

    return (name.trim() !== '' && message.trim() !== '');
  });

  return macros;
};

const serializeOptions = () => {
  const macros = serializeMacros();

  return { macros };
};

const successPopup = () => {
  const footer = document.querySelector('footer');

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

const renderOptions = ({ macros }) => {
  macros.forEach(({ name, message }) => insertMacro(name, message));
};

onClick(ADD_MACRO_BUTTON_SELECTOR, () => {
  insertMacro();
});

onClick(OPTIONS_SAVE_BUTTON_SELECTOR, () => {
  const options = serializeOptions();

  storage.save(options).then(() => successPopup());
});

onDocumentReady(() => {
  const storageParams = { macros: [] };
  storage.get(storageParams).then(renderOptions);
});
