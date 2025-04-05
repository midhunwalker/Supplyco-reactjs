import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // You can also log error details to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-800">
          <h1>Something went wrong.</h1>
          <p>{this.state.error.toString()}</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
