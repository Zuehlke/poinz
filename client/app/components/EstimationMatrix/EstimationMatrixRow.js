import React from 'react';
import PropTypes from 'prop-types';

import {StyledEMRow, StyledEstimationMatrixCell} from './_styled';

const EstimationMatrixRow = ({story, columnWidthPercentage, cardConfig}) => (
  <StyledEMRow>
    {cardConfig.map((cc) =>
      cc.value === story.consensus ? (
        <StyledEstimationMatrixCell
          key={story.id + ':' + cc.value}
          width={columnWidthPercentage}
          color={cc.color}
        >
          <h4 title={cc.label}>{story.title}</h4>
        </StyledEstimationMatrixCell>
      ) : (
        <StyledEstimationMatrixCell key={story.id + ':' + cc.value} width={columnWidthPercentage} />
      )
    )}
  </StyledEMRow>
);

EstimationMatrixRow.propTypes = {
  story: PropTypes.object,
  columnWidthPercentage: PropTypes.number,
  cardConfig: PropTypes.array
};

export default EstimationMatrixRow;
