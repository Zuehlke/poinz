import React from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {toggleMarkdownEnabled} from '../../state/actions/uiStateActions';

import {StyledStoryText, StyledToggleIcon} from './_styled';

const StoryDescription = ({text, markdownEnabled, toggleMarkdownEnabled}) => {
  return (
    <React.Fragment>
      <StyledStoryText md={markdownEnabled}>
        {markdownEnabled && (
          <ReactMarkdown linkTarget="_blank" remarkPlugins={[remarkGfm]}>
            {text || ''}
          </ReactMarkdown>
        )}
        {!markdownEnabled && <Anchorify text={text || ''} />}
      </StyledStoryText>

      <StyledToggleIcon
        on={markdownEnabled ? '1' : ''}
        className="icon-markdown"
        onClick={toggleMarkdownEnabled}
      ></StyledToggleIcon>
    </React.Fragment>
  );
};

StoryDescription.propTypes = {
  text: PropTypes.string,
  markdownEnabled: PropTypes.bool,
  toggleMarkdownEnabled: PropTypes.func
};

export default connect(
  (state) => ({
    markdownEnabled: state.ui.markdownEnabled
  }),
  {toggleMarkdownEnabled}
)(StoryDescription);
