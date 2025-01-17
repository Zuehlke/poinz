import React, {useCallback, createContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';

import {importCsvFile} from '../../state/actions/commandActions';

import {StyledFileImportDropZoneOverlay} from './_styled';

const ACCEPTED_MIME_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.ms-excel': ['.csv'],
  'application/csv': ['.csv'],
  'text/x-csv': ['.csv'],
  'application/x-csv': ['.csv'],
  'text/comma-separated-values': ['.csv'],
  'text/x-comma-separated-values': ['.csv'],

  'application/json': ['.json']
};

// we put the dropzone "open" callback into a context so that we can use it from child components
export const OpenFileDialogContext = createContext(() => {});

/**
 * Handles CSV and JSON file drop & importing
 */
const BacklogFileDropWrapper = ({importCsvFile, children}) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      importCsvFile(acceptedFiles[0]);
    }
  }, []);
  const {getRootProps, isDragActive, isDragAccept, isDragReject, open} = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    maxSize: 200000,
    accept: ACCEPTED_MIME_TYPES
  });

  return (
    <div {...getRootProps()}>
      <StyledFileImportDropZoneOverlay
        $active={isDragActive}
        $isAccept={isDragAccept}
        $isReject={isDragReject}
      />
      <OpenFileDialogContext.Provider value={open}>{children}</OpenFileDialogContext.Provider>
    </div>
  );
};

BacklogFileDropWrapper.propTypes = {
  importCsvFile: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default connect(() => ({}), {importCsvFile})(BacklogFileDropWrapper);
