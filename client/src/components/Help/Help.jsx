import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {SIDEBAR_HELP} from '../../state/actions/uiStateActions';
import {getCurrentSidebarIfAny} from '../../state/ui/uiSelectors';
import Avatar from '../common/Avatar';
import Changelog from '../common/Changelog';
import appConfig from '../../services/appConfig';

import {StyledHelp, StyledHelpInner} from './_styled';
import {StyledSection} from '../common/_styled';

/**
 */
const Help = ({shown}) => {
  const {t} = useContext(L10nContext);
  return (
    <StyledHelp $shown={shown}>
      <h4>{t('help')}</h4>

      <StyledHelpInner>
        <StyledSection>
          <h5>User manual & Feedback</h5>
          If you need help, please checkout the{' '}
          <a
            href="https://github.com/Zuehlke/poinz/blob/master/docu/manual.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            User Manual
          </a>{' '}
          or get <a href="mailto:xeronimus@gmail.com">in touch!</a>
          <p>
            Also, I&apos;m always interested in your feedback. Please open a{' '}
            <a
              href="https://github.com/Zuehlke/poinz/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discussion on github.
            </a>
          </p>
          <p>
            <Avatar
              user={{email: 'set@zuehlke.com', emailHash: 'd2bb0fb7ae7e208f0a2384ec08d708ef'}}
              index={0}
            />
          </p>
        </StyledSection>

        <StyledSection>
          <Changelog changelog={appConfig.changeLog} />
        </StyledSection>
      </StyledHelpInner>
    </StyledHelp>
  );
};

Help.propTypes = {
  shown: PropTypes.bool
};

export default connect((state) => ({
  shown: getCurrentSidebarIfAny(state) === SIDEBAR_HELP
}))(Help);
