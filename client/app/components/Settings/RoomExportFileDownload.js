import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getRoomExport} from '../../services/restApi/roomService';

const RoomExportFileDownload = ({t, roomId, userToken}) => {
  return (
    <button type="button" className="pure-button pure-button-primary" onClick={onDownloadClick}>
      {t('exportLinkText')} <i className="icon-download-cloud"></i>
    </button>
  );

  function onDownloadClick() {
    getRoomExport(roomId, userToken).then((data) =>
      fakeDownload(JSON.stringify(data, null, 4), `${roomId}.json`)
    );
  }

  /**
   * will add a non-visible, temporary anchor element to the body, set it's href to the data in the right format and manually trigger "click" on it.
   * Afterwards it is removed again
   *
   * see https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
   */
  function fakeDownload(data, filename) {
    const blob = new Blob([data], {type: 'application/json'});
    const blobURL = window.URL.createObjectURL(blob);
    const tempAnchorElement = document.createElement('a');
    tempAnchorElement.style.display = 'none';
    tempAnchorElement.href = blobURL;
    tempAnchorElement.setAttribute('download', filename);

    if (typeof tempAnchorElement.download === 'undefined') {
      tempAnchorElement.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempAnchorElement);
    tempAnchorElement.click();

    setTimeout(() => {
      document.body.removeChild(tempAnchorElement);
      window.URL.revokeObjectURL(blobURL);
    }, 200);
  }
};

RoomExportFileDownload.propTypes = {
  t: PropTypes.func,
  roomId: PropTypes.string,
  userToken: PropTypes.string
};

export default connect((state) => ({
  t: state.translator,
  userToken: state.userToken
}))(RoomExportFileDownload);
