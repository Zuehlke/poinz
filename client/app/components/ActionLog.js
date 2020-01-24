import React from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// we do not use momentjs, since we only need one function "format(..)" . momentjs is 15Kb, fecha is 2Kb
// https://github.com/taylorhakes/fecha
// see https://www.npmjs.com/package/fecha#formatting-tokens for format
import fecha from 'fecha';

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
              {fecha.format(entry.tstamp, 'HH:mm')} {entry.message}
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

export default connect(
  state => ({
    t: state.translator,
    logShown: state.logShown,
    actionLog: state.actionLog
  })
)(ActionLog);
