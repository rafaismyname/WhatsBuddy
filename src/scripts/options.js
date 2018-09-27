import * as storage from './utils/storage';
import { onDocumentReady } from './utils/events';

import '../styles/options.scss';

const defaults = {
  messageSuccess: 'Options saved successfully!',
  messageError: 'Please fill all items in the form.',
  messageTime: 2000,
};

const getOptions = () => {
  const defaultInput = document.getElementById('default-input');
  const defaultCheckbox = document.getElementById('default-checkbox');

  return {
    standard: defaultInput.value,
    checkbox: defaultCheckbox.checked,
  };
};

const setOptions = () => {
  const storageParams = { standard: '', checkbox: false };
  storage.get(storageParams).then((data) => {
    const defaultInput = document.getElementById('default-input');
    defaultInput.value = data.standard;

    const defaultCheckbox = document.getElementById('default-checkbox');
    defaultCheckbox.checked = data.checkbox;
  });
};

const response = (message, classname) => {
  const responseContainer = document.querySelector('.response');

  responseContainer.innerHTML = message;
  responseContainer.classList.add(classname);

  setTimeout(() => {
    responseContainer.classList.remove(classname);
  }, defaults.messageTime);
};

onDocumentReady(() => {
  const saveButton = document.querySelector('.save-options');
  saveButton.addEventListener('click', () => {
    const options = getOptions();

    // Check if exists some field filled.
    if (!options.standard) {
      // Set error message.
      response(defaults.messageError, 'error');
      return;
    }

    // Store values to the Chrome storage.
    storage.save(options).then(() => {
      response(defaults.messageSuccess, 'success');
    });
  });

  setOptions();
});
