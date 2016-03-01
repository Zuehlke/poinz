import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addStory } from '../services/actions';

const StoryAddForm = ({addStory}) => {

  let titleInputField, descriptionInputField;

  return (
    <div className='pure-form'>

      <fieldset className='pure-group'>
        <input type='text' className='pure-input-1'
               placeholder='Story title'
               ref={ref => titleInputField = ref}/>

        <textarea className='pure-input-1'
                  placeholder='Description / URL / etc.'
                  ref={ref => descriptionInputField = ref}/>
      </fieldset>

      <button type='button'
              className='pure-button pure-input-1 pure-button-primary'
              onClick={triggerAddAndClearForm}>
        Add Story
        <i className='fa fa-plus  button-icon-right'></i>
      </button>

    </div>
  );


  function triggerAddAndClearForm() {
    addStory(titleInputField.value, descriptionInputField.value);
    titleInputField.value = '';
    descriptionInputField.value = '';
  }

};

export default connect(
  undefined,
  dispatch => bindActionCreators({addStory}, dispatch)
)(StoryAddForm);
