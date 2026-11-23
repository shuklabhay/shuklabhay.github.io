import { useEffect, useState } from "react";

type PostPageComponent = typeof import("./Post").default;

let PostPage: PostPageComponent | null = null;
let postPagePromise: Promise<PostPageComponent> | null = null;

export function loadPostPage(): Promise<PostPageComponent> {
  postPagePromise ??= import("./Post").then(
    (module) => (PostPage = module.default),
    (error: unknown) => {
      postPagePromise = null;
      throw error;
    },
  );
  return postPagePromise;
}

export default function PostRoute(): JSX.Element | null {
  const [, setLoaded] = useState(PostPage !== null);

  useEffect(() => {
    if (PostPage) return;
    let cancelled = false;
    loadPostPage().then(
      () => {
        if (!cancelled) setLoaded(true);
      },
      () => undefined,
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return PostPage ? <PostPage /> : null;
}
