import { Component } from "react";

export default class SettingsErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[SettingsPage] Render error caught by boundary:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "40px",
            textAlign: "center",
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            color: "#121c2d",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "56px", color: "#ba1a1a", marginBottom: "16px" }}
          >
            error
          </span>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
            System Settings failed to load
          </h2>
          <p style={{ color: "#777588", fontSize: "14px", maxWidth: "480px", marginBottom: "24px" }}>
            {this.state.error?.message || "An unexpected error occurred while rendering the settings panel."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "#3721de",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload Settings
          </button>
          {Boolean((import.meta.env?.DEV ?? true) && this.state.info) && (
            <pre
              style={{
                marginTop: "24px",
                textAlign: "left",
                fontSize: "11px",
                color: "#ba1a1a",
                background: "#ffdad6",
                padding: "12px",
                borderRadius: "6px",
                maxWidth: "700px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {this.state.info.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
