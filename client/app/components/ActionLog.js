import React from 'react';
import { connect } from 'react-redux';

// we do not use momentjs, since we only need one function "format(..)" . momentjs is 15Kb, fecha is 2Kb
// https://github.com/taylorhakes/fecha
import fecha from 'fecha';

const LogLine = ({ entry }) => (
  <li>{fecha.format(entry.get('tstamp'), 'hh:mm')} {entry.get('message')}</li>
);

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

export default connect(
  state => ({
    actionLog: state.get('actionLog')
  })
)(ActionLog);
