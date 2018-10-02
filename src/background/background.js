import { browserAction, runtime } from '../helpers/api';

browserAction.onClicked.addListener(() => runtime.openOptionsPage());
