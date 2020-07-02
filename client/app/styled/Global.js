import {createGlobalStyle} from 'styled-components';

import {COLOR_BLUE, COLOR_FONT_GREY, COLOR_ORANGE} from './colors';
import zFontWoff from '../assets/aazuotps_30.12.13-webfont.woff2';
import {StyledCardInner} from './Board';

const Global = createGlobalStyle`

@font-face {
  font-family: 'aa_zuehlke_otpsregular';
  src: url('${zFontWoff}') format("woff2");
  font-weight: normal;
  font-style: normal;
}

body {
  color: ${COLOR_FONT_GREY};
}

#app-root {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

/* purecss form overrides */
.pure-form {

  .pure-group {
    input:first-child, textarea:first-child, input:last-child, textarea:last-child {
      border-radius: 0;
    }
  }

  textarea, input[type=text] {
    box-shadow: none;
    border-radius: 0;

    &:focus {
      border-bottom: 1px solid ${COLOR_BLUE};
    }
  }

  &.pure-form-stacked label {
    margin-top: 16px;
  }

}

.pure-button {
  border-radius: 2px;

  &.pure-button-primary {
    background-color: ${COLOR_BLUE};
  }

  i.button-icon-left {
    padding-right: 8px;
  }

  i.button-icon-right {
    padding-left: 8px;
  }

  &.pure-button-stripped {
    background: none;
    border: none;
    box-shadow :none;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }

    &.active {
      opacity: 1;
      color: ${COLOR_ORANGE};
    }
  }
}

a {
  color: ${COLOR_ORANGE};
}

.waiting-spinner {
  /* this is needed, so that we can position the gray overlay accordingly */
  position: relative;

  &:before {
    display: inline-block;
    position: absolute;
    width :100%;
    height :100%;
    background: rgba(0, 0, 0, 0.3);
    left :0;
    top: 0;
    content: " ";
  }

  &${StyledCardInner}:before {
    border-radius: 12px;
  }

  &:after {
    animation: fa-spin 2s infinite linear;
    font: normal normal normal 14px / 1 FontAwesome;
    text-rendering: auto;
    content: "\\F110";
    position: absolute;
    left :50%;
    top :50%;
    font-size: 26px;
    margin-left: -13px;
    margin-top: -13px;
  }
}

.clickable {
  cursor :pointer;
}

`;

export default Global;
