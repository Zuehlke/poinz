import React from 'react';
import Immutable from 'immutable';
import classnames from 'classnames';
import {connect} from 'react-redux';

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
              {fecha.format(entry.get('tstamp'), 'HH:mm')} {entry.get('message')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ActionLog.propTypes = {
  t: React.PropTypes.func,
  logShown: React.PropTypes.bool,
  actionLog: React.PropTypes.instanceOf(Immutable.List)
};

export default connect(
  state => ({
    t: state.get('translator'),
    logShown: state.get('logShown'),
    actionLog: state.get('actionLog')
  })
)(ActionLog);
