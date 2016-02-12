import React from 'react';


const Person = ({person}) => (
  <div className='person'>
    {person}
  </div>
);

const People = ({ people }) => (
  <div className='people'>
    {people.map(person => <Person key={person} person={person}/>)}
  </div>
);

const Backlog = () => (
  <div className='backlog'>

  </div>
);


const Board = ({ roomId, people }) => (
  <div className='board'>

    <People people={people}/>
    <a href='#menu' className='menu-link'>
      <span></span>
    </a>
    <Backlog />
    {roomId}
  </div>
);


export default Board;
