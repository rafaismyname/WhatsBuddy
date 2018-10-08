import * as storage from '../helpers/storage';
import { onSidePaneLoaded } from './events';
import { BaseList, OverlayList } from './models';

const baseList = new BaseList();
const overlayList = new OverlayList();

const sidePaneLoadCallback = (sidePane) => {
  baseList.build(sidePane, overlayList);

  overlayList.build(sidePane, baseList);
  overlayList.init();

  window.addEventListener('error', () => document.location.reload());
};

const storageParams = { enableHideChats: true, hiddenChats: [] };
storage.get(storageParams).then(({ enableHideChats, hiddenChats }) => {
  if (!enableHideChats || hiddenChats.length === 0) return;

  onSidePaneLoaded(sidePane => sidePaneLoadCallback(sidePane));
});
