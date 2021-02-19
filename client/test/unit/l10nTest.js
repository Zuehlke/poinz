/* eslint react/prop-types: 0 */
import React, {useContext, useEffect} from 'react';
import TestRenderer from 'react-test-renderer';

import {L10nContext, WithL10n} from '../../app/services/l10n';

test('WithL10n can mount', () => {
  const testRenderer = TestRenderer.create(
    <WithL10n>
      <div className="inner" />
    </WithL10n>
  );

  const testInstance = testRenderer.root;

  expect(testInstance.findByProps({className: 'inner'})).toBeDefined();
});

test('WithL10n : Inner component can access "t" function and translate default language', () => {
  const InnerComponent = () => {
    const {t} = useContext(L10nContext);
    return <div className="inner">{t('backlog')}</div>;
  };

  let testRenderer;
  TestRenderer.act(() => {
    testRenderer = TestRenderer.create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });

  expect(testRenderer.root.findByProps({className: 'inner'}).children).toEqual(['Backlog']);
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

  let testRenderer;
  TestRenderer.act(() => {
    testRenderer = TestRenderer.create(
      <WithL10n>
        <InnerComponent />
      </WithL10n>
    );
  });
  expect(testRenderer.root.findByProps({className: 'inner'}).children).toEqual(['Room']);

  // update with customLanguage property set to "de"
  TestRenderer.act(() => {
    testRenderer.update(
      <WithL10n>
        <InnerComponent customLanguage="de" />
      </WithL10n>
    );
  });
  expect(testRenderer.root.findByProps({className: 'inner'}).children).toEqual(['Raum']);
});
