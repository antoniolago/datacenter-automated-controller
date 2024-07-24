// @ts-nocheck
import React, { Component } from "react";
import throttle from "lodash";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, setErrorState: () => {} };
    this.setErrorState = throttle(this.setErrorState.bind(this), 1000); // Throttle error state updates to once per second
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  setErrorState(error) {
    this.setState({ hasError: true, error });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasError !== this.state.hasError || prevState.error !== this.state.error) {
      this.setState(this.state.error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red" }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error && this.state.error.toString()}</p>
        </div>
      );
    }

    return this.props.children;
  }
}


const useErrorBoundary = () => {
  return ({ children }) => <ErrorBoundary>{children}</ErrorBoundary>;
};

export default useErrorBoundary;