import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleBacklog, toggleUserMenu, toggleLog } from '../actions';

const TopBar = ({
  username,
  toggleBacklog,
  toggleUserMenu,
  toggleLog,
  userMenuShown,
  logShown,
  backlogShown
}) => {
  return (
    <div className="top-bar">
      <div className="poinz-logo">PoinZ</div>
      <a
        className={`backlog-toggle clickable ${backlogShown ? 'pure-button-active' : ''}`}
        onClick={toggleBacklog}
      >
        <span className="menu-link-inner">
          <span></span>
        </span>
      </a>

      <span className="quick-menu">
        <span className="whoami">{username}</span>
      </span>

      <a
        className={`user-menu-toggle clickable pure-button pure-button-primary ${
          userMenuShown ? 'pure-button-active' : ''
        } `}
        onClick={toggleUserMenu}
      >
        <i className="fa fa-cog"></i>
      </a>
      <a
        className={`log-toggle clickable pure-button pure-button-primary ${
          logShown ? 'pure-button-active' : ''
        }`}
        onClick={toggleLog}
      >
        <i className="fa fa-list"></i>
      </a>
    </div>
  );
};

TopBar.propTypes = {
  userMenuShown: PropTypes.bool,
  backlogShown: PropTypes.bool,
  logShown: PropTypes.bool,
  username: PropTypes.string,
  toggleBacklog: PropTypes.func,
  toggleUserMenu: PropTypes.func,
  toggleLog: PropTypes.func
};

export default connect(
  (state) => ({
    userMenuShown: state.userMenuShown,
    backlogShown: state.backlogShown,
    logShown: state.logShown,
    username: state.users && state.users[state.userId] ? state.users[state.userId].username : '-'
  }),
  { toggleBacklog, toggleUserMenu, toggleLog }
)(TopBar);
