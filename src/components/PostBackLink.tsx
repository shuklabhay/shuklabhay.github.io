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
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "1.25rem",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.24rem",
          lineHeight: 1.1,
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
            display: "inline-block",
            lineHeight: 1,
            transform: "translateY(-1.5px)",
          }}
        >
          ←
        </span>
        <span style={{ display: "inline-block", lineHeight: 1.1 }}>back</span>
      </Link>
    </div>
  );
}
