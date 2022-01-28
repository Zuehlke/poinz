import React, {useState} from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {toggleMarkdownEnabled} from '../../state/actions/uiStateActions';
import {StyledStoryText, StyledStoryTextExpandButton, StyledToggleIcon} from './_styled';

const StoryDescription = ({
  textExpandThreshold = 200,
  text = '',
  markdownEnabled,
  toggleMarkdownEnabled,
  showMarkdownToggle = true,
  scroll = true
}) => {
  const [textExpanded, setTextExpanded] = useState(false);
  const originalTextLength = text.length;
  const textToDisplay =
    originalTextLength <= textExpandThreshold || textExpanded
      ? text
      : text.substring(0, textExpandThreshold) + '...';

  return (
    <React.Fragment>
      <StyledStoryText md={markdownEnabled} scroll={scroll} data-testid="storyText">
        {markdownEnabled && (
          <ReactMarkdown linkTarget="_blank" remarkPlugins={[remarkGfm]}>
            {textToDisplay}
          </ReactMarkdown>
        )}
        {!markdownEnabled && <Anchorify text={textToDisplay} />}

        {originalTextLength > textExpandThreshold && !textExpanded && (
          <StyledStoryTextExpandButton
            className="pure-button pure-button-primary"
            onClick={() => setTextExpanded(true)}
          >
            <i className="icon-angle-double-down"></i>
          </StyledStoryTextExpandButton>
        )}
        {originalTextLength > textExpandThreshold && textExpanded && (
          <StyledStoryTextExpandButton
            className="pure-button pure-button-primary"
            onClick={() => setTextExpanded(false)}
          >
            <i className="icon-angle-double-up"></i>
          </StyledStoryTextExpandButton>
        )}
      </StyledStoryText>

      {showMarkdownToggle && (
        <StyledToggleIcon
          on={markdownEnabled ? '1' : ''}
          className="icon-markdown"
          onClick={toggleMarkdownEnabled}
        ></StyledToggleIcon>
      )}
    </React.Fragment>
  );
};

StoryDescription.propTypes = {
  text: PropTypes.string,
  markdownEnabled: PropTypes.bool,
  toggleMarkdownEnabled: PropTypes.func,
  showMarkdownToggle: PropTypes.bool,
  scroll: PropTypes.bool,
  textExpandThreshold: PropTypes.number
};

export default connect(
  (state) => ({
    markdownEnabled: state.ui.markdownEnabled
  }),
  {toggleMarkdownEnabled}
)(StoryDescription);
