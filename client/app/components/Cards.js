import React from 'react';
import Immutable from 'immutable';
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

Cards.propTypes = {
  cardConfig: React.PropTypes.instanceOf(Immutable.List)
};

export default connect(
  state =>({
    cardConfig: state.get('cardConfig')
  })
)(Cards);
