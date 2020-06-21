import React from 'react';

import appConfig from '../services/appConfig';
import {formatDateTime} from '../services/timeUtil';

const RoomFooter = () => (
  <div className="room-footer">
    <div className="license-hint">
      Avatar Icons (c) by DELEKET{' '}
      <a href="https://www.deviantart.com/deleket">https://www.deviantart.com/deleket</a>
    </div>
    <div className="version-info">
      {appConfig.version}
      {formatDateTime(appConfig.buildTime)}
    </div>
  </div>
);

export default RoomFooter;
