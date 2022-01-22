import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {StyledPasswordFieldWrapper, StyledPasswordInput} from './_styled';

const PasswordField = (props) => {
  const {pw, placeholder, isNewPassword, onChange, onKeyPress} = props;
  const [isPwReadable, setIsPwReadable] = useState(false);

  return (
    <StyledPasswordFieldWrapper>
      <StyledPasswordInput
        data-testid={props['data-testid']}
        type={isPwReadable ? 'text' : 'password'}
        placeholder={placeholder}
        onChange={onChange}
        value={pw}
        onKeyPress={onKeyPress}
        autoComplete={isNewPassword ? 'new-password' : 'current-password'}
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
  onKeyPress: PropTypes.func.isRequired,
  'data-testid': PropTypes.string,
  isNewPassword: PropTypes.bool // default is false -> autocomplete is on
};

export default PasswordField;
