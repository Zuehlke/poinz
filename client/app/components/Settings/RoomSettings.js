import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {toggleAutoReveal, setCardConfig, SIDEBAR_SETTINGS} from '../../actions';
import {CardConfigEditor} from './CardConfigEditor';

import {StyledSection, StyledLinkButton, StyledExpandButton, StyledArea} from './_styled';

const RoomSettings = ({
  t,
  shown,
  autoReveal,
  cardConfig,
  roomId,
  setCardConfig,
  toggleAutoReveal
}) => {
  const [customCardConfigExpanded, setCustomCardConfigExpanded] = useState(false);
  React.useEffect(() => {
    setCustomCardConfigExpanded(false);
  }, [shown]);

  return (
    <StyledArea>
      <h4>{t('room')}</h4>

      <StyledSection>
        <h5>{t('toggleAutoReveal')}</h5>
        {t('autoRevealInfo')}

        <p onClick={toggleAutoReveal} className="clickable" data-testid="toggleAutoReveal">
          <i className={autoReveal ? 'icon-check' : 'icon-check-empty'}></i> {t('autoReveal')}
        </p>
      </StyledSection>

      <StyledSection>
        <h5>{t('customCards')}</h5>
        {t('customCardsInfo')}

        {!customCardConfigExpanded && (
          <StyledExpandButton
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => setCustomCardConfigExpanded(true)}
          >
            <i className="icon-angle-double-down"></i>
          </StyledExpandButton>
        )}

        {customCardConfigExpanded && (
          <CardConfigEditor t={t} cardConfig={cardConfig} onSave={(cc) => setCardConfig(cc)} />
        )}
      </StyledSection>

      <StyledSection>
        <h5>{t('export')}</h5>
        {t('exportInfo')}

        <p>
          <StyledLinkButton href={`/api/export/room/${roomId}?mode=file`} download>
            {t('exportLinkText')} <i className="icon-download-cloud"></i>
          </StyledLinkButton>
        </p>
      </StyledSection>
    </StyledArea>
  );
};

RoomSettings.propTypes = {
  t: PropTypes.func,
  shown: PropTypes.bool,
  autoReveal: PropTypes.bool,
  toggleAutoReveal: PropTypes.func,
  setCardConfig: PropTypes.func,
  cardConfig: PropTypes.array,
  roomId: PropTypes.string
};

export default connect(
  (state) => ({
    t: state.translator,
    shown: state.sidebar === SIDEBAR_SETTINGS,
    autoReveal: state.autoReveal,
    cardConfig: state.cardConfig,
    roomId: state.roomId
  }),
  {
    toggleAutoReveal,
    setCardConfig
  }
)(RoomSettings);
