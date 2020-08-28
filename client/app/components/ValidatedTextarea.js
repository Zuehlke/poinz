import React from 'react';
import PropTypes from 'prop-types';

/**
 */
const ValidatedTextarea = (props) => {
  const {fieldValue, setFieldValue, regexPattern, allLowercase, ...restProps} = props;
  const pattern = typeof regexPattern === 'string' ? new RegExp(regexPattern) : regexPattern;

  return <textarea {...restProps} value={fieldValue} onChange={onChange} />;

  function onChange(ev) {
    const val = allLowercase ? ev.target.value.toLowerCase() : ev.target.value;
    if (pattern.test(val)) {
      setFieldValue(val);
    }
  }
};

ValidatedTextarea.propTypes = {
  fieldValue: PropTypes.any.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  allLowercase: PropTypes.bool, // if true, entered charachters get "lowercased" before pattern checking
  regexPattern: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]).isRequired
};
export default ValidatedTextarea;
