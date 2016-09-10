import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleBacklog, toggleUserMenu, setLanguage } from '../services/actions';

const TopBar = ({ roomId, username, toggleBacklog, toggleUserMenu, setLanguage }) => {
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
        <span className="language-selector">
          <ul>
            <li onClick={() => setLanguage('en')}>en</li>
            <li onClick={() => setLanguage('de')}>de</li>
          </ul>
        </span>
      </span>

      <a className="user-menu-toggle clickable" onClick={toggleUserMenu}>
        <i className="fa fa-cog"></i>
      </a>

    </div>
  );
};

TopBar.propTypes = {
  roomId: React.PropTypes.string,
  username: React.PropTypes.string,
  toggleBacklog: React.PropTypes.func,
  setLanguage: React.PropTypes.func,
  toggleUserMenu: React.PropTypes.func
};

export default connect(
  state => ({
    roomId: state.get('roomId'),
    username: state.getIn(['users', state.get('userId'), 'username']) || '-'
  }),
  dispatch => bindActionCreators({toggleBacklog, toggleUserMenu, setLanguage}, dispatch)
)(TopBar);


