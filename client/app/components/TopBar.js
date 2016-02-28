import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleBacklog, toggleUserMenu } from '../services/actions';

const TopBar = ({ roomId, username, toggleBacklog, toggleUserMenu }) => {
  return (
    <div className='top-bar'>
      <div className='poinz-logo'>PoinZ</div>
      <a className='backlog-toggle' onClick={toggleBacklog}>
        <span className='menu-link-inner'>
          <span></span>
        </span>
      </a>
      <span className='whoami'>{username + '@' + roomId}</span>
      <a className='user-menu-toggle' onClick={toggleUserMenu}>
        <i className='fa fa-cog'></i>
      </a>
    </div>
  );
};

export default connect(
  state => ({
    roomId: state.get('roomId'),
    username: state.getIn(['users', state.get('userId'), 'username']) || '-'
  }),
  dispatch => bindActionCreators({toggleBacklog, toggleUserMenu}, dispatch)
)(TopBar);


