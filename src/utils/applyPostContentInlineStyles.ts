function setStyles(element: HTMLElement, styles: Record<string, string>) {
  for (const [property, value] of Object.entries(styles)) {
    element.style.setProperty(property, value);
  }
}

function isHeadingTwoToFour(element: Element | null): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false;
  return (
    element.tagName === "H2" ||
    element.tagName === "H3" ||
    element.tagName === "H4"
  );
}

export function applyPostContentInlineStyles(root: HTMLElement) {
  const cleanups: Array<() => void> = [];

  const headingElements = root.querySelectorAll<HTMLElement>("h1, h2, h3, h4");
  headingElements.forEach((heading) => {
    setStyles(heading, {
      "line-height": "1.25",
      "margin-top": "1.25em",
      "margin-bottom": "0.5em",
      color: "#1f2840",
    });
  });

  const directChildren = Array.from(root.children);
  const firstH1 = directChildren.find(
    (child) => child instanceof HTMLElement && child.tagName === "H1",
  ) as HTMLElement | undefined;
  if (firstH1) {
    setStyles(firstH1, { display: "none" });
    const nextSibling = firstH1.nextElementSibling;
    if (isHeadingTwoToFour(nextSibling)) {
      setStyles(nextSibling, { "margin-top": "0.12em" });
    }
  }

  if (isHeadingTwoToFour(directChildren[0] ?? null)) {
    setStyles(directChildren[0] as HTMLElement, { "margin-top": "0.12em" });
  }

  root.querySelectorAll<HTMLElement>("p, li").forEach((element) => {
    setStyles(element, {
      "line-height": "1.7",
      color: "#2a344f",
    });
  });

  root.querySelectorAll<HTMLElement>("ul, ol").forEach((list) => {
    setStyles(list, {
      "margin-top": "0.42rem",
      "margin-bottom": "1rem",
      "padding-left": "1.2rem",
    });
  });

  root.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => {
    setStyles(anchor, {
      color: "#335ec2",
      "text-decoration": "none",
      "font-weight": "600",
    });

    const onMouseEnter = () => {
      anchor.style.setProperty("color", "#264a9b");
    };
    const onMouseLeave = () => {
      anchor.style.setProperty("color", "#335ec2");
      if (document.activeElement !== anchor) {
        anchor.style.removeProperty("outline");
        anchor.style.removeProperty("outline-offset");
      }
    };
    const onFocus = () => {
      anchor.style.setProperty("color", "#264a9b");
      anchor.style.setProperty("outline", "2px solid rgba(51, 94, 194, 0.35)");
      anchor.style.setProperty("outline-offset", "2px");
    };
    const onBlur = () => {
      anchor.style.setProperty("color", "#335ec2");
      anchor.style.removeProperty("outline");
      anchor.style.removeProperty("outline-offset");
    };

    anchor.addEventListener("mouseenter", onMouseEnter);
    anchor.addEventListener("mouseleave", onMouseLeave);
    anchor.addEventListener("focus", onFocus);
    anchor.addEventListener("blur", onBlur);

    cleanups.push(() => {
      anchor.removeEventListener("mouseenter", onMouseEnter);
      anchor.removeEventListener("mouseleave", onMouseLeave);
      anchor.removeEventListener("focus", onFocus);
      anchor.removeEventListener("blur", onBlur);
    });
  });

  root.querySelectorAll<HTMLElement>("code").forEach((inlineCode) => {
    if (inlineCode.parentElement?.tagName === "PRE") return;
    setStyles(inlineCode, {
      display: "inline",
      padding: "0.22em 0.22em",
      "border-radius": "6px",
      border: "1px solid rgba(51, 94, 194, 0.34)",
      background: "rgba(51, 94, 194, 0.12)",
      color: "#335ec2",
      "font-size": "0.9em",
      "box-decoration-break": "clone",
      "-webkit-box-decoration-break": "clone",
    });
  });

  root.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    setStyles(image, {
      display: "block",
      "max-width": "100%",
      height: "auto",
      "border-radius": "8px",
      border: "1px solid rgba(19, 30, 52, 0.18)",
      margin: "0.72rem 0",
      "box-shadow": "0 10px 24px rgba(8, 14, 26, 0.18)",
      cursor: "zoom-in",
      "user-select": "none",
      "-webkit-user-select": "none",
      "-webkit-touch-callout": "none",
      "-webkit-user-drag": "none",
    });
  });

  root
    .querySelectorAll<HTMLElement>("video, picture, canvas")
    .forEach((element) => {
      setStyles(element, {
        "max-width": "100%",
        "user-select": "none",
        "-webkit-user-select": "none",
        "-webkit-touch-callout": "none",
        "-webkit-user-drag": "none",
      });
    });

  root.querySelectorAll<HTMLElement>("blockquote").forEach((blockquote) => {
    setStyles(blockquote, {
      margin: "1rem 0",
      padding: "0.76rem 0.95rem",
      "border-left": "3px solid rgba(51, 94, 194, 0.6)",
      "border-radius": "0 12px 12px 0",
      background: "rgba(51, 94, 194, 0.12)",
    });
  });

  root.querySelectorAll<HTMLElement>("blockquote p").forEach((paragraph) => {
    setStyles(paragraph, { margin: "0" });
    if (paragraph.previousElementSibling?.tagName === "P") {
      setStyles(paragraph, {
        "margin-top": "0.35rem",
        opacity: "0.96",
        "font-size": "0.95rem",
      });
    }
  });

  root.querySelectorAll<HTMLImageElement>("blockquote img").forEach((image) => {
    setStyles(image, {
      margin: "0 0 0.28rem",
      "max-width": "100%",
    });
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
