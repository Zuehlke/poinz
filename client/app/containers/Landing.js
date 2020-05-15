import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import CreateRoomForm from '../components/CreateRoomForm';
import GithubRibbon from '../components/GithubRibbon';

/**
 * The "landing" page where the user can enter a room name to join
 */
const Landing = ({t, waitingForJoin}) => {
  return (
    <div className="landing">
      <GithubRibbon />
      <div className="landing-inner">
        {!waitingForJoin && <CreateRoomForm />}
        {waitingForJoin && <Loader t={t} />}
      </div>
    </div>
  );
};

Landing.propTypes = {
  t: PropTypes.func,
  waitingForJoin: PropTypes.bool
};

export default connect((state) => ({
  t: state.translator,
  waitingForJoin: !!Object.values(state.pendingCommands).find((cmd) => cmd.name === 'joinRoom')
}))(Landing);

const Loader = ({t}) => <div className="eyecatcher loading">{t('loading')}</div>;

Loader.propTypes = {
  t: PropTypes.func
};
