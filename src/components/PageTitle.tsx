interface PageTitleProps {
  title: string;
  subtitle?: React.ReactNode;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div style={{ marginTop: "4rem", paddingBottom: "2rem" }}>
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "700",
          color: "white",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {subtitle}
    </div>
  );
}

export function SubtitleText({ text }: { text: string }) {
  return (
    <p
      style={{
        color: "white",
        textDecoration: "none",
        fontSize: "1.25rem",
        marginTop: "0.5rem",
      }}
    >
      {text}
    </p>
  );
}
