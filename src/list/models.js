import * as storage from '../helpers/storage';

const BASE_LIST_SELECTOR = 'div:first-child > div:first-child > div:first-child';
const OVERLAY_LIST_ID = 'whatsbuddy-overlay-list';
const OVERLAY_CHAT_CLASSNAME = 'whatsbuddy-overlay-chat';
const OVERLAY_HIDDEN_CHAT_CLASSNAME = 'whatsbuddy-overlay-hidden-chat';
const CHAT_NAME_SELECTOR = 'span[dir="auto"][title][class]';
const CHAT_NAME_ATTRIBUTE = 'title';

export class Chat {
  constructor(element) {
    this.element = element;

    this.id = null;
    this.name = null;

    this.styleObserver = null;

    this.build();
  }

  build() {
    const nameElement = this.element.querySelector(CHAT_NAME_SELECTOR);
    this.name = nameElement.getAttribute(CHAT_NAME_ATTRIBUTE);
    this.id = this.name; // TODO: implement id

    return this;
  }

  setStyleObserver(callback) {
    this.styleObserver = new MutationObserver(() => callback());
  }

  initStyleObserver() {
    const observerOptions = { attributes: true, attributeFilter: ['style'] };
    this.styleObserver.observe(this.element, observerOptions);
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
    this.chats = chatsElements.reduce((acc, chatElement) => {
      const chat = new Chat(chatElement);

      chat.setStyleObserver(() => this.process());

      return Object.assign({}, acc, { [chat.id]: chat });
    }, this.chats);

    const chatIds = Object.keys(this.chats);
    this.sortedChatIds = chatIds.sort((a, b) => {
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

      chat.initStyleObserver();

      this.appendChat(chat);
    });
  }
}
