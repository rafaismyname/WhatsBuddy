import * as storage from '../../helpers/storage';
import { onDocumentReady, onClick, onChange } from '../../helpers/events';

const SWITCH_INPUT_SELECTOR = 'input#whatsbuddy-macros-enabled';
const SWITCH_STATUS_SELECTOR = 'span#whatsbuddy-macros-status';
const MACROS_CONTAINER_SELECTOR = '#whatsbuddy-options-macros';
const ADD_MACRO_BUTTON_SELECTOR = '#whatsbuddy-options-add-macro';
const MACRO_CONTAINER_CLASSNAME = 'whatsbuddy-options-macro';
const MACRO_NAME_INPUT_CLASSNAME = 'whatsbuddy-options-macro-name form-input input-lg';
const MACRO_NAME_INPUT_SELECTOR = 'input.whatsbuddy-options-macro-name';
const MACRO_MESSAGE_INPUT_CLASSNAME = 'whatsbuddy-options-macro-message form-input input-lg';
const MACRO_MESSAGE_INPUT_SELECTOR = 'input.whatsbuddy-options-macro-message';
const MACRO_DELETE_BUTTON_CLASSNAME = 'whatsbuddy-options-macro-delete btn btn-error';

let state = {
  macrosEnabled: true,
  macros: [],
};

const renderEnableSwitch = () => {
  const enableSwitch = document.querySelector(SWITCH_INPUT_SELECTOR);
  enableSwitch.checked = state.macrosEnabled;

  const enableStatus = document.querySelector(SWITCH_STATUS_SELECTOR);
  enableStatus.innerHTML = state.macrosEnabled ? 'Enabled' : 'Disabled';
};

const toggleEnableSwitch = () => {
  const enabled = state.macrosEnabled;
  state = { ...state, macrosEnabled: !enabled };

  renderEnableSwitch();
};

onChange(SWITCH_INPUT_SELECTOR, () => toggleEnableSwitch());

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

const renderMacros = () => {
  state.macros.forEach(({ name, message }) => insertMacro(name, message));
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

onClick(ADD_MACRO_BUTTON_SELECTOR, () => insertMacro());

export const save = () => {
  const macros = serializeMacros();

  state = { ...state, macros };

  return storage.save(state);
};

onDocumentReady(() => {
  storage.get(state)
    .then((response) => {
      state = { ...state, ...response };
    })
    .then(() => renderEnableSwitch())
    .then(() => renderMacros());
});

export default {};
