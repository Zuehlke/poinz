/**
 * Created by yapi on 26.01.17.
 */
import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';


//The different notification's types
export const TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info'
};

//The notification timeout in milliseconds
const TIME_OUT = 1300;

/**
 * Notification component used to display info, success, warning or error
 * notifications
 */
class Notification extends React.Component {

  componentDidMount() {
    this.displayNotification(this.props.type, this.props.message);
  }

  /**
   * Display the notification
   * @param type the type of notification that should be displayed
   * @param message the message of the notification
   */
  displayNotification(type, message) {
    switch (type) {
      case TYPE.INFO:
        NotificationManager.info(message, 'Info', TIME_OUT);
        break;
      case TYPE.SUCCESS:
        NotificationManager.success(message, 'Success', TIME_OUT);
        break;
      case TYPE.WARNING:
        NotificationManager.warning(message, 'Warning', TIME_OUT);
        break;
      case TYPE.ERROR:
        NotificationManager.error(message, 'Error', TIME_OUT);
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

Notification.propTypes = {
  type: React.PropTypes.string,
  message: React.PropTypes.string
};

export default Notification;
