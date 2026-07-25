import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from "react";
import { Link } from "../../router";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("NEXUS rendering error", error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="error-screen">
          <span className="eyebrow">Archive interruption</span>
          <h1>The interface lost contact with this fragment.</h1>
          <p>
            Your stored progress remains on this device. Reload the application or return
            home.
          </p>
          <div className="button-row">
            <button
              className="button button-primary"
              onClick={() => window.location.reload()}
            >
              Reconnect
            </button>
            <Link className="button button-secondary" to="/">
              Return home
            </Link>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
