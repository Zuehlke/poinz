import React from 'react';

import appConfig from '../services/appConfig';
import {formatDateTime} from '../services/timeUtil';
import {StyledRoomFooter} from '../styled/RoomFooter';

const RoomFooter = () => (
  <StyledRoomFooter>
    <div className="version-info">
      {appConfig.env === 'dev' && (
        <span>
          v{appConfig.version}&nbsp;{appConfig.vcsInfo.branch}&nbsp;{appConfig.vcsInfo.hash}&nbsp;
        </span>
      )}

      {appConfig.env !== 'dev' && <span>v{appConfig.version}&nbsp;</span>}
      {formatDateTime(appConfig.buildTime)}
    </div>
  </StyledRoomFooter>
);

export default RoomFooter;
