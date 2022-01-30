import React from 'react';
import PropTypes from 'prop-types';

import {StyledToggleButton, StyledToggleButtonGroup} from '../common/_styled';
import {StyledMatrixToggle} from './_styled';

const MatrixToggle = ({onToggle, matrixShown}) => (
  <StyledMatrixToggle>
    <StyledToggleButtonGroup className="pure-button-group" role="group">
      <StyledToggleButton
        className="pure-button"
        type="button"
        onClick={onToggle}
        active={!matrixShown}
        title={'g'}
      >
        <i className="icon-list-alt" />
      </StyledToggleButton>

      <StyledToggleButton
        className="pure-button"
        type="button"
        onClick={onToggle}
        active={matrixShown}
        title={'g'}
      >
        <i className="icon-table" />
      </StyledToggleButton>
    </StyledToggleButtonGroup>
  </StyledMatrixToggle>
);

MatrixToggle.propTypes = {
  onToggle: PropTypes.func,
  matrixShown: PropTypes.bool
};

export default MatrixToggle;
