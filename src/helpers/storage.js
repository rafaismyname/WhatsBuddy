const storage = () => {
  let section = {};

  try {
    if (chrome.storage) {
      section = chrome.storage.sync || chrome.storage.local;
    }
  } catch(e) {} //eslint-disable-line

  try {
    if (window.storage) {
      section = window.storage.local;
    }
  } catch(e) {} //eslint-disable-line

  try {
    if (browser.storage) {
      section = browser.storage.local;
    }
  } catch(e) {} //eslint-disable-line

  return section;
};

export const save = keys => (
  new Promise((resolve) => {
    storage().set(keys, () => resolve(true));
  })
);

export const get = keys => (
  new Promise((resolve) => {
    storage().get(keys, items => resolve(items));
  })
);

export const remove = keys => (
  new Promise((resolve) => {
    storage().remove(keys, items => resolve(items));
  })
);
