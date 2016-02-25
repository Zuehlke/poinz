import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleMenu } from '../services/actions';


import UserMenu from './UserMenu';

const TopBar = ({ toggleMenu }) => {
  return (
    <div className='top-bar'>
      <a href='#menu' className='menu-link' onClick={toggleMenu}>
        <span className='menu-link-inner'>
          <span></span>
        </span>
      </a>
      <div className='whoami'>
        <UserMenu  />
      </div>
    </div>
  );

};


export default connect(
  undefined,
  dispatch => bindActionCreators({toggleMenu}, dispatch)
)(TopBar);


