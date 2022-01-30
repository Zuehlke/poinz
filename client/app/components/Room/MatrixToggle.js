import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';

import {StyledToggleButton, StyledToggleButtonGroup} from '../common/_styled';
import {StyledMatrixToggle} from './_styled';

const MatrixToggle = ({onToggle, matrixShown}) => {
  const {t} = useContext(L10nContext);
  return (
    <StyledMatrixToggle data-testid="matrixToggle">
      <StyledToggleButtonGroup className="pure-button-group" role="group">
        <StyledToggleButton
          className="pure-button"
          type="button"
          onClick={onToggle}
          active={!matrixShown}
          title={'Story'}
        >
          <i className="icon-list-alt" />
        </StyledToggleButton>

        <StyledToggleButton
          className="pure-button"
          type="button"
          onClick={onToggle}
          active={matrixShown}
          title={t('matrix')}
        >
          <i className="icon-table" />
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </StyledMatrixToggle>
  );
};

MatrixToggle.propTypes = {
  onToggle: PropTypes.func,
  matrixShown: PropTypes.bool
};

export default MatrixToggle;
