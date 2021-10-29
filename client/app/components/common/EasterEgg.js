import React from 'react';
import styled from 'styled-components';

/**
 * displays animated falling (like snowflages) gifs
 */

const StyledEasterEgg = styled.div`
  user-select: none;
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  width: 75%;

  .snowflake {
    color: transparent;
    font-size: 1em;
  }

  .snowflake img {
    height: 40px;
    bottom: 0;
    background-color: transparent;
    display: block;
  }

  @keyframes snowflakes-fall {
    0% {
      top: -41px;
    }
    100% {
      top: 100%;
    }
  }

  @keyframes snowflakes-shake {
    0% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(80px);
    }
    100% {
      transform: translateX(0px);
    }
  }

  .snowflake {
    position: absolute;
    top: -41px;
    z-index: 9999;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
    -webkit-animation-name: snowflakes-fall, snowflakes-shake;
    -webkit-animation-duration: 10s, 3s;
    -webkit-animation-timing-function: linear, ease-in-out;
    -webkit-animation-iteration-count: infinite, infinite;
    -webkit-animation-play-state: running, running;
    animation-name: snowflakes-fall, snowflakes-shake;
    animation-duration: 10s, 3s;
    animation-timing-function: linear, ease-in-out;
    animation-iteration-count: 1, infinite;
    animation-play-state: running, running;
  }

  .snowflake:nth-of-type(0) {
    left: 1%;
    animation-delay: 0s, 0s;
  }

  .snowflake:nth-of-type(1) {
    left: 10%;
    animation-delay: 1s, 1s;
  }

  .snowflake:nth-of-type(2) {
    left: 20%;
    animation-delay: 6s, 0.5s;
  }

  .snowflake:nth-of-type(3) {
    left: 30%;
    animation-delay: 4s, 2s;
  }

  .snowflake:nth-of-type(4) {
    left: 40%;
    animation-delay: 2s, 2s;
  }

  .snowflake:nth-of-type(5) {
    left: 50%;
    animation-delay: 8s, 3s;
  }

  .snowflake:nth-of-type(6) {
    left: 60%;
    animation-delay: 6s, 2s;
  }

  .snowflake:nth-of-type(7) {
    left: 70%;
    animation-delay: 2s, 1s;
  }

  .snowflake:nth-of-type(8) {
    left: 80%;
    animation-delay: 1s, 0s;
  }

  .snowflake:nth-of-type(9) {
    left: 90%;
    animation-delay: 3s, 1s;
  }
`;

/** currently these are all halloween themed gifs **/
const giphyLinks = [
  'https://media.giphy.com/media/AFDLK5jU756dW/giphy.gif',
  'https://media.giphy.com/media/NvzEjCsGlXsYCbgiGP/giphy.gif',
  'https://media.giphy.com/media/5PhD4XcqZkNhN9asdV/giphy.gif',
  'https://media.giphy.com/media/xT9IgzmIOFMa6vOQW4/giphy.gif',
  'https://media.giphy.com/media/Gc53XljpCgo6I/giphy.gif',
  'https://media.giphy.com/media/buys0RyOKVU88BcUbV/giphy.gif'
];

const EasterEgg = () => {
  shuffle(giphyLinks);

  return (
    <StyledEasterEgg>
      {giphyLinks.map((link) => (
        <div key={link} className="snowflake">
          <img src={link} />
        </div>
      ))}
    </StyledEasterEgg>
  );
};

export default EasterEgg;

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
