/**
 *
 * @param {object} estmForOneStory The estimation object from the redux state, mapping userIds (keys) to  {estimation values and confidence}
 * @param {object[]} cardConfig The card configuration array
 * @return {object[]} Returns an array with two summaries!
 *      - First Summary is the default (ignoring confidence)
 *      - Second Summary is without "unsure" values
 */
export default function getEstimationSummary(estmForOneStory, cardConfig) {
  const estmValues = Object.values(estmForOneStory);
  if (estmValues.length < 1) {
    return [-1, -1].fill({
      lowest: undefined,
      highest: undefined,
      average: undefined,
      recommendation: undefined,
      estimationCount: 0,
      estimatedValues: {}
    });
  }

  const ignoringConfidEstmValues = estmValues.map((ev) => ev.value);
  const withoutUnsureEstmValues = estmValues
    .filter(
      (ev) => (ev.confidence !== undefined && ev.confidence >= 0) || ev.confidence === undefined
    )
    .map((ev) => ev.value);

  return [
    buildSummaryForValues(ignoringConfidEstmValues, cardConfig),
    buildSummaryForValues(withoutUnsureEstmValues, cardConfig)
  ];
}

function buildSummaryForValues(estmValues, cardConfig) {
  const estimationValues = estmValues.map((value) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    } else {
      return value;
    }
  });

  const estimatedValues = estimationValues.reduce((result, current) => {
    if (result[current]) {
      result[current] = result[current] + 1;
    } else {
      result[current] = 1;
    }

    return result;
  }, {});

  const numericalAverage = average(estimationValues);

  return {
    average: numberRoundedTwoDigit(numericalAverage),
    recommendation: getRecommendation(numericalAverage, cardConfig),
    highest: Math.max(...estimationValues),
    lowest: Math.min(...estimationValues),
    estimationCount: estimationValues.length,
    estimatedValues
  };
}

/**
 *
 * @param numericalAverage
 * @param cardConfig
 */
function getRecommendation(numericalAverage, cardConfig) {
  const cards = cardConfig.map((cc) => cc.value);
  cards.sort((cA, cB) => cA - cB);

  const cardHigherIndex = cards.findIndex((v) => v > numericalAverage);
  const cardHigher = cards[cardHigherIndex];
  const cardLower = cards[cardHigherIndex - 1];

  const diff = numericalAverage - cardLower;

  return diff <= 0.1 * cardLower ? cardLower : cardHigher;
}

const average = (values) => {
  const positiveValuesOnly = values.filter((v) => v >= 0);
  if (positiveValuesOnly.length < 1) {
    return undefined;
  }
  return positiveValuesOnly.reduce((a, b) => a + b) / positiveValuesOnly.length;
};

const numberRoundedTwoDigit = (number) =>
  typeof number !== 'undefined' ? parseFloat(number.toFixed(2)) : undefined;
