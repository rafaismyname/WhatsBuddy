export const onDocumentReady = (callback) => {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
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
