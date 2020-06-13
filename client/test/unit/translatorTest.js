import translatorFactory from '../../app/services/translator';

import translationsEN from '../../app/assets/i18n/en.json';
import translationsDE from '../../app/assets/i18n/de.json';

const dictionary = {
  en: translationsEN,
  de: translationsDE
};

test('simple', () => {
  const {t, setLanguage} = translatorFactory(dictionary, 'de');

  let translated = t('username');
  expect(translated).toBe('Benutzername');

  setLanguage('en');

  translated = t('username');
  expect(translated).toBe('Username');
});

test('unknown key', () => {
  const {t} = translatorFactory(dictionary, 'de');

  let translated = t('notKnown');
  expect(translated).toBe('!!!notKnown!!!');
});

test('interpolation', () => {
  const {t, setLanguage} = translatorFactory(dictionary, 'de');

  let translated = t('joinRoomname', {roomName: 'Custom-Room'});
  expect(translated).toBe('Custom-Room beitreten');

  setLanguage('en');

  translated = t('joinRoomname', {roomName: 'Custom-Room'});
  expect(translated).toBe('Join Custom-Room');
});
