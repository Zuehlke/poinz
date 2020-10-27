import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyledHelp, StyledHelpInner} from '../styled/Help';
import {SIDEBAR_HELP} from '../actions';
import Avatar from './Avatar';

/**
 */
const Help = ({t, shown}) => (
  <StyledHelp shown={shown}>
    <h4>{t('help')}</h4>

    <StyledHelpInner>
      <p>
        If you need help, please checkout the{' '}
        <a
          href="https://github.com/Zuehlke/poinz/blob/master/manual.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          User Manual
        </a>{' '}
        or get <a href="mailto:xeronimus@gmail.com">in touch!</a>
      </p>

      <p>
        Also, I&apos;m always interested in your feedback. Please open an{' '}
        <a href="https://github.com/Zuehlke/poinz/issues" target="_blank" rel="noopener noreferrer">
          Issue on github.
        </a>
      </p>

      <p>
        {' '}
        <Avatar
          user={{email: 'set@zuehlke.com', emailHash: 'd2bb0fb7ae7e208f0a2384ec08d708ef'}}
          index={0}
        />
      </p>
    </StyledHelpInner>
  </StyledHelp>
);

Help.propTypes = {
  t: PropTypes.func,
  shown: PropTypes.bool
};

export default connect((state) => ({
  t: state.translator,
  shown: state.sidebar === SIDEBAR_HELP
}))(Help);
