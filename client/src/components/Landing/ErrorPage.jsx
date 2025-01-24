import React from 'react';

import {StyledEyecatcher, StyledInfoText, StyledLanding, StyledLandingInner} from './_styled';
import Global from '../../_styled';

const ErrorPage = () => {
  return (
    <StyledLanding>
      <Global />
      <StyledLandingInner>
        <StyledEyecatcher>
          <StyledInfoText>
            <i className="icon-attention-circled"></i>
            <p>
              We are sorry, there seems to be a problem...
              <br />
              Please try again. Or <a href="mailto:xeronimus@gmail.com">get in touch</a>, if the
              error persists.
            </p>
          </StyledInfoText>
        </StyledEyecatcher>
      </StyledLandingInner>
    </StyledLanding>
  );
};

export default ErrorPage;
