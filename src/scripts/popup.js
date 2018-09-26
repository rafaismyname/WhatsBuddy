import runtime from './utils/runtime';
import { onDocumentReady } from './utils/events';

import '../styles/popup.scss';

const OPTIONS_URI = 'dist/options.html';

onDocumentReady(() => {
  const optionsButton = document.querySelector('.options');
  optionsButton.addEventListener('click', () => {
    const optionsURL = runtime.getURL(OPTIONS_URI);
    window.open(optionsURL);
  });
});
