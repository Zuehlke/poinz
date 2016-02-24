import React from 'react';
import { connect } from 'react-redux';

import Card from './Card';

const Cards = ({ cardConfig })=> {

  return (
    <div className='pure-g cards'>
      {
        cardConfig.map((config, index) => (
            <Card
              key={'card_'+index}
              card={config}
            />
          )
        )
      }
    </div>
  );
};

export default connect(
  state =>({
    cardConfig: state.get('cardConfig')
  })
)(Cards);
