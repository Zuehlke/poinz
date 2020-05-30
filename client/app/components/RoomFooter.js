import React from 'react';

import appConfig from '../services/appConfig';
import {formatDateTime} from '../services/timeUtil';

const RoomFooter = () => (
  <div className="room-footer">
    <div className="version-info">
      {appConfig.version}
      {formatDateTime(appConfig.buildTime)}
    </div>
  </div>
);

export default RoomFooter;
