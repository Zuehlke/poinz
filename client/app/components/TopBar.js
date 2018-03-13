import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {toggleBacklog, toggleUserMenu, toggleLog} from '../actions';

const TopBar = ({roomId, username, toggleBacklog, toggleUserMenu, toggleLog}) => {
  return (
    <div className="top-bar">
      <div className="poinz-logo">PoinZ</div>
      <a className="backlog-toggle clickable" onClick={toggleBacklog}>
        <span className="menu-link-inner">
          <span></span>
        </span>
      </a>

      <span className="quick-menu">
        <span className="whoami">{username + '@' + roomId}</span>
      </span>

      <a className="user-menu-toggle clickable" onClick={toggleUserMenu}>
        <i className="fa fa-cog"></i>
      </a>
      <a className="log-toggle clickable" onClick={toggleLog}>
        <i className="fa fa-list"></i>
      </a>

    </div>
  );
};

TopBar.propTypes = {
  roomId: PropTypes.string,
  username: PropTypes.string,
  toggleBacklog: PropTypes.func,
  toggleUserMenu: PropTypes.func,
  toggleLog: PropTypes.func
};

export default connect(
  state => ({
    roomId: state.get('roomId'),
    username: state.getIn(['users', state.get('userId'), 'username']) || '-'
  }),
  dispatch => bindActionCreators({toggleBacklog, toggleUserMenu, toggleLog}, dispatch)
)(TopBar);


