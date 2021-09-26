import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {StyledConfidenceButtons} from './_styled';

const ConfidenceButtons = ({onConfidenceChange, selectedConfidence}) => {
  const {t} = useContext(L10nContext);
  return (
    <StyledConfidenceButtons>
      <button
        className={`pure-button ${selectedConfidence < 0 ? 'pure-button-primary' : ''}`}
        type="button"
        onClick={() => onConfidenceChange(-1)}
      >
        {t('confidenceUnsure')}
      </button>
      <button
        className={`pure-button ${!selectedConfidence ? 'pure-button-primary' : ''}`}
        type="button"
        onClick={() => onConfidenceChange(0)}
      >
        {t('confidenceDefault')}
      </button>
      <button
        className={`pure-button ${selectedConfidence > 0 ? 'pure-button-primary' : ''}`}
        type="button"
        onClick={() => onConfidenceChange(1)}
      >
        {t('confidenceVerySure')}
      </button>
    </StyledConfidenceButtons>
  );
};

ConfidenceButtons.propTypes = {
  onConfidenceChange: PropTypes.func,
  selectedConfidence: PropTypes.number
};

export default ConfidenceButtons;
