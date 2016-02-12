import React from 'react';
import { ACTIONS } from '../services/store';

class Landing extends React.Component {


  start() {
    ACTIONS.requestRoom(this.roomIdInputField.value);
  }

  render() {

    const start = this.start.bind(this);

    return (
      <div className='landing'>

        <div className='eyecatcher'>
          <div className="room-id-wrapper">
            <input type='text' ref={ref => this.roomIdInputField = ref}/>
            <button type='button' className='pure-button pure-button-primary' onClick={start}>Start</button>
          </div>
        </div>

      </div>
    );
  }
}


export default Landing;
