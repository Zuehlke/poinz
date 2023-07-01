import React from 'react';
import PropTypes from 'prop-types';

import {StyledCCTableCell, StyledCCTableRow, StyledColorBadge} from './_styled';

/**
 * one item in the editor. consists of three input fields for label,value,color as well as "move" and "delete" buttons
 */
const CardConfigEditorItem = ({item, isLast, isFirst, onChange, onUp, onDown, onDelete}) => {
  return (
    <StyledCCTableRow>
      <StyledCCTableCell>
        <input type="text" defaultValue={item.label} onBlur={onValueChange.bind(this, 'label')} />
      </StyledCCTableCell>
      <StyledCCTableCell>
        <input
          type="number"
          step="0.5"
          defaultValue={item.value}
          onBlur={onValueChange.bind(this, 'value')}
        />
      </StyledCCTableCell>
      <StyledCCTableCell style={{width: 'auto'}}>
        <StyledColorBadge $color={item.color} />
        <input type="text" defaultValue={item.color} onBlur={onValueChange.bind(this, 'color')} />
      </StyledCCTableCell>
      <StyledCCTableCell>
        <button
          type="button"
          className="pure-button"
          onClick={onUp}
          style={{visibility: isFirst ? 'hidden' : 'visible'}}
        >
          <i className="icon-up-dir"></i>
        </button>
        <button
          type="button"
          className="pure-button"
          onClick={onDown}
          style={{visibility: isLast ? 'hidden' : 'visible'}}
        >
          <i className="icon-down-dir"></i>
        </button>
        <button type="button" className="pure-button" onClick={onDelete}>
          <i className="icon-trash"></i>
        </button>
      </StyledCCTableCell>
    </StyledCCTableRow>
  );

  function onValueChange(propName, e) {
    const changedItem = {...item};
    changedItem[propName] = e.target.value;
    onChange(changedItem);
  }
};

CardConfigEditorItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool,
  isFirst: PropTypes.bool,
  onChange: PropTypes.func,
  onUp: PropTypes.func,
  onDown: PropTypes.func,
  onDelete: PropTypes.func
};

export default CardConfigEditorItem;
