import React from 'react';
import { connect } from 'react-redux';

import Backlog from '../components/Backlog';
import Users from '../components/Users';
import Estimation from '../components/Estimation';

const Board = ({ roomId, selectedStory }) => (
  <div className='board' id={roomId}>
    <Users />
    <Backlog />
    {
      selectedStory &&
      <Estimation />
    }
  </div>
);

export default connect(
  state => ({
    roomId: state.get('roomId'),
    selectedStory: state.getIn(['stories', state.get('selectedStory')])
  })
)(Board);
