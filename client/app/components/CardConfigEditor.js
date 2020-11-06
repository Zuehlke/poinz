import React, {useState, useEffect} from 'react';
import {v4 as uuid} from 'uuid';
import PropTypes from 'prop-types';

import {
  AddItemButton,
  ErrorMsg,
  StyledCardConfigEditor,
  StyledCCTableCell,
  StyledColorBadge,
  StyledItems,
  StyledTextarea
} from '../styled/CardConfigEditor';

/**
 *
 */
export const CardConfigEditor = ({cardConfig, onSave, t}) => {
  const [validationError, setValidationError] = useState('');
  const [internalCC, setInternalCC] = useState(addIds(cardConfig));
  const [showTextEditor, setShowTextEditor] = useState(false);

  useEffect(() => {
    setInternalCC(addIds(cardConfig));
  }, [cardConfig]);

  return (
    <StyledCardConfigEditor>
      <div className="pure-g">
        <button
          className={`pure-u-1-2 pure-button pure-button-stripped ${
            showTextEditor ? '' : 'active'
          }`}
          type="button"
          onClick={setShowTextEditor.bind(undefined, false)}
        >
          <i className="icon-magic"></i> Editor
        </button>
        <button
          className={`pure-u-1-2 pure-button pure-button-stripped ${
            showTextEditor ? 'active' : ''
          }`}
          type="button"
          onClick={setShowTextEditor.bind(undefined, true)}
        >
          <i className="icon-code"></i> Text
        </button>
      </div>

      {showTextEditor && (
        <StyledTextarea
          value={JSON.stringify(stripIds(internalCC), null, 4)}
          onChange={onTextChange}
        />
      )}

      {!showTextEditor && (
        <StyledItems>
          {internalCC.map((ccItem, index) => (
            <CardConfigItem
              key={ccItem.id}
              item={ccItem}
              isFirst={index === 0}
              isLast={index === internalCC.length - 1}
              onChange={onChangedItem.bind(undefined, index)}
              onDelete={onDelete.bind(undefined, index)}
              onUp={onUp.bind(undefined, index)}
              onDown={onDown.bind(undefined, index)}
            />
          ))}
          <AddItemButton className="pure-button" type="button" onClick={onAdd}>
            <i className="icon-plus"></i> Add Card
          </AddItemButton>
        </StyledItems>
      )}

      {validationError && <ErrorMsg>{validationError}</ErrorMsg>}

      <button
        type="button"
        className="pure-button pure-button-primary"
        onClick={() => onSave(stripIds(internalCC))}
        disabled={validationError}
      >
        {t('iKnowWhatImDoin')} <i className="icon-floppy" />
      </button>
    </StyledCardConfigEditor>
  );

  function onAdd() {
    const modifiedInternalCC = [...internalCC, {id: uuid(), label: 'new', value: 0, color: '#888'}];
    setAndValidate(modifiedInternalCC);
  }

  function onTextChange(e) {
    try {
      const modifiedCC = JSON.parse(e.target.value);
      setAndValidate(addIds(modifiedCC));
    } catch (err) {
      setValidationError(t('customCardsJsonError'));
    }
  }

  function setAndValidate(cc) {
    const valueArray = cc.map((i) => i.value);
    if (new Set(valueArray).size !== valueArray.length) {
      setValidationError(t('customCardsDuplicateError'));
    } else {
      setValidationError('');
    }

    setInternalCC(cc);
  }

  function stripIds(cc) {
    return cc.map((item) => {
      const itemWitouthId = {...item};
      delete itemWitouthId.id;
      return itemWitouthId;
    });
  }

  function addIds(cc) {
    if (!cc) {
      return [];
    }
    return cc.map((ccItem) => ({...ccItem, id: uuid()}));
  }

  function onChangedItem(index, changedItem) {
    const modifiedInternalCC = internalCC.map((item, ind) => (ind === index ? changedItem : item));
    setAndValidate(modifiedInternalCC);
  }

  function onDelete(index) {
    const modifiedInternalCC = internalCC.filter((item, ind) => ind !== index);
    setAndValidate(modifiedInternalCC);
  }

  function onUp(index) {
    move(index, index - 1);
  }

  function onDown(index) {
    move(index, index + 1);
  }

  function move(oldIndex, newIndex) {
    if (newIndex > -1 && newIndex < internalCC.length) {
      const modifiedInternalCC = internalCC.slice();
      const removedElement = modifiedInternalCC.splice(oldIndex, 1)[0];
      modifiedInternalCC.splice(newIndex, 0, removedElement);
      setAndValidate(modifiedInternalCC);
    }
  }
};

CardConfigEditor.propTypes = {
  cardConfig: PropTypes.array,
  onSave: PropTypes.func,
  t: PropTypes.func
};

/**
 * one item in the editor. consists of three input fields for label,value,color as well as "move" and "delete" buttons
 */
const CardConfigItem = ({item, isLast, isFirst, onChange, onUp, onDown, onDelete}) => {
  return (
    <React.Fragment>
      <StyledCCTableCell style={{width: '25%'}}>
        <input type="text" defaultValue={item.label} onBlur={onValueChange.bind(this, 'label')} />
      </StyledCCTableCell>
      <StyledCCTableCell style={{width: '10%'}}>
        <input
          type="number"
          step="0.5"
          defaultValue={item.value}
          onBlur={onValueChange.bind(this, 'value')}
        />
      </StyledCCTableCell>
      <StyledCCTableCell style={{width: '40%'}}>
        <StyledColorBadge color={item.color} />
        <input type="text" defaultValue={item.color} onBlur={onValueChange.bind(this, 'color')} />
      </StyledCCTableCell>
      <StyledCCTableCell style={{width: '24%'}}>
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
    </React.Fragment>
  );

  function onValueChange(propName, e) {
    const changedItem = {...item};
    changedItem[propName] = e.target.value;
    onChange(changedItem);
  }
};

CardConfigItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool,
  isFirst: PropTypes.bool,
  t: PropTypes.func,
  onChange: PropTypes.func,
  onUp: PropTypes.func,
  onDown: PropTypes.func,
  onDelete: PropTypes.func
};
