import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {StyledPasswordFieldWrapper, StyledPasswordInput} from './_styled';

const PasswordField = ({pw, placeholder, onChange, onKeyPress}) => {
  const [isPwReadable, setIsPwReadable] = useState(false);

  return (
    <StyledPasswordFieldWrapper>
      <StyledPasswordInput
        data-testid="passwordInput"
        type={isPwReadable ? 'text' : 'password'}
        placeholder={placeholder}
        onChange={onChange}
        value={pw}
        onKeyPress={onKeyPress}
        autoComplete="off"
      />

      <div className="clickable" onClick={() => setIsPwReadable(!isPwReadable)}>
        <i className={isPwReadable ? 'icon-eye-off' : 'icon-eye'} />
      </div>
    </StyledPasswordFieldWrapper>
  );
};

PasswordField.propTypes = {
  pw: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired
};

export default PasswordField;
