import selector from './utils/selector';
import runtime from './utils/runtime';

import '../styles/popup.scss';

const OPTIONS_URI = 'dist/options.html';

class Popup {
  constructor() {
    selector(document).ready(Popup.bind());
  }

  static bind() {
    selector('.options').click(() => {
      window.open(runtime.api('runtime').getURL(OPTIONS_URI));
    });
  }
}

export default new Popup();
