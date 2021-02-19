import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {hasMatchingPendingCommand} from '../../state/commandTracking/commandTrackingSelectors';
import {getActionLog} from '../../state/actionLog/actionLogSelectors';
import appConfig from '../../services/appConfig';
import JoinRoomForm from './JoinRoomForm';
import GithubRibbon from './GithubRibbon';

import {
  StyledActionLog,
  StyledEyecatcher,
  StyledLandingInner,
  StyledLanding,
  StyledLargeFontEyecatcher,
  StyledInfoText,
  StyledChangelog
} from './_styled';

/**
 * The "landing" page where the user can enter a room name to join
 */
const Landing = ({waitingForJoin, actionLog}) => {
  const {t} = useContext(L10nContext);
  if (waitingForJoin) {
    return (
      <StyledLanding>
        <GithubRibbon />
        <StyledLandingInner>
          <Loader t={t} />
        </StyledLandingInner>
      </StyledLanding>
    );
  }

  return (
    <StyledLanding>
      <GithubRibbon />
      <StyledLandingInner>
        <JoinRoomForm />

        <StyledEyecatcher>
          <StyledInfoText small={true}>
            <i className="icon-attention"></i>
            {t('disclaimer')}
          </StyledInfoText>
        </StyledEyecatcher>

        {actionLog && actionLog.length > 0 && (
          <StyledEyecatcher>
            <StyledActionLog>
              {actionLog.map((entry, index) => (
                <li key={`logline_${index}`}>
                  <span>{entry.tstamp}</span>
                  <span>{entry.message}</span>
                </li>
              ))}
            </StyledActionLog>
          </StyledEyecatcher>
        )}

        <StyledEyecatcher>
          <StyledChangelog dangerouslySetInnerHTML={{__html: appConfig.changeLog}} />
        </StyledEyecatcher>
      </StyledLandingInner>
    </StyledLanding>
  );
};

Landing.propTypes = {
  waitingForJoin: PropTypes.bool,
  actionLog: PropTypes.array
};

export default connect((state) => ({
  actionLog: getActionLog(state),
  waitingForJoin: hasMatchingPendingCommand(state, 'joinRoom')
}))(Landing);

const Loader = ({t}) => <StyledLargeFontEyecatcher>{t('loading')}</StyledLargeFontEyecatcher>;

Loader.propTypes = {
  t: PropTypes.func
};
