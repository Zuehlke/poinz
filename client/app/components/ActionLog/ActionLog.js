import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SIDEBAR_ACTIONLOG} from '../../state/actions/uiStateActions';
import {getActionLog} from '../../state/actionLog/actionLogSelectors';
import {getCurrentSidebarIfAny} from '../../state/ui/uiSelectors';
import {L10nContext} from '../../services/l10n';

import {
  StyledActionLogInner,
  StyledActionLogList,
  StyledActionLog,
  StyledActionLogListItem
} from './_styled';

/**
 * The ActionLog displays a chronological list of "actions" (backend events)
 */
const ActionLog = ({actionLog, shown}) => {
  const {t} = useContext(L10nContext);
  return (
    <StyledActionLog $shown={shown}>
      <h4>{t('log')}</h4>

      <StyledActionLogInner>
        <StyledActionLogList>
          {actionLog.map((entry) => (
            <StyledActionLogListItem $isError={entry.isError} key={`logline_${entry.logId}`}>
              <span>{entry.tstamp}</span>
              <span style={{whiteSpace: 'pre-line'}}>{entry.message}</span>
            </StyledActionLogListItem>
          ))}
        </StyledActionLogList>
      </StyledActionLogInner>
    </StyledActionLog>
  );
};

ActionLog.propTypes = {
  shown: PropTypes.bool,
  actionLog: PropTypes.array
};

export default connect((state) => ({
  shown: getCurrentSidebarIfAny(state) === SIDEBAR_ACTIONLOG,
  actionLog: getActionLog(state)
}))(ActionLog);
