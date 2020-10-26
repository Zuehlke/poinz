import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyledHelp, StyledHelpInner} from '../styled/Help';

/**
 */
const Help = ({t, helpShown}) => (
  <StyledHelp shown={helpShown}>
    <h5>{t('help')}</h5>

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
        or get{' '}
        <a href="https://github.com/Zuehlke/poinz/issues" target="_blank" rel="noopener noreferrer">
          in touch!
        </a>
      </p>

      <p>Also, I&apos;m always interested in your feedback. Please open an Issue on github...</p>
    </StyledHelpInner>
  </StyledHelp>
);

Help.propTypes = {
  t: PropTypes.func,
  helpShown: PropTypes.bool
};

export default connect((state) => ({
  t: state.translator,
  helpShown: state.helpShown
}))(Help);
