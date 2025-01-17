import React, {useContext} from 'react';

import appConfig from '../../services/appConfig';

import {StyledRoomFooter} from './_styled';
import {L10nContext} from '../../services/l10n';

const RoomFooter = () => {
  const {format} = useContext(L10nContext);

  return (
    <StyledRoomFooter>
      <div className="version-info">
        {appConfig.env === 'dev' && (
          <span>
            v{appConfig.version}&nbsp;{appConfig.vcsInfo.branch}&nbsp;{appConfig.vcsInfo.hash}&nbsp;
          </span>
        )}

        {appConfig.env !== 'dev' && <span>v{appConfig.version}&nbsp;</span>}
        {format.formatDateTime(appConfig.buildTime)}
      </div>
    </StyledRoomFooter>
  );
};

export default RoomFooter;
