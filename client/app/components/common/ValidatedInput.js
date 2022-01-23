import React from 'react';
import PropTypes from 'prop-types';

/**
 */
const ValidatedInput = (props) => {
  const {fieldValue, setFieldValue, onEnter, regexPattern, allLowercase, ...restProps} = props;
  const pattern = typeof regexPattern === 'string' ? new RegExp(regexPattern) : regexPattern;

  return (
    <input {...restProps} value={fieldValue} onChange={onChange} onKeyPress={onInputKeyPress} />
  );

  function onInputKeyPress(e) {
    if (!onEnter) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  }

  function onChange(ev) {
    const val = allLowercase ? ev.target.value.toLowerCase() : ev.target.value;
    if (pattern.test(val)) {
      setFieldValue(val);
    }
  }
};

ValidatedInput.propTypes = {
  fieldValue: PropTypes.any.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
  allLowercase: PropTypes.bool, // if true, entered characters get "lowercased" before pattern checking
  regexPattern: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]).isRequired
};
export default ValidatedInput;
