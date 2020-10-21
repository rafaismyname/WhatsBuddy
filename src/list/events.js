const SIDE_PANE_SELECTOR = '#pane-side';

export const onSidePaneLoaded = (callback) => {
  const paneObserver = new MutationObserver((mutations, observer) => {
    mutations.some((mutation) => {
      const addedNodes = [...mutation.addedNodes];
      return addedNodes.some((node) => {
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

export default { onSidePaneLoaded };
