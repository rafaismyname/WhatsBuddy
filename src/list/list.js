const SIDE_PANE_SELECTOR = '#pane-side';
const SIDE_PANE_LIST_SELECTOR = 'div:first-child > div:first-child > div:first-child';
const CONTACTS_OVERLAY_ID = 'whatsbuddy-contacts-overlay';
const OVERLAY_CONTACT_CLASSNAME = 'whatsbuddy-overlay-contact';
const OVERLAY_HIDDEN_CONTACT_CLASSNAME = 'whatsbuddy-overlay-hidden-contact';

let sidePane = null;
let contactsList = null;
let contactsOverlay = null;
let contacts = {};

const hideList = [];

const clearOverlay = () => {
  contactsList.style.display = 'none';

  while (contactsOverlay.firstChild) {
    contactsOverlay.removeChild(contactsOverlay.firstChild);
  }
};

const getSortedContactsNames = () => (
  Object.keys(contacts).sort((a, b) => {
    const getPriority = (contactName) => {
      const contact = contacts[contactName];
      const transformVal = contact.style.transform;
      const transformMatch = transformVal.match(/translateY\((\w*)px\)/i);
      const rawPriority = (transformMatch && transformMatch[1]) || 999999;
      return parseInt(rawPriority, 10);
    };

    return getPriority(a) - getPriority(b);
  })
);

const buildOverlay = () => {
  clearOverlay();

  const sortedContactNames = getSortedContactsNames();

  sortedContactNames.forEach((contactName) => {
    const contact = contacts[contactName];

    contact.classList.add(OVERLAY_CONTACT_CLASSNAME);

    if (hideList.includes(contactName)) {
      contact.classList.add(OVERLAY_HIDDEN_CONTACT_CLASSNAME);
      return;
    }

    contactsOverlay.appendChild(contact);
  });
};

const processList = () => {
  const listContacts = [...contactsList.children];
  (listContacts).forEach((contact) => {
    const text = contact.innerText.trim();
    const name = text.split('\n')[0];

    const styleObserver = new MutationObserver(() => processList());
    styleObserver.observe(contact, { attributes: true, attributeFilter: ['style'] });

    contacts = Object.assign({}, contacts, { [name]: contact });
  });

  buildOverlay();
};

const listObserver = new MutationObserver(() => processList());

const mainObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.className && node.className.includes && node.className.includes('app')) {
        sidePane = node.querySelector(SIDE_PANE_SELECTOR);
        if (!sidePane) return;

        mainObserver.disconnect();

        contactsList = sidePane.querySelector(SIDE_PANE_LIST_SELECTOR);

        contactsOverlay = document.createElement('div');
        contactsOverlay.id = CONTACTS_OVERLAY_ID;

        sidePane.insertBefore(contactsOverlay, sidePane.firstChild);

        processList();

        window.addEventListener('error', () => document.location.reload());

        listObserver.observe(contactsList, { childList: true, subtree: true });
      }
    });
  });
});
mainObserver.observe(document, { childList: true, subtree: true });
