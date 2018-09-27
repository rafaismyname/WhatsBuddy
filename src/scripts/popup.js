import runtime from './utils/runtime';
import { onClick } from './utils/events';

import '../styles/popup.scss';

const OPTIONS_URI = 'dist/options.html';
const OPTIONS_BUTTON_SELECTOR = '#whatsbuddy-popup-options';

onClick(OPTIONS_BUTTON_SELECTOR, () => {
  const optionsURL = runtime.getURL(OPTIONS_URI);
  window.open(optionsURL);
});
