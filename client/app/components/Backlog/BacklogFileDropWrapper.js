import React, {useCallback} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';

import {importCsvFile} from '../../state/actions/commandActions';

import {StyledFileImportDropZoneOverlay} from './_styled';

const ACCEPTED_MIME_TYPES =
  'text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values';

/**
 * Handles CSV file drop & importing
 */
const BacklogFileDropWrapper = ({importCsvFile, children}) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      importCsvFile(acceptedFiles[0]);
    }
  }, []);
  const {getRootProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    maxSize: 200000,
    accept: ACCEPTED_MIME_TYPES
  });

  return (
    <div {...getRootProps()}>
      <StyledFileImportDropZoneOverlay
        active={isDragActive}
        isAccept={isDragAccept}
        isReject={isDragReject}
      />
      {children}
    </div>
  );
};

BacklogFileDropWrapper.propTypes = {
  importCsvFile: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default connect(() => ({}), {importCsvFile})(BacklogFileDropWrapper);
