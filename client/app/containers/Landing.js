import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import JoinRoomForm from '../components/JoinRoomForm';
import GithubRibbon from '../components/GithubRibbon';
import {hasMatchingPendingCommand} from '../services/queryPendingCommands';
import {formatTime} from '../services/timeUtil';

/**
 * The "landing" page where the user can enter a room name to join
 */
const Landing = ({t, waitingForJoin, actionLog}) => {
  return (
    <div className="landing">
      <GithubRibbon />
      <div className="landing-inner">
        {!waitingForJoin && <JoinRoomForm />}
        {waitingForJoin && <Loader t={t} />}

        <div className="eyecatcher disclaimer-text">
          <div className="info-text">
            <i className="fa fa-warning leading-paragraph-icon-small"></i>
            {t('disclaimer')}
          </div>
        </div>

        {actionLog && actionLog.length > 0 && (
          <div className="eyecatcher action-log-landing">
            <ul>
              {actionLog.map((entry, index) => (
                <li key={`logline_${index}`}>
                  <span>{formatTime(entry.tstamp)}</span>
                  <span>{entry.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

Landing.propTypes = {
  t: PropTypes.func,
  waitingForJoin: PropTypes.bool,
  actionLog: PropTypes.array
};

export default connect((state) => ({
  t: state.translator,
  actionLog: state.actionLog,
  waitingForJoin: hasMatchingPendingCommand(state, 'joinRoom')
}))(Landing);

const Loader = ({t}) => <div className="eyecatcher loading">{t('loading')}</div>;

Loader.propTypes = {
  t: PropTypes.func
};
