import * as storage from '../helpers/storage';

const BASE_LIST_SELECTOR = 'div:first-child > div:first-child > div:first-child';
const OVERLAY_LIST_ID = 'whatsbuddy-overlay-list';
const OVERLAY_CHAT_CLASSNAME = 'whatsbuddy-overlay-chat';
const OVERLAY_HIDDEN_CHAT_CLASSNAME = 'whatsbuddy-overlay-hidden-chat';

export class Chat {
  constructor() {
    this.id = null;
    this.name = null;
    this.element = null;
    this.styleObserver = null;
  }

  build(element, styleUpdateCallback) {
    this.element = element;

    const chatText = this.element.innerText.trim();
    this.name = (chatText.split('\n')[0]).trim();
    this.id = this.name; // TODO: implement id

    this.styleObserver = new MutationObserver(() => styleUpdateCallback());
    this.styleObserver.observe(this.element, { attributes: true, attributeFilter: ['style'] });

    return this;
  }
}

export class BaseList {
  constructor() {
    this.parent = null;
    this.element = null;

    this.overlay = null;

    this.chats = {};
    this.sortedChatIds = [];
  }

  build(parent, overlay) {
    this.parent = parent;
    this.element = parent.querySelector(BASE_LIST_SELECTOR);
    this.overlay = overlay;

    return this;
  }

  init() {
    this.process();

    const observer = new MutationObserver(() => this.process());
    observer.observe(this.element, { childList: true, subtree: true });
  }

  hide() {
    this.element.style.display = 'none';
  }

  fetchChats() {
    const chatsElements = [...this.element.children];
    (chatsElements).forEach((chatElement) => {
      const chat = (new Chat()).build(chatElement, this.process);

      this.chats = Object.assign({}, this.chats, { [chat.id]: chat });
    });

    this.sortedChatIds = Object.keys(this.chats).sort((a, b) => {
      const getPriority = (chatId) => {
        const chat = this.chats[chatId];
        const chatElement = chat.element;
        const transformVal = chatElement.style.transform;
        const transformMatch = transformVal.match(/translateY\((\w*)px\)/i);
        const rawPriority = (transformMatch && transformMatch[1]) || 999999;
        return parseInt(rawPriority, 10);
      };

      return getPriority(a) - getPriority(b);
    });

    return this.chats;
  }

  persistChats() {
    const chats = Object.keys(this.chats).map((chatId) => {
      const chat = this.chats[chatId];
      return { id: chatId, name: chat.name };
    });

    return storage.save({ chats });
  }

  process() {
    this.fetchChats();
    this.persistChats();
    this.hide();

    this.overlay.render();
  }
}

export class OverlayList {
  constructor() {
    this.parent = null;
    this.element = null;

    this.baseList = null;

    this.hiddenChats = [];
  }

  build(parent, baseList) {
    this.parent = parent;
    this.baseList = baseList;

    this.element = document.createElement('div');
    this.element.id = OVERLAY_LIST_ID;

    parent.insertBefore(this.element, parent.firstChild);

    return this;
  }

  init() {
    const storageParams = { hiddenChats: [] };
    storage.get(storageParams).then(({ hiddenChats }) => {
      this.hiddenChats = hiddenChats;
      this.baseList.init();
    });
  }

  empty() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  appendChat(chat) {
    const chatElement = chat.element;

    chatElement.classList.add(OVERLAY_CHAT_CLASSNAME);

    if (this.hiddenChats.includes(chat.id)) {
      chatElement.classList.add(OVERLAY_HIDDEN_CHAT_CLASSNAME);
    }

    this.element.appendChild(chatElement);
  }

  render() {
    this.empty();

    this.baseList.sortedChatIds.forEach((chatId) => {
      const chat = this.baseList.chats[chatId];
      if (!chat) return;

      this.appendChat(chat);
    });
  }
}
