import { Link } from "react-router-dom";

export default function PostBackLink() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        zIndex: 11,
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "1rem",
        paddingBottom: "4px",
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      <Link
        to="/blog"
        viewTransition={false}
        state={{ fromPost: true }}
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "1.25rem",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.26rem",
          lineHeight: 1,
          paddingBottom: "0.45rem",
          marginBottom: "-0.45rem",
          pointerEvents: "auto",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            width: "0.6em",
            height: "0.6em",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          <svg
            viewBox="0 0 10 10"
            width="100%"
            height="100%"
            fill="currentColor"
            style={{ display: "block" }}
          >
            <path d="M7.8 1.4L2.6 5l5.2 3.6V1.4z" />
          </svg>
        </span>
        <span style={{ display: "inline-block", lineHeight: 1 }}>back</span>
      </Link>
    </div>
  );
}
