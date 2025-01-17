import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Avatar from '../common/Avatar';
import {hideNewUserHints} from '../../state/actions/uiStateActions';

import {StyledFeedbackHint} from './_styled';

const FeedbackHint = ({hintsHidden, hideNewUserHints}) => {
  if (hintsHidden) {
    return null;
  }

  return (
    <StyledFeedbackHint>
      <i className="icon-cancel hide-hints" onClick={() => hideNewUserHints()}></i>
      <div style={{width: '45px'}}>
        <Avatar
          user={{email: 'set@zuehlke.com', emailHash: 'd2bb0fb7ae7e208f0a2384ec08d708ef'}}
          index={0}
        />
      </div>
      <div>
        Hey there! Do you use Poinz on a regular basis? I would be very interested in your{' '}
        <a href="https://github.com/Zuehlke/poinz/issues" target="_blank" rel="noopener noreferrer">
          feedback!
        </a>
      </div>
    </StyledFeedbackHint>
  );
};

FeedbackHint.propTypes = {
  hintsHidden: PropTypes.bool,
  hideNewUserHints: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    hintsHidden: state.ui.newUserHintHidden
  }),
  {hideNewUserHints}
)(FeedbackHint);
