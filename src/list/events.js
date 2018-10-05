const SIDE_PANE_SELECTOR = '#pane-side';
const SIDE_PANE_ROOT_CLASSNAME = 'app';

export const onSidePaneLoaded = (callback) => {
  const paneObserver = new MutationObserver((mutations, observer) => {
    mutations.some((mutation) => {
      const addedNodes = [...mutation.addedNodes];
      return addedNodes.some((node) => {
        const nodeClass = node.className && node.className.includes && node.className;
        if (!nodeClass || !nodeClass.includes(SIDE_PANE_ROOT_CLASSNAME)) {
          return false;
        }

        const sidePane = node.querySelector(SIDE_PANE_SELECTOR);
        if (!sidePane) return false;

        observer.disconnect();

        callback(sidePane);

        return true;
      });
    });
  });

  return paneObserver.observe(document, { childList: true, subtree: true });
};

export default {};
