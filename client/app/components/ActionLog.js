import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

// we do not use momentjs, since we only need one function "format(..)" . momentjs is 15Kb, fecha is 2Kb
// https://github.com/taylorhakes/fecha
// see https://www.npmjs.com/package/fecha#formatting-tokens for format
import fecha from 'fecha';

const LogLine = ({ entry }) => (
  <li>{fecha.format(entry.get('tstamp'), 'HH:mm')} {entry.get('message')}</li>
);

LogLine.propTypes = {
  entry: React.PropTypes.instanceOf(Immutable.Map)
};

const ActionLog = ({ actionLog }) => (
  <div className='action-log'>
    <ul>
      {actionLog.map((entry, index) => (
        <LogLine
          key={`logline_${index}`}
          entry={entry}
        />
      ))}
    </ul>

  </div>
);

ActionLog.propTypes = {
  actionLog: React.PropTypes.instanceOf(Immutable.List)
};

export default connect(
  state => ({
    actionLog: state.get('actionLog')
  })
)(ActionLog);
