/**
 * Created by yapi on 26.01.17.
 */
import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

/**
 * PopUp component used to display the success
 * notification when the team has achieved a consent on the story points
 */
class PopUp extends React.Component {

  componentDidMount() {
    this.displayNotification(this.props.messageType, this.props.message);
  }

  /**
   * Display the notification
   * @param type the type of notification that should be displayed
   * @param message the message of the notification
   */
  displayNotification(type, message) {
    switch (type) {
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success':
        NotificationManager.success(message, 'Success', 1300);
        break;
      case 'warning':
        NotificationManager.warning(message, 'Warning', 1300);
        break;
      case 'error':
        NotificationManager.error(message, 'Error', 1300);
        break;
    }
  }

  render() {
    return (
      <div>
        <NotificationContainer/>
      </div>
    );
  }
}

PopUp.propTypes = {
  messageType: React.PropTypes.string,
  message : React.PropTypes.string
};

export default PopUp;
