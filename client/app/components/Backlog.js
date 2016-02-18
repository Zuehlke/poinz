import React from 'react';
import Stories from './Stories';
import StoryAddForm from './StoryAddForm';
import zuehlkeLogo from '../assets/logo-zuehlke-small.png';

class Backlog extends React.Component {

  render() {

    const { stories, selectedStory, actions } = this.props;

    return (
      <div className='backlog'>

        {
          stories &&
          <Stories stories={stories} selectedStory={selectedStory} actions={actions}/>
        }

        <StoryAddForm onAddStory={actions.addStory}/>

        <div className='logo-wrapper'>
          <img src={zuehlkeLogo}/>
        </div>
      </div>
    );
  }
}


export default Backlog;
