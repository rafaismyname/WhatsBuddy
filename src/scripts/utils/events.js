const CHAT_CONTAINER_PATH = '#main div[data-asset-chat-background]';

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

    const chatContainer = document.querySelector(CHAT_CONTAINER_PATH);
    if (!chatContainer) return true;

    callback();

    return true;
  };

  document.addEventListener('DOMNodeInserted', onNodeInserted, false);
};
