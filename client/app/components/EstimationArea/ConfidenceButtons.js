import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';

import {StyledToggleButton, StyledToggleButtonGroup} from '../common/_styled';

const ConfidenceButtons = ({onConfidenceChange, selectedConfidence}) => {
  const {t} = useContext(L10nContext);
  return (
    <StyledToggleButtonGroup className="pure-button-group" role="group">
      <ConfButton
        label={t('confidenceUnsure')}
        title={t('confidenceUnsureTitle')}
        onClick={() => onConfidenceChange(-1)}
        active={selectedConfidence < 0}
      />
      <ConfButton
        label={t('confidenceDefault')}
        title={t('confidenceDefaultTitle')}
        onClick={() => onConfidenceChange(0)}
        active={!selectedConfidence}
      />
      <ConfButton
        label={t('confidenceVerySure')}
        title={t('confidenceVerySureTitle')}
        onClick={() => onConfidenceChange(1)}
        active={selectedConfidence > 0}
      />
    </StyledToggleButtonGroup>
  );
};
ConfidenceButtons.propTypes = {
  onConfidenceChange: PropTypes.func,
  selectedConfidence: PropTypes.number
};

const ConfButton = ({label, title, onClick, active}) => (
  <StyledToggleButton
    className="pure-button"
    type="button"
    onClick={onClick}
    active={active}
    title={title}
  >
    {label}
  </StyledToggleButton>
);

ConfButton.propTypes = {
  label: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool
};

export default ConfidenceButtons;
