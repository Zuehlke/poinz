import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {
  StyledActionLogInner,
  StyledActionLogList,
  StyledActionLog,
  StyledActionLogListItem
} from '../styled/ActionLog';

/**
 * The ActionLog displays a chronological list of "actions" (backend events)
 */
const ActionLog = ({t, actionLog, logShown}) => (
  <StyledActionLog shown={logShown}>
    <h5>{t('log')}</h5>

    <StyledActionLogInner>
      <StyledActionLogList>
        {actionLog.map((entry) => (
          <StyledActionLogListItem isError={entry.isError} key={`logline_${entry.logId}`}>
            <span>{entry.tstamp}</span>
            <span style={{whiteSpace: 'pre-line'}}>{entry.message}</span>
          </StyledActionLogListItem>
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
