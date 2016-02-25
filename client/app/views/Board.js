import React from 'react';
import { connect } from 'react-redux';

import Backlog from '../components/Backlog';
import Users from '../components/Users';
import Estimation from '../components/Estimation';
import ActionLog from '../components/ActionLog';

const Board = ({ roomId, selectedStory }) => (
  <div className='board' id={roomId}>
    <Users />
    <Backlog />
    {
      selectedStory &&
      <Estimation />
    }
    <ActionLog />
  </div>
);

export default connect(
  state => ({
    roomId: state.get('roomId'),
    selectedStory: state.getIn(['stories', state.get('selectedStory')])
  })
)(Board);
