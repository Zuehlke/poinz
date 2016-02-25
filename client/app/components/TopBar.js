import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleBacklog, toggleUserMenu } from '../services/actions';

const TopBar = ({ toggleBacklog, toggleUserMenu }) => {
  return (
    <div className='top-bar'>
      <a href='#menu' className='backlog-toggle' onClick={toggleBacklog}>
        <span className='menu-link-inner'>
          <span></span>
        </span>
      </a>
      <a href='#menu' className='user-menu-toggle' onClick={toggleUserMenu}>
        <i className='fa fa-cog'></i>
      </a>
    </div>
  );

};


export default connect(
  undefined,
  dispatch => bindActionCreators({toggleBacklog, toggleUserMenu}, dispatch)
)(TopBar);


