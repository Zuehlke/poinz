import {getCardConfigForValue} from '../../../app/state/selectors/getCardConfigForValue';
import {COLOR_WARNING} from '../../../app/components/colors';

beforeEach(() => {
  getCardConfigForValue.resetRecomputations();
});

test('matched cardConfig', () => {
  const state = {
    cardConfig: [
      {label: 'eins', value: 1, color: 'red'},
      {label: 'zwei', value: 2, color: 'blue'}
    ]
  };
  const resultOne = getCardConfigForValue({...state, cardConfigLookupValue: 2});
  expect(resultOne).toEqual({label: 'zwei', value: 2, color: 'blue'});
});

test('unmatched cardConfig', () => {
  const state = {
    cardConfig: [
      {label: 'eins', value: 1, color: 'red'},
      {label: 'zwei', value: 2, color: 'blue'}
    ]
  };
  const resultOne = getCardConfigForValue({...state, cardConfigLookupValue: 3});
  expect(resultOne).toEqual({label: '3 !', value: 3, color: COLOR_WARNING});
});

test('recomputations of memoized selector', () => {
  const state = {
    cardConfig: [
      {label: 'eins', value: 1, color: 'red'},
      {label: 'zwei', value: 2, color: 'blue'}
    ]
  };

  getCardConfigForValue({...state, cardConfigLookupValue: 1});
  expect(getCardConfigForValue.recomputations()).toBe(1);

  getCardConfigForValue({...state, cardConfigLookupValue: 1});
  expect(getCardConfigForValue.recomputations()).toBe(1);

  getCardConfigForValue({...state, cardConfigLookupValue: 2});
  expect(getCardConfigForValue.recomputations()).toBe(2); // <<-  needed to recompute, since lookupValue is different than last call to selector

  getCardConfigForValue({...state, cardConfigLookupValue: 1});
  expect(getCardConfigForValue.recomputations()).toBe(3); // <<-  needed to recompute, since lookupValue is different than last call to selector
});
