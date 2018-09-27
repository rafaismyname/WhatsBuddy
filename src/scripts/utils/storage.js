const sync = () => {
  let section = {};

  try {
    if (chrome.storage) {
      if (chrome.storage.sync) {
        section = chrome.storage.sync;
      } else {
        section = chrome.storage.local;
      }
    }
  } catch(e) {}//eslint-disable-line

  try {
    if (window.storage) {
      section = window.storage.local;
    }
  } catch(e) {}//eslint-disable-line

  try {
    if (browser.storage) {
      section = browser.storage.local;
    }
  } catch(e) {} //eslint-disable-line

  return section;
};

export const save = keys => (
  new Promise((resolve) => {
    sync().set(keys, () => resolve(true));
  })
);

export const get = keys => (
  new Promise((resolve) => {
    sync().get(keys, items => resolve(items));
  })
);

export const remove = keys => (
  new Promise((resolve) => {
    sync().remove(keys, items => resolve(items));
  })
);
