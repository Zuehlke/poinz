import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {formatTime} from '../services/timeUtil';
import {StyledActionLogInner, StyledActionLogList, StyledActionLog} from '../styled/ActionLog';

/**
 * The ActionLog displays a chronological list of "actions" (backend events)
 */
const ActionLog = ({t, actionLog, logShown}) => (
  <StyledActionLog shown={logShown}>
    <h5>{t('log')}</h5>

    <StyledActionLogInner>
      <StyledActionLogList>
        {actionLog.map((entry, index) => (
          <li key={`logline_${index}`}>
            <span>{formatTime(entry.tstamp)}</span>
            <span>{entry.message}</span>
          </li>
        ))}
      </StyledActionLogList>
    </StyledActionLogInner>
  </StyledActionLog>
);

ActionLog.propTypes = {
  t: PropTypes.func,
  logShown: PropTypes.bool,
  actionLog: PropTypes.array
};

export default connect((state) => ({
  t: state.translator,
  logShown: state.logShown,
  actionLog: state.actionLog
}))(ActionLog);
