const SIDE_PANE_SELECTOR = '#pane-side';
const SIDE_PANE_LIST_SELECTOR = 'div:first-child > div:first-child > div:first-child';

let sidePane = null;
let contactsList = null;

const processList = () => {
  // TODO: process list
  console.log(contactsList);
};

const listObserver = new MutationObserver(() => processList());

const mainObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.className && node.className.includes && node.className.includes('app')) {
        mainObserver.disconnect();

        sidePane = node.querySelector(SIDE_PANE_SELECTOR);
        contactsList = sidePane.querySelector(SIDE_PANE_LIST_SELECTOR);

        listObserver.observe(contactsList, { childList: true, subtree: true });
      }
    });
  });
});
mainObserver.observe(document, { childList: true, subtree: true });
