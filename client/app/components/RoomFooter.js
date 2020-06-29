import React from 'react';

import appConfig from '../services/appConfig';
import {formatDateTime} from '../services/timeUtil';
import {StyledRoomFooter} from '../styled/RoomFooter';

const RoomFooter = () => (
  <StyledRoomFooter>
    <div className="version-info">
      {appConfig.version}
      {formatDateTime(appConfig.buildTime)}
    </div>
  </StyledRoomFooter>
);

export default RoomFooter;
