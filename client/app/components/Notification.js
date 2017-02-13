/**
 * Created by yapi on 26.01.17.
 */
import {NotificationManager} from 'react-notifications';


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
 * Display the notification
 * @param type the type of notification that should be displayed
 * @param message the message of the notification
 */
export default function displayNotification(type, message) {
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
