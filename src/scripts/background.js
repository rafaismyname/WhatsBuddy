import { browserAction, extension, tabs } from './utils/api';

const OPTIONS_URI = 'dist/options.html';

browserAction.onClicked.addListener(() => {
  const optionsURL = extension.getURL(OPTIONS_URI);
  tabs.create({ url: optionsURL });
});
