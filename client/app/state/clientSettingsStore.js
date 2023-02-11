const POINZ_NAMESPACE = 'poinz_';

const persisters = [];

/**
 *
 * @param {string} key The key that should be used to store the value in localStorage
 * @param {function} selector A selector function that must return the value from the redux state that should be persisted on change
 */
export const persistOnStateChange = (key, selector) => {
  persisters.push({
    key,
    selector
  });
};

/**
 * called once during initialization of the Poinz client app
 *
 * @param {object} store The redux store
 */
export const registerReduxStore = (store) => {
  const onStoreChange = () => {
    const reduxNextState = store.getState();
    persisters.forEach((persister) => {
      const newStateValue = persister.selector(reduxNextState);
      if (persister.oldStateValue !== newStateValue) {
        persister.oldStateValue = newStateValue;
        setItem(persister.key, newStateValue);
      }
    });
  };
  store.subscribe(onStoreChange);
};

export function getItem(key) {
  return localStorage.getItem(POINZ_NAMESPACE + key);
}

function setItem(key, value) {
  localStorage.setItem(POINZ_NAMESPACE + key, value ?? '');
}

export const getPresetLanguage = () => getItem('presetLanguage');
export const setPresetLanguage = (language) => setItem('presetLanguage', language);
