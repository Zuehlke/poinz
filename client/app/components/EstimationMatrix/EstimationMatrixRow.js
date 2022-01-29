import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import ValueBadge from '../common/ValueBadge';
import {L10nContext} from '../../services/l10n';

import {StyledEMRow, StyledEMRowDate, StyledEstimationMatrixCell} from './_styled';

const EstimationMatrixRow = ({story, columnWidthPercentage, cardConfig}) => {
  const {format} = useContext(L10nContext);

  return (
    <StyledEMRow>
      <div>
        <div>
          <h4>{story.title}</h4>
        </div>
        <StyledEMRowDate>{format.formatDateTime(story.createdAt)}</StyledEMRowDate>
      </div>

      {cardConfig.map((cc) =>
        cc.value === story.consensus ? (
          <StyledEstimationMatrixCell key={story.id + ':' + cc.value} width={columnWidthPercentage}>
            <ValueBadge cardValue={story.consensus} />
          </StyledEstimationMatrixCell>
        ) : (
          <StyledEstimationMatrixCell
            key={story.id + ':' + cc.value}
            width={columnWidthPercentage}
          />
        )
      )}
    </StyledEMRow>
  );
};

EstimationMatrixRow.propTypes = {
  story: PropTypes.object,
  columnWidthPercentage: PropTypes.number,
  cardConfig: PropTypes.array
};

export default EstimationMatrixRow;
