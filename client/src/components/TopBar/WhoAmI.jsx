import React, {useRef, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Avatar from '../common/Avatar';
import {getOwnUser} from '../../state/users/usersSelectors';
import {getRoomId} from '../../state/room/roomSelectors';
import useOutsideClick from '../common/useOutsideClick';

import {StyledWhoAmI} from './_styled';
import {StyledDropdown} from '../common/_styled';

const WhoAmI = ({user, roomId}) => {
  const roomUrl = `${window.location.origin}/${roomId}`;
  const whoamIRef = useRef(null);
  const [extended, setExtended] = useState(false);

  useOutsideClick(whoamIRef, () => setExtended(false));

  return (
    <StyledWhoAmI data-testid="whoami" ref={whoamIRef}>
      <Avatar user={user} isOwn={false} shaded={false} onClick={() => setExtended(!extended)} />

      {extended && (
        <StyledDropdown data-testid="whoamiDropdown" className="pure-form">
          <div>
            <i className="icon-user" /> {user.username}
          </div>
          <div>
            <i className="icon-share" />
            <input type="text" defaultValue={roomUrl} readOnly onClick={(e) => e.target.select()} />
          </div>
        </StyledDropdown>
      )}
    </StyledWhoAmI>
  );
};

WhoAmI.propTypes = {
  user: PropTypes.object,
  roomId: PropTypes.string
};

export default connect((state) => ({
  roomId: getRoomId(state),
  user: getOwnUser(state)
}))(WhoAmI);
