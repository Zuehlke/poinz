import React from 'react';
import PropTypes from 'prop-types';

import ErrorPage from '../Landing/ErrorPage';
import {reportError} from '../../services/restApi/errorLogService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasRenderingError: false};
    this.onError = this.onError.bind(this);
    this.onUnhandledPromiseRejection = this.onUnhandledPromiseRejection.bind(this);
  }

  onError(event) {
    reportError('EVENT_HANDLER', event?.error?.stack || '');
  }

  onUnhandledPromiseRejection(event) {
    reportError('PROMISE_REJECTION', event?.reason?.stack || '');
  }

  componentDidCatch(error) {
    // will be invoked for errors/exception during rendering of React components.
    // see https://reactjs.org/docs/error-boundaries.html
    reportError('RENDERING', error?.stack || '');
  }

  componentDidMount() {
    window.addEventListener('error', this.onError);
    window.addEventListener('unhandledrejection', this.onUnhandledPromiseRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.onError);
    window.removeEventListener('unhandledrejection', this.onUnhandledPromiseRejection);
  }

  static getDerivedStateFromError() {
    return {hasRenderingError: true};
  }

  render() {
    if (this.state.hasRenderingError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default ErrorBoundary;
