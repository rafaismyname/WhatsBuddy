const CHAT_CONTAINER_SELECTOR = '#main div[data-asset-chat-background], #main div[data-asset-chat-background-dark]';

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

export default { onChatOpen };
