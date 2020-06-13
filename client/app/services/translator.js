import Polyglot from 'node-polyglot';

export default function translatorFactory(dictionary, language) {
  const polyglot = new Polyglot({phrases: dictionary[language]});

  return {
    t: translatorFunction,
    setLanguage: (lang) => polyglot.replace(dictionary[lang])
  };

  function translatorFunction(translationKey, data) {
    return polyglot.t(translationKey, {...data, _: `!!!${translationKey}!!!`});
  }
}
