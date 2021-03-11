import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';

const BacklogModeButtons = ({
  onShowBacklog,
  onShowTrash,
  trashShown,
  trashedStoriesCount,
  activeStoriesCount
}) => {
  const {t} = useContext(L10nContext);
  return (
    <div className="pure-g">
      <button
        title={t('backlog')}
        type="button"
        className={'pure-u-1-2 pure-button pure-button-stripped ' + (trashShown ? '' : 'active')}
        onClick={onShowBacklog}
        data-testid="backlogModeActiveStories"
      >
        <i className="icon-list-bullet"></i> {t('backlog')} ({activeStoriesCount})
      </button>
      <button
        title={t('trash')}
        type="button"
        className={'pure-u-1-2 pure-button pure-button-stripped ' + (trashShown ? 'active' : '')}
        onClick={onShowTrash}
        data-testid="backlogModeTrashedStories"
      >
        <i className="icon-trash-empty"></i> {t('trash')} ({trashedStoriesCount})
      </button>
    </div>
  );
};

BacklogModeButtons.propTypes = {
  trashShown: PropTypes.bool,
  onShowBacklog: PropTypes.func.isRequired,
  onShowTrash: PropTypes.func.isRequired,
  trashedStoriesCount: PropTypes.number.isRequired,
  activeStoriesCount: PropTypes.number.isRequired
};

export default BacklogModeButtons;
