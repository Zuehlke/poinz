import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {MAINVIEW_DETAIL, MAINVIEW_MATRIX, MAINVIEW_ROOM} from '../../state/actions/uiStateActions';

import {StyledShakyIcon, StyledToggleButton, StyledToggleButtonGroup} from '../common/_styled';
import {StyledMatrixToggle} from './_styled';

const MainViewToggle = ({onChange, currentMainView, selectedStoryId}) => {
  const {t} = useContext(L10nContext);
  const [shaky, setShaky] = useState(false);

  useEffect(() => {
    setShaky(selectedStoryId && currentMainView !== MAINVIEW_ROOM);
  }, [selectedStoryId]);

  return (
    <StyledMatrixToggle data-testid="matrixToggle">
      <StyledToggleButtonGroup className="pure-button-group" role="group">
        <StyledToggleButton
          className="pure-button"
          type="button"
          onClick={() => {
            setShaky(false);
            onChange(MAINVIEW_ROOM);
          }}
          active={currentMainView === MAINVIEW_ROOM}
          title={'Room'}
        >
          {shaky && <StyledShakyIcon className="icon-users" />}
          {!shaky && <i className="icon-users" />}
        </StyledToggleButton>

        <StyledToggleButton
          className="pure-button"
          type="button"
          onClick={onChange.bind(undefined, MAINVIEW_DETAIL)}
          active={currentMainView === MAINVIEW_DETAIL}
          title={'Story'}
        >
          <i className="icon-list-alt" />
        </StyledToggleButton>

        <StyledToggleButton
          className="pure-button"
          type="button"
          onClick={onChange.bind(undefined, MAINVIEW_MATRIX)}
          active={currentMainView === MAINVIEW_MATRIX}
          title={t('matrix')}
        >
          <i className="icon-table" />
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </StyledMatrixToggle>
  );
};

MainViewToggle.propTypes = {
  onChange: PropTypes.func,
  currentMainView: PropTypes.string,
  selectedStoryId: PropTypes.string
};

export default MainViewToggle;
