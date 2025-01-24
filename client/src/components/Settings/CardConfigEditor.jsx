import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import uuid from '../../services/uuid';
import CardConfigEditorItem from './CardConfigEditorItem';

import {
  AddItemButton,
  ErrorMsg,
  StyledCadConfigEditor,
  StyledCCTableCell,
  StyledCCTableHeader,
  StyledItems,
  StyledTextarea
} from './_styled';

/**
 *
 */
export const CardConfigEditor = ({cardConfig, onSave, t}) => {
  const [validationError, setValidationError] = useState('');
  const [internalCC, setInternalCC] = useState(addIds(cardConfig));
  const [internalCcString, setInternalCcString] = useState(
    deriveInternalCcStringFromCC(cardConfig)
  );
  const [showTextEditor, setShowTextEditor] = useState(false);

  useEffect(() => {
    setInternalCC(addIds(cardConfig));
    setInternalCcString(deriveInternalCcStringFromCC(cardConfig));
  }, [cardConfig]);

  function deriveInternalCcStringFromCC(cc) {
    return JSON.stringify(stripIds(cc), null, 4);
  }

  return (
    <StyledCadConfigEditor>
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

      {showTextEditor && <StyledTextarea value={internalCcString} onChange={onTextChange} />}

      {!showTextEditor && (
        <React.Fragment>
          <StyledItems>
            <StyledCCTableHeader>
              <StyledCCTableCell>{t('label')}</StyledCCTableCell>
              <StyledCCTableCell>{t('value')}</StyledCCTableCell>
              <StyledCCTableCell style={{width: 'auto', minWidth: '160px', flexGrow: 1}}>
                {t('color')}
              </StyledCCTableCell>
              <StyledCCTableCell style={{width: '25%'}}></StyledCCTableCell>
            </StyledCCTableHeader>

            {internalCC.map((ccItem, index) => (
              <CardConfigEditorItem
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
          </StyledItems>

          <div className="pure-g">
            <AddItemButton className="pure-button" type="button" onClick={onAdd}>
              <i className="icon-plus"></i> {t('addCard')}
            </AddItemButton>
          </div>
        </React.Fragment>
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

      <button type="button" className="pure-button" onClick={() => onSave()}>
        {t('default')} <i className="icon-ccw" />
      </button>
    </StyledCadConfigEditor>
  );

  function onAdd() {
    const modifiedInternalCC = [...internalCC, {id: uuid(), label: 'new', value: 0, color: '#888'}];
    setAndValidate(modifiedInternalCC);
  }

  function onTextChange(e) {
    try {
      setInternalCcString(e.target.value);
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
    setInternalCcString(deriveInternalCcStringFromCC(cc));
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
