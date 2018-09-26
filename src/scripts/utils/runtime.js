const api = (method) => {
  try {
    if (chrome[method]) {
      return chrome[method];
    }
  } catch (e) {} //eslint-disable-line

  // Try to request as Window.
  try {
    if (window[method]) {
      return window[method];
    }
  } catch (e) {} //eslint-disable-line

  // Try to request as Browser.
  try {
    if (browser[method]) {
      return browser[method];
    }
  } catch (e) {} //eslint-disable-line

  // Try to request as extension in browser.
  try {
    return browser.extension[method];
  } catch (e) {} //eslint-disable-line

  return false;
};

export default api('runtime');
