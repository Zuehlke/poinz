/* eslint react/prop-types: 0 */
import React, {useContext, useEffect} from 'react';
import {create, act} from 'react-test-renderer';

import {L10nContext, WithL10n} from '../../src/services/l10n';

beforeEach(() => {
  const InnerComponent = () => {
    const {setLanguage} = useContext(L10nContext);
    useEffect(() => setLanguage('en'), []);
    return null;
  };

  act(() => {
    create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });
});

test('WithL10n can mount', () => {
  const tr = create(
    <WithL10n>
      <div className="inner" />
    </WithL10n>
  );

  expect(tr.root.findByProps({className: 'inner'})).toBeDefined();
});

test('WithL10n : Inner component can access "t" function and translate default language', () => {
  const InnerComponent = () => {
    const {t} = useContext(L10nContext);
    return <div className="inner">{t('backlog')}</div>;
  };

  let tr;
  act(() => {
    tr = create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });

  expect(tr.root.findByProps({className: 'inner'}).children).toEqual(['Backlog']);
});

test('WithL10n : can translate with interpolations', () => {
  const InnerComponent = () => {
    const {t} = useContext(L10nContext);
    return <div className="inner">{t('joinWithRoomName', {room: 'mein-super-raum'})}</div>;
  };

  let tr;
  act(() => {
    tr = create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });

  expect(tr.root.findByProps({className: 'inner'}).children).toEqual([
    'Join room "mein-super-raum"'
  ]);
});

test('WithL10n : can translate with interpolations (empty string)', () => {
  const InnerComponent = () => {
    const {t, setLanguage} = useContext(L10nContext);
    useEffect(() => setLanguage('de'), []);
    return <div className="inner">{t('joinWithRoomName', {room: ''})}</div>;
  };

  let tr;
  act(() => {
    tr = create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });

  expect(tr.root.findByProps({className: 'inner'}).children).toEqual(['Raum "" beitreten']);
});

test('WithL10n : can translate with interpolations (values not passed)', () => {
  const InnerComponent = () => {
    const {t} = useContext(L10nContext);
    return <div className="inner">{t('joinWithRoomName', {thereIsNoRoom: 'property'})}</div>;
  };

  let tr;
  act(() => {
    tr = create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });

  expect(tr.root.findByProps({className: 'inner'}).children).toEqual(['Join room "%{room}"']);
});

test('WithL10n : handles missing translation for given key', () => {
  const InnerComponent = () => {
    const {t} = useContext(L10nContext);
    return <div className="inner">{t('thisKeyDoesNotExist')}</div>;
  };

  let tr;
  act(() => {
    tr = create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });

  expect(tr.root.findByProps({className: 'inner'}).children).toEqual(['!!!thisKeyDoesNotExist!!!']);
});

test('WithL10n : setLanguage', () => {
  const InnerComponent = ({customLanguage}) => {
    const {t, setLanguage} = useContext(L10nContext);
    useEffect(() => {
      if (customLanguage) {
        setLanguage(customLanguage);
      }
    }, [customLanguage]);
    return <div className="inner">{t('room')}</div>;
  };

  let tr;
  act(() => {
    tr = create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });
  expect(tr.root.findByProps({className: 'inner'}).children).toEqual(['Room']);

  // update with customLanguage property set to "de"
  act(() => {
    tr.update(
      <WithL10n>
        <InnerComponent customLanguage="de" />
      </WithL10n>
    );
  });
  expect(tr.root.findByProps({className: 'inner'}).children).toEqual(['Raum']);
});
