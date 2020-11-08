import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SIDEBAR_ACTIONLOG} from '../../actions';

import {
  StyledActionLogInner,
  StyledActionLogList,
  StyledActionLog,
  StyledActionLogListItem
} from './_styled';

/**
 * The ActionLog displays a chronological list of "actions" (backend events)
 */
const ActionLog = ({t, actionLog, shown}) => (
  <StyledActionLog shown={shown}>
    <h4>{t('log')}</h4>

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
  shown: PropTypes.bool,
  actionLog: PropTypes.array
};

export default connect((state) => ({
  t: state.translator,
  shown: state.sidebar === SIDEBAR_ACTIONLOG,
  actionLog: state.actionLog
}))(ActionLog);
