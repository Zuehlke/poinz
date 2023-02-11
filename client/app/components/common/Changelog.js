import React from 'react';
import PropTypes from 'prop-types';

import {StyledChangelog} from './_styled';

/**
 * Displays a list of Poinz versions (changelog items)
 * The input data is parsed from CHANGELOG.md during webpack build...
 */
const Changelog = ({changelog}) => {
  return (
    <StyledChangelog>
      <h4>Changelog</h4>
      <ul>
        {changelog.map((ci, outerI) => (
          <li key={'cv_' + outerI}>
            <h1>
              {ci.version}: {ci.date}
            </h1>
            <ul>
              {ci.changes.map((ch, i) => (
                <li key={'change_' + outerI + '_' + i}>{ch}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </StyledChangelog>
  );
};

Changelog.propTypes = {
  changelog: PropTypes.array
};

export default Changelog;
