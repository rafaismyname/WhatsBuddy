import { onSidePaneLoaded } from './events';
import { BaseList, OverlayList } from './models';

const baseList = new BaseList();
const overlayList = new OverlayList();

onSidePaneLoaded((sidePane) => {
  baseList.build(sidePane, overlayList);
  overlayList.build(sidePane, baseList);
  overlayList.init();

  window.addEventListener('error', () => document.location.reload());
});
