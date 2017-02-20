/**
 * Created by yapi on 26.01.17.
 */
import {NotificationManager} from 'react-notifications';
import log from 'loglevel';

const LOGGER = log.getLogger('Notification');

//The different notification's types
export const TYPE = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info'
};

//The notification timeout in milliseconds
const TIME_OUT = 1300;

/**
 * Display the notification
 * @param type the type of notification that should be displayed
 * @param message the message of the notification
 */
export default function displayNotification(type, message) {
  if (TYPE.hasOwnProperty(type)) {
    NotificationManager[type](message, type.toUpperCase(), TIME_OUT);
  }else{
    LOGGER.error('The notification type '+type+' is not recognised. Recognised types are success, warning, error and info.');
  }
}
