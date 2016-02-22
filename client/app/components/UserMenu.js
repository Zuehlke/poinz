import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

/**
 * This component has own react state.
 * Local state like menuOpen does not belong into our app-state (redux store)
 */
class UserMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleUsernameInputKeyPress = this.handleUsernameInputKeyPress.bind(this);
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside(e) {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(e.target)) {
      this.setState({
        menuOpen: false
      });
    }
  }

  handleUsernameInputKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.actions.setUsername(this.usernameInputField.value);
    }
  }

  render() {

    const { user, roomId, moderatorId, actions } = this.props;

    const username = user.get('username');
    const isVisitor = user.get('visitor');
    const isModerator = user.get('id') === moderatorId;

    const dropDownClasses = classnames('pure-menu-item pure-menu-has-children', {
      'pure-menu-active': this.state.menuOpen
    });

    const visitorItemClasses = classnames('pure-menu-item', {
      'menu-item-visitor': isVisitor
    });

    return (
      <div className="pure-menu pure-menu-horizontal">
        <ul className="pure-menu-list">
          <li className={dropDownClasses}>
            <a href="#" className="pure-menu-link pure-menu-toggle"
               onClick={this.toggleMenu }>{(username || '-') + '@' + roomId}</a>
            <ul className="pure-menu-children">
              <li className='pure-menu-item'>
                <input className='username-input'
                       placeholder='Your Username...'
                       defaultValue={username}
                       type='text'
                       ref={ref => this.usernameInputField = ref}
                       onKeyPress={this.handleUsernameInputKeyPress}/>
              </li>
              {!isModerator &&
                <li className={visitorItemClasses}>
                  <a href="#" className="pure-menu-link"
                     onClick={actions.toggleVisitor}>Visitor</a>
                </li>
              }
              <li className="pure-menu-item">
                <a href="#" className="pure-menu-link"
                   onClick={actions.leaveRoom}>Leave Room</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserMenu;
