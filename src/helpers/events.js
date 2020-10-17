const CHAT_CONTAINER_SELECTOR = '#main div[data-asset-chat-background], #main div[data-asset-chat-background-dark]';

export const onDocumentReady = (callback) => {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

export const onChatOpen = (callback) => {
  const onNodeInserted = (element) => {
    if (element.target.id !== 'main') return true;

    const chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);
    if (!chatContainer) return true;

    callback();

    return true;
  };

  document.addEventListener('DOMNodeInserted', onNodeInserted, false);
};

export const onClick = (selector, callback) => {
  const element = (() => {
    if (typeof selector === 'string') {
      return document.querySelector(selector);
    }

    return selector;
  })();

  element.addEventListener('click', ({ target }) => callback(target), false);
};

export const onChange = (selector, callback) => {
  const element = (() => {
    if (typeof selector === 'string') {
      return document.querySelector(selector);
    }

    return selector;
  })();

  element.addEventListener('change', ({ target }) => callback(target), false);
};
