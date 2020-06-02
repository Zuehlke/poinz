import React from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {formatTime} from '../services/timeUtil';

/**
 * The ActionLog displays a chronological list of "actions" (backend events)
 */
const ActionLog = ({t, actionLog, logShown}) => {
  const actionLogClasses = classnames('action-log', {
    'action-log-active': logShown
  });

  return (
    <div className={actionLogClasses}>
      <h5>{t('log')}</h5>
      <div className="action-log-wrapper">
        <ul>
          {actionLog.map((entry, index) => (
            <li key={`logline_${index}`}>
              <span>{formatTime(entry.tstamp)}</span>
              <span>{entry.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

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
